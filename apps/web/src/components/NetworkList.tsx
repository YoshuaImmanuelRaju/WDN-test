import { useNetworks } from '../hooks/useNetworks';

export function NetworkList() {
  const { data, isLoading } = useNetworks();
  if (isLoading) return <p>Loading networks...</p>;

  return (
    <div className="card">
      <h2>Networks</h2>
      <ul>
        {(data ?? []).map((n: any) => (
          <li key={n.id}>{n.name} - {n.status}</li>
        ))}
      </ul>
    </div>
  );
}
