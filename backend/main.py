import os
import sys

# Ensure backend directory is in sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from typing import Optional

from realtime_service import (
    get_realtime_heat_assessment,
    search_location,
    reverse_geocode,
    PRESET_CITIES,
    SYSTEM_INTEGRATIONS
)

app = FastAPI(
    title="Hyperlocal Heatwave Early Warning & Health Risk System",
    description="Real-time biometeorological analytics engine computing WBGT, UTCI, Overnight Cooling Failure, and OSHA Occupational Precautions",
    version="1.0.0"
)

# Enable CORS for local client development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
@app.get("/health")
def health_check():
    return {
        "status": "online",
        "service": "Hyperlocal Heatwave Biometeorological Engine",
        "realtime_data_feed": "Open-Meteo Operational Stream (Active)",
        "indices_supported": ["WBGT (ISO 7243)", "UTCI", "NOAA Heat Index", "Overnight Cooling Escalation"],
        "version": "1.0.0"
    }


@app.get("/api/presets")
@app.get("/presets")
def list_presets():
    return PRESET_CITIES


@app.get("/api/integrations")
@app.get("/integrations")
def get_integrations_status():
    """
    Returns current active telemetry and explicit requirements for upgrading
    to official enterprise feeds (IMD, Google Earth Engine, SMS/Cell Broadcast).
    """
    return {
        "active_primary_stream": "Open-Meteo Open Data Stream (WMO / ECMWF / GFS)",
        "integrations": SYSTEM_INTEGRATIONS,
        "instructions": (
            "To connect enterprise ground sensors (IMD AWS) and Google Earth Engine LST: "
            "provide your credentials in .env or the frontend Integration Drawer."
        )
    }


@app.get("/api/search")
@app.get("/search")
def search_city(q: str = Query(..., min_length=2, description="City, town, or district name")):
    results = search_location(q)
    return {"query": q, "results": results}


@app.get("/api/reverse-geocode")
@app.get("/reverse-geocode")
def get_reverse_geocode(
    lat: float = Query(..., description="Latitude of the point"),
    lon: float = Query(..., description="Longitude of the point")
):
    """
    Reverse geocodes coordinates into location name, district, pincode, state, and address.
    """
    return reverse_geocode(lat, lon)


@app.get("/api/realtime")
@app.get("/realtime")
def get_realtime_data(
    lat: Optional[float] = None,
    lon: Optional[float] = None,
    city: Optional[str] = "ahmedabad",
    persona: str = Query("delivery", regex="^(delivery|construction|agriculture|elderly)$")
):
    """
    Computes real-time biometeorological indices and 5-tier risk for a given coordinate or preset city.
    Strictly uses real-time operational meteorological feeds.
    """
    location_name = "Custom Location"

    if lat is None or lon is None:
        city_key = (city or "ahmedabad").lower()
        if city_key in PRESET_CITIES:
            cfg = PRESET_CITIES[city_key]
            lat = cfg["lat"]
            lon = cfg["lon"]
            location_name = cfg["name"]
        else:
            # Fallback to Ahmedabad
            cfg = PRESET_CITIES["ahmedabad"]
            lat = cfg["lat"]
            lon = cfg["lon"]
            location_name = cfg["name"]

    try:
        data = get_realtime_heat_assessment(
            lat=lat,
            lon=lon,
            location_name=location_name,
            persona=persona
        )
        return data
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Failed to fetch real-time meteorological stream: {str(e)}")


# Mount frontend static directory if exists
frontend_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend"))
if os.path.exists(frontend_path):
    app.mount("/static", StaticFiles(directory=frontend_path), name="static")

    @app.get("/")
    async def serve_index():
        index_file = os.path.join(frontend_path, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
        return {"message": "Frontend index.html not found"}
