
"use client";

import { memo, useState } from "react";
import { useLanguage } from "@/context/language-context";
import { useInvoice } from "@/context/invoice-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { CreditCard, Landmark, ArrowLeft } from "lucide-react";
import { AppleIcon } from "@/components/icons";
import { useToast } from "@/hooks/use-toast";
import type { InvoiceItem } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


const InvoicePage = memo(function InvoicePage() {
  const { t } = useLanguage();
  const { invoiceItems, totalPrice, clearInvoice } = useInvoice();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [paymentStep, setPaymentStep] = useState('methodSelection');
  const [selectedMethod, setSelectedMethod] = useState('');

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear + i);
  const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));

  const formSchema = z.object({
    cardName: z.string().min(1, { message: t('required_field_error') }),
    cardNumber: z.string().regex(/^(?:\d{4} ){3}\d{4}$/, { message: t('invalid_card_number_error') }),
    expiryMonth: z.string({ required_error: t('required_field_error') }),
    expiryYear: z.string({ required_error: t('required_field_error') }),
    cvc: z.string().regex(/^\d{3,4}$/, { message: t('invalid_cvc_error') }),
  });
  
  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cardName: "",
      cardNumber: "",
      cvc: "",
    },
  });

  const handlePaymentMethodSelect = (method: string) => {
    setSelectedMethod(method);
    if (method === "Cash") {
      toast({
        title: t('reception_notified_title'),
        description: t('payment_success_desc_Cash')
      });
      setIsDialogOpen(false);
    } else if (method === "Apple Pay") {
      setPaymentStep('applePayConfirmation');
    } else {
      setPaymentStep('cardDetails');
    }
  };
  
  const handleApplePayConfirm = () => {
    console.log(`Payment confirmed for ${selectedMethod}`);
    toast({
        title: t('payment_success_title'),
        description: t('payment_success_desc'),
    });
    setPaymentStep('methodSelection');
    setIsDialogOpen(false);
    clearInvoice();
  };

  const handleCardPayment = (data: FormValues) => {
    console.log(`Payment confirmed for ${selectedMethod} with data:`, data);
    toast({
      title: t('payment_success_title'),
      description: t('payment_success_desc'),
    });
    form.reset();
    setPaymentStep('methodSelection');
    setIsDialogOpen(false);
    clearInvoice();
  };

  const renderItemName = (item: InvoiceItem) => {
    const mainName = t(item.name as any);
    if (item.bookingInfo) {
      return `${mainName} (${item.bookingInfo})`;
    }
    return mainName;
  }

  const handleDialogChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setTimeout(() => {
        form.reset();
        setPaymentStep('methodSelection');
        setSelectedMethod('');
      }, 300);
    }
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    }
    return value;
  }
  
  return (
    <div className="flex-1 space-y-4 p-4 md:space-y-8 md:p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          {t("invoice_title")}
        </h1>
        <p className="text-muted-foreground">
          {t("invoice_subtitle")}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("invoice_card_title")}</CardTitle>
          <CardDescription>
            {invoiceItems.length > 0
              ? t("invoice_summary_desc")
              : t("invoice_empty_message")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {invoiceItems.length > 0 && (
            <>
              {/* Mobile View */}
              <div className="md:hidden">
                {invoiceItems.map((item, index) => (
                  <div key={`${item.id}-${index}`} className="mb-4 rounded-lg border p-4">
                    <div className="font-semibold">{renderItemName(item)}</div>
                    <div className="text-sm text-muted-foreground">{format(new Date(item.date), "PPP p")}</div>
                    <div className="mt-2 flex justify-between">
                      <div>
                        {item.quantity} x {item.price.toFixed(2)}€
                      </div>
                      <div className="font-semibold">{(item.price * item.quantity).toFixed(2)}€</div>
                    </div>
                  </div>
                ))}
                <div className="mt-4 flex justify-between border-t pt-4 font-bold text-lg">
                  <span>{t("invoice_grand_total")}</span>
                  <span>{totalPrice.toFixed(2)}€</span>
                </div>
              </div>

              {/* Desktop View */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("invoice_table_date")}</TableHead>
                      <TableHead>{t("invoice_table_item")}</TableHead>
                      <TableHead className="text-center">{t("invoice_table_quantity")}</TableHead>
                      <TableHead className="text-right">{t("invoice_table_unit_price")}</TableHead>
                      <TableHead className="text-right">{t("invoice_table_total_price")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoiceItems.map((item, index) => (
                      <TableRow key={`${item.id}-${index}`}>
                        <TableCell>{format(new Date(item.date), "PPP p")}</TableCell>
                        <TableCell>{renderItemName(item)}</TableCell>
                        <TableCell className="text-center">{item.quantity}</TableCell>
                        <TableCell className="text-right">{item.price.toFixed(2)}€</TableCell>
                        <TableCell className="text-right">{(item.price * item.quantity).toFixed(2)}€</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={4} className="text-right font-bold text-lg">{t("invoice_grand_total")}</TableCell>
                      <TableCell className="text-right font-bold text-lg">{totalPrice.toFixed(2)}€</TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>
            </>
          )}
        </CardContent>
        {totalPrice > 0 && (
           <CardFooter className="justify-end">
            <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
              <DialogTrigger asChild>
                <Button>{t("pay_now_button")}</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                {paymentStep === 'methodSelection' ? (
                  <>
                    <DialogHeader>
                      <DialogTitle>{t("payment_method_title")}</DialogTitle>
                      <DialogDescription>
                        {t("payment_method_desc")}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <Button
                        variant="outline"
                        className="w-full h-16 justify-start gap-4"
                        onClick={() => handlePaymentMethodSelect("Visa")}
                      >
                        <CreditCard className="h-8 w-8 text-blue-600" />
                        <span className="font-semibold text-lg">{t('payment_method_visa')}</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full h-16 justify-start gap-4"
                        onClick={() => handlePaymentMethodSelect("Mastercard")}
                      >
                        <CreditCard className="h-8 w-8 text-orange-500" />
                        <span className="font-semibold text-lg">{t('payment_method_mastercard')}</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full h-16 justify-start gap-4"
                        onClick={() => handlePaymentMethodSelect("Apple Pay")}
                      >
                        <AppleIcon className="h-8 w-8" />
                        <span className="font-semibold text-lg">{t('payment_method_apple_pay')}</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full h-16 justify-start gap-4"
                        onClick={() => handlePaymentMethodSelect("Cash")}
                      >
                        <Landmark className="h-8 w-8 text-muted-foreground" />
                        <span className="font-semibold text-lg">{t("pay_at_reception_button")}</span>
                      </Button>
                    </div>
                  </>
                ) : paymentStep === 'applePayConfirmation' ? (
                    <>
                        <DialogHeader>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setPaymentStep('methodSelection')}>
                                    <ArrowLeft className="h-4 w-4" />
                                </Button>
                                <DialogTitle>{t('apple_pay_confirm_title')}</DialogTitle>
                            </div>
                            <DialogDescription>{t('apple_pay_confirm_desc')}</DialogDescription>
                        </DialogHeader>
                        <div className="py-8 text-center space-y-4">
                            <AppleIcon className="h-16 w-16 mx-auto" />
                            <p className="text-sm text-muted-foreground">{t('total_amount_label')}</p>
                            <p className="text-3xl font-bold">{totalPrice.toFixed(2)}€</p>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleApplePayConfirm} className="w-full">
                                {t('apple_pay_confirm_button')}
                            </Button>
                        </DialogFooter>
                    </>
                ) : (
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(handleCardPayment)} className="space-y-4">
                        <DialogHeader>
                          <div className="flex items-center gap-2">
                              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setPaymentStep('methodSelection')}>
                                <ArrowLeft className="h-4 w-4" />
                              </Button>
                              <DialogTitle>{t('card_details_title')}</DialogTitle>
                          </div>
                        </DialogHeader>

                        <FormField
                          control={form.control}
                          name="cardName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('card_name_label')}</FormLabel>
                              <FormControl>
                                <Input placeholder={t('card_name_placeholder')} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="cardNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('card_number_label')}</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="0000 0000 0000 0000"
                                  {...field}
                                  onChange={(e) => {
                                    const formattedValue = formatCardNumber(e.target.value);
                                    field.onChange(formattedValue);
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid grid-cols-3 gap-4">
                          <FormField
                            control={form.control}
                            name="expiryMonth"
                            render={({ field }) => (
                              <FormItem className="col-span-1">
                                <FormLabel>{t('expiry_month_label')}</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder={t('month_placeholder')} />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {months.map(month => (
                                      <SelectItem key={month} value={month}>{month}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="expiryYear"
                            render={({ field }) => (
                              <FormItem className="col-span-1">
                                <FormLabel>{t('expiry_year_label')}</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder={t('year_placeholder')} />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {years.map(year => (
                                      <SelectItem key={year} value={String(year)}>{year}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="cvc"
                            render={({ field }) => (
                              <FormItem className="col-span-1">
                                <FormLabel>{t('cvc_label')}</FormLabel>
                                <FormControl>
                                    <Input placeholder="CVC" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <DialogFooter>
                            <Button type="submit" className="w-full">{t('confirm_payment_button')}</Button>
                        </DialogFooter>
                      </form>
                    </Form>
                )}
              </DialogContent>
            </Dialog>
           </CardFooter>
        )}
      </Card>
    </div>
  );
});

export default InvoicePage;
