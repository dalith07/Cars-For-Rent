/* eslint-disable react-hooks/set-state-in-effect */
"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { toast } from "sonner"
import { ItemsCarsWithAll } from "./utils"

interface CartContextType {
    items: ItemsCarsWithAll[]
    addItem: (item: Omit<ItemsCarsWithAll, "quantity">) => void
    removeItem: (id: string) => void
    updateQuantity: (id: string, quantity: number) => void
    clearCart: () => void
    getTotalItems: () => number
    getTotalPrice: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<ItemsCarsWithAll[]>([])
    const [isLoaded, setIsLoaded] = useState(false)

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem("shopping-cart")
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart))
            } catch (error) {
                console.error("Error loading cart:", error)
            }
        }
        setIsLoaded(true)
    }, [])

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("shopping-cart", JSON.stringify(items))
        }
    }, [items, isLoaded])

    const addItem = (newItem: Omit<ItemsCarsWithAll, "quantity">) => {
        setItems((currentItems) => {
            const existingItem = currentItems.find((item) => item.id === newItem.id)

            if (existingItem) {
                // Check if we can add more
                if (existingItem.quantity >= existingItem.quantity) {
                    toast.error(`Maximum stock (${existingItem.quantity}) reached`);
                    return currentItems;
                }

                // Increase quantity
                toast.success(`Increased quantity of ${newItem.name}`);
                return currentItems.map((item) =>
                    item.id === newItem.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }

            // Add new product to cart
            // toast.success(`Added ${newItem.name} to cart`);
            return [...currentItems, { ...newItem, quantity: 1 }];
        });
    }

    const removeItem = (id: string) => {
        setItems((currentItems) => {
            const item = currentItems.find((item) => item.id === id)
            if (item) {
                toast.success(`Removed ${item.name} from cart`)
            }
            return currentItems.filter((item) => item.id !== id)
        })
    }

    const updateQuantity = (id: string, quantity: number) => {
        if (quantity < 1) {
            removeItem(id)
            return
        }

        setItems((currentItems) => {
            return currentItems.map((item) => {
                if (item.id === id) {
                    if (quantity > item.quantity) {
                        toast.error(`Maximum quantity is ${item.quantity}`)
                        return item
                    }
                    return { ...item, quantity }
                }
                return item
            })
        })
    }

    const clearCart = () => {
        setItems([])
        // toast.success("Cart cleared")
    }

    const getTotalItems = () => {
        return items.reduce((total, item) => total + item.quantity, 0)
    }

    const getTotalPrice = () => {
        return items.reduce((total, item) => {
            const price = item.discount ? item.price * (1 - item.discount / 100) : item.price
            return total + price * item.quantity
        }, 0)
    }

    return (
        <CartContext.Provider
            value={{
                items,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                getTotalItems,
                getTotalPrice,
            }}
        >
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider")
    }
    return context
}
