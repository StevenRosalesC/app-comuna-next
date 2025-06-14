'use client';
import { useState } from 'react';

export const CreateUserForm = () => {
  const [userInformation, setUserInformation] = useState({
    email: '',
    userName: '',
    password: ''
  });

  const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify(userInformation)
    });
    const data = await response.json();
    return data;
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInformation({
      ...userInformation,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className='dark:shadow-dark-lg flex h-full w-full flex-col rounded-lg bg-gray-50 shadow-lg dark:bg-gray-800  md:space-y-6 md:p-6'>
      <h1 className='text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl'>
        Create an account
      </h1>
      <form className='space-y-4 md:space-y-6' onSubmit={onFormSubmit}>
        <div>
          <label
            htmlFor='email'
            className='mb-2 block text-sm font-medium text-gray-900 dark:text-white'
          >
            User email
          </label>
          <input
            type='email'
            name='email'
            id='email'
            className='focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'
            placeholder='name@company.com'
            value={userInformation.email}
            onChange={onInputChange}
          />
        </div>
        <div>
          <label
            htmlFor='userName'
            className='mb-2 block text-sm font-medium text-gray-900 dark:text-white'
          >
            User name
          </label>
          <input
            type='userName'
            name='userName'
            id='userName'
            className='focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'
            placeholder='Username'
            value={userInformation.userName}
            onChange={onInputChange}
          />
        </div>
        <div>
          <label
            htmlFor='password'
            className='mb-2 block text-sm font-medium text-gray-900 dark:text-white'
          >
            Password
          </label>
          <input
            name='password'
            id='password'
            placeholder='••••••••'
            className='focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'
            value={userInformation.password}
            onChange={onInputChange}
          />
        </div>

        <button
          type='submit'
          className='hover:bg-primary-700 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 w-full rounded-lg bg-stone-600 px-5 py-2.5 text-center text-sm font-medium text-white focus:outline-none focus:ring-4'
        >
          Create an account
        </button>
      </form>
    </div>
  );
};
