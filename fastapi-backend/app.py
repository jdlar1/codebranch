from fastapi import FastAPI, HTTPException, status
from fastapi.responses import JSONResponse

from models import Point, PointListRequest, CentroidResponse, Bounds

app = FastAPI()

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "geo-processor"}


@app.post(
    "/process-coordinates",
    status_code=status.HTTP_200_OK,
    summary="Process geographic coordinates",
    description="Calculate centroid and bounds for a list of latitude/longitude points"
)
async def process_coordinates(request: PointListRequest) -> CentroidResponse:
    """
    Process a list of geographic coordinates to calculate:
    - Centroid (average of all points)
    - Bounding box (north, south, east, west extremes)
    
    Args:
        request: PointListRequest containing list of lat/lng points
        
    Returns:
        CentroidResponse with centroid and bounds information
        
    Raises:
        HTTPException: 400 if points list is empty
        HTTPException: 422 if validation fails (handled by FastAPI/Pydantic)
    """
    try:
        points = request.points
        
        if not points:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Points list cannot be empty"
            )
        
        
        latitudes = [point.lat for point in points]
        longitudes = [point.lng for point in points]
        
        north = max(latitudes)
        south = min(latitudes)
        east = max(longitudes)
        west = min(longitudes)
        
        centroid_lat = sum(latitudes) / len(latitudes)
        centroid_lng = sum(longitudes) / len(longitudes)
        
        centroid = Point(lat=centroid_lat, lng=centroid_lng)
        bounds = Bounds(north=north, south=south, east=east, west=west)

        return CentroidResponse(centroid=centroid, bounds=bounds)

        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid coordinate data: {str(e)}"
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error processing coordinates"
        )




@app.exception_handler(422)
async def validation_exception_handler(request, exc):
    """Custom handler for Pydantic validation errors"""
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={
            "detail": "Invalid input data. Please check that all points have valid numeric lat/lng values.",
            "errors": exc.detail if hasattr(exc, 'detail') else str(exc)
        }
    )
