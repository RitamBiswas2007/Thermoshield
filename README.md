# ThermoShield India | Hyperlocal Heatwave Early Warning & Health Risk Platform

A production-grade, biometeorological heatwave forecasting platform built specifically for Indian summers, municipal disaster management authorities (NDMA/DDMA), and vulnerable occupational outdoor laborers (delivery riders, construction workers, agricultural farmers).

---

## 🌟 Reference Architecture Alignment

This system directly implements and bridges the core lessons from the problem statement:

1. **OSHA-NIOSH Heat Safety Tool**: Generates real-time physiological body strain metrics (WBGT, UTCI, NOAA Heat Index) and translates them into **direct operational commands** (mandatory work/rest cycle minutes, shaded canopy mandates, hydration cadence in ml/hour).
2. **NWS HeatRisk (NOAA / CDC)**: Uses an NWS-standard **5-Tier risk scale (Tier 0 to Tier 4)** and directly incorporates an **Overnight Cooling Deficit Engine** (automatic +1 tier escalation if nighttime temperatures fail to drop below 26°C).
3. **Copernicus "Thermal Trace" (ERA5-HEAT / ECMWF)**: Calculates multi-node human thermal stress categories and radiant solar flux.
4. **HeatShield (India)**: Features **Occupational Persona Modes** (Delivery, Construction, Agriculture, Elderly) that dynamically recalibrate metabolic heat generation and offers **multilingual advisories** (Hindi, Bengali, Tamil, Telugu, and English).

---

## 🚀 Quick Start (Running Locally)

### 1. Requirements
* Python 3.10+ (FastAPI, Uvicorn, Requests)
* Modern web browser (Chrome, Edge, Firefox)

### 2. Start the Backend & Dashboard Server
Run the following command from this directory:
```bash
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```

### 3. Open in Browser
Open your browser and navigate to:
```
http://localhost:8000
```

---

## 📡 Real-Time Telemetry & Upgrade Blueprint

### 🟢 What is Live Right Now (100% Real Meteorological Observations)
* **Zero Mock or Demo Data**: The system is connected directly to **Open-Meteo's Open Meteorological Data Stream (WMO / ECMWF / GFS)**.
* **Instant Pan-India Telemetry**: Fetches live dry-bulb temperature, relative humidity, 10m wind speed, direct solar radiation flux ($W/m^2$), and 7-day hourly forecasts for any coordinates or Indian city.
* **GPS Geolocation & Geocoding**: Click *"Use Current GPS"* or search for any Indian municipality/ward to immediately fetch live measurements.

---

### 🟡 Enterprise Government Upgrades: What is Needed

To upgrade the platform from the open scientific meteorological feed to official sovereign enterprise infrastructure:

| Component | Target Integration | What You Need to Provide | Purpose |
| :--- | :--- | :--- | :--- |
| **Ground Telemetry** | **IMD AWS Network** | API Bearer Token from IMD Data Center (`mausam.imd.gov.in`) | Direct ground-truth calibration against 550+ IMD automated weather stations |
| **Hyperlocal UHI** | **Google Earth Engine (GEE)** | GCP Service Account JSON key (`credentials/gee-service-account.json`) | 30m-100m spatial resolution Land Surface Temperature (LST) from Landsat-8/9 and Sentinel-3 |
| **Civic Alerts** | **NDMA Cell Broadcast / WhatsApp** | Twilio / Gupshup API Token (`.env`) | Geo-fenced push notifications to all citizen devices without requiring app installation |

*(You can enter and test these credentials directly via the **Pipeline & APIs** diagnostics modal in the top header).*
