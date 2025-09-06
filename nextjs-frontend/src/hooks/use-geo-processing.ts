import { useMutation } from '@tanstack/react-query';
import { processCoordinates } from '@/services/geo-api';
import { PointListRequest, GeoResponse } from '@/types/geo';

export function useGeoProcessing() {
  return useMutation<GeoResponse, Error, PointListRequest>({
    mutationFn: processCoordinates,
  });
}