import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const MagicLinkPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { verifyMagicLink } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      const token = searchParams.get('token');

      if (!token) {
        setError('No magic link token provided');
        setIsLoading(false);

        return;
      }

      try {
        await verifyMagicLink(token);
        toast.success('Successfully signed in!');
        // The verifyMagicLink function will handle navigation to dashboard
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Magic link verification failed';

        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, [searchParams, verifyMagicLink]);

  const handleReturnToLogin = () => {
    navigate('/login');
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        <div>
          <div className='flex justify-center'>
            <div className='w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center'>
              <span className='text-white font-bold text-xl'>$</span>
            </div>
          </div>
          <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white'>
            {isLoading
              ? 'Verifying Magic Link...'
              : error
                ? 'Verification Failed'
                : 'Sign In Successful'}
          </h2>
        </div>

        <div className='bg-white dark:bg-gray-800 py-8 px-6 shadow rounded-lg'>
          {isLoading && (
            <div className='text-center'>
              <div className='inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
              <p className='mt-4 text-gray-600 dark:text-gray-300'>
                Please wait while we verify your magic link...
              </p>
            </div>
          )}

          {error && (
            <div className='text-center'>
              <div className='mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20'>
                <svg
                  className='h-6 w-6 text-red-600 dark:text-red-400'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </div>
              <h3 className='mt-2 text-sm font-medium text-gray-900 dark:text-white'>
                Magic Link Verification Failed
              </h3>
              <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
                {error}
              </p>
              <div className='mt-6 flex flex-col space-y-3'>
                <button
                  onClick={handleReturnToLogin}
                  className='w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm'
                >
                  Return to Login
                </button>
                <p className='text-xs text-gray-500 dark:text-gray-400'>
                  Magic links expire after 15 minutes. You can request a new one
                  from the login page.
                </p>
              </div>
            </div>
          )}

          {!isLoading && !error && (
            <div className='text-center'>
              <div className='mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/20'>
                <svg
                  className='h-6 w-6 text-green-600 dark:text-green-400'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M5 13l4 4L19 7'
                  />
                </svg>
              </div>
              <h3 className='mt-2 text-sm font-medium text-gray-900 dark:text-white'>
                Successfully Signed In!
              </h3>
              <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
                You&apos;re being redirected to your dashboard...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MagicLinkPage;
