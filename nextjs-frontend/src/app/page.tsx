'use client';

import { useState, useEffect } from 'react';
import { PointInput } from '@/components/point-input';
import { PointsList } from '@/components/points-list';
import { ResultsDisplay } from '@/components/results-display';
import { MapWrapper } from '@/components/map-wrapper';
import { useGeoProcessing } from '@/hooks/use-geo-processing';
import { Point, GeoResponse } from '@/types/geo';
import { toast } from 'sonner';

export default function Home() {
  const [points, setPoints] = useState<Point[]>([]);
  const [results, setResults] = useState<GeoResponse | null>(null);
  const geoMutation = useGeoProcessing();

  const addPoint = (point: Point) => {
    setPoints(prev => [...prev, point]);
  };

  const removePoint = (index: number) => {
    setPoints(prev => prev.filter((_, i) => i !== index));
    toast.success('Point removed');
  };

  const clearAll = () => {
    setPoints([]);
    setResults(null);
    toast.success('All points cleared');
  };

  useEffect(() => {
    if (points.length > 0) {
      geoMutation.mutate(
        { points },
        {
          onSuccess: (data) => {
            setResults(data);
          },
          onError: (error) => {
            toast.error(error.message);
            setResults(null);
          },
        }
      );
    } else {
      setResults(null);
    }
  }, [points]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Geo Processor</h1>
          <p className="text-muted-foreground">
            Add coordinate points to calculate centroid and bounding box
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          <div className="space-y-6">
            <PointInput onAddPoint={addPoint} />
            <PointsList
              points={points}
              onRemovePoint={removePoint}
              onClearAll={clearAll}
            />
            <ResultsDisplay 
              results={results} 
              isLoading={geoMutation.isPending && points.length > 0}
            />
          </div>

          <div>
            <div className="sticky top-8">
              <h3 className="text-lg font-semibold mb-4">Map Visualization</h3>
              <MapWrapper points={points} results={results} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
