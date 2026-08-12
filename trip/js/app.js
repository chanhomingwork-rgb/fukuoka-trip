/* global TRIP, TYPE_LABELS, TYPE_COLORS, BOOKING_LABELS, L, enrichTrip, enrichPlace, getDayMapItems, getAllMapItems */

const TRIP_DATA = enrichTrip(TRIP);

const STORAGE_KEY = "fukuoka-trip-v1";

let map;
let markers = [];
let routeLine = null;
let activeDay = 1;
let activePlaceId = null;
let activeSidebarTab = "itinerary";
let searchQuery = "";
let sidebarOpen = false;

const state = loadState();

function loadState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { bookings: {}, visited: {} };
  } catch {
    return { bookings: {}, visited: {} };
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

const iconCache = {};

function typeIcon(type, visited, kind = "primary") {
  const key = `${type}-${visited}-${kind}`;
  if (iconCache[key]) return iconCache[key];
  const color = visited ? "#94a3b8" : TYPE_COLORS[type] || TYPE_COLORS.recommend || "#64748b";
  const scale = kind === "recommend" || kind === "poi" ? 0.72 : 1;
  const w = Math.round(28 * scale);
  const h = Math.round(38 * scale);
  const stroke = kind === "swap" ? `stroke-dasharray="4 2" stroke-width="2.5"` : `stroke-width="2"`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 28 38">
    <path d="M14 0C6.3 0 0 6.3 0 14c0 10.5 14 24 14 24s14-13.5 14-24C28 6.3 21.7 0 14 0z" fill="${color}" stroke="#fff" ${stroke}/>
    <circle cx="14" cy="14" r="6" fill="#fff"/>
  </svg>`;
  iconCache[key] = L.divIcon({
    html: svg,
    className: visited ? "marker-visited" : kind !== "primary" ? `marker-${kind}` : "",
    iconSize: [w, h],
    iconAnchor: [w / 2, h],
    popupAnchor: [0, -h + 2],
  });
  return iconCache[key];
}

function homeIcon() {
  return L.divIcon({
    html: `<svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34">
      <circle cx="17" cy="17" r="15" fill="#059669" stroke="#fff" stroke-width="2"/>
      <text x="17" y="22" text-anchor="middle" fill="#fff" font-size="13" font-weight="700">博</text>
    </svg>`,
    className: "",
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  });
}

function mapsUrl(lat, lng, name) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} ${lat},${lng}`)}`;
}

function addressMapsUrl(address) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

function toast(msg) {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 2200);
}

function initMap() {
  map = L.map("map", { zoomControl: true }).setView([TRIP.meta.baseLat, TRIP.meta.baseLng], 11);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://openstreetmap.org/copyright">OSM</a>',
    maxZoom: 19,
  }).addTo(map);

  L.marker([TRIP.meta.baseLat, TRIP.meta.baseLng], { icon: homeIcon() })
    .addTo(map)
    .bindPopup(`<strong>住宿基地</strong><br>${TRIP.meta.base}<br>全程同一飯店`);

  renderLegend();
}

function renderLegend() {
  const extra = [
    ["recommend", "推薦店"],
    ["poi", "值得去"],
    ["swap", "互換"],
  ];
  document.getElementById("map-legend").innerHTML = [
    ...Object.entries(TYPE_LABELS).filter(([k]) => !["recommend", "poi"].includes(k)),
    ...extra,
  ]
    .map(([k, v]) => {
      const color = TYPE_COLORS[k] || TYPE_COLORS.recommend;
      return `<span class="legend-item"><i style="background:${color}"></i>${v}</span>`;
    })
    .join("");
}

function clearMapLayers() {
  markers.forEach((m) => map.removeLayer(m));
  markers = [];
  if (routeLine) {
    map.removeLayer(routeLine);
    routeLine = null;
  }
}

function allPlaces() {
  return TRIP_DATA.days.flatMap((d) => getDayMapItems(d).map((p) => ({ ...p, dayId: d.id })));
}

function findPlace(id) {
  return allPlaces().find((p) => p.id === id) || null;
}

function matchesSearch(p, q) {
  if (!q) return true;
  const hay = [
    p.name,
    p.address,
    p.time,
    p.transport,
    ...(p.mustSee || []),
    ...(p.restaurants || []).flatMap((r) => [r.name, r.address, r.note]),
    ...(p.sources || []).flatMap((s) => [s.platform, s.rating, s.note]),
    p.hours,
  ]
    .join(" ")
    .toLowerCase();
  return hay.includes(q.toLowerCase());
}

function renderSourcesHtml(sources) {
  if (!sources?.length) return "";
  return sources
    .map(
      (s) => `
    <div class="source-item">
      <span class="source-platform">${s.platform}</span>
      ${s.rating ? `<span class="source-rating">${s.rating}</span>` : ""}
      ${s.note ? `<span class="source-note">${s.note}</span>` : ""}
    </div>`
    )
    .join("");
}

function renderSourceChips(sources) {
  if (!sources?.length) return "";
  return `<div class="card-sources">${sources
    .slice(0, 2)
    .map((s) => `<span class="source-chip">${s.platform}${s.rating ? ` ${s.rating}` : ""}</span>`)
    .join("")}</div>`;
}

function renderRestaurantHtml(r) {
  const img = r.image
    ? `<img class="rest-thumb" src="${r.image}" alt="" loading="lazy" onerror="this.hidden=true" />`
    : `<div class="rest-thumb placeholder">食</div>`;
  return `
    <div class="restaurant-item">
      ${img}
      <div class="rest-body">
        <strong>${r.name}</strong>
        ${r.hours ? `<div class="hours">🕐 ${r.hours}</div>` : ""}
        <div class="addr">${r.address}</div>
        ${r.tel ? `<div class="addr">☎ <a href="tel:${r.tel.replace(/-/g, "")}">${r.tel}</a></div>` : ""}
        ${r.note ? `<div class="note">${r.note}</div>` : ""}
        <div class="rest-actions">
          <button type="button" class="btn-xs copy-rest" data-addr="${r.address}">複製地址</button>
          <a class="btn-xs primary" href="${addressMapsUrl(r.address)}" target="_blank" rel="noopener">導航</a>
        </div>
      </div>
    </div>`;
}

function openSidebar() {
  closeDetail(false);
  sidebarOpen = true;
  document.querySelector(".sidebar").classList.add("open");
  const bd = document.getElementById("sidebar-backdrop");
  bd.hidden = false;
  requestAnimationFrame(() => bd.classList.add("show"));
  const btn = document.getElementById("sidebar-toggle");
  btn.classList.add("active");
  btn.querySelector(".map-fab-icon").textContent = "✕";
  btn.querySelector("span:last-child").textContent = "關閉";
}

function closeSidebar() {
  sidebarOpen = false;
  document.querySelector(".sidebar").classList.remove("open");
  const bd = document.getElementById("sidebar-backdrop");
  bd.classList.remove("show");
  setTimeout(() => {
    if (!sidebarOpen) bd.hidden = true;
  }, 280);
  const btn = document.getElementById("sidebar-toggle");
  btn.classList.remove("active");
  btn.querySelector(".map-fab-icon").textContent = "☰";
  btn.querySelector("span:last-child").textContent = "行程";
}

function toggleSidebar() {
  if (sidebarOpen) closeSidebar();
  else openSidebar();
}

function showDetailBackdrop() {
  const bd = document.getElementById("detail-backdrop");
  bd.hidden = false;
  requestAnimationFrame(() => bd.classList.add("show"));
}

function hideDetailBackdrop() {
  const bd = document.getElementById("detail-backdrop");
  bd.classList.remove("show");
  setTimeout(() => {
    if (!document.getElementById("detail-panel").classList.contains("open")) bd.hidden = true;
  }, 280);
}

function renderDayTabs() {
  const el = document.getElementById("day-tabs");
  el.innerHTML = TRIP_DATA.days
    .map((d) => {
      const visited = d.places.filter((p) => state.visited[p.id]).length;
      const total = d.places.length;
      return `
      <button type="button" class="day-tab ${d.id === activeDay ? "active" : ""}" data-day="${d.id}">
        <span class="tab-num">Day ${d.id}</span>
        ${d.date.split("（")[0]}
        <span class="tab-progress">${visited}/${total}</span>
      </button>`;
    })
    .join("");

  el.querySelectorAll(".day-tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeDay = Number(btn.dataset.day);
      activePlaceId = null;
      closeDetail(false);
      renderAll();
    });
  });
}

function renderBookings() {
  const el = document.getElementById("booking-list");
  const done = TRIP.bookings.filter((b) => state.bookings[b.id] || b.status === "done").length;
  const progress = `${done}/${TRIP.bookings.length}`;

  document.getElementById("booking-progress").textContent = progress;
  document.getElementById("booking-tab-badge").textContent = progress;

  el.innerHTML = TRIP.bookings
    .map((b) => {
      const checked = state.bookings[b.id] || b.status === "done";
      return `
      <label class="booking-item ${checked ? "checked" : ""} ${b.status}">
        <input type="checkbox" data-id="${b.id}" ${checked ? "checked" : ""} />
        <span class="booking-dot ${b.status}"></span>
        <div class="booking-body">
          <strong>${b.label}</strong>
          <div class="booking-sub">Day ${b.day} · ${BOOKING_LABELS[b.status]}</div>
          ${b.note ? `<div class="booking-note">${b.note}</div>` : ""}
          ${b.url ? `<a href="${b.url}" target="_blank" rel="noopener" class="booking-link" onclick="event.stopPropagation()">預約連結 →</a>` : ""}
        </div>
      </label>`;
    })
    .join("");

  el.querySelectorAll("input[type=checkbox]").forEach((cb) => {
    cb.addEventListener("change", () => {
      state.bookings[cb.dataset.id] = cb.checked;
      saveState();
      renderBookings();
      renderDayTabs();
    });
  });
}

function renderSidebarTabs() {
  document.querySelectorAll(".sidebar-main-tab").forEach((btn) => {
    const isActive = btn.dataset.tab === activeSidebarTab;
    btn.classList.toggle("active", isActive);
    btn.setAttribute("aria-selected", isActive);
  });

  document.getElementById("panel-itinerary").classList.toggle("active", activeSidebarTab === "itinerary");
  document.getElementById("panel-itinerary").hidden = activeSidebarTab !== "itinerary";
  document.getElementById("panel-bookings").classList.toggle("active", activeSidebarTab === "bookings");
  document.getElementById("panel-bookings").hidden = activeSidebarTab !== "bookings";
}

function switchSidebarTab(tab) {
  activeSidebarTab = tab;
  renderSidebarTabs();
  if (tab === "bookings") {
    closeDetail(false);
    renderBookings();
  } else {
    renderAll();
  }
}

function renderDayHero(day) {
  const visited = day.places.filter((p) => state.visited[p.id]).length;
  document.getElementById("day-hero").innerHTML = `
    ${day.image ? `<img src="${day.image}" alt="" class="day-hero-img" />` : ""}
    <div class="day-hero-text">
      <h2>${day.date} ${day.title}</h2>
      <p>${getDayMapItems(day).length} 個地圖標記 · 主行程 ${day.places.length} 站 · 已完成 ${visited}/${day.places.length}</p>
    </div>`;
}

function renderTimeline(day) {
  const q = searchQuery.trim();
  const items = getDayMapItems(day);
  const primary = items.filter((p) => p.markerKind === "primary" && matchesSearch(p, q));
  const recommends = items.filter((p) => p.markerKind === "recommend" && matchesSearch(p, q));
  const swaps = items.filter((p) => p.markerKind === "swap" && matchesSearch(p, q));
  const pois = items.filter((p) => p.markerKind === "poi" && matchesSearch(p, q));

  const renderItem = (p) => `
      <button type="button" class="timeline-item ${p.markerKind !== "primary" ? "extra" : ""} ${p.id === activePlaceId ? "active" : ""} ${state.visited[p.id] ? "visited" : ""}" data-id="${p.id}">
        <div class="tl-time">${p.time || "—"}</div>
        <div class="tl-dot" style="background:${TYPE_COLORS[p.type] || TYPE_COLORS.recommend}"></div>
        <div class="tl-body">
          <div class="tl-name">${p.name}</div>
          <div class="tl-type">${TYPE_LABELS[p.type] || TYPE_LABELS.recommend}${p.hours ? ` · ${p.hours}` : ""}</div>
        </div>
      </button>`;

  let html = "";
  if (primary.length === 0 && recommends.length === 0 && swaps.length === 0 && pois.length === 0 && q) {
    html = `<p class="empty">找不到符合「${q}」的地點</p>`;
  } else {
    html += primary.map(renderItem).join("");
    if (recommends.length) {
      html += `<h3 class="section-label">推薦餐廳</h3>` + recommends.map(renderItem).join("");
    }
    if (pois.length) {
      html += `<h3 class="section-label">值得去 · 景點／美食／購物</h3>` + pois.map(renderItem).join("");
    }
    if (swaps.length) {
      html += `<h3 class="section-label">互換備案</h3>` + swaps.map(renderItem).join("");
    }
  }

  document.getElementById("timeline").innerHTML = html;

  document.getElementById("timeline").querySelectorAll(".timeline-item").forEach((btn) => {
    btn.addEventListener("click", () => selectPlace(btn.dataset.id, day));
  });
}

function renderSwaps(day) {
  const global = TRIP.alternateModules || [];
  const swaps = [...(day.swaps || []), ...global.map((m) => `${m.title}：${m.desc}`)];

  document.getElementById("swaps-block").innerHTML = swaps.length
    ? `<h3 class="section-label">可互換 / 備案</h3><ul class="swaps-list">${swaps.map((s) => `<li>${s}</li>`).join("")}</ul>`
    : "";
}

function renderMapMarkers(day) {
  clearMapLayers();
  const coords = [];
  const q = searchQuery.trim();
  const items = getDayMapItems(day).filter((p) => matchesSearch(p, q));

  items.forEach((p) => {
    if (!p.lat || !p.lng) return;
    const visited = !!state.visited[p.id];
    const kind = p.markerKind || "primary";
    const marker = L.marker([p.lat, p.lng], { icon: typeIcon(p.type, visited, kind) }).addTo(map);
    marker.placeId = p.id;
    const label = TYPE_LABELS[p.type] || TYPE_LABELS.recommend;
    marker.bindPopup(
      `<strong>${p.name}</strong><br>${p.time || ""}<br>${label}${
        p.sources?.[0]?.rating ? `<br><small>${p.sources[0].platform} ${p.sources[0].rating}</small>` : ""
      }`
    );
    marker.on("click", () => selectPlace(p.id, day));
    markers.push(marker);
    if (kind === "primary") coords.push([p.lat, p.lng]);
  });

  coords.push([TRIP.meta.baseLat, TRIP.meta.baseLng]);

  if (coords.length > 2) {
    routeLine = L.polyline(coords, { color: "#2563eb", weight: 3, opacity: 0.45, dashArray: "8 6" }).addTo(map);
  }

  if (coords.length > 1) {
    map.fitBounds(coords, { padding: [48, 48], maxZoom: 12 });
  } else if (items.length > 0) {
    const allCoords = items.filter((p) => p.lat && p.lng).map((p) => [p.lat, p.lng]);
    allCoords.push([TRIP.meta.baseLat, TRIP.meta.baseLng]);
    map.fitBounds(allCoords, { padding: [48, 48], maxZoom: 12 });
  }
}

function selectPlace(id, day) {
  activePlaceId = id;
  const place = findPlace(id);
  if (!place) return;
  closeSidebar();
  renderTimeline(day);
  showDetail(place);
  focusMarker(place);
}

function showDetail(p) {
  const panel = document.getElementById("detail-panel");
  panel.classList.add("open");
  showDetailBackdrop();

  const imgEl = document.getElementById("detail-img");
  const fallback = document.getElementById("detail-img-fallback");

  if (p.image) {
    imgEl.src = p.image;
    imgEl.alt = p.name;
    imgEl.hidden = false;
    fallback.hidden = true;
    imgEl.onerror = () => {
      imgEl.hidden = true;
      fallback.hidden = false;
      fallback.textContent = TYPE_LABELS[p.type];
    };
  } else {
    imgEl.hidden = true;
    fallback.hidden = false;
    fallback.textContent = TYPE_LABELS[p.type];
  }

  document.getElementById("detail-type").textContent = TYPE_LABELS[p.type];
  document.getElementById("detail-type").style.background = TYPE_COLORS[p.type];
  document.getElementById("detail-name").textContent = p.name;
  document.getElementById("detail-meta").textContent = [p.time, p.hours, p.address].filter(Boolean).join(" · ");
  const sourcesWrap = document.getElementById("detail-sources-wrap");
  const sourcesEl = document.getElementById("detail-sources");
  if (p.sources?.length) {
    sourcesEl.innerHTML = renderSourcesHtml(p.sources);
    sourcesWrap.hidden = false;
  } else {
    sourcesWrap.hidden = true;
  }

  document.getElementById("detail-mustsee").innerHTML = (p.mustSee || []).map((s) => `<li>${s}</li>`).join("") || "<li>—</li>";
  document.getElementById("detail-transport").textContent = p.transport || "—";

  document.getElementById("detail-restaurants").innerHTML = (p.restaurants || []).length
    ? p.restaurants.map((r) => renderRestaurantHtml(r)).join("")
    : "<p class='muted'>此站無指定餐廳</p>";

  const restSection = document.getElementById("detail-restaurants").closest(".detail-section");
  restSection.hidden = p.type === "swap" || !(p.restaurants || []).length;

  document.querySelectorAll(".copy-rest").forEach((btn) => {
    btn.addEventListener("click", () => {
      navigator.clipboard.writeText(btn.dataset.addr).then(() => toast("地址已複製"));
    });
  });

  const bookingWrap = document.getElementById("detail-booking-wrap");
  const bookingEl = document.getElementById("detail-booking");
  if (p.booking) {
    bookingEl.innerHTML = `<span class="booking-badge ${p.booking.status}">${p.booking.text}</span>`;
    bookingWrap.hidden = false;
  } else {
    bookingWrap.hidden = true;
  }

  document.getElementById("detail-maplink").href = mapsUrl(p.lat, p.lng, p.name);

  const visitBtn = document.getElementById("btn-visit-toggle");
  visitBtn.textContent = state.visited[p.id] ? "取消已去" : "標記已去";
  visitBtn.dataset.id = p.id;

  document.getElementById("btn-copy-addr").onclick = () => {
    navigator.clipboard.writeText(p.address).then(() => toast("地址已複製"));
  };
}

function focusMarker(place) {
  if (!place?.lat) return;
  map.setView([place.lat, place.lng], 14, { animate: true });
  markers.find((m) => m.placeId === place.id)?.openPopup();
}

function closeDetail(rerender = true) {
  document.getElementById("detail-panel").classList.remove("open");
  hideDetailBackdrop();
  activePlaceId = null;
  if (rerender) {
    const day = TRIP_DATA.days.find((d) => d.id === activeDay);
    if (day) renderTimeline(day);
  }
}

function showAllMarkers() {
  closeDetail(false);
  clearMapLayers();
  const bounds = [[TRIP.meta.baseLat, TRIP.meta.baseLng]];

  getAllMapItems(TRIP_DATA).forEach((p) => {
    if (!p.lat || !p.lng) return;
    const kind = p.markerKind || "primary";
    const marker = L.marker([p.lat, p.lng], { icon: typeIcon(p.type, state.visited[p.id], kind) }).addTo(map);
    marker.bindPopup(`<strong>Day ${p.dayId}</strong> ${p.name}`);
    marker.on("click", () => {
      activeDay = p.dayId;
      renderAll();
      selectPlace(p.id, TRIP_DATA.days.find((d) => d.id === p.dayId));
    });
    markers.push(marker);
    bounds.push([p.lat, p.lng]);
  });

  map.fitBounds(bounds, { padding: [36, 36], maxZoom: 10 });
}

function renderTransportModal() {
  document.getElementById("transport-table").innerHTML = `
    <table class="data-table">
      <thead><tr><th>目的地</th><th>方式</th><th>時間</th><th>費用</th></tr></thead>
      <tbody>${TRIP.transportGuide
        .map((r) => `<tr><td>${r.dest}</td><td>${r.how}</td><td>${r.time}</td><td>${r.cost}</td></tr>`)
        .join("")}</tbody>
    </table>
    <p class="muted" style="margin-top:12px">住宿基地：博多站 · 建議購買 IC 卡（Hayakaken / Suica）</p>`;
}

function renderAll() {
  renderSidebarTabs();
  renderDayTabs();
  renderBookings();
  const day = TRIP_DATA.days.find((d) => d.id === activeDay);
  if (!day) return;
  renderDayHero(day);
  renderTimeline(day);
  renderSwaps(day);
  renderMapMarkers(day);
}

document.addEventListener("DOMContentLoaded", () => {
  initMap();
  renderTransportModal();
  renderAll();

  document.getElementById("close-detail").addEventListener("click", () => closeDetail());
  document.getElementById("detail-backdrop").addEventListener("click", () => closeDetail());
  document.getElementById("sidebar-backdrop").addEventListener("click", () => closeSidebar());
  document.getElementById("sidebar-toggle").addEventListener("click", () => toggleSidebar());

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (document.getElementById("detail-panel").classList.contains("open")) closeDetail();
    else if (sidebarOpen) closeSidebar();
  });
  document.getElementById("show-all-days").addEventListener("click", showAllMarkers);

  document.getElementById("btn-visit-toggle").addEventListener("click", (e) => {
    const id = e.target.dataset.id;
    if (!id) return;
    state.visited[id] = !state.visited[id];
    saveState();
    const day = TRIP_DATA.days.find((d) => d.id === activeDay);
    renderAll();
    if (activePlaceId === id) showDetail(findPlace(id));
  });

  document.getElementById("search").addEventListener("input", (e) => {
    searchQuery = e.target.value;
    renderAll();
  });

  const dlg = document.getElementById("transport-dialog");
  document.getElementById("btn-transport").addEventListener("click", () => dlg.showModal());
  dlg.querySelectorAll("[data-close]").forEach((b) => b.addEventListener("click", () => dlg.close()));
  dlg.addEventListener("click", (e) => {
    if (e.target === dlg) dlg.close();
  });

  document.getElementById("btn-print").addEventListener("click", () => window.print());

  document.querySelectorAll(".sidebar-main-tab").forEach((btn) => {
    btn.addEventListener("click", () => switchSidebarTab(btn.dataset.tab));
  });

  // Deep link: ?day=2&place=d2-dazaifu  or ?tab=bookings
  const params = new URLSearchParams(location.search);
  if (params.get("tab") === "bookings") {
    activeSidebarTab = "bookings";
    renderSidebarTabs();
  }
  if (params.get("day")) activeDay = Number(params.get("day")) || 1;
  renderAll();
  if (params.get("tab") === "bookings") openSidebar();
  if (params.get("place") && activeSidebarTab === "itinerary") {
    const p = findPlace(params.get("place"));
    if (p) selectPlace(p.id, TRIP_DATA.days.find((d) => d.id === activeDay));
  }
});
