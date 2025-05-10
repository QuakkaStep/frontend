import React from 'react';
import { AppLayout } from './components/layout/AppLayout';
import { AppContextProvider } from './context/AppContext';

function App() {
  return (
    <AppContextProvider>
      <AppLayout />
    </AppContextProvider>
  );
}

export default App;