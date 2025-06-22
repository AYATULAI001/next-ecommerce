'use server';

import { cookies } from 'next/headers';

export default function retrieveRefreshToken() {
  const cookiesStore = cookies();
  return cookiesStore.get('refresh_token')?.value;
}
