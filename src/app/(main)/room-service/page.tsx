
"use client";

import { useState } from "react";
import menuData from "@/lib/room-service-menu.json";
import { useLanguage } from "@/context/language-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/cart-context";
import type { RoomServiceItem, CartItem } from "@/lib/types";
import { Search, ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const { classicMenu, veganMenu, beveragesMenu } = menuData;

function MenuItemCard({ item }: { item: RoomServiceItem }) {
  const { t } = useLanguage();
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addToCart({
      id: item.name,
      name: item.name,
      price: item.price,
      quantity: 1,
    } as CartItem);
    toast({
      title: t('Added to cart'),
      description: `${t(item.name as any)} ${t('has been added to your order.')}`,
    });
  };

  return (
    <Card className="overflow-hidden flex flex-col">
       <CardHeader>
        <CardTitle>{t(item.name as any)}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground">{t(item.description as any)}</p>
      </CardContent>
      <CardFooter className="flex items-center justify-between mt-auto">
        <p className="text-lg font-bold">{item.price > 0 ? `${item.price.toFixed(2)}€` : t('Offert')}</p>
        <Button onClick={handleAddToCart}>{t('Add')}</Button>
      </CardFooter>
    </Card>
  );
}

function CartSheet() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { cart, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();

  const handleCheckout = () => {
    toast({
      title: t("Your order has been placed!"),
      description: t("Estimated delivery time: 25 minutes."),
    });
    clearCart();
  };
  
  return (
    <SheetContent className="flex flex-col">
      <SheetHeader>
        <SheetTitle>{t("My Order")}</SheetTitle>
      </SheetHeader>
      {cart.length === 0 ? (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-muted-foreground">{t("Your cart is empty.")}</p>
        </div>
      ) : (
        <ScrollArea className="flex-1 -mx-6">
            <div className="px-6">
                {cart.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 py-4">
                        <div className="flex-1">
                        <p className="font-semibold">{t(item.name as any)}</p>
                        <p className="text-sm text-muted-foreground">{item.price.toFixed(2)}€</p>
                        </div>
                        <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                            <Minus className="h-4 w-4" />
                        </Button>
                        <span>{item.quantity}</span>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                        </div>
                        <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => removeFromCart(item.id)}
                        >
                        <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
            </div>
        </ScrollArea>
      )}
      {cart.length > 0 && (
        <SheetFooter className="mt-auto flex flex-col gap-4 !text-left">
          <Separator />
          <div className="flex justify-between font-semibold">
            <span>{t("Subtotal")}</span>
            <span>{totalPrice.toFixed(2)}€</span>
          </div>
          <div className="flex justify-between text-lg font-bold">
            <span>{t("Total")}</span>
            <span>{totalPrice.toFixed(2)}€</span>
          </div>
          <SheetClose asChild>
            <Button size="lg" onClick={handleCheckout}>{t("Confirm")}</Button>
          </SheetClose>
        </SheetFooter>
      )}
    </SheetContent>
  );
}

function MenuTabContent({ menuCategories }: { menuCategories: any[] }) {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCategories = menuCategories.map(category => ({
    ...category,
    items: category.items.filter((item: RoomServiceItem) =>
        t(item.name as any).toLowerCase().includes(searchTerm.toLowerCase()) ||
        t(item.description as any).toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.items.length > 0);

  return (
    <div className="space-y-4">
      <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
              placeholder={t("Search for dishes...")}
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
          />
      </div>

      {filteredCategories.length > 0 ? (
        filteredCategories.map(category => (
          <div key={category.id}>
            <h2 className="text-2xl font-bold tracking-tight font-headline mt-6 mb-4">{t(category.name as any)}</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {category.items.map((item: RoomServiceItem) => (
                  <MenuItemCard key={item.name} item={item} />
                ))}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center text-muted-foreground py-10">
          {t('No dishes found.')}
        </div>
      )}
    </div>
  );
}


export default function RoomServicePage() {
  const { t } = useLanguage();
  const { totalItems } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 p-4 md:p-8">
        <h1 className="text-3xl font-bold tracking-tight font-headline">{t("Room Service")}</h1>
        <p className="text-muted-foreground mb-8">{t("Order from your room, 24/7.")}</p>

        <Tabs defaultValue="classic">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="classic">{t('Classic Menu')}</TabsTrigger>
            <TabsTrigger value="vegan">{t('Vegan Menu')}</TabsTrigger>
            <TabsTrigger value="beverages">{t('Signature & Mocktails')}</TabsTrigger>
          </TabsList>
          <TabsContent value="classic" className="mt-6">
            <MenuTabContent menuCategories={classicMenu.categories} />
          </TabsContent>
          <TabsContent value="vegan" className="mt-6">
            <MenuTabContent menuCategories={veganMenu.categories} />
          </TabsContent>
          <TabsContent value="beverages" className="mt-6">
            <MenuTabContent menuCategories={beveragesMenu.categories} />
          </TabsContent>
        </Tabs>
      </div>

      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
          <CartSheet />
      </Sheet>

      {totalItems > 0 && (
          <div className="sticky bottom-0 z-10 w-full p-4 bg-background/80 backdrop-blur-sm border-t">
          <Button className="w-full text-lg h-14" onClick={() => setIsCartOpen(true)}>
              <ShoppingCart className="mr-2 h-5 w-5" />
              {t('My Order')} ({totalItems})
          </Button>
          </div>
      )}
    </div>
  );
}
