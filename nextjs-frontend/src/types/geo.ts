export interface Point {
  lat: number;
  lng: number;
}

export interface PointListRequest {
  points: Point[];
}

export interface Bounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface GeoResponse {
  centroid: Point;
  bounds: Bounds;
}