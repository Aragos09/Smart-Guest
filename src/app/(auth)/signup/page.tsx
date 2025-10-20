
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { AppLogo } from "@/components/icons";
import { useLanguage } from "@/context/language-context";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";


export default function SignupPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const router = useRouter();

  const stayPreferences = [
    { id: "quiet", en: "Quiet room / View", fr: "Chambre calme / Vue" },
    { id: "pillow", en: "Firm / Soft pillow", fr: "Oreiller ferme / doux" },
    { id: "allergy", en: "Food allergies", fr: "Allergie alimentaire" },
    { id: "sustainability", en: "Sustainability preference", fr: "Préférence énergétique (durabilité)" },
  ];


  const formSchema = z.object({
    firstName: z.string().min(1, { message: t('required_field_error') }),
    lastName: z.string().min(1, { message: t('required_field_error') }),
    email: z.string().email({ message: t('invalid_email_error') }),
    password: z.string().min(8, { message: t('password_length_error') }),
    confirmPassword: z.string(),
    phone: z.string().optional(),
    preferences: z.array(z.string()).optional(),
  }).refine((data) => data.password === data.confirmPassword, {
    message: t('password_mismatch_error'),
    path: ["confirmPassword"],
  });
  
  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      preferences: [],
    },
  });

  function onSubmit(data: FormValues) {
    console.log(data);
    toast({
      title: t('account_created_success_title'),
      description: t('account_created_success_desc'),
    });
    router.push("/smart-room");
  }

  return (
    <Card className="w-full max-w-lg">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4">
          <AppLogo className="h-12 w-12 text-primary" />
        </div>
        <CardTitle className="text-2xl font-headline">Smart Guest</CardTitle>
        <CardDescription>
          {t('signup_subtitle')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>{t('first_name_label')}</FormLabel>
                    <FormControl>
                        <Input placeholder={t('first_name_placeholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>{t('last_name_label')}</FormLabel>
                    <FormControl>
                        <Input placeholder={t('last_name_placeholder')} {...field} />
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
                    <Input type="email" placeholder={t('email_placeholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('password_label')}</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder={t('password_placeholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('confirm_password_label')}</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder={t('confirm_password_placeholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('phone_label')}</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder={t('phone_placeholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="preferences"
              render={() => (
                <FormItem>
                    <FormLabel>{t('preferences_label')}</FormLabel>
                    <div className="space-y-2">
                        {stayPreferences.map((item) => (
                            <FormField
                            key={item.id}
                            control={form.control}
                            name="preferences"
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
                                        {t(item.id as any)}
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
            
            <p className="text-xs text-muted-foreground">{t('legal_notice_text')}</p>

            <Button type="submit" className="w-full">{t('create_account_button')}</Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex-col gap-4">
        <Button variant="link" asChild>
          <Link href="/login">{t('login_link_text')}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
