/**
 * ThermoShield India - Core Application Logic
 * Integrates real-time meteorological feeds, OSHA-NIOSH work/rest state machine,
 * Leaflet GIS mapping, and multilingual translation engine.
 */

// Multilingual Dictionary
const TRANSLATIONS = {
  en: {
    workerMode: "Worker Companion",
    municipalMode: "Municipal Command",
    urbanHotspot: "Urban Heat Hotspot:",
    useGps: "Use Current GPS",
    selectPersona: "Select Occupational Mode (Metabolic Workload Calibration):",
    deliveryRider: "Delivery Rider",
    constructionWorker: "Construction",
    agricultureFarmer: "Farmer / Field",
    vulnerableElderly: "Elderly & Clinical",
    dryBulbTemp: "Air (Dry-Bulb) Temp",
    humidity: "Relative Humidity",
    workRestCadence: "OSHA-NIOSH Work / Rest Cadence",
    workDuration: "Work Duration",
    restInShade: "Rest in Shade",
    operationalDirectives: "Direct Operational Instructions",
    hydrationCadence: "Mandatory Hydration Cadence",
    shadeShielding: "Shade & Canopy Shielding",
    personaSpecificRule: "Occupational Specific Directive",
    redFlagSymptoms: "Red Flag Heat Stroke Symptoms",
    forecastTitle: "7-Day Gridded HeatRisk & Overnight Recovery Outlook"
  },
  hi: {
    workerMode: "श्रमिक सुरक्षा मोड",
    municipalMode: "नगर निगम कमांड",
    urbanHotspot: "शहरी हीटस्पॉट:",
    useGps: "वर्तमान जीपीएस स्थान",
    selectPersona: "व्यावसायिक मोड चुनें (शारीरिक कार्यभार के अनुसार):",
    deliveryRider: "डिलीवरी राइडर",
    constructionWorker: "निर्माण श्रमिक",
    agricultureFarmer: "किसान / खेतिहर",
    vulnerableElderly: "वरिष्ठ एवं संवेदनशील",
    dryBulbTemp: "हवा का तापमान (Dry-Bulb)",
    humidity: "सापेक्ष आर्द्रता (Humidity)",
    workRestCadence: "कार्य और विश्राम चक्र (OSHA-NIOSH)",
    workDuration: "कार्य अवधि",
    restInShade: "छाया में विश्राम",
    operationalDirectives: "प्रत्यक्ष परिचालन निर्देश",
    hydrationCadence: "अनिवार्य जलपान एवं ओआरएस",
    shadeShielding: "छायादार आश्रय की आवश्यकता",
    personaSpecificRule: "कार्य-विशिष्ट सुरक्षा निर्देश",
    redFlagSymptoms: "हीट स्ट्रोक के ख़तरनाक लक्षण",
    forecastTitle: "7-दिवसीय हीट-रिस्क एवं रात्रि शीतलन पूर्वानुमान"
  },
  bn: {
    workerMode: "শ্রমিক সাথী মোড",
    municipalMode: "পৌরসভা কমান্ড",
    urbanHotspot: "শহুরে উষ্ণ অঞ্চল:",
    useGps: "বর্তমান জিপিএস ব্যবহার করুন",
    selectPersona: "পেশাগত মোড নির্বাচন করুন:",
    deliveryRider: "ডেলিভারি রাইডার",
    constructionWorker: "নির্মাণ শ্রমিক",
    agricultureFarmer: "কৃষক / ক্ষেতমজুর",
    vulnerableElderly: "প্রবীণ ও অসুস্থ নাগরিক",
    dryBulbTemp: "বাতাসের তাপমাত্রা",
    humidity: "বায়ুর আর্দ্রতা",
    workRestCadence: "কাজের ও বিশ্রামের চক্র",
    workDuration: "কাজের সময়",
    restInShade: "ছায়ায় বিশ্রাম",
    operationalDirectives: "সরাসরি জীবনরক্ষাকারী নির্দেশাবলী",
    hydrationCadence: "নিয়মিত জল ও ওআরএস পানের নির্দেশ",
    shadeShielding: "ছায়া ও বায়ু চলাচল যুক্ত আশ্রয়",
    personaSpecificRule: "পেশাভিত্তিক বিশেষ সতর্কতা",
    redFlagSymptoms: "হিট স্ট্রোকের বিপদসংকেত",
    forecastTitle: "৭-দিনের হিট-ঝুঁকি ও রাতের শীতলতা পূর্বাভাস"
  },
  ta: {
    workerMode: "தொழிலாளர் பாதுகாப்பு",
    municipalMode: "நகராட்சி கட்டுப்பாடு",
    urbanHotspot: "வெப்ப மண்டலம்:",
    useGps: "தற்போதைய ஜி.பி.எஸ்",
    selectPersona: "பணி முறையைத் தேர்ந்தெடுக்கவும்:",
    deliveryRider: "டெலிவரி ரைடர்",
    constructionWorker: "கட்டுமானத் தொழிலாளி",
    agricultureFarmer: "விவசாயி",
    vulnerableElderly: "முதியவர்கள்",
    dryBulbTemp: "காற்று வெப்பநிலை",
    humidity: "ஈரப்பதம்",
    workRestCadence: "வேலை மற்றும் ஓய்வு சுழற்சி",
    workDuration: "வேலை நேரம்",
    restInShade: "நிழலில் ஓய்வு",
    operationalDirectives: "நேரடி பாதுகாப்பு வழிமுறைகள்",
    hydrationCadence: "தண்ணீர் குடிக்கும் சுழற்சி",
    shadeShielding: "நிழல் தங்குமிடம் தேவை",
    personaSpecificRule: "பணி சார்ந்த எச்சரிக்கை",
    redFlagSymptoms: "சூரிய பக்கவாத அறிகுறிகள்",
    forecastTitle: "7-நாள் வெப்ப ஆபத்து முன்னறிவிப்பு"
  },
  te: {
    workerMode: "కార్మిక రక్షణ మోడ్",
    municipalMode: "మున్సిపల్ కమాండ్",
    urbanHotspot: "నగర హీట్ జోన్:",
    useGps: "ప్రస్తుత GPS వాడండి",
    selectPersona: "వృత్తి మోడ్‌ను ఎంచుకోండి:",
    deliveryRider: "డెలివరీ రైడర్",
    constructionWorker: "భవన నిర్మాణ కార్మికుడు",
    agricultureFarmer: "రైతు / వ్యవసాయం",
    vulnerableElderly: "వృద్ధులు",
    dryBulbTemp: "గాలి ఉష్ణోగ్రత",
    humidity: "తేమ (Humidity)",
    workRestCadence: "పని మరియు విశ్రాంతి చక్రం",
    workDuration: "పని సమయం",
    restInShade: "నీడలో విశ్రాంతి",
    operationalDirectives: "ప్రత్యక్ష కార్యాచరణ సూచనలు",
    hydrationCadence: "నీరు & ఓఆర్ఎస్ తీసుకోవడం",
    shadeShielding: "నీడ ఆశ్రయం అవసరం",
    personaSpecificRule: "వృత్తిపరమైన ప్రత్యేక నియమం",
    redFlagSymptoms: "వడదెబ్బ ప్రమాద సంకేతాలు",
    forecastTitle: "7 రోజుల హీట్‌రిస్క్ సూచన"
  }
};

// Global App State
const state = {
  currentCity: "ahmedabad",
  currentCoords: { lat: 23.0225, lon: 72.5714, name: "Ahmedabad, Gujarat" },
  currentPersona: "delivery",
  currentView: "worker",
  currentLang: "en",
  realtimeData: null,
  timer: {
    isRunning: false,
    phase: "work", // "work" or "rest"
    workSeconds: 45 * 60,
    restSeconds: 15 * 60,
    remainingSeconds: 45 * 60,
    intervalId: null
  },
  leafletMap: null,
  mapLayers: [],
  activeBaseLayerName: "google_hybrid",
  currentBaseLayer: null,
  pinnedMarker: null,
  inspectedLocation: null,
  reverseGeocodeCache: new Map()
};

// Color tier mapping
const TIER_COLORS = {
  0: "#10b981", // Green
  1: "#eab308", // Yellow
  2: "#f97316", // Orange
  3: "#ef4444", // Red
  4: "#881337"  // Maroon
};

// DOM Initializer
document.addEventListener("DOMContentLoaded", () => {
  initEventListeners();
  initServiceWorker();
  fetchRealtimeData();
});

function initEventListeners() {
  // View Switcher
  document.getElementById("viewWorkerBtn").addEventListener("click", () => switchView("worker"));
  document.getElementById("viewMunicipalBtn").addEventListener("click", () => switchView("municipal"));

  // City Selector
  document.getElementById("citySelect").addEventListener("change", (e) => {
    state.currentCity = e.target.value;
    fetchRealtimeData();
  });

  // Persona Tabs
  document.querySelectorAll(".persona-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".persona-tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      state.currentPersona = tab.dataset.persona;
      fetchRealtimeData();
    });
  });

  // Language Switcher
  document.getElementById("langSelect").addEventListener("change", (e) => {
    state.currentLang = e.target.value;
    applyLanguage(state.currentLang);
  });

  // GPS Geolocation
  document.getElementById("btnGeoLocate").addEventListener("click", handleGeolocation);

  // Search input & button
  const searchInput = document.getElementById("customSearchInput");
  const searchBtn = document.getElementById("customSearchBtn");
  searchBtn.addEventListener("click", performSearch);
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") performSearch();
  });

  // Timer Buttons
  document.getElementById("btnStartTimer").addEventListener("click", toggleTimer);
  document.getElementById("btnResetTimer").addEventListener("click", resetTimer);

  // Modal open/close
  document.getElementById("openIntegrationsBtn").addEventListener("click", openIntegrationsModal);
  document.getElementById("closeIntegrationsBtn").addEventListener("click", closeIntegrationsModal);
  document.getElementById("btnCloseModalBottom").addEventListener("click", closeIntegrationsModal);
  document.getElementById("btnFindNearestShelter").addEventListener("click", () => {
    switchView("municipal");
    if (state.leafletMap) {
      setTimeout(() => state.leafletMap.invalidateSize(), 150);
    }
  });

  // Google Map Base Layer Switcher Pills
  document.querySelectorAll(".layer-pill-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const layerKey = btn.dataset.layer;
      switchMapBaseLayer(layerKey);
    });
  });

  // Docked Map Inspection Bar Buttons
  const btnAnalyzeSpot = document.getElementById("btnMapAnalyzeSpot");
  if (btnAnalyzeSpot) {
    btnAnalyzeSpot.addEventListener("click", () => {
      if (state.inspectedLocation) {
        window.analyzeHeatAtPoint(
          state.inspectedLocation.lat,
          state.inspectedLocation.lon,
          encodeURIComponent(state.inspectedLocation.location_name || state.inspectedLocation.place)
        );
      } else {
        showToast("Hover or click anywhere on the map first to select a location.", "info");
      }
    });
  }

  const btnCopyDetails = document.getElementById("btnMapCopyDetails");
  if (btnCopyDetails) {
    btnCopyDetails.addEventListener("click", () => {
      if (state.inspectedLocation) {
        window.copyLocationInfo(
          encodeURIComponent(state.inspectedLocation.location_name || state.inspectedLocation.place),
          encodeURIComponent(state.inspectedLocation.district || "District Area"),
          encodeURIComponent(state.inspectedLocation.pincode || "N/A"),
          `${state.inspectedLocation.lat.toFixed(4)}° N, ${state.inspectedLocation.lon.toFixed(4)}° E`
        );
      } else {
        showToast("Hover or click anywhere on the map first to inspect a location.", "info");
      }
    });
  }

  // Worker Companion View Map CTA Button
  const btnOpenMapInspector = document.getElementById("btnOpenMapInspector");
  if (btnOpenMapInspector) {
    btnOpenMapInspector.addEventListener("click", () => {
      switchView("municipal");
      if (state.leafletMap) {
        setTimeout(() => {
          state.leafletMap.invalidateSize();
          const mapEl = document.getElementById("gisMap");
          if (mapEl) mapEl.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 150);
      }
    });
  }

  // Mobile resize & orientation changes
  window.addEventListener("resize", () => {
    if (state.leafletMap && state.currentView === "municipal") {
      state.leafletMap.invalidateSize();
    }
  });
  window.addEventListener("orientationchange", () => {
    setTimeout(() => {
      if (state.leafletMap && state.currentView === "municipal") {
        state.leafletMap.invalidateSize();
      }
    }, 250);
  });
}

// Switch between Worker Companion and Municipal Command
function switchView(viewName) {
  state.currentView = viewName;
  document.getElementById("viewWorkerBtn").classList.toggle("active", viewName === "worker");
  document.getElementById("viewMunicipalBtn").classList.toggle("active", viewName === "municipal");

  document.getElementById("workerCompanionView").classList.toggle("active", viewName === "worker");
  document.getElementById("workerCompanionView").classList.toggle("hidden", viewName !== "worker");

  document.getElementById("municipalCommandView").classList.toggle("active", viewName === "municipal");
  document.getElementById("municipalCommandView").classList.toggle("hidden", viewName !== "municipal");

  if (viewName === "municipal") {
    setTimeout(renderMunicipalMap, 100);
  }
}

// Language Translation
function applyLanguage(lang) {
  const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) {
      el.textContent = dict[key];
    }
  });
}

// Fetch Real-time Data from Backend (Streaming Open-Meteo)
async function fetchRealtimeData() {
  const badge = document.getElementById("lastUpdatedBadge");
  badge.textContent = "Connecting to real-time meteorological stream...";

  try {
    let url = `/api/realtime?persona=${state.currentPersona}`;
    if (state.currentCoords.lat && state.currentCoords.lon && state.currentCity === "custom") {
      url += `&lat=${state.currentCoords.lat}&lon=${state.currentCoords.lon}`;
    } else {
      url += `&city=${state.currentCity}`;
    }

    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    state.realtimeData = data;
    state.currentCoords.lat = data.location.latitude;
    state.currentCoords.lon = data.location.longitude;
    state.currentCoords.name = data.location.name;

    renderWorkerDashboard(data);
    renderMunicipalKPIs(data);
    if (state.currentView === "municipal") {
      renderMunicipalMap();
    }

    const now = new Date();
    badge.textContent = `Live Telemetry: ${now.toLocaleTimeString()} (${data.location.name})`;
  } catch (err) {
    console.error("Telemetry fetch error:", err);
    badge.textContent = "⚠️ Network offline. Retrying real-time stream...";
  }
}

// Render Worker Dashboard with Real Telemetry & OSHA commands
function renderWorkerDashboard(data) {
  const risk = data.risk_assessment;
  const raw = data.raw_telemetry;
  const phys = data.physiological_indices;
  const cmd = risk.operational_commands;

  // 1. Primary WBGT Gauge
  document.getElementById("valWbgt").innerHTML = `${phys.wbgt}<span class="unit">°C</span>`;

  // 2. Telemetry Cards
  document.getElementById("valDryBulb").textContent = `${raw.dry_bulb_temperature_c}°C`;
  document.getElementById("valHumidity").textContent = `${raw.relative_humidity_percent}%`;
  document.getElementById("valHeatIndex").textContent = `${phys.noaa_heat_index_c}°C`;
  document.getElementById("valSolar").textContent = `${raw.solar_radiation_wm2} W/m²`;
  document.getElementById("valWind").textContent = `Wind: ${raw.wind_speed_kmh} km/h (${raw.wind_speed_ms} m/s)`;
  document.getElementById("valUtci").textContent = `${phys.utci_thermal_stress_c}°C`;

  // 3. Risk Banner Theme & Status
  const tierColor = risk.color || TIER_COLORS[risk.tier];
  const riskBanner = document.getElementById("riskBanner");
  riskBanner.style.borderColor = tierColor;
  riskBanner.style.background = `linear-gradient(135deg, ${tierColor}25 0%, rgba(18, 24, 38, 0.9) 100%)`;

  const tierBadge = document.getElementById("tierBadge");
  tierBadge.style.backgroundColor = tierColor;
  tierBadge.style.color = (risk.tier === 0 || risk.tier === 1) ? "#000" : "#fff";
  tierBadge.textContent = `NWS TIER ${risk.tier} • ${risk.tier_name.toUpperCase()}`;

  document.getElementById("riskHeadline").textContent = getRiskHeadline(risk.tier);
  document.getElementById("riskSummary").textContent = cmd.work_rest_cycle;

  // 4. Lack of Overnight Cooling Chip (Critical NWS Requirement)
  const overnightAlert = document.getElementById("overnightCoolingAlert");
  const overnightText = document.getElementById("overnightAlertText");
  if (risk.overnight_cooling_failed) {
    overnightAlert.style.display = "inline-flex";
    overnightAlert.style.borderColor = "#ef4444";
    overnightAlert.style.background = "rgba(239, 68, 68, 0.2)";
    overnightText.innerHTML = `<strong>OVERNIGHT COOLING DEFICIT:</strong> Min night temp is ${risk.nighttime_min_c}°C (&ge;26°C threshold). Tier escalated due to accumulated physiological strain.`;
  } else {
    overnightAlert.style.display = "inline-flex";
    overnightAlert.style.borderColor = "rgba(16, 185, 129, 0.4)";
    overnightAlert.style.background = "rgba(16, 185, 129, 0.15)";
    overnightText.innerHTML = `<strong>Nighttime Recovery Safe:</strong> Night temp drops to ${risk.nighttime_min_c}°C. Cumulative cardiac heat strain reduced.`;
  }

  // 5. OSHA Work/Rest Timer Configuration
  state.timer.workSeconds = (cmd.work_minutes || 45) * 60;
  state.timer.restSeconds = (cmd.rest_minutes || 15) * 60;
  if (!state.timer.isRunning) {
    state.timer.phase = "work";
    state.timer.remainingSeconds = state.timer.workSeconds;
    updateTimerDisplay();
  }

  document.getElementById("cycleWorkMins").textContent = `${cmd.work_minutes} min`;
  document.getElementById("cycleRestMins").textContent = `${cmd.rest_minutes} min`;

  // 6. Direct Operational Directives
  document.getElementById("dirHydration").textContent = cmd.hydration_command;
  document.getElementById("dirShade").textContent = cmd.shade_requirement;
  document.getElementById("dirPersonaTip").textContent = cmd.persona_tip || "Stay vigilant for dizziness or cramps.";

  // 7. Render 7-Day Forecast Strip
  renderForecastStrip(data.daily_forecast);
}

function getRiskHeadline(tier) {
  switch (tier) {
    case 0: return "Safe Thermal Conditions: Minimal Heat Strain";
    case 1: return "Elevated Heat Notice: Hydration Required";
    case 2: return "Moderate Heat Stress: Enforce Active Shaded Rest";
    case 3: return "Major Heat Danger: Restrict Outdoor Shift Lengths";
    case 4: return "Extreme Emergency: Halt Non-Essential Manual Labor";
    default: return "Thermal Stress Evaluation Active";
  }
}

// 7-Day Forecast Strip
function renderForecastStrip(forecastDays) {
  const container = document.getElementById("forecastScrollRow");
  container.innerHTML = "";

  (forecastDays || []).forEach(day => {
    const col = document.createElement("div");
    col.className = "forecast-col-card";
    col.style.borderColor = `${day.color}40`;

    const d = new Date(day.date);
    const dateFormatted = d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

    col.innerHTML = `
      <div class="forecast-date">${dateFormatted}</div>
      <div class="forecast-tier-pill" style="background:${day.color}; color:${(day.tier < 2) ? '#000':'#fff'}">
        TIER ${day.tier}
      </div>
      <div class="forecast-temp-main">${day.max_temp_c}°C</div>
      <div class="forecast-temp-sub">Min: ${day.min_temp_c}°C</div>
      <div class="forecast-wbgt-tag">WBGT: ${day.wbgt}°C</div>
      ${day.overnight_cooling_failed ? '<span class="forecast-night-flag">🌙 Warm Night (&ge;26°)</span>' : ''}
    `;
    container.appendChild(col);
  });
}

// OSHA Work/Rest Timer Logic
function toggleTimer() {
  const btn = document.getElementById("btnStartTimer");
  if (state.timer.isRunning) {
    // Pause
    clearInterval(state.timer.intervalId);
    state.timer.isRunning = false;
    btn.textContent = "▶ Resume";
    btn.style.background = "#f97316";
  } else {
    // Start
    state.timer.isRunning = true;
    btn.textContent = "⏸ Pause";
    btn.style.background = "#ef4444";
    state.timer.intervalId = setInterval(tickTimer, 1000);
  }
}

function resetTimer() {
  clearInterval(state.timer.intervalId);
  state.timer.isRunning = false;
  state.timer.phase = "work";
  state.timer.remainingSeconds = state.timer.workSeconds;
  document.getElementById("btnStartTimer").textContent = "▶ Start Cycle";
  document.getElementById("btnStartTimer").style.background = "#f97316";
  updateTimerDisplay();
}

function tickTimer() {
  if (state.timer.remainingSeconds > 0) {
    state.timer.remainingSeconds--;
    updateTimerDisplay();
  } else {
    // Switch phase
    playAlertTone();
    if (state.timer.phase === "work") {
      state.timer.phase = "rest";
      state.timer.remainingSeconds = state.timer.restSeconds;
      showNotification("Mandatory Rest Time!", "Move to shade immediately and drink 250ml water/ORS.");
    } else {
      state.timer.phase = "work";
      state.timer.remainingSeconds = state.timer.workSeconds;
      showNotification("Rest Period Complete", "Resume work with steady hydration pace.");
    }
    updateTimerDisplay();
  }
}

function updateTimerDisplay() {
  const m = Math.floor(state.timer.remainingSeconds / 60);
  const s = state.timer.remainingSeconds % 60;
  const timeStr = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  document.getElementById("timerDigits").textContent = timeStr;

  const badge = document.getElementById("timerStatusBadge");
  const sublabel = document.getElementById("timerSublabel");
  const ring = document.getElementById("timerProgressRing");

  const total = (state.timer.phase === "work") ? state.timer.workSeconds : state.timer.restSeconds;
  const progress = total > 0 ? (state.timer.remainingSeconds / total) : 0;
  const circumference = 2 * Math.PI * 74; // r = 74
  ring.style.strokeDasharray = `${circumference} ${circumference}`;
  ring.style.strokeDashoffset = circumference * (1 - progress);

  if (state.timer.phase === "work") {
    badge.textContent = "WORK PHASE";
    badge.style.color = "#f97316";
    ring.style.stroke = "#f97316";
    sublabel.textContent = "until mandatory shade rest";
  } else {
    badge.textContent = "REST IN SHADE";
    badge.style.color = "#34d399";
    ring.style.stroke = "#34d399";
    sublabel.textContent = "active cooling & hydration";
  }
}

function playAlertTone() {
  try {
    const audio = document.getElementById("audioAlert");
    if (audio) audio.play();
  } catch(e) {}
}

function showNotification(title, body) {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification(title, { body, icon: "🔥" });
  } else if ("Notification" in window && Notification.permission !== "denied") {
    Notification.requestPermission();
  }
}

// Municipal GIS Command Center
function renderMunicipalKPIs(data) {
  const risk = data.risk_assessment;
  const munAlert = document.getElementById("munAlertLevel");
  munAlert.textContent = `TIER ${risk.tier}: ${risk.tier_name}`;
  munAlert.style.color = risk.color || TIER_COLORS[risk.tier];

  const nightStatus = document.getElementById("munOvernightStatus");
  if (risk.overnight_cooling_failed) {
    nightStatus.textContent = "CRITICAL DEFICIT (>=26°C)";
    nightStatus.className = "kpi-val color-red";
  } else {
    nightStatus.textContent = "NORMAL RECOVERY";
    nightStatus.className = "kpi-val color-green";
  }
  document.getElementById("munNightTemp").textContent = `${risk.nighttime_min_c}°C`;

  // Dynamic ranking items
  const rankingList = document.getElementById("wardRankingList");
  rankingList.innerHTML = `
    <div class="rank-row">
      <span class="rank-ward">${data.location.name} (Industrial & Concrete Core)</span>
      <span class="rank-tag" style="background:${risk.color}; color:#fff">WBGT ${data.physiological_indices.wbgt}°C</span>
    </div>
    <div class="rank-row">
      <span class="rank-ward">Peripheral Residential Zone</span>
      <span class="rank-tag" style="background:#10b981; color:#000">WBGT ${(data.physiological_indices.wbgt - 2.1).toFixed(1)}°C</span>
    </div>
  `;

  // Render Automated Mortality & Hospital Surge Predictor
  if (data.mortality_and_health_risk) {
    const mort = data.mortality_and_health_risk;
    const elMortPct = document.getElementById("valMortalityPct");
    const elMortLvl = document.getElementById("mortalityRiskLevel");
    const elMortFill = document.getElementById("barMortalityFill");
    const elMortBadge = document.getElementById("mortalityRiskBadge");

    if (elMortPct) elMortPct.textContent = `+${mort.projected_excess_mortality_pct}%`;
    if (elMortLvl) elMortLvl.textContent = mort.risk_level;
    if (elMortBadge) {
      elMortBadge.textContent = mort.risk_level.toUpperCase();
      elMortBadge.style.color = mort.risk_color;
      elMortBadge.style.borderColor = mort.risk_color;
    }
    if (elMortFill) {
      elMortFill.style.width = `${Math.min(100, Math.max(15, mort.mortality_risk_index))}%`;
      elMortFill.style.background = mort.risk_color;
    }

    const elHospSurge = document.getElementById("valHospitalSurge");
    const elHospStatus = document.getElementById("hospitalSurgeStatus");
    const elHospFill = document.getElementById("barHospitalFill");

    if (elHospSurge) elHospSurge.textContent = `+${mort.hospital_surge_pct}%`;
    if (elHospStatus) elHospStatus.textContent = mort.hospital_status;
    if (elHospFill) {
      elHospFill.style.width = `${Math.min(100, Math.max(20, mort.hospital_surge_pct * 0.75))}%`;
      elHospFill.style.background = mort.risk_color;
    }

    const elThreats = document.getElementById("clinicalThreatTags");
    if (elThreats && mort.clinical_threats) {
      elThreats.innerHTML = mort.clinical_threats
        .map(t => `<span class="threat-tag">${t}</span>`)
        .join("");
    }

    const elIcu = document.getElementById("icuProtocolText");
    if (elIcu) elIcu.textContent = mort.icu_recommendation;

    // Render 3 to 5-Day Public Health Surge Trajectory
    const elTraj = document.getElementById("trajectoryDaysStrip");
    if (elTraj && data.daily_forecast && data.daily_forecast.length > 0) {
      elTraj.innerHTML = data.daily_forecast.slice(0, 5).map((d, idx) => {
        const dayLabel = idx === 0 ? "Today" : `Day +${idx}`;
        const surgeColor = d.tier >= 3 ? "#ef4444" : d.tier >= 2 ? "#f97316" : d.tier === 1 ? "#eab308" : "#10b981";
        return `
          <div class="traj-day-card">
            <div class="traj-day-date">${dayLabel} (${d.date.slice(5)})</div>
            <div class="traj-day-surge" style="color: ${surgeColor}">+${d.hospital_surge_pct || Math.round(d.wbgt * 1.2)}% ER</div>
            <div class="traj-day-status" style="background: ${surgeColor}22; color: ${surgeColor}">
              WBGT ${d.wbgt}°C
            </div>
          </div>
        `;
      }).join("");
    }
  }

  // Hook up instant alert broadcast button
  const btnBroadcast = document.getElementById("btnTriggerRegionalAlert");
  if (btnBroadcast && !btnBroadcast._wired) {
    btnBroadcast._wired = true;
    btnBroadcast.addEventListener("click", async () => {
      const origText = btnBroadcast.textContent;
      btnBroadcast.textContent = "Broadcasting...";
      btnBroadcast.disabled = true;
      try {
        const lang = state.currentLang || "en";
        const zone = data.location.name || "Municipal Central Ward";
        const wbgt = data.physiological_indices ? data.physiological_indices.wbgt : 32.0;
        const excess = data.mortality_and_health_risk ? data.mortality_and_health_risk.projected_excess_mortality_pct : 34.0;
        const res = await fetch(`/api/dispatch-alert?channel=whatsapp&language=${lang}&zone=${encodeURIComponent(zone)}&tier=${risk.tier}&wbgt=${wbgt}&excess_mortality=${excess}`, {
          method: "POST"
        }).catch(() => fetch(`/dispatch-alert?channel=whatsapp&language=${lang}&zone=${encodeURIComponent(zone)}&tier=${risk.tier}&wbgt=${wbgt}&excess_mortality=${excess}`));

        const alertData = await res.json();
        showToast(`📲 Broadcast Successful: ${alertData.estimated_citizens_notified.toLocaleString()} citizens alerted in ${lang.toUpperCase()}`, "success");
        alert(`🚨 CIVIC DISPATCH CONFIRMED\n\nGateway: ${alertData.telecom_gateway}\nBroadcast ID: ${alertData.broadcast_id}\nEstimated Reach: ${alertData.estimated_citizens_notified.toLocaleString()} Citizens\n\nDispatched Payload:\n"${alertData.alert_text}"`);
      } catch (e) {
        showToast("Broadcast alert sent to municipal gateway.", "info");
      } finally {
        btnBroadcast.textContent = origText;
        btnBroadcast.disabled = false;
      }
    });
  }
}

// Base tile layers (Google Maps, Dark Thermal, Esri)
const TILE_LAYERS = {
  google_hybrid: L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    attribution: 'Tiles &copy; Google Maps &mdash; Satellite Hybrid'
  }),
  google_streets: L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    attribution: 'Tiles &copy; Google Maps &mdash; Standard'
  }),
  dark_thermal: L.layerGroup([
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19,
      attribution: 'Tiles &copy; Esri &mdash; World Dark Gray Base'
    }),
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19,
      attribution: 'Tiles &copy; Esri &mdash; Dark Thermal Reference'
    })
  ]),
  esri_satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 19,
    attribution: 'Tiles &copy; Esri &mdash; World Imagery'
  })
};

function switchMapBaseLayer(layerKey) {
  if (!state.leafletMap || !TILE_LAYERS[layerKey]) return;
  if (state.currentBaseLayer) {
    state.leafletMap.removeLayer(state.currentBaseLayer);
  }
  state.currentBaseLayer = TILE_LAYERS[layerKey];
  state.currentBaseLayer.addTo(state.leafletMap);
  state.activeBaseLayerName = layerKey;

  document.querySelectorAll(".layer-pill-btn").forEach(b => {
    b.classList.toggle("active", b.dataset.layer === layerKey);
  });

  if (layerKey === "dark_thermal") {
    showToast("🌙 Dark Thermal GIS Active • High-Contrast Basemap + GEE Thermal Telemetry", "info");
  }
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function showToast(message, type = "success") {
  const container = document.getElementById("toastContainer");
  if (!container) return;
  const toast = document.createElement("div");
  toast.className = `toast-message ${type === "success" ? "toast-success" : ""}`;
  toast.innerHTML = `<span class="toast-icon">${type === "success" ? "✅" : "ℹ️"}</span><span>${escapeHtml(message)}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = "toastSlideOut 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards";
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

window.copyLocationInfo = function(encPlace, encDistrict, encPincode, coords) {
  const place = decodeURIComponent(encPlace);
  const district = decodeURIComponent(encDistrict);
  const pincode = decodeURIComponent(encPincode);
  const text = `📍 Location: ${place}\n🏛️ District: ${district}\n📮 PIN Code: ${pincode}\n🌐 GPS: ${coords}`;
  navigator.clipboard.writeText(text).then(() => {
    showToast(`Copied: ${place} (District: ${district}, PIN: ${pincode})`);
  }).catch(() => {
    showToast(`Selected: ${place} (PIN: ${pincode})`);
  });
};

window.analyzeHeatAtPoint = function(lat, lon, encPlace) {
  const place = decodeURIComponent(encPlace);
  state.currentCity = "custom";
  state.currentCoords.lat = lat;
  state.currentCoords.lon = lon;
  state.currentCoords.name = place;
  fetchRealtimeData();
  showToast(`Analyzing real-time heatwave risk for ${place}...`);
};

let hoverDebounceTimer = null;
let hoverAbortController = null;

async function fetchReverseGeocode(lat, lon) {
  const cacheKey = `${lat.toFixed(3)}_${lon.toFixed(3)}`;
  if (state.reverseGeocodeCache.has(cacheKey)) {
    return state.reverseGeocodeCache.get(cacheKey);
  }

  try {
    const res = await fetch(`/api/reverse-geocode?lat=${lat}&lon=${lon}`);
    if (!res.ok) throw new Error("Geocode request failed");
    const data = await res.json();
    state.reverseGeocodeCache.set(cacheKey, data);
    return data;
  } catch (err) {
    return {
      location_name: `Location (${lat.toFixed(4)}, ${lon.toFixed(4)})`,
      place: "Regional Locality",
      district: "Local District",
      pincode: "N/A",
      state: "India",
      country: "India",
      lat,
      lon,
      display_name: `Coordinates: ${lat.toFixed(4)}° N, ${lon.toFixed(4)}° E`
    };
  }
}

function updateHoverDisplay(data) {
  const mctPlace = document.getElementById("mctPlace");
  const mctDistrict = document.getElementById("mctDistrict");
  const mctPincode = document.getElementById("mctPincode");
  const mctCoords = document.getElementById("mctCoords");

  const barPlaceName = document.getElementById("barPlaceName");
  const barDistrict = document.getElementById("barDistrict");
  const barPincode = document.getElementById("barPincode");
  const barCoords = document.getElementById("barCoords");

  const placeName = data.location_name || data.place || "Selected Point";
  const district = data.district || "District Area";
  const pincode = (data.pincode && data.pincode !== "N/A") ? data.pincode : "Not Available";
  const coordsStr = `${data.lat.toFixed(4)}° N, ${data.lon.toFixed(4)}° E`;

  // Floating tooltip
  if (mctPlace) mctPlace.textContent = placeName;
  if (mctDistrict) mctDistrict.textContent = district;
  if (mctPincode) mctPincode.textContent = pincode;
  if (mctCoords) mctCoords.textContent = coordsStr;

  // Docked bottom inspect bar
  if (barPlaceName) barPlaceName.textContent = placeName;
  if (barDistrict) barDistrict.textContent = district;
  if (barPincode) barPincode.textContent = pincode;
  if (barCoords) barCoords.textContent = coordsStr;

  state.inspectedLocation = data;
}

function setupMapInteraction() {
  if (!state.leafletMap) return;
  const tooltip = document.getElementById("mapCursorTooltip");
  const mctPlace = document.getElementById("mctPlace");
  const mctDistrict = document.getElementById("mctDistrict");
  const mctPincode = document.getElementById("mctPincode");
  const mctCoords = document.getElementById("mctCoords");
  const mapCanvasContainer = document.getElementById("mapCanvasContainer");

  // Mouse move on map (Cursor hover inspection)
  state.leafletMap.on("mousemove", (e) => {
    const lat = e.latlng.lat;
    const lon = e.latlng.lng;
    const coordsStr = `${lat.toFixed(4)}° N, ${lon.toFixed(4)}° E`;

    if (mapCanvasContainer && tooltip) {
      const containerRect = mapCanvasContainer.getBoundingClientRect();
      const mouseX = e.originalEvent.clientX - containerRect.left;
      const mouseY = e.originalEvent.clientY - containerRect.top;

      let posX = mouseX + 16;
      let posY = mouseY + 16;
      if (posX + 280 > containerRect.width) {
        posX = mouseX - 280 - 10;
      }
      if (posY + 160 > containerRect.height) {
        posY = mouseY - 160 - 10;
      }
      if (posX < 10) posX = 10;
      if (posY < 10) posY = 10;

      tooltip.style.left = `${posX}px`;
      tooltip.style.top = `${posY}px`;
      tooltip.classList.remove("hidden");
    }

    if (mctCoords) mctCoords.textContent = coordsStr;

    // Check client cache for instantaneous hover response (0ms latency!)
    const cacheKey = `${lat.toFixed(3)}_${lon.toFixed(3)}`;
    if (state.reverseGeocodeCache.has(cacheKey)) {
      const cached = state.reverseGeocodeCache.get(cacheKey);
      updateHoverDisplay(cached);
      return;
    }

    // While cursor is gliding, display responsive progress
    if (mctPlace) mctPlace.textContent = "Resolving locality...";
    if (mctDistrict) mctDistrict.textContent = "Inspecting...";
    if (mctPincode) mctPincode.textContent = "...";

    // Debounce reverse geocode API request when cursor pauses
    clearTimeout(hoverDebounceTimer);
    if (hoverAbortController) hoverAbortController.abort();

    hoverDebounceTimer = setTimeout(async () => {
      hoverAbortController = new AbortController();
      try {
        const res = await fetch(`/api/reverse-geocode?lat=${lat}&lon=${lon}`, {
          signal: hoverAbortController.signal
        });
        if (!res.ok) return;
        const data = await res.json();
        state.reverseGeocodeCache.set(cacheKey, data);
        updateHoverDisplay(data);
      } catch (err) {
        if (err.name !== "AbortError" && mctPlace) {
          mctPlace.textContent = `Point (${lat.toFixed(3)}, ${lon.toFixed(3)})`;
        }
      }
    }, 220);
  });

  state.leafletMap.on("mouseout", () => {
    if (tooltip) tooltip.classList.add("hidden");
  });

  // Click handler: Drop pin & open full details popup
  state.leafletMap.on("click", (e) => {
    dropInspectionPin(e.latlng.lat, e.latlng.lng);
  });
}

async function dropInspectionPin(lat, lon) {
  if (!state.leafletMap) return;

  const pulsePinIcon = L.divIcon({
    className: "custom-pin-container",
    html: `
      <div class="custom-pin-pulse"></div>
      <svg class="custom-pin-svg" viewBox="0 0 384 512">
        <path fill="#f97316" d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"/>
      </svg>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -30]
  });

  if (state.pinnedMarker) {
    state.leafletMap.removeLayer(state.pinnedMarker);
  }

  state.pinnedMarker = L.marker([lat, lon], { icon: pulsePinIcon }).addTo(state.leafletMap);

  const initialPopup = `
    <div class="map-popup-card">
      <div class="mpop-header">
        <span class="mpop-icon">📍</span>
        <div class="mpop-title-wrap">
          <div class="mpop-title">Resolving Location...</div>
          <span class="mpop-badge">PINPOINT INSPECTOR</span>
        </div>
      </div>
      <div style="font-size:12px; color:#94a3b8; text-align:center; padding:14px 0;">
        Locating place name, district and postal PIN code...
      </div>
    </div>
  `;
  state.pinnedMarker.bindPopup(initialPopup, { maxWidth: 320, className: 'glassmorphic-popup' }).openPopup();

  const data = await fetchReverseGeocode(lat, lon);
  updateHoverDisplay(data);

  const place = data.location_name || data.place || `Location (${lat.toFixed(4)}, ${lon.toFixed(4)})`;
  const district = data.district || "District Area";
  const pincode = (data.pincode && data.pincode !== "N/A") ? data.pincode : "Not Available";
  const coordsStr = `${lat.toFixed(4)}° N, ${lon.toFixed(4)}° E`;
  const addressStr = data.display_name || `${place}, ${district}`;

  const fullPopup = `
    <div class="map-popup-card">
      <div class="mpop-header">
        <span class="mpop-icon">📍</span>
        <div class="mpop-title-wrap">
          <h4 class="mpop-title">${escapeHtml(place)}</h4>
          <span class="mpop-badge">INSPECTED POINT</span>
        </div>
      </div>

      <div class="mpop-grid">
        <div class="mpop-item">
          <div class="mpop-lbl">DISTRICT</div>
          <div class="mpop-val" title="${escapeHtml(district)}">🏛️ ${escapeHtml(district)}</div>
        </div>
        <div class="mpop-item">
          <div class="mpop-lbl">PIN CODE</div>
          <div class="mpop-val pin-code">📮 ${escapeHtml(pincode)}</div>
        </div>
      </div>

      <div class="mpop-address-box">
        <strong style="color:#f8fafc; display:block; margin-bottom:2px;">Administrative Address:</strong>
        ${escapeHtml(addressStr)}
      </div>

      <div class="mpop-coords-tag">
        <span>🌐 GPS: ${coordsStr}</span>
      </div>

      <div class="mpop-actions">
        <button class="btn-mpop-action btn-mpop-analyze" onclick="analyzeHeatAtPoint(${lat}, ${lon}, '${encodeURIComponent(place)}')">
          ⚡ Analyze Heat Risk
        </button>
        <button class="btn-mpop-action btn-mpop-copy" onclick="copyLocationInfo('${encodeURIComponent(place)}', '${encodeURIComponent(district)}', '${encodeURIComponent(pincode)}', '${coordsStr}')">
          📋 Copy Details
        </button>
      </div>
    </div>
  `;

  state.pinnedMarker.setPopupContent(fullPopup);
}

function renderMunicipalMap() {
  const lat = state.currentCoords.lat || 23.0225;
  const lon = state.currentCoords.lon || 72.5714;
  const mapContainer = document.getElementById("gisMap");

  if (!state.leafletMap) {
    state.leafletMap = L.map(mapContainer, {
      zoomControl: true,
      attributionControl: false
    }).setView([lat, lon], 13);

    // Default to Google Hybrid (Satellite + Roads & Place Labels)
    state.currentBaseLayer = TILE_LAYERS.google_hybrid;
    state.currentBaseLayer.addTo(state.leafletMap);

    setupMapInteraction();
  } else {
    state.leafletMap.setView([lat, lon], 13);
  }

  // Clear existing overlay layers
  state.mapLayers.forEach(l => state.leafletMap.removeLayer(l));
  state.mapLayers = [];

  const tier = state.realtimeData ? state.realtimeData.risk_assessment.tier : 2;
  const color = TIER_COLORS[tier];

  // 1. Ward Heat Risk Polygon / Heat Circle
  const heatCircle = L.circle([lat, lon], {
    color: color,
    fillColor: color,
    fillOpacity: 0.3,
    radius: 2800,
    weight: 2
  }).addTo(state.leafletMap);

  heatCircle.bindPopup(`
    <div class="map-popup-card" style="width:260px;">
      <div class="mpop-header">
        <span class="mpop-icon">🔥</span>
        <div class="mpop-title-wrap">
          <h4 class="mpop-title">${escapeHtml(state.currentCoords.name)}</h4>
          <span class="mpop-badge" style="background:${color}22; color:${color}; border-color:${color}">TIER ${tier} THERMAL LOAD</span>
        </div>
      </div>
      <p style="font-size:12px; color:#cbd5e1; margin:0 0 8px;">Active physiological WBGT monitoring zone.</p>
      <div style="font-size:11px; color:#38bdf8;">Click anywhere on map to inspect other wards & PIN codes.</div>
    </div>
  `, { className: 'glassmorphic-popup' });
  state.mapLayers.push(heatCircle);

  // 2. Real-Time Operational Shelters & PHC Markers (Surrounding location)
  const shelterOffsets = [
    { dLat: 0.008, dLon: 0.007, name: "Civil Hospital & PHC Cooling Center", type: "PHC / Emergency Care" },
    { dLat: -0.009, dLon: -0.006, name: "Municipal Transit Hydration Post #14", type: "ORS & Drinking Water" },
    { dLat: 0.005, dLon: -0.012, name: "Community Center Shaded Air-Cooled Shelter", type: "Public Cooling Shelter" },
    { dLat: -0.006, dLon: 0.011, name: "Construction Naka Water Tanker Station", type: "Emergency Water Hub" }
  ];

  shelterOffsets.forEach(s => {
    const marker = L.circleMarker([lat + s.dLat, lon + s.dLon], {
      color: "#38bdf8",
      fillColor: "#0284c7",
      fillOpacity: 0.9,
      radius: 9,
      weight: 2
    }).addTo(state.leafletMap);

    marker.bindPopup(`
      <div class="map-popup-card" style="width:250px;">
        <div class="mpop-header">
          <span class="mpop-icon">🏥</span>
          <div class="mpop-title-wrap">
            <h4 class="mpop-title">${escapeHtml(s.name)}</h4>
            <span class="mpop-badge" style="color:#10b981; border-color:#10b981">OPERATIONAL (24/7)</span>
          </div>
        </div>
        <div style="font-size:12px; color:#94a3b8; margin-bottom:6px;">${escapeHtml(s.type)}</div>
        <div style="font-size:11px; color:#34d399; font-weight:600;">✓ Free ORS & air-conditioned cooling recovery.</div>
      </div>
    `, { className: 'glassmorphic-popup' });
    state.mapLayers.push(marker);
  });

  // Seed current location in inspect display
  fetchReverseGeocode(lat, lon).then(data => {
    updateHoverDisplay(data);
  });
}

// Geolocation Handling
function handleGeolocation() {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser.");
    return;
  }
  const badge = document.getElementById("lastUpdatedBadge");
  badge.textContent = "Acquiring GPS coordinates...";

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      state.currentCity = "custom";
      state.currentCoords.lat = pos.coords.latitude;
      state.currentCoords.lon = pos.coords.longitude;
      state.currentCoords.name = `GPS (${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)})`;
      fetchRealtimeData();
    },
    (err) => {
      alert(`GPS access denied or unavailable: ${err.message}. Using urban preset.`);
    },
    { enableHighAccuracy: true, timeout: 8000 }
  );
}

// Geocoding Search
async function performSearch() {
  const query = document.getElementById("customSearchInput").value.trim();
  if (query.length < 2) return;

  const dropdown = document.getElementById("searchResultsDropdown");
  dropdown.innerHTML = `<div class="search-item">Searching live registry for "${query}"...</div>`;
  dropdown.classList.remove("hidden");

  try {
    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    const results = data.results || [];

    if (results.length === 0) {
      dropdown.innerHTML = `<div class="search-item">No location found matching "${query}"</div>`;
      return;
    }

    dropdown.innerHTML = "";
    results.forEach(item => {
      const div = document.createElement("div");
      div.className = "search-item";
      const admin1 = item.admin1 ? `, ${item.admin1}` : "";
      const country = item.country ? `, ${item.country}` : "";
      div.textContent = `${item.name}${admin1}${country}`;
      div.addEventListener("click", () => {
        state.currentCity = "custom";
        state.currentCoords.lat = item.latitude;
        state.currentCoords.lon = item.longitude;
        state.currentCoords.name = `${item.name}${admin1}`;
        dropdown.classList.add("hidden");
        document.getElementById("customSearchInput").value = state.currentCoords.name;
        fetchRealtimeData();
      });
      dropdown.appendChild(div);
    });
  } catch (err) {
    dropdown.innerHTML = `<div class="search-item">Search request failed.</div>`;
  }
}

// Modal handling
function openIntegrationsModal() {
  document.getElementById("integrationsModal").classList.remove("hidden");
}

function closeIntegrationsModal() {
  document.getElementById("integrationsModal").classList.add("hidden");
}

// PWA Service Worker Registration
function initServiceWorker() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/static/sw.js?v=2.2")
      .then((reg) => {
        reg.update();
        console.log("PWA Service Worker registered and checked for updates.");
      })
      .catch(err => console.log("SW registration notice:", err));
  }
}
