import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
}

interface CartStore {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  subtotal: () => number
  shipping: () => number
  total: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => set((state) => {
        const existing = state.items.find(i => i.id === item.id)
        if (existing) {
          return { items: state.items.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i) }
        }
        return { items: [...state.items, { ...item, quantity: 1 }] }
      }),
      removeItem: (id) => set((state) => ({ items: state.items.filter(i => i.id !== id) })),
      updateQuantity: (id, quantity) => set((state) => ({
        items: quantity <= 0
          ? state.items.filter(i => i.id !== id)
          : state.items.map(i => i.id === id ? { ...i, quantity } : i)
      })),
      clearCart: () => set({ items: [] }),
      subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      shipping: () => {
        const sub = get().subtotal()
        if (sub === 0) return 0
        return sub >= 4000 ? 0 : 299   // Free shipping above ₹4,000
      },
      total: () => get().subtotal() + get().shipping(),
    }),
    { name: 'roshgems-cart' }   // RoshGems-specific persist key
  )
)
