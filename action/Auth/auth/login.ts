// app/Auth/auth/login.ts
'use server';

import { fetchApiClient } from '@/lib/oneentry';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const handleLoginSubmit = async (inputValues: {
  email: string;
  password: string;
}) => {
  try {
    const apiClient = await fetchApiClient();

    const data = {
      authData: [
        { marker: 'email', value: inputValues.email },
        { marker: 'password', value: inputValues.password },
      ],
    };

    const response = await apiClient?.Authprovider.SignIn('email', data);

    if (!response || !response.userIdentifier) {
      return { message: 'Authentication failed.' };
    }

    const cookieStore = cookies();
    cookieStore.set('access_token', response.accessToken, { maxAge: 60 * 60 * 24 });
    cookieStore.set('refresh_token', response.refreshToken, { maxAge: 60 * 60 * 24 * 7 });

    redirect('/');
  } catch (error: any) {
    console.error(error);
    return { message: 'Login failed. Please try again.' };
  }
};

export const getLoginFormData = async () => {
  const apiClient = await fetchApiClient();
  const response = await apiClient?.getFormByMarker('sign_ In', 'en_US');
  return response?.attributes;
};
