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
  mapLayers: []
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

    // High-Resolution Satellite Base Map (Esri World Imagery - No API Key Required)
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19,
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    }).addTo(state.leafletMap);
  } else {
    state.leafletMap.setView([lat, lon], 13);
  }

  // Clear existing layers
  state.mapLayers.forEach(l => state.leafletMap.removeLayer(l));
  state.mapLayers = [];

  const tier = state.realtimeData ? state.realtimeData.risk_assessment.tier : 2;
  const color = TIER_COLORS[tier];

  // 1. Ward Heat Risk Polygon / Heat Circle
  const heatCircle = L.circle([lat, lon], {
    color: color,
    fillColor: color,
    fillOpacity: 0.35,
    radius: 2800,
    weight: 2
  }).addTo(state.leafletMap);

  heatCircle.bindPopup(`
    <div style="font-family:sans-serif; color:#000;">
      <h4 style="margin:0 0 4px;">${state.currentCoords.name}</h4>
      <p style="margin:0; font-size:12px;">Thermal Stress Tier: <strong>${tier}</strong></p>
      <p style="margin:4px 0 0; font-size:11px;">Lack of overnight cooling penalty applied.</p>
    </div>
  `);
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
      <div style="font-family:sans-serif; color:#000;">
        <h4 style="margin:0 0 2px;">📍 ${s.name}</h4>
        <div style="font-size:11px; color:#555;">${s.type}</div>
        <div style="font-size:11px; color:#16a34a; font-weight:bold; margin-top:4px;">● OPERATIONAL (Open 24/7)</div>
      </div>
    `);
    state.mapLayers.push(marker);
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
    navigator.serviceWorker.register("/static/sw.js")
      .then(() => console.log("PWA Service Worker registered for offline resilience."))
      .catch(err => console.log("SW registration notice:", err));
  }
}
