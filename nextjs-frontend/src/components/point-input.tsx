'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Point } from '@/types/geo';
import { toast } from 'sonner';

interface PointInputProps {
  onAddPoint: (point: Point) => void;
}

export function PointInput({ onAddPoint }: PointInputProps) {
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);
    
    if (isNaN(latNum) || isNaN(lngNum)) {
      toast.error('Please enter valid numbers for latitude and longitude');
      return;
    }
    
    if (latNum < -90 || latNum > 90) {
      toast.error('Latitude must be between -90 and 90');
      return;
    }
    
    if (lngNum < -180 || lngNum > 180) {
      toast.error('Longitude must be between -180 and 180');
      return;
    }
    
    onAddPoint({ lat: latNum, lng: lngNum });
    setLat('');
    setLng('');
    toast.success('Point added successfully');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Coordinate Point</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Latitude</label>
              <Input
                type="number"
                step="any"
                placeholder="e.g., 40.7128"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Longitude</label>
              <Input
                type="number"
                step="any"
                placeholder="e.g., -74.0060"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                required
              />
            </div>
          </div>
          <Button type="submit" className="w-full">
            Add Point
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}