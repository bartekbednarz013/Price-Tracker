import { configureStore } from '@reduxjs/toolkit';
// import { combineReducers } from '@reduxjs/toolkit';
// import {
//   persistReducer,
//   FLUSH,
//   REHYDRATE,
//   PAUSE,
//   PERSIST,
//   PURGE,
//   REGISTER,
// } from 'redux-persist';
// import storage from 'redux-persist/lib/storage';
import authReducer from './features/auth/authSlice';
import { apiSlice } from './features/api/apiSlice';
import itemsReducer from './features/items/itemsSlice';
import scraperSlice from './features/scraper/scraperSlice';
import notificationsSlice from './features/notifications/notificationsSlice';

// const reducers = combineReducers({
//   auth: authReducer,
//   items: itemsReducer,
//   scraper: scraperSlice,
//   notifications: notificationsSlice,
//   [apiSlice.reducerPath]: apiSlice.reducer,
// });

// const persistConfig = {
//   key: 'root',
//   version: 1,
//   storage,
// };

// const persistedReducer = persistReducer(persistConfig, reducers);

// const store = configureStore({
//   reducer: persistedReducer,
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: {
//         ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
//       },
//     }).concat(apiSlice.middleware),
// });

const store = configureStore({
  reducer: {
    auth: authReducer,
    items: itemsReducer,
    scraper: scraperSlice,
    notifications: notificationsSlice,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export default store;
