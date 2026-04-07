import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Network } from '../types/network';

type NetworkStore = {
  networks: Network[];
  activeNetworkId: string | null;

  addNetwork: (n: Network) => void;
  setActiveNetwork: (id: string) => void;

  updateNodeDemand: (
    networkId: string,
    nodeId: string,
    demand: number
  ) => void;

  deleteNetwork: (networkId: string) => void;

  getActiveNetwork: () => Network | null;
};

export const useNetworkStore = create<NetworkStore>()(
  persist(
    (set, get) => ({
      networks: [],
      activeNetworkId: null,

      /* ================= ADD ================= */
      addNetwork: (network) =>
        set((state) => ({
          networks: [...state.networks, network],
          activeNetworkId: network.id,
        })),

      /* ================= SET ACTIVE ================= */
      setActiveNetwork: (id) =>
        set({ activeNetworkId: id }),

      /* ================= UPDATE NODE ================= */
      updateNodeDemand: (networkId, nodeId, demand) =>
        set((state) => ({
          networks: state.networks.map((net) =>
            net.id !== networkId
              ? net
              : {
                  ...net,
                  nodes: net.nodes.map((n) =>
                    n.id === nodeId
                      ? { ...n, demand }
                      : n
                  ),
                }
          ),
        })),

      /* ================= DELETE ================= */
      deleteNetwork: (networkId) =>
        set((state) => {
          const filtered = state.networks.filter(
            (n) => n.id !== networkId
          );

          return {
            networks: filtered,
            activeNetworkId:
              state.activeNetworkId === networkId
                ? filtered[0]?.id ?? null
                : state.activeNetworkId,
          };
        }),

      /* ================= GET ACTIVE ================= */
      getActiveNetwork: () => {
        const { networks, activeNetworkId } = get();
        return (
          networks.find((n) => n.id === activeNetworkId) ||
          null
        );
      },
    }),
    {
      name: 'wdn-networks-store',
    }
  )
);