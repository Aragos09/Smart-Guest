
"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
  } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Bike,
  CheckCircle2,
  Leaf,
  Wind,
} from "lucide-react";
import { useLanguage } from "@/context/language-context";
import wellnessData from "@/lib/wellness-services.json";
import type { WellnessService, WellnessServiceCategory } from "@/lib/types";
import { memo, useState } from "react";
import { useInvoice } from "@/context/invoice-context";
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';


const { wellness_services: wellnessServices, eco_commitments: ecoCommitments } = wellnessData;

const timeSlots = [
    "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"
];

function BookingDialog({ item, children }: { item: WellnessService; children: React.ReactNode }) {
    const { t } = useLanguage();
    const { addItemsToInvoice } = useInvoice();
    const { toast } = useToast();
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [time, setTime] = useState<string | undefined>(undefined);
    const [isOpen, setIsOpen] = useState(false);

    const handleBooking = () => {
        if (!date || !time) {
          toast({
            variant: "destructive",
            title: t('booking_error_title'),
            description: t('booking_error_desc'),
          });
          return;
        }

        const bookingDate = new Date(date);
        const [hours, minutes] = time.split(':').map(Number);
        bookingDate.setHours(hours, minutes);
        
        const bookingInfo = format(bookingDate, "PPP @ p");

        addItemsToInvoice([{
            id: `wellness-${item.name}-${Date.now()}`,
            name: item.name, // Store the key, not the translated string
            price: item.price_eur,
            quantity: 1,
            bookingInfo: bookingInfo, // Store formatted date separately
        }]);

        toast({
            title: t('booking_success_title'),
        });
        
        setDate(new Date());
        setTime(undefined);
        setIsOpen(false);
    }
    
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{t('book_service_title', { context: t(item.name as any)})}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))}
                        className="rounded-md border"
                    />
                    <Select onValueChange={setTime} value={time}>
                        <SelectTrigger>
                            <SelectValue placeholder={t('select_time_placeholder')} />
                        </SelectTrigger>
                        <SelectContent>
                            {timeSlots.map(slot => (
                                <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">{t('cancel_button')}</Button>
                    </DialogClose>
                    <Button onClick={handleBooking}>{t('confirm_button')}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

const ServiceCard = memo(function ServiceCard({ item }: { item: WellnessService }) {
  const { t } = useLanguage();
  
  const isFree = item.price_eur <= 0;
  const isDonation = item.action_type === 'donate';
  const buttonText = isDonation ? 'donate_button' : 'book_now_button';

  const cardContent = (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle className="text-lg">{t(item.name as any)}</CardTitle>
        <p className="text-sm text-muted-foreground pt-2">{t(item.description as any)}</p>
      </CardHeader>
      <CardFooter className="mt-auto flex items-center justify-between">
        <p className="text-xl font-bold">
          {isFree ? t('free_price') : `${item.price_eur.toFixed(2)}€`}
        </p>
        <Button disabled={isFree}>{t(buttonText as any)}</Button>
      </CardFooter>
    </Card>
  );

  if(isFree) {
      return cardContent;
  }

  return (
    <BookingDialog item={item}>
        {cardContent}
    </BookingDialog>
  );
});

const WellnessServicesPage = memo(function WellnessServicesPage() {
  const { t } = useLanguage();

  const categories: WellnessServiceCategory[] = [
    { name: "spa_category", icon: Wind, items: wellnessServices.spa },
    { name: "fitness_category", icon: Bike, items: wellnessServices.fitness },
    { name: "eco_services_category", icon: Leaf, items: wellnessServices.eco_services },
  ];

  const commitments = ecoCommitments ? Object.entries(ecoCommitments) : [];

  return (
    <div className="flex-1 space-y-4 p-4 md:space-y-8 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            {t('wellness_services_title')}
          </h1>
          <p className="text-muted-foreground">
            {t('wellness_services_subtitle')}
          </p>
        </div>
      </div>

      <Accordion type="multiple" defaultValue={[t("spa_category" as any)]} className="w-full space-y-4">
        {categories.map((category) => (
          <AccordionItem value={t(category.name as any)} key={category.name}>
            <AccordionTrigger className="text-2xl font-headline font-bold rounded-lg bg-card p-4 border data-[state=open]:border-b-0 data-[state=open]:rounded-b-none">
              <div className="flex items-center gap-3">
                <category.icon className="h-6 w-6 text-primary" />
                {t(category.name as any)}
              </div>
            </AccordionTrigger>
            <AccordionContent className="border border-t-0 rounded-b-lg bg-card p-4">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {category.items.map((item) => (
                  <ServiceCard key={`${category.name}-${item.name}`} item={item} />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <Card>
        <CardHeader>
          <CardTitle>{t('eco_commitments_title')}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          {commitments.map(([key, value]) => (
            <div key={key} className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 mt-1 text-green-500 flex-shrink-0" />
              <p className="text-sm text-muted-foreground">{t(value as any)}</p>
            </div>
          ))}
        </CardContent>
      </Card>

    </div>
  );
});

export default WellnessServicesPage;
