"use client";

import { CartProvider } from "@/components/cart/CartContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartSidebar from "@/components/cart/CartSidebar";
import ChatBox from "@/components/chat/ChatBox";

export default function RootLayoutClient({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <CartProvider>
            <Navbar />
            <CartSidebar />
            <main className="pt-16">
                {children}
            </main>
            <Footer />
            <ChatBox />
        </CartProvider>
    );
}
