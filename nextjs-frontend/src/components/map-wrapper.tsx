'use client';

import dynamic from 'next/dynamic';
import { Point, GeoResponse } from '@/types/geo';

const GeoMap = dynamic(() => import('./geo-map').then(mod => ({ default: mod.GeoMap })), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] bg-muted/20 rounded-lg border border-border flex items-center justify-center">
      <div className="text-muted-foreground">Loading map...</div>
    </div>
  )
});

interface MapWrapperProps {
  points: Point[];
  results: GeoResponse | null;
}

export function MapWrapper({ points, results }: MapWrapperProps) {
  return <GeoMap points={points} results={results} />;
}