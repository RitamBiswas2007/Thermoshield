import sys
import os

# Add paths
root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
backend_dir = os.path.join(root_dir, "backend")
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

from biometeorology import (
    calculate_wbgt,
    calculate_heat_index,
    calculate_utci_approx,
    evaluate_nws_tier
)
from realtime_service import PRESET_CITIES, search_location


def test_biometeorology_calculations():
    # Test WBGT calculation
    wbgt_res = calculate_wbgt(
        temperature_c=38.0,
        relative_humidity=65.0,
        solar_radiation=800.0,
        wind_speed_10m=2.5,
        is_outdoor=True
    )
    assert "wbgt" in wbgt_res
    assert "wet_bulb_c" in wbgt_res
    assert wbgt_res["wbgt"] > 25.0

    # Test Heat Index
    hi = calculate_heat_index(38.0, 60.0)
    assert hi > 38.0

    # Test UTCI approximation
    utci = calculate_utci_approx(38.0, 60.0, 2.0, 600.0)
    assert utci > 30.0

    # Test NWS Tier evaluation with overnight cooling deficit (night min >= 26°C)
    tier_info = evaluate_nws_tier(wbgt=32.0, nighttime_min_c=28.5, persona="delivery")
    assert "tier" in tier_info
    assert "tier_escalated" in tier_info
    assert tier_info["tier_escalated"] is True
    assert tier_info["tier"] >= 3
    print("All biometeorological calculation tests passed!")


def test_presets_and_search():
    assert "ahmedabad" in PRESET_CITIES
    assert "delhi" in PRESET_CITIES
    assert "kolkata" in PRESET_CITIES

    results = search_location("Ahmedabad")
    if results:
        assert "latitude" in results[0] or "lat" in results[0]
    print("Preset and geocoding tests passed!")


if __name__ == "__main__":
    test_biometeorology_calculations()
    test_presets_and_search()
    print("All tests passed successfully!")
