import { create } from 'zustand';
import type { Network, Node, Pipe, NetworkWithDetails } from '@/types';

type VisualizationMode = 'flow' | 'pressure' | 'cost';

interface NetworkState {
  currentNetwork: NetworkWithDetails | null;
  selectedNode: Node | null;
  selectedPipe: Pipe | null;
  visualizationMode: VisualizationMode;

  setCurrentNetwork: (network: NetworkWithDetails | null) => void;
  selectNode: (node: Node | null) => void;
  selectPipe: (pipe: Pipe | null) => void;
  setVisualizationMode: (mode: VisualizationMode) => void;
  updateNodePressure: (nodeId: string, pressure: number) => void;
  updatePipeFlow: (pipeId: string, flow: number) => void;
  clearSelection: () => void;
}

export const useNetworkStore = create<NetworkState>((set, get) => ({
  currentNetwork: null,
  selectedNode: null,
  selectedPipe: null,
  visualizationMode: 'flow',

  setCurrentNetwork: (network) => {
    set({
      currentNetwork: network,
      selectedNode: null,
      selectedPipe: null,
    });
  },

  selectNode: (node) => {
    set({
      selectedNode: node,
      selectedPipe: null,
    });
  },

  selectPipe: (pipe) => {
    set({
      selectedPipe: pipe,
      selectedNode: null,
    });
  },

  setVisualizationMode: (mode) => {
    set({ visualizationMode: mode });
  },

  updateNodePressure: (nodeId, pressure) => {
    const { currentNetwork } = get();
    if (!currentNetwork?.nodes) return;

    const updatedNodes = currentNetwork.nodes.map((n) =>
      n.id === nodeId ? { ...n, current_pressure: pressure } : n
    );

    set({
      currentNetwork: {
        ...currentNetwork,
        nodes: updatedNodes,
      },
    });
  },

  updatePipeFlow: (pipeId, flow) => {
    const { currentNetwork } = get();
    if (!currentNetwork?.pipes) return;

    const updatedPipes = currentNetwork.pipes.map((p) =>
      p.id === pipeId ? { ...p, current_flow: flow } : p
    );

    set({
      currentNetwork: {
        ...currentNetwork,
        pipes: updatedPipes,
      },
    });
  },

  clearSelection: () => {
    set({
      selectedNode: null,
      selectedPipe: null,
    });
  },
}));
