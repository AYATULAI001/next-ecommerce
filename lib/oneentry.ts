import { defineOneEntry } from "oneentry";
import retrieveRefreshToken from '@/action/Auth/auth/retrieveRefreshToken';
import storeRefreshToken from '@/action/Auth/auth/storeRefreshToken';

export type ApiClientType = ReturnType<typeof defineOneEntry> | null;

let apiClient: ApiClientType = null;

export async function setApiClient(): Promise<ReturnType<typeof defineOneEntry>> {
  const apiUrl = process.env.ONEENTRY_PROJECT_URL;

  if (!apiUrl) {
    throw new Error('ONEENTRY_PROJECT_URL is missing');
  }

  if (apiClient) return apiClient;

  try {
    const refreshToken = await retrieveRefreshToken();

    apiClient = defineOneEntry(apiUrl, {
       token: process.env.ONEENTRY_TOKEN,
      langCode: 'en_US',
      auth: {
        refreshToken: refreshToken || undefined,
        customAuth: false,
        saveFunction: async (newToken: string) => {
          await storeRefreshToken(newToken);
        },
      },
    });
  } catch (error) {
    console.error('Error setting up API client:', error);
    throw error;
  }

  if (!apiClient) {
    throw new Error('Failed to initialize apiClient');
  }

  return apiClient;
}

export async function fetchApiClient(): Promise<ReturnType<typeof defineOneEntry>> {
  if (!apiClient) {
    await setApiClient();
  }

  if (!apiClient) {
    throw new Error('apiClient is still null after setup');
  }

  return apiClient;
}
