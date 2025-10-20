
"use client";

import { memo } from "react";
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
import { format } from "date-fns";

const InvoicePage = memo(function InvoicePage() {
  const { t } = useLanguage();
  const { invoiceItems, totalPrice } = useInvoice();

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
        </CardHeader>
        <CardContent>
          {invoiceItems.length > 0 ? (
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
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">{t("invoice_empty_message")}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
});

export default InvoicePage;
