
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '../products/productsApi';

export interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

function loadCart(): CartItem[] {
  try {
    const savedCart = localStorage.getItem('redux-mini-shop-cart');

    if (!savedCart) {
      return [];
    }

    const parsedCart: unknown = JSON.parse(savedCart);

    if (!Array.isArray(parsedCart)) {
      return [];
    }

    return parsedCart;
  } catch {
    return [];
  }
}

const initialState: CartState = {
  items: loadCart(),
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,

  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id,
      );

      if (existingItem) {
        existingItem.quantity += 1;
        return;
      }

      state.items.push({
        ...action.payload,
        quantity: 1,
      });
    },

    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(
        (item) => item.id !== action.payload,
      );
    },

    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
