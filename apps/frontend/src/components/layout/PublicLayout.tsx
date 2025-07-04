import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';

const PublicLayout: React.FC = () => {
  const { effectiveTheme, toggleTheme } = useTheme();

  return (
    <div className='min-h-screen flex flex-col'>
      {/* Header */}
      <header className='bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            {/* Logo */}
            <div className='flex items-center'>
              <Link to='/' className='flex items-center space-x-2'>
                <div className='w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center'>
                  <span className='text-white font-bold text-lg'>$</span>
                </div>
                <span className='text-xl font-bold text-gray-900 dark:text-white'>
                  SpendSmart
                </span>
              </Link>
            </div>

            {/* Navigation */}
            <nav className='hidden md:flex items-center space-x-6'>
              <Link
                to='/'
                className='text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors'
              >
                Home
              </Link>
              <Link
                to='/features'
                className='text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors'
              >
                Features
              </Link>
              <Link
                to='/pricing'
                className='text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors'
              >
                Pricing
              </Link>
              <Link
                to='/about'
                className='text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors'
              >
                About
              </Link>
            </nav>

            {/* Actions */}
            <div className='flex items-center space-x-4'>
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className='p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'
                aria-label='Toggle theme'
              >
                {effectiveTheme === 'light' ? (
                  <svg
                    className='w-5 h-5 text-gray-600 dark:text-gray-300'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z'
                    />
                  </svg>
                ) : (
                  <svg
                    className='w-5 h-5 text-gray-600 dark:text-gray-300'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z'
                    />
                  </svg>
                )}
              </button>

              {/* Auth Actions */}
              <Link
                to='/login'
                className='text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors'
              >
                Sign In
              </Link>
              <Link to='/register' className='btn-primary'>
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='flex-1'>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className='bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
            {/* Company Info */}
            <div className='col-span-1'>
              <div className='flex items-center space-x-2 mb-4'>
                <div className='w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center'>
                  <span className='text-white font-bold text-lg'>$</span>
                </div>
                <span className='text-xl font-bold text-gray-900 dark:text-white'>
                  SpendSmart
                </span>
              </div>
              <p className='text-gray-600 dark:text-gray-400 text-sm'>
                Take control of your finances with smart budgeting and spending
                insights.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className='text-sm font-semibold text-gray-900 dark:text-white mb-3'>
                Product
              </h3>
              <ul className='space-y-2'>
                <li>
                  <Link
                    to='/features'
                    className='text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm transition-colors'
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    to='/pricing'
                    className='text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm transition-colors'
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    to='/security'
                    className='text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm transition-colors'
                  >
                    Security
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className='text-sm font-semibold text-gray-900 dark:text-white mb-3'>
                Support
              </h3>
              <ul className='space-y-2'>
                <li>
                  <Link
                    to='/help'
                    className='text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm transition-colors'
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    to='/contact'
                    className='text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm transition-colors'
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    to='/status'
                    className='text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm transition-colors'
                  >
                    Status
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className='text-sm font-semibold text-gray-900 dark:text-white mb-3'>
                Legal
              </h3>
              <ul className='space-y-2'>
                <li>
                  <Link
                    to='/privacy'
                    className='text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm transition-colors'
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to='/terms'
                    className='text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm transition-colors'
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    to='/cookies'
                    className='text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm transition-colors'
                  >
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className='mt-8 pt-8 border-t border-gray-200 dark:border-gray-700'>
            <p className='text-center text-gray-600 dark:text-gray-400 text-sm'>
              © 2024 SpendSmart. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
