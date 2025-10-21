
"use client";

import React, { createContext, useContext, useState, ReactNode, useMemo, useEffect } from 'react';
import type { CartItem, InvoiceItem } from '@/lib/types';

interface InvoiceContextType {
  invoiceItems: InvoiceItem[];
  addItemsToInvoice: (items: CartItem[]) => void;
  clearInvoice: () => void;
  totalPrice: number;
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

export function InvoiceProvider({ children }: { children: ReactNode }) {
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedInvoice = localStorage.getItem("invoiceItems");
      if (storedInvoice) {
        setInvoiceItems(JSON.parse(storedInvoice));
      }
    } catch (error) {
      console.error("Failed to load invoice items from local storage", error);
    } finally {
        setIsLoading(false);
    }
  }, []);

  const addItemsToInvoice = (items: CartItem[]) => {
    const newInvoiceItems = items.map(item => ({
        ...item,
        date: new Date().toISOString(),
    }));

    setInvoiceItems(prevItems => {
        const updatedItems = [...prevItems, ...newInvoiceItems];
        try {
            localStorage.setItem("invoiceItems", JSON.stringify(updatedItems));
        } catch (error) {
            console.error("Failed to save invoice items to local storage", error);
        }
        return updatedItems;
    });
  };

  const clearInvoice = () => {
    setInvoiceItems([]);
    try {
      localStorage.removeItem("invoiceItems");
    } catch (error) {
      console.error("Failed to clear invoice items from local storage", error);
    }
  };

  const totalPrice = useMemo(() => {
    return invoiceItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [invoiceItems]);

  return (
    <InvoiceContext.Provider
      value={{
        invoiceItems,
        addItemsToInvoice,
        clearInvoice,
        totalPrice,
      }}
    >
      {!isLoading && children}
    </InvoiceContext.Provider>
  );
}

export function useInvoice() {
  const context = useContext(InvoiceContext);
  if (context === undefined) {
    throw new Error('useInvoice must be used within a InvoiceProvider');
  }
  return context;
}
