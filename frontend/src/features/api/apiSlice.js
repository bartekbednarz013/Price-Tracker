import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { userLoggedIn, userLoggedOut } from '../auth/authSlice';
import {
  itemsFetched,
  itemAdded,
  itemDeleted,
  itemUpdated,
} from '../items/itemsSlice';
import { notificationShowed } from '../notifications/notificationsSlice';
import { itemScraped } from '../scraper/scraperSlice';

const handleError = (error, dispatch) => {
  if (error.error.status === 'FETCH_ERROR') {
    dispatch(
      notificationShowed({
        status: 503,
        detail: 'Cannot connect to server. Please try again later.',
      })
    );
    return;
  }

  let {
    status,
    data: { detail },
  } = error.error;
  // zmienic wiadomosc przy 422, bo ta nic nie sugeruje
  if (status === 422) {
    detail = detail[0].msg;
  }
  dispatch(
    notificationShowed({
      status: status,
      detail: detail,
    })
  );
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://127.0.0.1:8000',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.accessToken;
      if (token) {
        headers.set('Authorization', token);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    register: builder.query({
      query: (registerData) => ({
        url: '/register',
        method: 'POST',
        body: registerData,
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          dispatch(
            notificationShowed({
              status: 201,
              detail: 'Account created! You can sign in now!',
            })
          );
        } catch (error) {
          handleError(error, dispatch);
        }
      },
    }),
    login: builder.query({
      query: (loginData) => {
        let data = new FormData();
        data.append('username', loginData.username);
        data.append('password', loginData.password);
        return {
          url: '/login',
          method: 'POST',
          body: data,
          formData: true,
        };
      },
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          const userData = (({
            access_token,
            user: { items: _, ...user },
          }) => ({ access_token, user }))(data);
          dispatch(userLoggedIn(userData));
          dispatch(itemsFetched(data.user.items));
        } catch (error) {
          handleError(error, dispatch);
        }
      },
    }),
    deleteAccount: builder.query({
      query: () => ({
        url: '/delete-account',
        method: 'POST',
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          dispatch(userLoggedOut());
        } catch (error) {
          handleError(error, dispatch);
        }
      },
    }),
    changePassword: builder.query({
      query: (password) => {
        return {
          url: '/change-password',
          method: 'POST',
          body: { password: password },
        };
      },
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          dispatch(
            notificationShowed({
              status: 204,
              detail: 'Password changed successfully.',
            })
          );
        } catch (error) {
          handleError(error, dispatch);
        }
      },
    }),
    // getItems: builder.query({
    //   query: () => '/items',
    //   onQueryStarted: async (body, { dispatch, queryFulfilled }) => {
    //     try {
    //       const { items } = await queryFulfilled;
    //       if (items !== []) {
    //         dispatch(itemsFetched(items));
    //       }
    //     } catch (error) {
    //       handleError(error, dispatch);
    //     }
    //   },
    // }),
    addItem: builder.query({
      query: (item) => ({
        url: '/items',
        method: 'POST',
        body: item,
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(itemAdded(data));
          dispatch(
            notificationShowed({
              status: 201,
              detail: 'Item successfully added to your list!',
            })
          );
        } catch (error) {
          handleError(error, dispatch);
        }
      },
    }),
    deleteItem: builder.query({
      query: (itemId) => ({
        url: `/items/${itemId}`,
        method: 'DELETE',
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(itemDeleted(data));
        } catch (error) {
          handleError(error, dispatch);
        }
      },
    }),
    updatePrice: builder.query({
      query: (itemId) => ({
        url: `/items/${itemId}/update-price`,
        method: 'POST',
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(itemUpdated(data));
        } catch (error) {
          handleError(error, dispatch);
        }
      },
    }),
    editExpectedPrice: builder.query({
      query: (item) => {
        const param = { expected_price: parseFloat(item.expected_price) };
        return {
          url: `/items/${item.id}/expected-price`,
          method: 'POST',
          params: param,
        };
      },
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(itemUpdated(data));
        } catch (error) {
          handleError(error, dispatch);
        }
      },
    }),
    editTrackingStatus: builder.query({
      query: (item) => {
        const param = { tracked: item.tracked };
        return {
          url: `/items/${item.id}/tracking-status`,
          method: 'POST',
          params: param,
        };
      },
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(itemUpdated(data));
        } catch (error) {
          handleError(error, dispatch);
        }
      },
    }),
    scrapItem: builder.query({
      query: (url) => ({
        url: '/scraper',
        method: 'POST',
        body: { url: url },
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(itemScraped(data));
        } catch (error) {
          handleError(error, dispatch);
        }
      },
    }),
  }),
});

export const {
  useLazyRegisterQuery,
  useLazyLoginQuery,
  useLazyDeleteAccountQuery,
  useLazyChangePasswordQuery,
  // useLazyGetItemsQuery,
  useLazyAddItemQuery,
  useLazyDeleteItemQuery,
  useLazyUpdatePriceQuery,
  useLazyEditExpectedPriceQuery,
  useLazyEditTrackingStatusQuery,
  useLazyScrapItemQuery,
} = apiSlice;
