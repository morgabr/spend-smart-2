import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React from 'react';
import { Toaster } from 'react-hot-toast';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

// Layout components
import Layout from './components/layout/Layout';
import PublicLayout from './components/layout/PublicLayout';

// Pages
import AccountsPage from './pages/AccountsPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import BudgetsPage from './pages/BudgetsPage';
import DashboardPage from './pages/DashboardPage';
import GoalsPage from './pages/GoalsPage';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import SettingsPage from './pages/SettingsPage';
import TransactionsPage from './pages/TransactionsPage';

// Context providers
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
              <Routes>
                {/* Public routes */}
                <Route path='/' element={<PublicLayout />}>
                  <Route index element={<HomePage />} />
                  <Route path='login' element={<LoginPage />} />
                  <Route path='register' element={<RegisterPage />} />
                </Route>

                {/* Protected routes */}
                <Route path='/app' element={<Layout />}>
                  <Route index element={<DashboardPage />} />
                  <Route path='dashboard' element={<DashboardPage />} />
                  <Route path='transactions' element={<TransactionsPage />} />
                  <Route path='budgets' element={<BudgetsPage />} />
                  <Route path='goals' element={<GoalsPage />} />
                  <Route path='accounts' element={<AccountsPage />} />
                  <Route path='settings' element={<SettingsPage />} />
                </Route>

                {/* 404 page */}
                <Route path='*' element={<NotFoundPage />} />
              </Routes>

              {/* Global toast notifications */}
              <Toaster
                position='top-right'
                toastOptions={{
                  className: 'dark:bg-gray-800 dark:text-white',
                  duration: 4000,
                }}
              />
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>

      {/* React Query DevTools (only in development) */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
};

export default App;
