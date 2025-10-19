
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLanguage } from "@/context/language-context";
import type { Language } from "@/lib/translations";
import { useUserProfile } from "@/context/user-profile-context";
import { useEffect } from "react";
import { Leaf, Building2, HeartHandshake, BotMessageSquare, Utensils, Wind, Star } from "lucide-react";
import menuData from "@/lib/restaurant-menu.json";
import signatureMenuJson from "@/lib/signature-menu.json";
import type { MenuCategory, SignatureMenuData } from "@/lib/types";

const { categories: menuCategories }: { categories: MenuCategory[] } = menuData;
const { menu: signatureMenu }: { menu: SignatureMenuData } = signatureMenuJson;

const allDishes = [
    ...menuCategories.flatMap(cat => cat.items.map(item => item.name)),
    ...signatureMenu.sections.flatMap(sec => sec.items.map(item => item.name))
];


const alergies = [
  { id: "nuts", label: "Nuts" },
  { id: "shellfish", label: "Shellfish" },
  { id: "dairy", label: "Dairy" },
  { id: "wheat", label: "Wheat" },
  { id: "other", label: "Other" },
];

const allQuickLinks = [
  { id: "eco-manager", label: "Eco Manager", icon: Leaf },
  { id: "services", label: "Services", icon: Building2 },
  { id: "experiences", label: "Experiences", icon: HeartHandshake },
  { id: "concierge", label: "Concierge", icon: BotMessageSquare },
  { id: "restaurant", label: "Restaurant", icon: Utensils },
  { id: "wellness", label: "Wellness", icon: Wind },
];

const profileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email(),
  language: z.enum(["en", "es", "fr"], {
    required_error: "Please select a language.",
  }),
  tripType: z.enum(["leisure", "business"], {
    required_error: "Please select a trip type.",
  }),
  ecoSensitivity: z.enum(["low", "medium", "high"], {
    required_error: "Please select your eco-sensitivity level.",
  }),
  bedType: z.string().optional(),
  floorPreference: z.string().optional(),
  viewPreference: z.string().optional(),
  pillowType: z.string().optional(),
  roomFragrance: z.string().optional(),
  housekeepingSchedule: z.string().optional(),
  dietaryRestrictions: z.string().optional(),
  allergies: z.array(z.string()).optional(),
  favoriteDishes: z.array(z.string()).optional(),
  quickLinks: z.array(z.string()).optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfilePage() {
  const { t, setLanguage, language } = useLanguage();
  const { toast } = useToast();
  const { profile, setProfile, isLoading } = useUserProfile();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: profile,
    mode: "onChange",
  });
  
  useEffect(() => {
    if (!isLoading) {
      form.reset(profile);
    }
  }, [isLoading, profile, form]);

  function onSubmit(data: ProfileFormValues) {
    if (data.language !== language) {
      setLanguage(data.language as Language);
    }
    setProfile(data as any);
    toast({
      title: t('Profile Updated'),
      description: t('Your preferences have been saved successfully.'),
    });
  }

  const toggleFavorite = (dishName: string) => {
    const favorites = profile.favoriteDishes || [];
    const newFavorites = favorites.includes(dishName)
      ? favorites.filter((dish) => dish !== dishName)
      : [...favorites, dishName];
    
    // Update both context and form state
    setProfile({ ...profile, favoriteDishes: newFavorites });
    form.setValue("favoriteDishes", newFavorites, { shouldDirty: true });
  };


  if (isLoading) {
    return <div>Loading...</div>;
  }

  const favoriteDishes = profile.favoriteDishes || [];

  return (
    <div className="flex-1 space-y-4 p-4 md:space-y-8 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">{t('Profile Settings')}</h1>
          <p className="text-muted-foreground">
            {t('Manage your account and personalization settings.')}
          </p>
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>{t('Personal Information')}</CardTitle>
              <CardDescription>{t('Update your personal details here.')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                <div className="flex items-center space-x-6">
                    <Avatar className="h-20 w-20">
                    <AvatarImage src="https://picsum.photos/seed/avatar/200" alt={profile.name} />
                    <AvatarFallback>{profile.name?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem className="flex-1">
                        <FormLabel>{t('Full Name')}</FormLabel>
                        <FormControl>
                            <Input placeholder={t('Your name')} {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t('Email')}</FormLabel>
                        <FormControl>
                        <Input type="email" placeholder="your.email@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="language"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t('Preferred Language')}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                            <SelectValue placeholder={t('Select your language')} />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Español</SelectItem>
                            <SelectItem value="fr">Français</SelectItem>
                        </SelectContent>
                        </Select>
                        <FormDescription>
                        {t('This will be used for all communications and in-app text.')}
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                    )}
                />
             </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
                <CardTitle>{t('Stay & Room Preferences')}</CardTitle>
                <CardDescription>{t("Customize your room for the perfect stay.")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                <FormField
                    control={form.control}
                    name="bedType"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>{t('Bed Type')}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder={t('Select a bed type')} />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            <SelectItem value="king">{t('King')}</SelectItem>
                            <SelectItem value="queen">{t('Queen')}</SelectItem>
                            <SelectItem value="twin">{t('Twin')}</SelectItem>
                            <SelectItem value="sofa-bed">{t('Sofa bed')}</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="floorPreference"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>{t('Floor Preference')}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder={t('Select a floor preference')} />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            <SelectItem value="high">{t('High floor')}</SelectItem>
                            <SelectItem value="low">{t('Low floor')}</SelectItem>
                            <SelectItem value="near-elevator">{t('Near elevator')}</SelectItem>
                            <SelectItem value="quiet-zone">{t('Quiet zone')}</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="viewPreference"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>{t('View Preference')}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder={t('Select a view preference')} />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            <SelectItem value="city">{t('City')}</SelectItem>
                            <SelectItem value="garden">{t('Garden')}</SelectItem>
                            <SelectItem value="pool">{t('Pool')}</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="pillowType"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>{t('Pillow Type')}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder={t('Select a pillow type')} />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            <SelectItem value="soft">{t('Soft')}</SelectItem>
                            <SelectItem value="firm">{t('Firm')}</SelectItem>
                            <SelectItem value="hypoallergenic">{t('Hypoallergenic')}</SelectItem>
                            <SelectItem value="memory-foam">{t('Memory foam')}</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="roomFragrance"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>{t('Room Fragrance')}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder={t('Select a room fragrance')} />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            <SelectItem value="none">{t('None')}</SelectItem>
                            <SelectItem value="citrus">{t('Citrus')}</FormItem>
                            <SelectItem value="lavender">{t('Lavender')}</SelectItem>
                            <SelectItem value="fresh-linen">{t('Fresh linen')}</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="housekeepingSchedule"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>{t('Housekeeping Schedule')}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder={t('Select a housekeeping schedule')} />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            <SelectItem value="morning">{t('Morning')}</SelectItem>
                            <SelectItem value="afternoon">{t('Afternoon')}</SelectItem>
                            <SelectItem value="on-request">{t('On request')}</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
                <CardTitle>{t('Dietary Preferences')}</CardTitle>
                <CardDescription>{t("Let us know about your dietary needs and allergies.")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                 <FormField
                    control={form.control}
                    name="dietaryRestrictions"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>{t('Dietary Restrictions')}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder={t('Select a dietary restriction')} />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="vegan">{t('Vegan')}</SelectItem>
                                <SelectItem value="vegetarian">{t('Végétarien')}</SelectItem>
                                <SelectItem value="halal">{t('Halal')}</SelectItem>
                                <SelectItem value="kosher">{t('Kosher')}</SelectItem>
                                <SelectItem value="gluten-free">{t('Gluten-free')}</SelectItem>
                                <SelectItem value="lactose-free">{t('Lactose-free')}</SelectItem>
                                <SelectItem value="none">{t('No dietary restrictions')}</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                  control={form.control}
                  name="allergies"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="text-base">{t('Allergens')}</FormLabel>
                      </div>
                      <div className="space-y-2">
                      {alergies.map((item) => (
                        <FormField
                          key={item.id}
                          control={form.control}
                          name="allergies"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={item.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(item.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...(field.value || []), item.id])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== item.id
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {t(item.label as any)}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>{t('Favorite Dishes')}</CardTitle>
              <CardDescription>
                {t('Star your favorite meals for future stays.')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {favoriteDishes.length > 0 ? (
                    <div className="space-y-2">
                        {favoriteDishes.map((dishName) => (
                        <div
                            key={dishName}
                            className="flex flex-row items-center justify-between space-x-3 space-y-0 rounded-md border p-4"
                        >
                            <p className="font-normal">{t(dishName as any)}</p>
                            <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleFavorite(dishName)}
                            >
                            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                            </Button>
                        </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-muted-foreground">{t('You have no favorite dishes yet. Star them in the restaurant menu!')}</p>
                )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('Dashboard Customization')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <FormField
                control={form.control}
                name="quickLinks"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">{t('Quick Links')}</FormLabel>
                      <FormDescription>
                        {t('Select which quick links to display on your dashboard.')}
                      </FormDescription>
                    </div>
                    <div className="space-y-2">
                      {allQuickLinks.map((item) => (
                        <FormField
                          key={item.id}
                          control={form.control}
                          name="quickLinks"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={item.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(item.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...(field.value || []), item.id])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== item.id
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {t(item.label as any)}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('Primary Trip Type')}</CardTitle>
              <CardDescription>{t("This helps us tailor your experience, whether you're here for work or play.")}</CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="tripType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="leisure" />
                          </FormControl>
                          <FormLabel className="font-normal">{t('Leisure')}</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="business" />
                          </FormControl>
                          <FormLabel className="font-normal">{t('Business')}</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('Eco-Sensitivity Level')}</CardTitle>
              <CardDescription>
                {t('Helps us tailor recommendations to your preferences.')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="ecoSensitivity"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormControl>
                       <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="high" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {t('High - I actively seek out the most sustainable options.')}
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="medium" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {t('Medium - I prefer sustainable options when convenient.')}
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="low" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {t("Low - I'm just starting to learn about eco-friendly travel.")}
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Button type="submit">{t('Update Profile')}</Button>
        </form>
      </Form>
    </div>
  );
}

    