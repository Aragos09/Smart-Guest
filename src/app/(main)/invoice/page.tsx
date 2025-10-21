
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
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { CreditCard, Landmark } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const InvoicePage = memo(function InvoicePage() {
  const { t } = useLanguage();
  const { invoiceItems, totalPrice } = useInvoice();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handlePayment = (method: string) => {
    console.log(`Payment initiated with ${method}`);
    setIsDialogOpen(false);
    toast({
      title: t('payment_success_title'),
      description: t('payment_success_desc', { context: method }),
    });
    // In a real app, you would clear the invoice or mark it as paid here.
  };

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
          <CardTitle>{t("invoice_title")}</CardTitle>
          <CardDescription>
            {invoiceItems.length > 0
              ? t("invoice_summary_desc")
              : t("invoice_empty_message")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {invoiceItems.length > 0 && (
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
                    <TableCell>{t(item.name as any)}</TableCell>
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
          )}
        </CardContent>
        {totalPrice > 0 && (
           <CardFooter className="justify-end">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>{t("pay_now_button")}</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
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
                    onClick={() => handlePayment("Visa")}
                  >
                    <CreditCard className="h-8 w-8 text-blue-600" />
                    <span className="font-semibold text-lg">Visa</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full h-16 justify-start gap-4"
                    onClick={() => handlePayment("Mastercard")}
                  >
                    <CreditCard className="h-8 w-8 text-orange-500" />
                    <span className="font-semibold text-lg">Mastercard</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full h-16 justify-start gap-4"
                    onClick={() => handlePayment("Cash")}
                  >
                    <Landmark className="h-8 w-8 text-muted-foreground" />
                    <span className="font-semibold text-lg">{t("pay_at_reception_button")}</span>
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
           </CardFooter>
        )}
      </Card>
    </div>
  );
});

export default InvoicePage;
