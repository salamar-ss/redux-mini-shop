import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../features/cart/cartSlice';
import { productsApi } from '../features/products/productsApi';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    [productsApi.reducerPath]: productsApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(productsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Persist shopping cart changes to localStorage.
store.subscribe(() => {
  try {
    const cart = store.getState().cart;

    localStorage.setItem(
      'redux-mini-shop-cart',
      JSON.stringify(cart.items),
    );
  } catch {
    // Ignore localStorage errors, for example when storage is unavailable.
  }
});
