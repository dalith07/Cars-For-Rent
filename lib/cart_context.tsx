/* eslint-disable react-hooks/set-state-in-effect */
// /* eslint-disable react-hooks/set-state-in-effect */
// "use client"

// import type React from "react"
// import { createContext, useContext, useState, useEffect } from "react"
// import { toast } from "sonner"
// import { ItemsCarsWithAll } from "./utils"

// interface CartItem extends ItemsCarsWithAll {
//     quantity: number
// }

// interface CartContextType {
//     items: CartItem[]
//     addItem: (item: ItemsCarsWithAll, quantity: number) => void
//     removeItem: (id: string) => void
//     updateQuantity: (id: string, quantity: number) => void
//     clearCart: () => void
//     getTotalItems: () => number
//     getTotalPrice: () => number
// }

// const CartContext = createContext<CartContextType | undefined>(undefined)

// export function CartProvider({ children }: { children: React.ReactNode }) {
//     // const [items, setItems] = useState<ItemsCarsWithAll[]>([])
//     const [items, setItems] = useState<CartItem[]>([])

//     const [isLoaded, setIsLoaded] = useState(false)

//     // Load cart from localStorage on mount
//     useEffect(() => {
//         const savedCart = localStorage.getItem("shopping-cart")
//         if (savedCart) {
//             try {
//                 setItems(JSON.parse(savedCart))
//             } catch (error) {
//                 console.error("Error loading cart:", error)
//             }
//         }
//         setIsLoaded(true)
//     }, [])

//     // Save cart to localStorage whenever it changes
//     useEffect(() => {
//         if (isLoaded) {
//             localStorage.setItem("shopping-cart", JSON.stringify(items))
//         }
//     }, [items, isLoaded])

//     const addItem = (item: ItemsCarsWithAll, quantity: number) => {
//         setItems((currentItems) => {
//             const existingItem = currentItems.find((i) => i.id === item.id);

//             if (existingItem) {
//                 if (existingItem.quantity + quantity > item.stock) {
//                     toast.error(`Maximum stock (${item.stock}) reached`);
//                     return currentItems;
//                 }

//                 return currentItems.map((i) =>
//                     i.id === item.id
//                         ? { ...i, quantity: i.quantity + quantity }
//                         : i
//                 );
//             }

//             return [...currentItems, { ...item, quantity }];
//         });
//     }

//     const removeItem = (id: string) => {
//         setItems((currentItems) => {
//             const item = currentItems.find((item) => item.id === id)
//             if (item) {
//                 toast.info(`Removed ${item.name} from cart`)
//             }
//             return currentItems.filter((item) => item.id !== id)
//         })
//     }

//     const updateQuantity = (id: string, quantity: number) => {
//         if (quantity < 1) {
//             removeItem(id)
//             return
//         }

//         setItems((currentItems) =>
//             currentItems.map((item) =>
//                 item.id === id
//                     ? quantity > item.stock
//                         ? item
//                         : { ...item, quantity }
//                     : item
//             )
//         )
//     }

//     const clearCart = () => {
//         setItems([])
//         toast.info("Cart cleared !")
//     }

//     const getTotalItems = () =>
//         items.reduce((total, item) => total + item.quantity, 0)

//     const getTotalPrice = () =>
//         items.reduce((total, item) => {
//             const price =
//                 item.discount
//                     ? item.pricePerDay * (1 - item.discount / 100)
//                     : item.pricePerDay

//             return total + price * item.quantity
//         }, 0)

//     return (
//         <CartContext.Provider
//             value={{
//                 items,
//                 addItem,
//                 removeItem,

//                 updateQuantity,
//                 clearCart,
//                 getTotalItems,
//                 getTotalPrice,
//             }}
//         >
//             {children}
//         </CartContext.Provider>
//     )
// }

// export function useCart() {
//     const context = useContext(CartContext)
//     if (context === undefined) {
//         throw new Error("useCart must be used within a CartProvider")
//     }
//     return context
// }

"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { toast } from "sonner"
import { ItemsCarsWithAll } from "./utils"

// Each item in the cart extends the car with a quantity
interface CartItem extends ItemsCarsWithAll {
    quantity: number
}

// Context type
interface CartContextType {
    items: CartItem[]
    addItem: (item: ItemsCarsWithAll, quantity: number) => void
    removeItem: (id: string) => void
    updateQuantity: (id: string, quantity: number) => void
    clearCart: () => void
    getTotalItems: () => number
    getTotalPrice: () => number
}

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined)

// Provider component
export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([])
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

    // Save cart to localStorage whenever items change
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("shopping-cart", JSON.stringify(items))
        }
    }, [items, isLoaded])

    // Add item to cart
    const addItem = (item: ItemsCarsWithAll, quantity: number): void => {
        setItems((currentItems) => {
            const existingItem = currentItems.find((i) => i.id === item.id)

            if (existingItem) {
                // Prevent exceeding stock
                if (existingItem.quantity + quantity > item.stock) {
                    toast.error(`Maximum stock (${item.stock}) reached`)
                    return currentItems
                }

                return currentItems.map((i) =>
                    i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
                )
            }

            // Add new item
            return [...currentItems, { ...item, quantity }]
        })
        toast.success(`Added ${quantity} ${item.name} to cart`)
    }

    // Remove item from cart
    const removeItem = (id: string): void => {
        setItems((currentItems) => {
            const item = currentItems.find((i) => i.id === id)
            if (item) toast.info(`Removed ${item.name} from cart`)
            return currentItems.filter((i) => i.id !== id)
        })
    }

    // Update item quantity
    const updateQuantity = (id: string, quantity: number): void => {
        if (quantity < 1) {
            removeItem(id)
            return
        }

        setItems((currentItems) =>
            currentItems.map((item) =>
                item.id === id
                    ? { ...item, quantity: Math.min(quantity, item.stock) } // clamp to stock
                    : item
            )
        )
    }

    // Clear the cart
    const clearCart = (): void => {
        setItems([])
        toast.info("Cart cleared!")
    }

    // Get total number of items
    const getTotalItems = (): number =>
        items.reduce((total, item) => total + item.quantity, 0)

    // Get total price of cart
    const getTotalPrice = (): number =>
        items.reduce((total, item) => {
            const price = item.discount
                ? item.pricePerDay * (1 - item.discount / 100)
                : item.pricePerDay
            return total + price * item.quantity
        }, 0)

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

// Hook to use cart context
export function useCart(): CartContextType {
    const context = useContext(CartContext)
    if (!context) throw new Error("useCart must be used within a CartProvider")
    return context
}
