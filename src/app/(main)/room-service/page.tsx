
"use client";

import { useState } from "react";
import classicMenuData from "@/lib/room-service-menu.json";
import veganMenuData from "@/lib/room-service-menu-vegan.json";
import beveragesMenuData from "@/lib/room-service-beverages.json";
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
import { Search, ShoppingCart, Plus, Minus, Trash2, ArrowLeft, Utensils, Leaf, Martini } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

const { room_service_menu: classicMenu } = classicMenuData;
const { room_service_menu_vegan: veganMenu } = veganMenuData;
const { room_service_beverages_signature: beveragesMenu } = beveragesMenuData;

function MenuItemCard({ item }: { item: RoomServiceItem }) {
  const { t } = useLanguage();
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addToCart({
      id: item.name_fr,
      name: item.name_fr,
      price: item.price_eur,
      quantity: 1,
    } as CartItem);
    toast({
      title: t('Added to cart'),
      description: `${t(item.name_fr as any)} ${t('has been added to your order.')}`,
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
        <p className="text-lg font-bold">{item.price_eur > 0 ? `${item.price_eur.toFixed(2)}€` : t('Offert')}</p>
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
                        {item.image && <Image
                        src={item.image}
                        alt={t(item.name as any)}
                        width={64}
                        height={64}
                        className="rounded-md object-cover"
                        />}
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

function MenuDisplay({ menuData, menuType, onBack }: { menuData: any, menuType: 'classic' | 'vegan' | 'beverages', onBack: () => void }) {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");

  const menuCategories = menuType === 'beverages' ? menuData : menuData.categories;

  const categories = Object.entries(menuCategories).map(([id, items]: [string, any]) => ({
    id,
    name: t(id.charAt(0).toUpperCase() + id.slice(1) as any),
    items: Array.isArray(items) ? items.filter((item: RoomServiceItem) =>
        t(item.name_fr as any).toLowerCase().includes(searchTerm.toLowerCase()) ||
        t(item.description_fr as any).toLowerCase().includes(searchTerm.toLowerCase())
    ) : []
  })).filter(category => category.items.length > 0);

  const defaultTab = categories.length > 0 ? categories[0].id : "";
  
  return (
    <div className="flex h-full flex-col">
        <div className="p-4 md:p-8">
            <Button variant="ghost" onClick={onBack} className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('Back to menus')}
            </Button>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    placeholder={t("Search for dishes...")}
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>

        <Tabs defaultValue={defaultTab} className="flex-1 flex flex-col">
            <div className="px-4 md:px-8">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                    {Object.keys(menuCategories).map((cat) => (
                        <TabsTrigger key={cat} value={cat}>{t(cat.charAt(0).toUpperCase() + cat.slice(1) as any)}</TabsTrigger>
                    ))}
                </TabsList>
            </div>
            <ScrollArea className="flex-1">
                <div className="p-4 md:p-8">
                    {categories.map((category) => (
                        <TabsContent key={category.id} value={category.id}>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {category.items.map((item: RoomServiceItem) => (
                            <MenuItemCard key={item.name_fr} item={item} />
                            ))}
                        </div>
                        </TabsContent>
                    ))}
                    {
                    categories.length === 0 && (
                        <div className="text-center text-muted-foreground py-10">
                        {t('No dishes found.')}
                        </div>
                    )
                    }
                </div>
            </ScrollArea>
        </Tabs>
    </div>
  );
}


export default function RoomServicePage() {
  const { t } = useLanguage();
  const { totalItems } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<"classic" | "vegan" | "beverages" | null>(null);

  if (!selectedMenu) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <h1 className="text-3xl font-bold tracking-tight text-center font-headline">{t("Room Service")}</h1>
        <p className="text-muted-foreground text-center mb-8">{t("Please select a menu to start your order.")}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
          <Card className="text-center hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => setSelectedMenu('classic')}>
            <CardHeader>
              <Utensils className="h-12 w-12 mx-auto text-primary" />
            </CardHeader>
            <CardContent>
              <CardTitle className="text-2xl font-headline">{t('Classic Menu')}</CardTitle>
              <CardDescription>{t('A selection of timeless favorites and comforting classics.')}</CardDescription>
            </CardContent>
          </Card>
          <Card className="text-center hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => setSelectedMenu('vegan')}>
            <CardHeader>
              <Leaf className="h-12 w-12 mx-auto text-accent" />
            </CardHeader>
            <CardContent>
              <CardTitle className="text-2xl font-headline">{t('Vegan Menu')}</CardTitle>
              <CardDescription>{t('Delicious and creative plant-based dishes.')}</CardDescription>
            </CardContent>
          </Card>
          <Card className="text-center hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => setSelectedMenu('beverages')}>
            <CardHeader>
              <Martini className="h-12 w-12 mx-auto text-yellow-500" />
            </CardHeader>
            <CardContent>
              <CardTitle className="text-2xl font-headline">{t('Signature & Mocktails')}</CardTitle>
              <CardDescription>{t('Artisanal cocktails and refreshing mocktails.')}</CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  const menuData = selectedMenu === 'classic' ? classicMenu : selectedMenu === 'vegan' ? veganMenu : beveragesMenu;

  return (
    <div className="h-full flex flex-col">
        <MenuDisplay menuData={menuData} menuType={selectedMenu} onBack={() => setSelectedMenu(null)} />
        
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
