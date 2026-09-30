import math
from typing import Dict, Any, Tuple, Optional

def calculate_wet_bulb_temperature(temperature_c: float, relative_humidity: float) -> float:
    """
    Computes natural wet-bulb temperature (Tnw / Tw) using Stull's (2011) formula.
    Valid for RH between 5% and 99% and T between -20°C and 50°C.
    """
    T = temperature_c
    RH = relative_humidity

    tw = (
        T * math.atan(0.151977 * math.sqrt(RH + 8.313659))
        + math.atan(T + RH)
        - math.atan(RH - 1.676331)
        + 0.00391838 * (RH ** 1.5) * math.atan(0.023101 * RH)
        - 4.686035
    )
    return round(tw, 2)


def calculate_globe_temperature(temperature_c: float, solar_radiation: float, wind_speed_10m: float) -> float:
    """
    Estimates black globe temperature (Tg) from ambient temperature, solar radiation (W/m2),
    and 10m wind speed (m/s) based on Liljegren et al. / ISO 7243 approximations.
    """
    # Wind speed at 2m is approximately 0.75 of 10m wind speed
    v = max(wind_speed_10m * 0.75, 0.2)
    # Estimate temperature difference between black globe and ambient air
    delta_t = (0.0149 * solar_radiation) / (v ** 0.4)
    # Clamp reasonable solar heating increment
    delta_t = min(max(delta_t, 0.0), 14.0)
    tg = temperature_c + delta_t
    return round(tg, 2)


def calculate_wbgt(
    temperature_c: float,
    relative_humidity: float,
    solar_radiation: float = 0.0,
    wind_speed_10m: float = 1.0,
    is_outdoor: bool = True
) -> Dict[str, float]:
    """
    Calculates Wet-Bulb Globe Temperature (WBGT).
    Indoor/Shade: WBGT = 0.7 * Tnw + 0.3 * Tg
    Outdoor (Direct Sunlight): WBGT = 0.7 * Tnw + 0.2 * Tg + 0.1 * Ta
    """
    tnw = calculate_wet_bulb_temperature(temperature_c, relative_humidity)
    tg = calculate_globe_temperature(temperature_c, solar_radiation, wind_speed_10m)

    if is_outdoor and solar_radiation > 20.0:
        wbgt = 0.7 * tnw + 0.2 * tg + 0.1 * temperature_c
    else:
        # Shaded or night
        wbgt = 0.7 * tnw + 0.3 * tg

    return {
        "wbgt": round(wbgt, 2),
        "wet_bulb_c": round(tnw, 2),
        "globe_temp_c": round(tg, 2),
        "dry_bulb_c": round(temperature_c, 2)
    }


def calculate_heat_index(temperature_c: float, relative_humidity: float) -> float:
    """
    Computes NOAA Heat Index using Rothfusz regression equation.
    Converts C to F, calculates HI in F, converts back to C.
    """
    T_f = (temperature_c * 9.0 / 5.0) + 32.0
    RH = relative_humidity

    # Simple formula threshold
    HI_simple = 0.5 * (T_f + 61.0 + ((T_f - 68.0) * 1.2) + (RH * 0.094))
    if ((HI_simple + T_f) / 2.0) < 80.0:
        hi_f = HI_simple
    else:
        # Full Rothfusz regression
        hi_f = (
            -42.379
            + 2.04901523 * T_f
            + 10.14333127 * RH
            - 0.22475541 * T_f * RH
            - 0.00683783 * (T_f ** 2)
            - 0.05481717 * (RH ** 2)
            + 0.00122874 * (T_f ** 2) * RH
            + 0.00085282 * T_f * (RH ** 2)
            - 0.00000199 * (T_f ** 2) * (RH ** 2)
        )
        if RH < 13.0 and 80.0 <= T_f <= 112.0:
            adj = ((13.0 - RH) / 4.0) * math.sqrt((17.0 - abs(T_f - 95.0)) / 17.0)
            hi_f -= adj
        elif RH > 85.0 and 80.0 <= T_f <= 87.0:
            adj = ((RH - 85.0) / 10.0) * ((87.0 - T_f) / 5.0)
            hi_f += adj

    hi_c = (hi_f - 32.0) * 5.0 / 9.0
    return round(hi_c, 2)


def calculate_utci_approx(temperature_c: float, relative_humidity: float, wind_speed_10m: float, solar_radiation: float) -> float:
    """
    Approximation of Universal Thermal Climate Index (UTCI) stress value.
    Factoring air temperature, vapor pressure, wind at 10m, and mean radiant temp increment.
    """
    Ta = temperature_c
    v = max(wind_speed_10m, 0.5)
    
    # Saturated vapor pressure (hPa) via Magnus-Tetens
    e_s = 6.1078 * math.exp((17.27 * Ta) / (Ta + 237.3))
    e = (relative_humidity / 100.0) * e_s

    # Radiant temp delta (Tmrt - Ta) derived from solar radiation
    delta_tmrt = 0.025 * solar_radiation / (v ** 0.2)

    # Simplified biometeorological UTCI polynomial offset
    offset = (
        (0.6075 * delta_tmrt)
        - (0.0097 * Ta * v)
        + (0.02 * (e - 10.0))
        - (1.2 * math.sqrt(v))
    )
    utci = Ta + offset
    return round(utci, 2)


def evaluate_nws_tier(
    wbgt: float,
    nighttime_min_c: float,
    persona: str = "delivery"
) -> Dict[str, Any]:
    """
    Evaluates risk on a 5-Tier scale (0 to 4), factoring:
    1. Base WBGT thresholds.
    2. Lack of overnight cooling (nighttime min >= 26°C triggers an automatic tier escalation).
    3. Occupational metabolic workload modifiers.
    """
    # Workload offsets (reduces threshold for heavier work)
    workload_offsets = {
        "agriculture": 1.2,    # Heavy manual labor under open sun
        "construction": 1.5,   # Heavy physical activity, concrete/asphalt reflection
        "delivery": 0.8,       # Constant transit, vehicle heat, protective gear
        "elderly": 2.0         # Severe clinical vulnerability, reduced thermoregulation
    }
    offset = workload_offsets.get(persona.lower(), 1.0)
    adjusted_wbgt = wbgt + offset

    # Base 5-tier classification
    if adjusted_wbgt < 28.0:
        base_tier = 0
        tier_name = "Minimal (Safe)"
        color = "#10b981" # Green
    elif adjusted_wbgt < 30.0:
        base_tier = 1
        tier_name = "Minor Heat Risk"
        color = "#eab308" # Yellow
    elif adjusted_wbgt < 31.8:
        base_tier = 2
        tier_name = "Moderate Heat Stress"
        color = "#f97316" # Orange
    elif adjusted_wbgt < 33.5:
        base_tier = 3
        tier_name = "Major Heat Danger"
        color = "#ef4444" # Red
    else:
        base_tier = 4
        tier_name = "Extreme / Fatal Heat Threat"
        color = "#7f1d1d" # Maroon / Dark Red

    # Overnight Cooling Failure Rule:
    # If nighttime min temperature fails to drop below 26.0°C (78.8°F), heat stress turns cumulative.
    overnight_cooling_failed = nighttime_min_c >= 26.0
    final_tier = base_tier
    tier_escalated = False

    if overnight_cooling_failed and base_tier < 4:
        final_tier = base_tier + 1
        tier_escalated = True

    # Operational instructions per persona and tier (OSHA-NIOSH format)
    operational_commands = generate_operational_instructions(final_tier, persona, overnight_cooling_failed)

    return {
        "tier": final_tier,
        "base_tier": base_tier,
        "tier_name": tier_name if not tier_escalated else f"{tier_name} [ESCALATED]",
        "color": color,
        "overnight_cooling_failed": overnight_cooling_failed,
        "nighttime_min_c": nighttime_min_c,
        "tier_escalated": tier_escalated,
        "operational_commands": operational_commands
    }


def generate_operational_instructions(tier: int, persona: str, overnight_cooling_failed: bool) -> Dict[str, Any]:
    """
    Generates exact OSHA-NIOSH operational instructions based on tier and occupational role.
    """
    instructions = {
        0: {
            "work_rest_cycle": "Standard continuous operation (Normal shifts)",
            "work_minutes": 60,
            "rest_minutes": 0,
            "hydration_command": "Drink at least 250ml of clean water every 45-60 minutes.",
            "shade_requirement": "Rest in shaded areas during meal breaks.",
            "civic_action": "Standard civic readiness. Routine public hydration notices."
        },
        1: {
            "work_rest_cycle": "50 min work / 10 min rest per hour under canopy/shade",
            "work_minutes": 50,
            "rest_minutes": 10,
            "hydration_command": "Drink 1 cup (250ml) electrolyte or cool water every 30 minutes.",
            "shade_requirement": "Mandatory shade or cooled rest areas equipped with ventilation.",
            "civic_action": "Municipal alert to Primary Health Centers (PHCs) for heat exhaustion preparedness."
        },
        2: {
            "work_rest_cycle": "45 min work / 15 min mandatory shaded rest per hour",
            "work_minutes": 45,
            "rest_minutes": 15,
            "hydration_command": "Drink 1 cup (250ml) water/ORS every 20 minutes. Do not wait until thirsty.",
            "shade_requirement": "Covered shelter with active fans or misting coolers required at site.",
            "civic_action": "Activate municipal Phase-1 cooling shelters and public ORS distribution kiosks."
        },
        3: {
            "work_rest_cycle": "30 min work / 30 min shaded rest per hour. Shift labor to 06:00-11:00 & 16:00-19:00",
            "work_minutes": 30,
            "rest_minutes": 30,
            "hydration_command": "Drink 1.5 - 2 liters of cool water/ORS per hour. Monitor urine color.",
            "shade_requirement": "Dedicated cooled indoor rest area or air-cooled canopy.",
            "civic_action": "Mandatory contractor work restrictions; deploy emergency water tankers to dense wards; grid surge alerts."
        },
        4: {
            "work_rest_cycle": "HALT all outdoor manual labor between 11:00 AM and 16:30 PM",
            "work_minutes": 0,
            "rest_minutes": 60,
            "hydration_command": "Immediate active cooling required. Hydrate with electrolyte solution continuously.",
            "shade_requirement": "Evacuate high-exposure zones into air-conditioned public cooling centers immediately.",
            "civic_action": "MUNICIPAL CODE RED: State of Emergency. Full hospital surge capacity activated. Peak grid load protections."
        }
    }

    cmd = dict(instructions.get(tier, instructions[4]))

    if overnight_cooling_failed:
        cmd["overnight_warning"] = (
            "CRITICAL: Lack of overnight recovery detected (night temp did not drop below 26°C). "
            "Accumulated physiological cardiac strain is high. Hydrate before sleep and sleep in ventilated rooms."
        )

    # Persona-specific operational tip
    if persona == "delivery":
        cmd["persona_tip"] = "Remove heavy riding jackets during traffic stops. Seek shade between parcel pickups. Hydrate at every transit hub."
    elif persona == "construction":
        cmd["persona_tip"] = "Enforce buddy system for signs of delirium/heat stroke. Avoid unshaded metallic scaffolding between 12:00-15:00."
    elif persona == "agriculture":
        cmd["persona_tip"] = "Conclude field plowing and spraying before 10:30 AM. Move livestock to covered sheds with damp floor."
    elif persona == "elderly":
        cmd["persona_tip"] = "Stay in the coolest room of the house. Wet cloth on wrists/neck if AC is unavailable. Check blood pressure frequently."

    return cmd


def calculate_mortality_and_health_risk(
    wbgt_c: float,
    heat_index_c: float,
    nighttime_min_c: float,
    persona: str = "delivery",
    elderly_density_pct: float = 12.5,
    outdoor_worker_pct: float = 28.0,
    peak_day_wbgt: Optional[float] = None
) -> Dict[str, Any]:
    """
    Computes automated Mortality Risk Index and Hospital Emergency Surge projections
    based on biometeorological stress (WBGT, NOAA HI), lack of overnight cooling,
    and demographic exposure factors (Lancet Planetary Health & Ahmedabad HAP models).
    """
    # Baseline nocturnal cardiac & cellular stress when night temp fails to cool below 26°C
    night_failure_baseline = 18.5 if nighttime_min_c >= 26.0 else 0.0

    # Effective thermal strain accounts for daytime peak exposure as well as current level
    effective_wbgt = max(wbgt_c, peak_day_wbgt or wbgt_c)
    thermal_excess = max(0.0, effective_wbgt - 27.0)

    # Base excess mortality multiplier
    base_mortality_spike = night_failure_baseline + (thermal_excess * 9.2)

    # Overnight cooling failure multiplier (+35% cumulative nocturnal cardiac load)
    nocturnal_multiplier = 1.35 if nighttime_min_c >= 26.0 else 1.0

    # Demographic vulnerability weighting (elderly and outdoor informal workers)
    demo_weight = (elderly_density_pct / 10.0) * 0.55 + (outdoor_worker_pct / 20.0) * 0.45
    demo_multiplier = max(0.8, min(demo_weight, 1.8))

    projected_excess_mortality = round(min(120.0, base_mortality_spike * nocturnal_multiplier * demo_multiplier), 1)

    # Hospitalization / Emergency Room admission surge (exceeds mortality by factor of ~1.4 - 1.8)
    hospital_surge_pct = round(min(175.0, projected_excess_mortality * 1.45 + (thermal_excess * 4.2)), 1)

    # Scaled index from 0 to 100
    mortality_risk_index = round(min(100.0, (projected_excess_mortality / 80.0) * 100.0), 1)

    # Clinical and surge categorization
    if mortality_risk_index < 20.0:
        risk_level = "Baseline (Normal Health Load)"
        risk_color = "#10b981"
        hospital_status = "Normal ER Capacity"
        icu_recommendation = "Standard operating medical protocols. Routine public hydration."
    elif mortality_risk_index < 40.0:
        risk_level = "Elevated (+10-25% Excess Risk)"
        risk_color = "#eab308"
        hospital_status = "Moderate Heat Casualty Intake (+20-35%)"
        icu_recommendation = "Pre-stock Oral Rehydration Salts (ORS) & ice-water immersion sheets at PHCs."
    elif mortality_risk_index < 65.0:
        risk_level = "Severe (+25-50% Excess Mortality Spike)"
        risk_color = "#f97316"
        hospital_status = "High Casualty Surge (ER Strain +35-65%)"
        icu_recommendation = "Reserve 20% casualty ward beds for heat stroke; pre-chill intravenous saline."
    else:
        risk_level = "Critical Threat (>50% Excess Mortality Spike)"
        risk_color = "#ef4444"
        hospital_status = "CRITICAL CODE RED SURGE (>65% ER Spike)"
        icu_recommendation = "Emergency disaster protocol: mobilize extra triage shifts, deploy mobile misting ambulances."

    clinical_threats = []
    if wbgt_c >= 29.5:
        clinical_threats.append("Exertional Heat Exhaustion & Rhabdomyolysis")
    if nighttime_min_c >= 26.0:
        clinical_threats.append("Nocturnal Cardiovascular Collapse & Arrhythmia")
    if heat_index_c >= 40.0:
        clinical_threats.append("Acute Kidney Injury (AKI) & Hyponatremia")
    if wbgt_c >= 32.5:
        clinical_threats.append("Hyperpyrexia & Multi-Organ Failure (Heat Stroke)")

    if not clinical_threats:
        clinical_threats.append("Mild Dehydration & Heat Fatigue")

    return {
        "mortality_risk_index": mortality_risk_index,
        "projected_excess_mortality_pct": projected_excess_mortality,
        "hospital_surge_pct": hospital_surge_pct,
        "risk_level": risk_level,
        "risk_color": risk_color,
        "hospital_status": hospital_status,
        "icu_recommendation": icu_recommendation,
        "clinical_threats": clinical_threats,
        "demographics_factored": {
            "elderly_density_pct": elderly_density_pct,
            "outdoor_worker_pct": outdoor_worker_pct,
            "vulnerability_multiplier": round(demo_multiplier, 2)
        }
    }

