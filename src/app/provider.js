'use client';

// Import Redux and Redux-Persist providers
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store/store';

// Wraps the application with Redux and Redux-Persist providers
export default function Providers({ children }) {
    return (
        <Provider store={store}>
            {/* PersistGate delays rendering until the Redux state is rehydrated */}
            <PersistGate loading={null} persistor={persistor}>
                {children}
            </PersistGate>
        </Provider>
    );
}