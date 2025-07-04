import React from 'react';

const AccountsPage: React.FC = () => {
  return (
    <div className='animate-fade-in'>
      <div className='mb-8'>
        <h1 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
          Accounts
        </h1>
        <p className='text-gray-600 dark:text-gray-400'>
          Manage your connected accounts
        </p>
      </div>

      <div className='card'>
        <div className='card-body'>
          <p className='text-gray-600 dark:text-gray-400'>
            Account management features coming soon...
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccountsPage;
