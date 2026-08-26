"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface CartItem {
    id: string;
    name: string;
    price: number; // sale price
    mrp?: number; // maximum retail price
    image: string;
    customized?: boolean;
    size?: string;
    quantity: number;
    slug: string; // Product slug for unique identification
}

interface CartContextType {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>(() => {
        if (typeof window === "undefined") return [];
        const saved = window.localStorage.getItem("future-fit-cart");
        if (!saved) return [];
        try {
            return JSON.parse(saved) as CartItem[];
        } catch (e) {
            console.error("Failed to load cart", e);
            return [];
        }
    });
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (typeof window === "undefined") return;
        window.localStorage.setItem("future-fit-cart", JSON.stringify(items));
    }, [items]);

    const addItem = (item: CartItem) => {
        // Create unique ID based on slug and size
        const uniqueId = `${item.slug}-${item.size || 'default'}`;
        
        setItems((prev) => {
            const existingItem = prev.find((i) => i.id === uniqueId);
            if (existingItem) {
                // Update quantity if item already exists
                return prev.map((i) => 
                    i.id === uniqueId 
                        ? { ...i, quantity: i.quantity + (item.quantity || 1) }
                        : i
                );
            } else {
                // Add new item with quantity
                const newItem = { 
                    ...item, 
                    id: uniqueId, 
                    quantity: item.quantity || 1 
                };
                return [...prev, newItem];
            }
        });
        setIsOpen(true);
    };

    const removeItem = (id: string) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
    };

    const updateQuantity = (id: string, quantity: number) => {
        if (quantity <= 0) {
            removeItem(id);
            return;
        }
        setItems((prev) => 
            prev.map((item) => 
                item.id === id ? { ...item, quantity } : item
            )
        );
    };

    const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, isOpen, setIsOpen, total }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
