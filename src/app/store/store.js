// Import necessary functions and libraries
import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import authReducer from './authSlice';

// Redux persist configuration
const persistConfig = {
  key: 'root',
  storage,
};

// Combine all reducers into a root reducer
const rootReducer = combineReducers({
  auth: authReducer,
});

// Wrap the root reducer with persistReducer to enable persistence
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the Redux store with persisted reducer and middleware configuration
export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production', // Enable Redux DevTools in non-production environments
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable check for redux-persist compatibility
    }),
});

// Create a persistor for redux-persist to persist the store
export const persistor = persistStore(store);