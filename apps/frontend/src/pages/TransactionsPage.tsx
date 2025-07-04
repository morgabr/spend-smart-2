import React from 'react';

const TransactionsPage: React.FC = () => {
  return (
    <div className='animate-fade-in'>
      <div className='mb-8'>
        <h1 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
          Transactions
        </h1>
        <p className='text-gray-600 dark:text-gray-400'>
          View and manage your transactions
        </p>
      </div>

      <div className='card'>
        <div className='card-body'>
          <p className='text-gray-600 dark:text-gray-400'>
            Transaction management features coming soon...
          </p>
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;
