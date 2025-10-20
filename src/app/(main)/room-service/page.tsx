
"use client";

import { useState, memo } from "react";
import menuData from "@/lib/room-service-menu.json";
import { useLanguage } from "@/context/language-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import type { RoomServiceItem, RoomServiceMenu } from "@/lib/types";
import { Search, ShoppingCart, Plus, Minus, Trash2, ArrowLeft, Martini, Vegan, Utensils } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const { classic, vegan, beverages } = menuData;

function MenuItemCard({ item, menuType }: { item: RoomServiceItem, menuType: string }) {
  const { t } = useLanguage();
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addToCart({
      id: `${menuType}-${item.name_fr}`,
      name: item.name_fr,
      price: item.price_eur,
      quantity: 1,
    });
    toast({
      title: t('added_to_cart_toast_title'),
      description: `${t(item.name_fr as any)} ${t('added_to_cart_toast_desc')}`,
    });
  };

  return (
    <Card className="overflow-hidden flex flex-col">
       <CardHeader>
        <CardTitle>{t(item.name_fr as any)}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground">{t(item.description_fr as any)}</p>
      </CardContent>
      <CardFooter className="flex items-center justify-between mt-auto">
        <p className="text-lg font-bold">{item.price_eur > 0 ? `${item.price_eur.toFixed(2)}€` : t('free_price')}</p>
        <Button onClick={handleAddToCart}>{t('add_to_cart_button')}</Button>
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
      title: t("order_placed_toast_title"),
      description: t("order_placed_toast_desc"),
    });
    clearCart();
  };
  
  return (
    <SheetContent className="flex flex-col">
      <SheetHeader>
        <SheetTitle>{t("my_order_title")}</SheetTitle>
      </SheetHeader>
      {cart.length === 0 ? (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-muted-foreground">{t("empty_cart_message")}</p>
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
            <span>{t("subtotal_label")}</span>
            <span>{totalPrice.toFixed(2)}€</span>
          </div>
          <div className="flex justify-between text-lg font-bold">
            <span>{t("total_label")}</span>
            <span>{totalPrice.toFixed(2)}€</span>
          </div>
          <SheetClose asChild>
            <Button size="lg" onClick={handleCheckout}>{t("checkout_button")}</Button>
          </SheetClose>
        </SheetFooter>
      )}
    </SheetContent>
  );
}

function MenuDisplay({ menu, menuType, searchTerm }: { menu: RoomServiceMenu, menuType: string, searchTerm: string }) {
  const { t } = useLanguage();

  const categories = Object.entries(menu.categories).map(([id, cat]) => ({
    id,
    name: cat.name_fr,
    items: cat.items,
  }));

  const filteredCategories = categories.map(category => ({
    ...category,
    items: category.items.filter((item: RoomServiceItem) =>
        t(item.name_fr as any).toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.description_fr && t(item.description_fr as any).toLowerCase().includes(searchTerm.toLowerCase()))
    )
  })).filter(category => category.items.length > 0);

  return (
    <div className="space-y-4">
      {filteredCategories.length > 0 ? (
        filteredCategories.map(category => (
          <div key={category.id}>
            <h2 className="text-2xl font-bold tracking-tight font-headline mt-6 mb-4">{t(category.name as any)}</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {category.items.map((item: RoomServiceItem) => (
                  <MenuItemCard key={item.name_fr} item={item} menuType={menuType} />
                ))}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center text-muted-foreground py-10">
          {t('no_dishes_found')}
        </div>
      )}
    </div>
  );
}

const RoomServicePage = memo(function RoomServicePage({ params }: { params: { locale: string }}) {
  const { t } = useLanguage();
  const { totalItems } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const menuChoices = [
    { id: "classic", label: "classic_menu_title", icon: Utensils, menu: classic },
    { id: "vegan", label: "vegan_menu_title", icon: Vegan, menu: vegan },
    { id: "beverages", label: "beverages_menu_title", icon: Martini, menu: beverages }
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 p-4 md:p-8">
        <h1 className="text-3xl font-bold tracking-tight font-headline">{t("room_service_title")}</h1>
        <p className="text-muted-foreground mb-8">{t("room_service_subtitle")}</p>

        <Tabs defaultValue="classic" className="space-y-4">
          <div className="flex justify-between items-center">
            <TabsList>
              {menuChoices.map(choice => (
                <TabsTrigger key={choice.id} value={choice.id}>
                  <choice.icon className="mr-2 h-4 w-4" />
                  {t(choice.label as any)}
                </TabsTrigger>
              ))}
            </TabsList>
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                  placeholder={t("search_dishes_placeholder")}
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          {menuChoices.map(choice => (
            <TabsContent key={choice.id} value={choice.id}>
              <MenuDisplay menu={choice.menu} menuType={choice.id} searchTerm={searchTerm} />
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
          <CartSheet />
      </Sheet>

      {totalItems > 0 && (
          <div className="sticky bottom-0 z-10 w-full p-4 bg-background/80 backdrop-blur-sm border-t">
          <Button className="w-full text-lg h-14" onClick={() => setIsCartOpen(true)}>
              <ShoppingCart className="mr-2 h-5 w-5" />
              {t('my_order_title')} ({totalItems})
          </Button>
          </div>
      )}
    </div>
  );
});

export default RoomServicePage;
