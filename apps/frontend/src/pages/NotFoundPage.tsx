import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8 text-center'>
        <div>
          <h1 className='text-9xl font-bold text-gray-300 dark:text-gray-600'>
            404
          </h1>
          <h2 className='mt-6 text-3xl font-extrabold text-gray-900 dark:text-white'>
            Page not found
          </h2>
          <p className='mt-2 text-sm text-gray-600 dark:text-gray-400'>
            Sorry, we couldn't find the page you're looking for.
          </p>
        </div>

        <div className='space-y-4'>
          <Link
            to='/'
            className='btn-primary inline-flex items-center px-4 py-2 text-sm font-medium'
          >
            <svg
              className='w-5 h-5 mr-2'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m0 0v-6a1 1 0 011-1h2a1 1 0 011 1v6m3 0a1 1 0 001-1V10m-11 4h11'
              />
            </svg>
            Go back home
          </Link>

          <div className='text-sm text-gray-500'>
            <button
              onClick={() => window.history.back()}
              className='font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400'
            >
              Go back to previous page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
