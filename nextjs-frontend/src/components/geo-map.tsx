'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Point, GeoResponse } from '@/types/geo';

interface GeoMapProps {
  points: Point[];
  results: GeoResponse | null;
}

export function GeoMap({ points, results }: GeoMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map if not already created
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView([40.7128, -74.0060], 2);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapRef.current);
    }

    const map = mapRef.current;
    
    // Clear existing layers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Rectangle || layer instanceof L.Circle) {
        map.removeLayer(layer);
      }
    });

    if (points.length === 0) {
      map.setView([40.7128, -74.0060], 2);
      return;
    }

    // Custom marker icons
    const pointIcon = L.divIcon({
      html: '<div style="background-color: #3b82f6; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
      className: 'custom-marker',
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });

    const centroidIcon = L.divIcon({
      html: '<div style="background-color: #ef4444; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.4);"></div>',
      className: 'centroid-marker',
      iconSize: [22, 22],
      iconAnchor: [11, 11]
    });

    // Add point markers
    points.forEach((point, index) => {
      L.marker([point.lat, point.lng], { icon: pointIcon })
        .bindPopup(`Point ${index + 1}<br/>Lat: ${point.lat.toFixed(6)}<br/>Lng: ${point.lng.toFixed(6)}`)
        .addTo(map);
    });

    // Add centroid and bounding box if results exist
    if (results) {
      // Add centroid marker
      L.marker([results.centroid.lat, results.centroid.lng], { icon: centroidIcon })
        .bindPopup(`Centroid<br/>Lat: ${results.centroid.lat.toFixed(6)}<br/>Lng: ${results.centroid.lng.toFixed(6)}`)
        .addTo(map);

      // Add bounding box rectangle
      const bounds = [
        [results.bounds.south, results.bounds.west],
        [results.bounds.north, results.bounds.east]
      ] as [[number, number], [number, number]];

      L.rectangle(bounds, {
        color: '#8b5cf6',
        weight: 2,
        fillOpacity: 0.1,
        dashArray: '5, 5'
      })
        .bindPopup(`Bounding Box<br/>N: ${results.bounds.north.toFixed(6)}<br/>S: ${results.bounds.south.toFixed(6)}<br/>E: ${results.bounds.east.toFixed(6)}<br/>W: ${results.bounds.west.toFixed(6)}`)
        .addTo(map);

      // Fit map to show all points and bounding box
      const mapBounds = L.latLngBounds(bounds);
      points.forEach(point => {
        mapBounds.extend([point.lat, point.lng]);
      });
      
      map.fitBounds(mapBounds, { padding: [20, 20] });
    } else if (points.length > 0) {
      // Fit map to show all points
      const group = new L.FeatureGroup();
      points.forEach(point => {
        group.addLayer(L.marker([point.lat, point.lng]));
      });
      map.fitBounds(group.getBounds(), { padding: [20, 20] });
    }

  }, [points, results]);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden border border-border">
      <div ref={mapContainerRef} className="w-full h-full" />
      
      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500 border-2 border-white shadow-sm"></div>
          <span>Points</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-white shadow-sm"></div>
          <span>Centroid</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-2 border-2 border-purple-500 border-dashed bg-purple-100/20"></div>
          <span>Bounding Box</span>
        </div>
      </div>
    </div>
  );
}