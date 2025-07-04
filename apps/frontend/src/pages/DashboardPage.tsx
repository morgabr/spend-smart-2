import React from 'react';

const DashboardPage: React.FC = () => {
  return (
    <div className='animate-fade-in'>
      <div className='mb-8'>
        <h1 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
          Welcome to your Dashboard
        </h1>
        <p className='text-gray-600 dark:text-gray-400'>
          Here's an overview of your financial health
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
        <div className='card'>
          <div className='card-body'>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
              Total Balance
            </h3>
            <p className='text-2xl font-bold text-green-600'>$12,345.67</p>
          </div>
        </div>

        <div className='card'>
          <div className='card-body'>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
              Monthly Income
            </h3>
            <p className='text-2xl font-bold text-blue-600'>$5,200.00</p>
          </div>
        </div>

        <div className='card'>
          <div className='card-body'>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
              Monthly Expenses
            </h3>
            <p className='text-2xl font-bold text-red-600'>$3,450.23</p>
          </div>
        </div>

        <div className='card'>
          <div className='card-body'>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
              Savings Rate
            </h3>
            <p className='text-2xl font-bold text-purple-600'>33.7%</p>
          </div>
        </div>
      </div>

      <div className='card'>
        <div className='card-body'>
          <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-4'>
            Recent Transactions
          </h2>
          <p className='text-gray-600 dark:text-gray-400'>
            Transaction list will be implemented here...
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
