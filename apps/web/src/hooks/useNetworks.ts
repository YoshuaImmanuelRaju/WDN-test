import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export function useNetworks() {
  return useQuery({
    queryKey: ['networks'],
    queryFn: async () => (await api.get('/networks')).data.data.items,
  });
}
