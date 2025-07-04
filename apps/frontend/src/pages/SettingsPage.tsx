import React from 'react';

const SettingsPage: React.FC = () => {
  return (
    <div className='animate-fade-in'>
      <div className='mb-8'>
        <h1 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
          Settings
        </h1>
        <p className='text-gray-600 dark:text-gray-400'>
          Manage your account settings and preferences
        </p>
      </div>

      <div className='card'>
        <div className='card-body'>
          <p className='text-gray-600 dark:text-gray-400'>
            Settings features coming soon...
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
