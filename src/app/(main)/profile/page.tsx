
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
import { useEffect, memo } from "react";
import { Leaf, Building2, HeartHandshake, BotMessageSquare, Utensils, Wind, Star, Sparkles, ShoppingBasket } from "lucide-react";
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
  { id: "nuts", label: "nuts_allergen" },
  { id: "shellfish", label: "shellfish_allergen" },
  { id: "dairy", label: "dairy_allergen" },
  { id: "wheat", label: "wheat_allergen" },
  { id: "other", label: "other_allergen" },
];

const allQuickLinks = [
  { id: "eco-manager", label: "eco_manager", icon: Leaf },
  { id: "services", label: "services", icon: Building2 },
  { id: "experiences", label: "experiences", icon: HeartHandshake },
  { id: "concierge", label: "concierge", icon: BotMessageSquare },
  { id: "restaurant", label: "restaurant", icon: Utensils },
  { id: "room-service", label: "room_service", icon: ShoppingBasket },
  { id: "wellness", label: "wellness", icon: Wind },
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

function ProfilePage() {
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
      title: t('profile_updated_toast_title'),
      description: t('profile_updated_toast_desc'),
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
          <h1 className="text-3xl font-bold tracking-tight font-headline">{t('profile_settings_title')}</h1>
          <p className="text-muted-foreground">
            {t('profile_settings_subtitle')}
          </p>
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>{t('personal_info_title')}</CardTitle>
              <CardDescription>{t('personal_info_subtitle')}</CardDescription>
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
                        <FormLabel>{t('full_name_label')}</FormLabel>
                        <FormControl>
                            <Input placeholder={t('your_name_placeholder')} {...field} />
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
                        <FormLabel>{t('email_label')}</FormLabel>
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
                        <FormLabel>{t('preferred_language_label')}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                            <SelectValue placeholder={t('select_language_placeholder')} />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Español</SelectItem>
                            <SelectItem value="fr">Français</SelectItem>
                        </SelectContent>
                        </Select>
                        <FormDescription>
                        {t('language_description')}
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                    )}
                />
             </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
                <CardTitle>{t('stay_room_preferences_title')}</CardTitle>
                <CardDescription>{t('stay_room_preferences_subtitle')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                <FormField
                    control={form.control}
                    name="bedType"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>{t('bed_type_label')}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder={t('select_bed_type_placeholder')} />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            <SelectItem value="king">{t('king_bed')}</SelectItem>
                            <SelectItem value="queen">{t('queen_bed')}</SelectItem>
                            <SelectItem value="twin">{t('twin_bed')}</SelectItem>
                            <SelectItem value="sofa-bed">{t('sofa_bed')}</SelectItem>
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
                        <FormLabel>{t('floor_preference_label')}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder={t('select_floor_preference_placeholder')} />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            <SelectItem value="high">{t('high_floor')}</SelectItem>
                            <SelectItem value="low">{t('low_floor')}</SelectItem>
                            <SelectItem value="near-elevator">{t('near_elevator')}</SelectItem>
                            <SelectItem value="quiet-zone">{t('quiet_zone')}</SelectItem>
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
                        <FormLabel>{t('view_preference_label')}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder={t('select_view_preference_placeholder')} />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            <SelectItem value="city">{t('city_view')}</SelectItem>
                            <SelectItem value="garden">{t('garden_view')}</SelectItem>
                            <SelectItem value="pool">{t('pool_view')}</SelectItem>
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
                        <FormLabel>{t('pillow_type_label')}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder={t('select_pillow_type_placeholder')} />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            <SelectItem value="soft">{t('soft_pillow')}</SelectItem>
                            <SelectItem value="firm">{t('firm_pillow')}</SelectItem>
                            <SelectItem value="hypoallergenic">{t('hypoallergenic_pillow')}</SelectItem>
                            <SelectItem value="memory-foam">{t('memory_foam_pillow')}</SelectItem>
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
                        <FormLabel>{t('room_fragrance_label')}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder={t('select_room_fragrance_placeholder')} />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            <SelectItem value="none">{t('none_fragrance')}</SelectItem>
                            <SelectItem value="citrus">{t('citrus_fragrance')}</SelectItem>
                            <SelectItem value="lavender">{t('lavender_fragrance')}</SelectItem>
                            <SelectItem value="fresh-linen">{t('fresh_linen_fragrance')}</SelectItem>
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
                        <FormLabel>{t('housekeeping_schedule_label')}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder={t('select_housekeeping_schedule_placeholder')} />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            <SelectItem value="morning">{t('morning_schedule')}</SelectItem>
                            <SelectItem value="afternoon">{t('afternoon_schedule')}</SelectItem>
                            <SelectItem value="on-request">{t('on_request_schedule')}</SelectItem>
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
                <CardTitle>{t('dietary_preferences_title')}</CardTitle>
                <CardDescription>{t('dietary_preferences_subtitle')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                 <FormField
                    control={form.control}
                    name="dietaryRestrictions"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>{t('dietary_restrictions_label')}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder={t('select_dietary_restriction_placeholder')} />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="vegan">{t('vegan_diet')}</SelectItem>
                                <SelectItem value="vegetarian">{t('vegetarian_diet')}</SelectItem>
                                <SelectItem value="halal">{t('halal_diet')}</SelectItem>
                                <SelectItem value="kosher">{t('kosher_diet')}</SelectItem>
                                <SelectItem value="gluten-free">{t('gluten_free_diet')}</SelectItem>
                                <SelectItem value="lactose-free">{t('lactose_free_diet')}</SelectItem>
                                <SelectItem value="none">{t('no_dietary_restrictions')}</SelectItem>
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
                        <FormLabel className="text-base">{t('allergens_label')}</FormLabel>
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
              <CardTitle>{t('favorite_dishes_title')}</CardTitle>
              <CardDescription>
                {t('favorite_dishes_subtitle')}
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
                    <p className="text-muted-foreground">{t('no_favorite_dishes_placeholder')}</p>
                )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard_customization_title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <FormField
                control={form.control}
                name="quickLinks"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">{t('quick_links_label')}</FormLabel>
                      <FormDescription>
                        {t('quick_links_description')}
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
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-primary" />
                {t('dynamic_preferences_title')}
              </CardTitle>
              <CardDescription>{t('dynamic_preferences_subtitle')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>{t('dynamic_preferences_desc')}</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>{t('dynamic_preferences_example_1')}</li>
                <li>{t('dynamic_preferences_example_2')}</li>
                <li>{t('dynamic_preferences_example_3')}</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('primary_trip_type_title')}</CardTitle>
              <CardDescription>{t('primary_trip_type_subtitle')}</CardDescription>
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
                          <FormLabel className="font-normal">{t('leisure_radio')}</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="business" />
                          </FormControl>
                          <FormLabel className="font-normal">{t('business_radio')}</FormLabel>
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
              <CardTitle>{t('eco_sensitivity_title')}</CardTitle>
              <CardDescription>
                {t('eco_sensitivity_subtitle')}
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
                            {t('eco_sensitivity_high')}
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="medium" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {t('eco_sensitivity_medium')}
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="low" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {t('eco_sensitivity_low')}
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

          <Button type="submit">{t('update_profile_button')}</Button>
        </form>
      </Form>
    </div>
  );
}

export default memo(ProfilePage);
