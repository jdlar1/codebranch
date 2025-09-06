'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GeoResponse } from '@/types/geo';
import { MapPin, Square } from 'lucide-react';

interface ResultsDisplayProps {
  results: GeoResponse | null;
  isLoading: boolean;
}

export function ResultsDisplay({ results, isLoading }: ResultsDisplayProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Centroid
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse">
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Square className="h-5 w-5" />
              Bounding Box
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-full"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!results) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground text-center py-8">
            Add coordinate points to see centroid and bounding box calculations.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Centroid
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Latitude:</span>
              <span className="font-mono">{results.centroid.lat.toFixed(6)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Longitude:</span>
              <span className="font-mono">{results.centroid.lng.toFixed(6)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Square className="h-5 w-5" />
            Bounding Box
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">North:</span>
              <span className="font-mono">{results.bounds.north.toFixed(6)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">South:</span>
              <span className="font-mono">{results.bounds.south.toFixed(6)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">East:</span>
              <span className="font-mono">{results.bounds.east.toFixed(6)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">West:</span>
              <span className="font-mono">{results.bounds.west.toFixed(6)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}