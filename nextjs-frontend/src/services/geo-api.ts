import { PointListRequest, GeoResponse } from '@/types/geo';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function processCoordinates(data: PointListRequest): Promise<GeoResponse> {
  const response = await fetch(`${API_URL}/process-coordinates`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to process coordinates');
  }

  return response.json();
}