import ProductList from './features/products/ProductList';
import Cart from './features/cart/Cart';

export default function App() {
  return (
    <main>
      <h1>Redux Mini Shop</h1>
      <ProductList />
      <Cart />
    </main>
  );
}