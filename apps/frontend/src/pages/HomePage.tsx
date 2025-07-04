import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className='animate-fade-in'>
      {/* Hero Section */}
      <section className='bg-gradient-to-br from-blue-600 to-purple-700 text-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24'>
          <div className='text-center'>
            <h1 className='text-4xl sm:text-5xl md:text-6xl font-bold mb-6'>
              Take Control of Your
              <span className='block text-yellow-300'>Financial Future</span>
            </h1>
            <p className='text-xl sm:text-2xl mb-8 max-w-3xl mx-auto opacity-90'>
              SpendSmart helps you track expenses, create budgets, and achieve
              your financial goals with intelligent insights and easy-to-use
              tools.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <Link
                to='/register'
                className='bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors'
              >
                Get Started Free
              </Link>
              <Link
                to='/login'
                className='border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors'
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='py-16 sm:py-24 bg-white dark:bg-gray-900'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4'>
              Everything You Need to Manage Your Money
            </h2>
            <p className='text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto'>
              Powerful features designed to help you understand and control your
              finances
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {/* Feature 1 */}
            <div className='text-center p-6 rounded-lg hover:shadow-lg transition-shadow'>
              <div className='w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4'>
                <svg
                  className='w-6 h-6 text-blue-600 dark:text-blue-400'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
                  />
                </svg>
              </div>
              <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>
                Smart Budgeting
              </h3>
              <p className='text-gray-600 dark:text-gray-300'>
                Create and track budgets with intelligent spending insights and
                personalized recommendations.
              </p>
            </div>

            {/* Feature 2 */}
            <div className='text-center p-6 rounded-lg hover:shadow-lg transition-shadow'>
              <div className='w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-4'>
                <svg
                  className='w-6 h-6 text-green-600 dark:text-green-400'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
              </div>
              <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>
                Goal Tracking
              </h3>
              <p className='text-gray-600 dark:text-gray-300'>
                Set and achieve financial goals with progress tracking and
                milestone celebrations.
              </p>
            </div>

            {/* Feature 3 */}
            <div className='text-center p-6 rounded-lg hover:shadow-lg transition-shadow'>
              <div className='w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-4'>
                <svg
                  className='w-6 h-6 text-purple-600 dark:text-purple-400'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M13 10V3L4 14h7v7l9-11h-7z'
                  />
                </svg>
              </div>
              <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>
                Instant Insights
              </h3>
              <p className='text-gray-600 dark:text-gray-300'>
                Get real-time analytics and insights about your spending
                patterns and financial health.
              </p>
            </div>

            {/* Feature 4 */}
            <div className='text-center p-6 rounded-lg hover:shadow-lg transition-shadow'>
              <div className='w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mx-auto mb-4'>
                <svg
                  className='w-6 h-6 text-orange-600 dark:text-orange-400'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
                  />
                </svg>
              </div>
              <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>
                Bank-Level Security
              </h3>
              <p className='text-gray-600 dark:text-gray-300'>
                Your financial data is protected with enterprise-grade security
                and encryption.
              </p>
            </div>

            {/* Feature 5 */}
            <div className='text-center p-6 rounded-lg hover:shadow-lg transition-shadow'>
              <div className='w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mx-auto mb-4'>
                <svg
                  className='w-6 h-6 text-red-600 dark:text-red-400'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
                  />
                </svg>
              </div>
              <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>
                Account Integration
              </h3>
              <p className='text-gray-600 dark:text-gray-300'>
                Connect all your bank accounts and credit cards for a complete
                financial picture.
              </p>
            </div>

            {/* Feature 6 */}
            <div className='text-center p-6 rounded-lg hover:shadow-lg transition-shadow'>
              <div className='w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center mx-auto mb-4'>
                <svg
                  className='w-6 h-6 text-indigo-600 dark:text-indigo-400'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01'
                  />
                </svg>
              </div>
              <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>
                Transaction Tracking
              </h3>
              <p className='text-gray-600 dark:text-gray-300'>
                Automatically categorize and track all your transactions with
                smart filtering.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='bg-gray-50 dark:bg-gray-800 py-16 sm:py-24'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <h2 className='text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4'>
            Ready to Take Control of Your Finances?
          </h2>
          <p className='text-xl text-gray-600 dark:text-gray-300 mb-8'>
            Join thousands of users who have transformed their financial lives
            with SpendSmart.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Link to='/register' className='btn-primary text-lg px-8 py-3'>
              Start Your Free Trial
            </Link>
            <Link to='/features' className='btn-outline text-lg px-8 py-3'>
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
