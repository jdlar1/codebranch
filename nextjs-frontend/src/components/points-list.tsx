'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Point } from '@/types/geo';
import { Trash2, MapPin } from 'lucide-react';

interface PointsListProps {
  points: Point[];
  onRemovePoint: (index: number) => void;
  onClearAll: () => void;
}

export function PointsList({ points, onRemovePoint, onClearAll }: PointsListProps) {
  if (points.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Coordinate Points
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No points added yet. Add your first coordinate point above.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Coordinate Points ({points.length})
          </CardTitle>
          <Button
            variant="destructive"
            size="sm"
            onClick={onClearAll}
            className="h-8"
          >
            Clear All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {points.map((point, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-muted rounded-lg"
            >
              <div className="flex items-center gap-3">
                <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </span>
                <div className="text-sm">
                  <span className="font-medium">Lat:</span> {point.lat.toFixed(6)},{' '}
                  <span className="font-medium">Lng:</span> {point.lng.toFixed(6)}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemovePoint(index)}
                className="h-8 w-8 p-0 hover:bg-destructive hover:text-white"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}