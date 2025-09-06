from pydantic import BaseModel, Field


class Point(BaseModel):
    lat: float = Field(..., description="The latitude of the point", ge=-90, le=90)
    lng: float = Field(..., description="The longitude of the point", ge=-180, le=180)


class PointListRequest(BaseModel):
    points: list[Point] = Field(..., description="A list of geographical points", min_length=1)


class Bounds(BaseModel):
    north: float = Field(..., description="Northernmost latitude", ge=-90, le=90)
    south: float = Field(..., description="Southernmost latitude", ge=-90, le=90)
    east: float = Field(..., description="Easternmost longitude", ge=-180, le=180)
    west: float = Field(..., description="Westernmost longitude", ge=-180, le=180)


class CentroidResponse(BaseModel):
    centroid: Point = Field(..., description="The centroid of the provided points")
    bounds: Bounds = Field(..., description="The bounding box of the provided points")
