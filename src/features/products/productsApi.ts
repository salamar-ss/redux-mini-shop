
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Product {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
}

interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

type NewProduct = Pick<Product, 'title' | 'price'>;

type UpdateProduct = {
  id: number;
  title: string;
  price: number;
};

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://dummyjson.com/' }),
  tagTypes: ['Products'],

  endpoints: (builder) => ({
    getProducts: builder.query<Product[], void>({
      query: () => 'products?limit=10',

      transformResponse: (response: ProductsResponse) => response.products,

      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: 'Products' as const,
                id,
              })),
              { type: 'Products' as const, id: 'LIST' },
            ]
          : [{ type: 'Products' as const, id: 'LIST' }],
    }),

    addProduct: builder.mutation<Product, NewProduct>({
      query: (product) => ({
        url: 'products/add',
        method: 'POST',
        body: product,
      }),

      async onQueryStarted(_newProduct, { dispatch, queryFulfilled }) {
        try {
          const { data: createdProduct } = await queryFulfilled;

          dispatch(
            productsApi.util.updateQueryData('getProducts', undefined, (draft) => {
              draft.unshift({
                ...createdProduct,
                thumbnail: '',
              });
            }),
          );
        } catch {
          // The list remains unchanged if the request fails.
        }
      },
    }),

    deleteProduct: builder.mutation<
      { id: number; isDeleted: boolean },
      number
    >({
      query: (id) => ({
        url: `products/${id}`,
        method: 'DELETE',
      }),

      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          productsApi.util.updateQueryData('getProducts', undefined, (draft) => {
            return draft.filter((product) => product.id !== id);
          }),
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    updateProduct: builder.mutation<Product, UpdateProduct>({
      query: ({ id, ...patch }) => ({
        url: `products/${id}`,
        method: 'PATCH',
        body: patch,
      }),

      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          productsApi.util.updateQueryData('getProducts', undefined, (draft) => {
            const product = draft.find((item) => item.id === id);

            if (product) {
              Object.assign(product, patch);
            }
          }),
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetProductsQuery,
  useAddProductMutation,
  useDeleteProductMutation,
  useUpdateProductMutation,
} = productsApi;
