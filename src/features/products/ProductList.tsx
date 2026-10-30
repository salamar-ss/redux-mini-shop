
import { useState, type FormEvent } from 'react';
import {
  useGetProductsQuery,
  useAddProductMutation,
  useDeleteProductMutation,
  useUpdateProductMutation,
  type Product,
} from './productsApi';
import { useAppDispatch } from '../../app/hooks';
import { addToCart } from '../cart/cartSlice';

export default function ProductList() {
  const {
    data: products = [],
    isLoading,
    isError,
    refetch,
  } = useGetProductsQuery();

  const [addProduct, { isLoading: isAdding, error: addError }] =
    useAddProductMutation();

  const [deleteProduct, { isLoading: isDeleting }] =
    useDeleteProductMutation();

  const [updateProduct, { isLoading: isUpdating, error: updateError }] =
    useUpdateProductMutation();

  const dispatch = useAppDispatch();

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editPrice, setEditPrice] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title
      .toLowerCase()
      .includes(searchTerm.trim().toLowerCase());

    const matchesPrice =
      maxPrice === '' || product.price <= Number(maxPrice);

    return matchesSearch && matchesPrice;
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTitle = title.trim();
    const numericPrice = Number(price);

    if (!trimmedTitle || !Number.isFinite(numericPrice) || numericPrice <= 0) {
      return;
    }

    try {
      await addProduct({
        title: trimmedTitle,
        price: numericPrice,
      }).unwrap();

      setTitle('');
      setPrice('');
    } catch {
      // The error is displayed through addError.
    }
  }

  function startEditing(product: Product) {
    setEditingId(product.id);
    setEditTitle(product.title);
    setEditPrice(String(product.price));
  }

  function cancelEditing() {
    setEditingId(null);
    setEditTitle('');
    setEditPrice('');
  }

  async function handleUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTitle = editTitle.trim();
    const numericPrice = Number(editPrice);

    if (
      editingId === null ||
      !trimmedTitle ||
      !Number.isFinite(numericPrice) ||
      numericPrice <= 0
    ) {
      return;
    }

    try {
      await updateProduct({
        id: editingId,
        title: trimmedTitle,
        price: numericPrice,
      }).unwrap();

      cancelEditing();
    } catch {
      // The error is displayed through updateError.
    }
  }

  async function handleDelete(id: number) {
    try {
      await deleteProduct(id).unwrap();
    } catch {
      // The optimistic update is reverted automatically.
    }
  }

  if (isLoading) {
    return <p className="status-message">Loading products...</p>;
  }

  if (isError) {
    return (
      <div className="status-message">
        <p>Unable to load products.</p>

        <button className="button" onClick={() => void refetch()}>
          Try again
        </button>
      </div>
    );
  }

  return (
    <section className="catalog">
      <div className="section-heading">
        <div>
          <p className="eyebrow">DISCOVER YOUR FAVORITES</p>
          <h2>Our Products</h2>
        </div>

        <span className="product-count">
          {filteredProducts.length} products
        </span>
      </div>

      <div className="product-filters">
        <input
          type="search"
          aria-label="Search products"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />

        <input
          type="number"
          min="0"
          step="0.01"
          aria-label="Maximum price"
          placeholder="Max price (€)"
          value={maxPrice}
          onChange={(event) => setMaxPrice(event.target.value)}
        />

        <button
          className="button button--text"
          type="button"
          onClick={() => {
            setSearchTerm('');
            setMaxPrice('');
          }}
        >
          Clear Filters
        </button>
      </div>

      <form className="product-form" onSubmit={handleSubmit}>
        <h3>Add New Product</h3>

        <div className="product-form__fields">
          <input
            aria-label="Product name"
            placeholder="Product name"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />

          <input
            aria-label="Price in euros"
            type="number"
            min="0.01"
            step="0.01"
            placeholder="Price (€)"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            required
          />

          <button className="button" type="submit" disabled={isAdding}>
            {isAdding ? 'Adding...' : 'Add Product'}
          </button>
        </div>

        {addError && (
          <p className="form-error">Failed to add the product.</p>
        )}
      </form>

      {filteredProducts.length === 0 ? (
        <div className="empty-state">
          <h3>No products found</h3>
          <p>Try changing your search or price filter.</p>
        </div>
      ) : (
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <article className="product-card" key={product.id}>
              <div className="product-card__image">
                {product.thumbnail ? (
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    loading="lazy"
                  />
                ) : (
                  <span className="product-card__placeholder">NEW</span>
                )}
              </div>

              <div className="product-card__body">
                {editingId === product.id ? (
                  <form className="edit-form" onSubmit={handleUpdate}>
                    <label>
                      Product Name
                      <input
                        value={editTitle}
                        onChange={(event) => setEditTitle(event.target.value)}
                        required
                      />
                    </label>

                    <label>
                      Price (€)
                      <input
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={editPrice}
                        onChange={(event) => setEditPrice(event.target.value)}
                        required
                      />
                    </label>

                    <button
                      className="button"
                      type="submit"
                      disabled={isUpdating}
                    >
                      {isUpdating ? 'Saving...' : 'Save Changes'}
                    </button>

                    <button
                      className="button button--text"
                      type="button"
                      onClick={cancelEditing}
                    >
                      Cancel
                    </button>

                    {updateError && (
                      <p className="form-error">
                        Failed to update the product.
                      </p>
                    )}
                  </form>
                ) : (
                  <>
                    <h3>{product.title}</h3>

                    <p className="product-card__price">
                      {product.price.toFixed(2)} €
                    </p>

                    <button
                      className="button"
                      onClick={() => dispatch(addToCart(product))}
                    >
                      Add to Cart
                    </button>

                    <button
                      className="button button--text"
                      onClick={() => startEditing(product)}
                    >
                      Edit Product
                    </button>

                    <button
                      className="button button--text"
                      onClick={() => void handleDelete(product.id)}
                      disabled={isDeleting}
                    >
                      {isDeleting ? 'Deleting...' : 'Delete Product'}
                    </button>
                  </>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
