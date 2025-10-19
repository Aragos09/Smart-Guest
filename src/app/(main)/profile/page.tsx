
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
import { useEffect, useState } from "react";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const alergies = [
  { id: "nuts", label: "Nuts" },
  { id: "shellfish", label: "Shellfish" },
  { id: "dairy", label: "Dairy" },
  { id: "wheat", label: "Wheat" },
  { id: "other", label: "Other" },
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
  arrivalDate: z.date().optional(),
  bedType: z.string().optional(),
  floorPreference: z.string().optional(),
  viewPreference: z.string().optional(),
  pillowType: z.string().optional(),
  roomFragrance: z.string().optional(),
  housekeepingSchedule: z.string().optional(),
  dietaryRestrictions: z.string().optional(),
  allergies: z.array(z.string()).optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfilePage() {
  const { t, setLanguage, language } = useLanguage();
  const { toast } = useToast();
  const { profile, setProfile, isLoading } = useUserProfile();
  const [isTodayArrival, setIsTodayArrival] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      ...profile,
      arrivalDate: profile.arrivalDate ? new Date(profile.arrivalDate) : undefined,
    },
    mode: "onChange",
  });
  
  useEffect(() => {
    if (!isLoading) {
      const defaultValues = {
        ...profile,
        arrivalDate: profile.arrivalDate ? new Date(profile.arrivalDate) : undefined,
      };
      form.reset(defaultValues);
      
      if (profile.arrivalDate) {
        const arrival = new Date(profile.arrivalDate);
        const today = new Date();
        setIsTodayArrival(arrival.toDateString() === today.toDateString());
      }
    }
  }, [isLoading, profile, form]);

  function onSubmit(data: ProfileFormValues) {
    const dataToSave = {
        ...data,
        arrivalDate: data.arrivalDate?.toISOString(),
    }

    if (data.language !== language) {
      setLanguage(data.language as Language);
    }
    setProfile(dataToSave as any);
    toast({
      title: t('Profile Updated'),
      description: t('Your preferences have been saved successfully.'),
    });
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

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
          
          {isTodayArrival && (
            <Card>
              <CardHeader>
                <CardTitle>Online Check-in</CardTitle>
              </CardHeader>
              <CardContent>
                <Button>Proceed to Check-in</Button>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
                <CardTitle>Stay & Room Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
                <FormField
                    control={form.control}
                    name="arrivalDate"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                        <FormLabel>Arrival Date</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                variant={"outline"}
                                className={cn(
                                    "w-[240px] pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                )}
                                >
                                {field.value ? (
                                    format(field.value, "PPP")
                                ) : (
                                    <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={(date) => {
                                    field.onChange(date);
                                    const today = new Date();
                                    setIsTodayArrival(date?.toDateString() === today.toDateString());
                                }}
                                disabled={(date) => date < new Date()}
                                initialFocus
                            />
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="bedType"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Bed Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a bed type" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            <SelectItem value="king">King</SelectItem>
                            <SelectItem value="queen">Queen</SelectItem>
                            <SelectItem value="twin">Twin</SelectItem>
                            <SelectItem value="sofa-bed">Sofa bed</SelectItem>
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
                        <FormLabel>Floor Preference</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a floor preference" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            <SelectItem value="high">High floor</SelectItem>
                            <SelectItem value="low">Low floor</SelectItem>
                            <SelectItem value="near-elevator">Near elevator</SelectItem>
                            <SelectItem value="quiet-zone">Quiet zone</SelectItem>
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
                        <FormLabel>View Preference</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a view preference" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            <SelectItem value="city">City</SelectItem>
                            <SelectItem value="garden">Garden</SelectItem>
                            <SelectItem value="pool">Pool</SelectItem>
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
                        <FormLabel>Pillow Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a pillow type" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            <SelectItem value="soft">Soft</SelectItem>
                            <SelectItem value="firm">Firm</SelectItem>
                            <SelectItem value="hypoallergenic">Hypoallergenic</SelectItem>
                            <SelectItem value="memory-foam">Memory foam</SelectItem>
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
                        <FormLabel>Room Fragrance</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a room fragrance" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="citrus">Citrus</SelectItem>
                            <SelectItem value="lavender">Lavender</SelectItem>
                            <SelectItem value="fresh-linen">Fresh linen</SelectItem>
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
                        <FormLabel>Housekeeping Schedule</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a housekeeping schedule" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            <SelectItem value="morning">Morning</SelectItem>
                            <SelectItem value="afternoon">Afternoon</SelectItem>
                            <SelectItem value="on-request">On request</SelectItem>
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
                <CardTitle>Dietary Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
                 <FormField
                    control={form.control}
                    name="dietaryRestrictions"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Dietary Restrictions</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a dietary restriction" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="vegan">Vegan</SelectItem>
                                <SelectItem value="vegetarian">Vegetarian</SelectItem>
                                <SelectItem value="halal">Halal</SelectItem>
                                <SelectItem value="kosher">Kosher</SelectItem>
                                <SelectItem value="gluten-free">Gluten-free</SelectItem>
                                <SelectItem value="lactose-free">Lactose-free</SelectItem>
                                <SelectItem value="none">No dietary restrictions</SelectItem>
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
                        <FormLabel className="text-base">Allergies</FormLabel>
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
                                  {item.label}
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
              <CardTitle>{t('Primary Trip Type')}</CardTitle>
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

    