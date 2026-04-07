import { Network } from '../types/network.ts';

const API_BASE_URL = 'https://water-network-backend.onrender.com';

export async function uploadNetwork(
  file: File
): Promise<Network> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(
    `${API_BASE_URL}/networks/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error('Failed to upload network');
  }

  return response.json();
}
