
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { clearCart, removeFromCart } from './cartSlice';

export default function Cart() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.cart.items);

  const count = items.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <section className="cart">
      <div className="section-heading">
        <div>
          <p className="eyebrow">YOUR SHOPPING</p>
          <h2>Shopping Cart ({count})</h2>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <h3>Your cart is empty</h3>
          <p>Add some products to get started.</p>
        </div>
      ) : (
        <>
          <div className="cart__items">
            {items.map((item) => (
              <article className="cart__item" key={item.id}>
                <div className="cart__item-info">
                  <p className="cart__item-title">
                    {item.title} × {item.quantity}
                  </p>

                  <p className="cart__item-price">
                    {(item.price * item.quantity).toFixed(2)} €
                  </p>
                </div>

                <button
                  className="button button--text"
                  onClick={() => dispatch(removeFromCart(item.id))}
                >
                  Remove
                </button>
              </article>
            ))}
          </div>

          <div className="cart__footer">
            <h3>Total: {total.toFixed(2)} €</h3>

            <button
              className="button"
              onClick={() => dispatch(clearCart())}
            >
              Clear Cart
            </button>
          </div>
        </>
      )}
    </section>
  );
}
