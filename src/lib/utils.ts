import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

export function getPressureColor(pressure: number | null): string {
  if (pressure === null) return '#94a3b8';
  if (pressure < 20) return '#ef4444';
  if (pressure < 40) return '#f59e0b';
  if (pressure < 60) return '#eab308';
  if (pressure < 80) return '#84cc16';
  return '#22c55e';
}

export function getFlowColor(flow: number | null): string {
  if (flow === null) return '#94a3b8';
  const absFlow = Math.abs(flow);
  if (absFlow < 10) return '#3b82f6';
  if (absFlow < 50) return '#06b6d4';
  if (absFlow < 100) return '#10b981';
  if (absFlow < 200) return '#f59e0b';
  return '#ef4444';
}

export function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'low':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'high':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'critical':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'active':
    case 'completed':
    case 'resolved':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'processing':
    case 'running':
    case 'queued':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'error':
    case 'failed':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'new':
    case 'acknowledged':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'cancelled':
    case 'archived':
    case 'inactive':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}
