
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLanguage } from "@/context/language-context";
import type { Language } from "@/lib/translations";
import { useUserProfile } from "@/context/user-profile-context";
import { useEffect, memo } from "react";
import { Leaf, HeartHandshake, BotMessageSquare, Utensils, Sparkles, ShoppingBasket, Home, Receipt, Star } from "lucide-react";
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
  { id: "nuts", label: "allergen_nuts" },
  { id: "shellfish", label: "allergen_shellfish" },
  { id: "dairy", label: "allergen_dairy" },
  { id: "wheat", label: "allergen_wheat" },
  { id: "other", label: "allergen_other" },
];

const allQuickLinks = [
  { id: "smart-room", label: "smart_room_title", icon: Home },
  { id: "eco-manager", label: "eco_manager_title", icon: Leaf },
  { id: "wellness-services", label: "wellness_services_title", icon: Sparkles },
  { id: "experiences", label: "experiences_title", icon: HeartHandshake },
  { id: "restaurant", label: "restaurant_title", icon: Utensils },
  { id: "room-service", label: "room_service_title", icon: ShoppingBasket },
  { id: "invoice", label: "invoice_title", icon: Receipt },
  { id: "concierge", label: "concierge_title", icon: BotMessageSquare },
];

const profileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email(),
  language: z.enum(["en", "fr"], {
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

const ProfilePage = memo(function ProfilePage() {
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
          <h1 className="text-3xl font-bold tracking-tight font-headline">{t('profile_title')}</h1>
          <p className="text-muted-foreground">
            {t('profile_subtitle')}
          </p>
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>{t('personal_information_title')}</CardTitle>
              <CardDescription>{t('personal_information_description')}</CardDescription>
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
                            <Input placeholder={t('full_name_placeholder')} {...field} />
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
                        <FormLabel>{t('language_label')}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                            <SelectValue placeholder={t('language_placeholder')} />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="en">English</SelectItem>
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
          
          <Accordion type="single" collapsible className="w-full">
            <Card>
              <AccordionItem value="item-1" className="border-b-0">
                <AccordionTrigger className="p-6 hover:no-underline">
                  <div className="flex flex-col items-start text-left">
                      <CardTitle>{t('stay_preferences_title')}</CardTitle>
                      <CardDescription className="mt-1.5">{t('stay_preferences_description')}</CardDescription>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
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
                                      <SelectValue placeholder={t('bed_type_placeholder')} />
                                  </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                  <SelectItem value="king">{t('bed_type_king')}</SelectItem>
                                  <SelectItem value="queen">{t('bed_type_queen')}</SelectItem>
                                  <SelectItem value="twin">{t('bed_type_twin')}</SelectItem>
                                  <SelectItem value="sofa-bed">{t('bed_type_sofa')}</SelectItem>
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
                                      <SelectValue placeholder={t('floor_preference_placeholder')} />
                                  </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                  <SelectItem value="high">{t('floor_preference_high')}</SelectItem>
                                  <SelectItem value="low">{t('floor_preference_low')}</SelectItem>
                                  <SelectItem value="near-elevator">{t('floor_preference_elevator')}</SelectItem>
                                  <SelectItem value="quiet-zone">{t('floor_preference_quiet')}</SelectItem>
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
                                      <SelectValue placeholder={t('view_preference_placeholder')} />
                                  </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                  <SelectItem value="city">{t('view_preference_city')}</SelectItem>
                                  <SelectItem value="garden">{t('view_preference_garden')}</SelectItem>
                                  <SelectItem value="pool">{t('view_preference_pool')}</SelectItem>
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
                                      <SelectValue placeholder={t('pillow_type_placeholder')} />
                                  </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                  <SelectItem value="soft">{t('pillow_type_soft')}</SelectItem>
                                  <SelectItem value="firm">{t('pillow_type_firm')}</SelectItem>
                                  <SelectItem value="hypoallergenic">{t('pillow_type_hypoallergenic')}</SelectItem>
                                  <SelectItem value="memory-foam">{t('pillow_type_memory')}</SelectItem>
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
                              <FormLabel>{t('fragrance_label')}</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                  <SelectTrigger>
                                      <SelectValue placeholder={t('fragrance_placeholder')} />
                                  </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                  <SelectItem value="none">{t('fragrance_none')}</SelectItem>
                                  <SelectItem value="citrus">{t('fragrance_citrus')}</SelectItem>
                                  <SelectItem value="lavender">{t('fragrance_lavender')}</SelectItem>
                                  <SelectItem value="fresh-linen">{t('fragrance_linen')}</SelectItem>
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
                              <FormLabel>{t('housekeeping_label')}</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                  <SelectTrigger>
                                      <SelectValue placeholder={t('housekeeping_placeholder')} />
                                  </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                  <SelectItem value="morning">{t('housekeeping_morning')}</SelectItem>
                                  <SelectItem value="afternoon">{t('housekeeping_afternoon')}</SelectItem>
                                  <SelectItem value="on-request">{t('housekeeping_request')}</SelectItem>
                                  </SelectContent>
                              </Select>
                              <FormMessage />
                              </FormItem>
                          )}
                      />
                  </CardContent>
                </AccordionContent>
              </AccordionItem>
            </Card>
          </Accordion>

          <Accordion type="single" collapsible className="w-full">
            <Card>
                <AccordionItem value="item-1" className="border-b-0">
                    <AccordionTrigger className="p-6 hover:no-underline">
                        <div className="flex flex-col items-start text-left">
                            <CardTitle>{t('dietary_preferences_title')}</CardTitle>
                            <CardDescription className="mt-1.5">{t('dietary_preferences_description')}</CardDescription>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
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
                                            <SelectValue placeholder={t('dietary_restrictions_placeholder')} />
                                        </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="vegan">{t('dietary_vegan')}</SelectItem>
                                            <SelectItem value="vegetarian">{t('dietary_vegetarian')}</SelectItem>
                                            <SelectItem value="halal">{t('dietary_halal')}</SelectItem>
                                            <SelectItem value="kosher">{t('dietary_kosher')}</SelectItem>
                                            <SelectItem value="gluten-free">{t('dietary_gluten_free')}</SelectItem>
                                            <SelectItem value="lactose-free">{t('dietary_lactose_free')}</SelectItem>
                                            <SelectItem value="none">{t('dietary_none')}</SelectItem>
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
                    </AccordionContent>
                </AccordionItem>
            </Card>
          </Accordion>
          
          <Card>
            <CardHeader>
              <CardTitle>{t('favorite_dishes_title')}</CardTitle>
              <CardDescription>
                {t('favorite_dishes_description')}
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
                    <p className="text-muted-foreground">{t('no_favorite_dishes')}</p>
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
                      <FormLabel className="text-base">{t('quick_links_title')}</FormLabel>
                      <FormDescription>
                        {t('dashboard_customization_description')}
                      </FormDescription>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
              <CardDescription>{t('dynamic_preferences_description')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>{t('dynamic_preferences_feature_1')}</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>{t('dynamic_preferences_example_1')}</li>
                <li>{t('dynamic_preferences_example_2')}</li>
                <li>{t('dynamic_preferences_example_3')}</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('trip_type_title')}</CardTitle>
              <CardDescription>{t("trip_type_description")}</CardDescription>
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
                          <FormLabel className="font-normal">{t('trip_type_leisure')}</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="business" />
                          </FormControl>
                          <FormLabel className="font-normal">{t('trip_type_business')}</FormLabel>
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
                {t('eco_sensitivity_description')}
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
                            {t("eco_sensitivity_low")}
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
});

export default ProfilePage;

    