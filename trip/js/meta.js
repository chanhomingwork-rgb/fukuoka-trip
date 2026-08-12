/** 地點／餐廳圖片與營業時間（合併至行程顯示） */
const PLACE_META = {
  "d1-mojiko": { hours: "24 小時（區域）· 各店依店家", image: "assets/fukuoka-trip/d1-mojiko.jpg" },
  "d1-canal": { hours: "10:00–21:00（商場）", image: "assets/food/canal-city.jpg" },
  "d1-ramen": { hours: "11:00–23:00（依各店）", image: "assets/food/ramen.jpg" },
  "d2-dazaifu": { hours: "6:00–19:00（參拜）· 表參道 9:00–17:00", image: "assets/fukuoka-trip/d2-dazaifu.jpg" },
  "d2-yanagawa": { hours: "遊船 10:10–15:40（夏季）", image: "assets/fukuoka-trip/d2-yanagawa.jpg" },
  "d3-ohori": { hours: "24 小時（公園）· 庭園 9:00–17:00", image: "assets/fukuoka-trip/d3-ohori.jpg" },
  "d3-kushida": { hours: "4:00–22:00 · 御守 9:00–17:00", image: "assets/fukuoka-trip/d3-kushida.jpg" },
  "d4-kokura": { hours: "9:00–17:00（天守・週一公休）", image: "assets/fukuoka-trip/d4-kokura.jpg" },
  "d4-mojiko": { hours: "10:00–17:00（展望室等）", image: "assets/fukuoka-trip/d1-mojiko.jpg" },
  "d1-blue-wing": { hours: "11:00・14:00 開橋（約 15 分）", image: "assets/fukuoka-trip/d1-mojiko.jpg" },
  "d1-princess-phiphi": { hours: "11:00–21:00（週三公休）", image: "assets/food/curry.jpg" },
  "d1-fireworks": { hours: "19:35–20:30（8/13）", image: "assets/food/fireworks.jpg" },
  "d1-nakasu-yatai": { hours: "18:00–01:00（依各攤）", image: "assets/food/yatai.jpg" },
  "d2-starbucks": { hours: "7:00–21:00", image: "assets/food/starbucks-dazaifu.jpg" },
  "d2-yasutake": { hours: "8:00–18:00", image: "assets/food/umegae.jpg" },
  "d2-kyushu-museum": { hours: "9:30–17:00（週一公休）", image: "assets/fukuoka-trip/d2-dazaifu.jpg" },
  "d2-kamado": { hours: "6:00–18:00", image: "assets/fukuoka-trip/d2-dazaifu.jpg" },
  "d2-motoyoshiya": { hours: "10:30–20:00（L.O. 19:30）", image: "assets/food/unagi.jpg" },
  "d2-ohoka": { hours: "9:00–17:00（庭園）", image: "assets/fukuoka-trip/d2-yanagawa.jpg" },
  "d2-tetsunabe": { hours: "17:00–23:00（日・祝公休）", image: "assets/food/gyoza.jpg" },
  "d3-sumiyoshi": { hours: "4:00–22:00", image: "assets/fukuoka-trip/d3-kushida.jpg" },
  "d3-kawabata": { hours: "10:00–19:00（依各店）", image: "assets/food/canal-city.jpg" },
  "d3-canal": { hours: "10:00–21:00", image: "assets/food/canal-city.jpg" },
  "d3-yatai": { hours: "18:00–01:00（依各攤）", image: "assets/food/yatai.jpg" },
  "d3-hanamidori": { hours: "17:00–23:00", image: "assets/food/mizutaki.jpg" },
  "d3-donki": { hours: "24 小時", image: "assets/fukuoka-trip/d3-kushida.jpg" },
  "d4-tanga": { hours: "8:00–17:00（依各攤）", image: "assets/food/sashimi.jpg" },
  "d4-karato": { hours: "週末馬關街 8:00–15:00 · 平日 2F 食堂", image: "assets/food/karato.jpg" },
  "d4-kanmon": { hours: "24 小時（橋・展望）", image: "assets/fukuoka-trip/d1-kanmon.jpg" },
  "d4-akama": { hours: "6:00–18:00", image: "assets/food/karato.jpg" },
  "d5-teamlab": { hours: "10:00–19:00（依預約時段）", image: "assets/fukuoka-trip/d5-tower.jpg" },
  "d5-gundam": { hours: "10:00–20:00（LaLaport 營業時間內）", image: "assets/food/gundam.jpg" },
  "d5-tower": { hours: "9:30–22:00（最終入場 21:30）", image: "assets/fukuoka-trip/d5-tower.jpg" },
  "d5-sasakiyama": { hours: "纜車 10:00–22:00（依季節）", image: "assets/fukuoka-trip/d4-kokura.jpg" },
  "d5-tenjin": { hours: "10:00–21:00（依各店）", image: "assets/fukuoka-trip/d6-hakata.jpg" },
  "d5-tenjin-chika": { hours: "10:00–20:00", image: "assets/fukuoka-trip/d6-hakata.jpg" },
  "d5-parco": { hours: "10:00–21:00", image: "assets/fukuoka-trip/d6-hakata.jpg" },
  "d5-meizhongzi": { hours: "11:00–22:00", image: "assets/food/mentaiko.jpg" },
  "d6-shopping": { hours: "10:00–21:00（依各店）", image: "assets/fukuoka-trip/d6-hakata.jpg" },
  "d6-ilforno": { hours: "7:00–售完為止", image: "assets/food/croissant.jpg" },
  "d6-ippudo": { hours: "11:00–23:00", image: "assets/food/ramen.jpg" },
};

const RESTAURANT_META = {
  "Princess Phi Phi": { hours: "11:00–21:00（週三公休）", image: "assets/food/curry.jpg" },
  "Café Matière": { hours: "10:00–17:00", image: "assets/fukuoka-trip/d1-mojiko.jpg" },
  "Mooon de Retro": { hours: "10:00–18:00", image: "assets/fukuoka-trip/d1-mojiko.jpg" },
  "焼きカレー 門司港": { hours: "11:00–20:00（依各店）", image: "assets/food/curry.jpg" },
  "協賛席內餐飲": { hours: "依票券時段", image: "assets/food/fireworks.jpg" },
  "中洲屋台 小金ちゃん": { hours: "18:00–01:00", image: "assets/food/yatai.jpg" },
  "小金ちゃん": { hours: "18:00–01:00", image: "assets/food/yatai.jpg" },
  "よしけい": { hours: "18:00–01:00", image: "assets/food/yatai.jpg" },
  "やす武": { hours: "8:00–18:00", image: "assets/food/umegae.jpg" },
  "一蘭 太宰府參道店": { hours: "8:00–22:00", image: "assets/food/ramen.jpg" },
  "Kingberry": { hours: "10:00–17:00", image: "assets/food/umegae.jpg" },
  "酒殿屋": { hours: "9:00–17:00", image: "assets/food/umegae.jpg" },
  "博物館咖啡廳": { hours: "9:30–17:00", image: "assets/fukuoka-trip/d2-dazaifu.jpg" },
  "元祖 本吉屋 本店": { hours: "10:30–20:00（L.O. 19:30）", image: "assets/food/unagi.jpg" },
  "若松屋": { hours: "11:00–14:00 / 17:00–21:00", image: "assets/food/unagi.jpg" },
  "民藝茶屋 六騎": { hours: "11:00–15:00 / 17:00–21:00", image: "assets/food/unagi.jpg" },
  "博多祇園鉄なべ": { hours: "17:00–23:00（日・祝公休）", image: "assets/food/gyoza.jpg" },
  "& LOCALS 大濠公園": { hours: "9:00–17:00（週一公休）", image: "assets/fukuoka-trip/d3-ohori.jpg" },
  "ごはんや 飯すけ": { hours: "11:00–14:00 / 17:00–21:00", image: "assets/fukuoka-trip/d3-ohori.jpg" },
  "博多一双 祇園店": { hours: "11:00–15:00 / 17:00–23:00", image: "assets/food/ramen.jpg" },
  "茶壺烏龍麵 博多あかちょこべ": { hours: "11:00–14:30 / 17:00–20:00", image: "assets/fukuoka-trip/d3-kushida.jpg" },
  "川端善哉": { hours: "10:00–18:00", image: "assets/food/umegae.jpg" },
  "博多拉麵競技場": { hours: "11:00–23:00", image: "assets/food/ramen.jpg" },
  "元祖牛腸鍋 樂天地 本店": { hours: "17:00–24:00", image: "assets/food/motsunabe.jpg" },
  "博多拉麵 ShinShin 本店": { hours: "11:00–23:00", image: "assets/food/ramen.jpg" },
  "博多華味鳥 本店": { hours: "17:00–23:00", image: "assets/food/mizutaki.jpg" },
  "小倉鉄なべ 本店": { hours: "11:30–14:00 / 17:00–22:00", image: "assets/food/gyoza.jpg" },
  "資さんうどん 魚町店": { hours: "24 小時", image: "assets/food/udon.jpg" },
  "旦過市場 海鮮丼": { hours: "8:00–17:00（依各攤）", image: "assets/food/sashimi.jpg" },
  "唐戶市場 馬關街攤位": { hours: "週末 8:00–15:00", image: "assets/food/karato.jpg" },
  "すし遊館 唐戸店": { hours: "11:00–22:00", image: "assets/food/sushi.jpg" },
  "Pain Stock": { hours: "8:00–19:00", image: "assets/food/croissant.jpg" },
  "BOSS E・ZO 內餐廳": { hours: "10:00–21:00（依各店）", image: "assets/fukuoka-trip/d5-tower.jpg" },
  "元祖博多明太重": { hours: "11:00–22:00", image: "assets/food/mentaiko.jpg" },
  "BAKE 起司塔": { hours: "10:00–21:00", image: "assets/food/cheese-tart.jpg" },
  "葫蘆壽司": { hours: "11:30–14:00 / 17:30–22:00", image: "assets/food/sushi.jpg" },
  "BAKE": { hours: "10:00–21:00", image: "assets/food/cheese-tart.jpg" },
  "博多拉麵 ShinShin": { hours: "11:00–23:00", image: "assets/food/ramen.jpg" },
  "一蘭 博多総本社": { hours: "24 小時", image: "assets/food/ramen.jpg" },
  "博多一双 デイトス店": { hours: "11:00–23:00", image: "assets/food/ramen.jpg" },
  "il FORNO del Mignon": { hours: "7:00–售完為止", image: "assets/food/croissant.jpg" },
  "一風堂 総本店": { hours: "11:00–23:00", image: "assets/food/ramen.jpg" },
};

/** 推薦餐廳座標（未獨立成停靠點者） */
const RESTAURANT_GEO = {
  "Princess Phi Phi": { lat: 33.9430, lng: 130.9580 },
  "Café Matière": { lat: 33.9436, lng: 130.9589 },
  "Mooon de Retro": { lat: 33.9428, lng: 130.9595 },
  "焼きカレー 門司港": { lat: 33.9432, lng: 130.9575 },
  "協賛席內餐飲": { lat: 33.9455, lng: 130.9560 },
  "中洲屋台 小金ちゃん": { lat: 33.5929, lng: 130.4076 },
  "小金ちゃん": { lat: 33.5927, lng: 130.4074 },
  "よしけい": { lat: 33.5930, lng: 130.4078 },
  "やす武": { lat: 33.5208, lng: 130.5342 },
  "一蘭 太宰府參道店": { lat: 33.5210, lng: 130.5340 },
  "Kingberry": { lat: 33.5212, lng: 130.5338 },
  "酒殿屋": { lat: 33.5206, lng: 130.5345 },
  "博物館咖啡廳": { lat: 33.5208, lng: 130.5430 },
  "元祖 本吉屋 本店": { lat: 33.1630, lng: 130.4055 },
  "若松屋": { lat: 33.1625, lng: 130.4068 },
  "民藝茶屋 六騎": { lat: 33.1623, lng: 130.4070 },
  "博多祇園鉄なべ": { lat: 33.5935, lng: 130.4120 },
  "& LOCALS 大濠公園": { lat: 33.5865, lng: 130.3785 },
  "ごはんや 飯すけ": { lat: 33.5870, lng: 130.3790 },
  "博多一双 祇園店": { lat: 33.5938, lng: 130.4118 },
  "茶壺烏龍麵 博多あかちょこべ": { lat: 33.5920, lng: 130.4098 },
  "川端善哉": { lat: 33.5942, lng: 130.4088 },
  "博多拉麵競技場": { lat: 33.5926, lng: 130.4089 },
  "元祖牛腸鍋 樂天地 本店": { lat: 33.5910, lng: 130.4070 },
  "博多拉麵 ShinShin 本店": { lat: 33.5905, lng: 130.4195 },
  "博多華味鳥 本店": { lat: 33.5908, lng: 130.4125 },
  "小倉鉄なべ 本店": { lat: 33.8835, lng: 130.8810 },
  "資さんうどん 魚町店": { lat: 33.8830, lng: 130.8805 },
  "旦過市場 海鮮丼": { lat: 33.8838, lng: 130.8795 },
  "唐戶市場 馬關街攤位": { lat: 33.9578, lng: 130.9400 },
  "すし遊館 唐戸店": { lat: 33.9582, lng: 130.9395 },
  "Pain Stock": { lat: 33.5898, lng: 130.3998 },
  "BOSS E・ZO 內餐廳": { lat: 33.5953, lng: 130.3623 },
  "元祖博多明太重": { lat: 33.5895, lng: 130.3995 },
  "BAKE 起司塔": { lat: 33.5904, lng: 130.4017 },
  "葫蘆壽司": { lat: 33.5888, lng: 130.4005 },
  "BAKE": { lat: 33.5903, lng: 130.4015 },
  "博多拉麵 ShinShin": { lat: 33.5905, lng: 130.4195 },
  "一蘭 博多総本社": { lat: 33.5918, lng: 130.4210 },
  "博多一双 デイトス店": { lat: 33.5897, lng: 130.4207 },
  "il FORNO del Mignon": { lat: 33.5895, lng: 130.4209 },
  "一風堂 総本店": { lat: 33.5903, lng: 130.4186 },
};

/** 互換／備案景點（可標記地圖） */
const SWAP_MARKERS = [
  {
    id: "swap-itoshima",
    days: [3],
    name: "糸島半日（互換）",
    lat: 33.5562,
    lng: 130.1985,
    address: "福岡県糸島市",
    mustSee: ["櫻井二見浦", "Itoshima Beer Lab", "海景咖啡"],
    transport: "博多→姪濱→bus 約 40 分",
    image: "assets/fukuoka-trip/d3-ohori.jpg",
    hours: "依各店營業時間",
  },
  {
    id: "swap-kitakyushu",
    days: [4],
    name: "北九州 + 下關（互換）",
    lat: 33.8833,
    lng: 130.8822,
    address: "福岡県北九州市小倉北区",
    mustSee: ["小倉城", "旦過市場", "門司港レトロ", "唐戶市場（週末馬關街）", "赤間神宮"],
    transport: "博多→小倉 新幹線 15 分 · 門司港→下關 聯絡船",
    image: "assets/fukuoka-trip/d4-kokura.jpg",
    hours: "9:00–17:00（小倉城）",
  },
  {
    id: "swap-kumamoto",
    days: [5],
    name: "熊本一日（互換）",
    lat: 32.8062,
    lng: 130.7058,
    address: "熊本県熊本市中央区",
    mustSee: ["熊本城", "城彩苑"],
    transport: "新幹線 40 分 · 07:00 出發",
    image: "assets/fukuoka-trip/d4-kokura.jpg",
    hours: "9:00–17:00（熊本城）",
  },
  {
    id: "swap-marine",
    days: [3, 4, 5],
    name: "海之中道（雨天備案）",
    lat: 33.6605,
    lng: 130.3582,
    address: "福岡県福岡市東区西戸崎18-28",
    mustSee: ["水族館", "海濱公園"],
    transport: "地鐵箱崎線 海之中道站",
    image: "assets/fukuoka-trip/d5-tower.jpg",
    hours: "9:30–17:30（水族館）",
  },
  {
    id: "swap-mojiko-d1",
    days: [1],
    name: "門司港半日（互換・無煙火）",
    lat: 33.9433,
    lng: 130.9586,
    address: "福岡県北九州市門司区港町",
    mustSee: ["門司港レトロ", "焼きカレー", "Blue Wing · 僅日班開橋"],
    transport: "博多→小倉新幹線 15 分 · 抵達日較趕",
    image: "assets/fukuoka-trip/d1-mojiko.jpg",
    hours: "17:00–20:00 左右",
  },
  {
    id: "swap-yanagawa-am",
    days: [2],
    name: "柳川早班船（互換）",
    lat: 33.1628,
    lng: 130.4069,
    address: "福岡県柳川市",
    mustSee: ["8:10 柳川船", "反向行程"],
    transport: "西鐵柳川站",
    image: "assets/fukuoka-trip/d2-yanagawa.jpg",
    hours: "8:10 班次",
  },
];

function slugName(name) {
  return name.replace(/\s+/g, "-").replace(/[^\w\u4e00-\u9fff-]/g, "");
}

function placeHasRestaurant(place, restName) {
  const base = restName.replace(/\s+/g, "");
  const pname = place.name.replace(/\s+/g, "");
  return pname.includes(base) || base.includes(pname.split("（")[0]);
}

function normalizePOIName(name) {
  return name
    .replace(/（.*?）/g, "")
    .replace(/\(.*?\)/g, "")
    .replace(/\s+/g, "")
    .trim();
}

function isDuplicateItem(a, b) {
  if (a.id === b.id) return true;
  const na = normalizePOIName(a.name);
  const nb = normalizePOIName(b.name);
  if (na && nb && (na === nb || na.includes(nb) || nb.includes(na))) return true;
  if (a.lat && b.lat && Math.abs(a.lat - b.lat) < 0.0008 && Math.abs(a.lng - b.lng) < 0.0008) return true;
  return false;
}

function getPOIsForDay(dayId) {
  if (typeof POI_CATALOG === "undefined") return [];
  return POI_CATALOG.filter((p) => p.days.includes(dayId));
}

function getDayMapItems(day) {
  const primary = day.places.map((p) => enrichPlace({ ...p, markerKind: "primary" }));
  const seenIds = new Set(primary.map((p) => p.id));
  const collected = [...primary];
  const extras = [];

  day.places.forEach((parent) => {
    (parent.restaurants || []).forEach((r, i) => {
      if (primary.some((p) => placeHasRestaurant(p, r.name))) return;
      const geo = RESTAURANT_GEO[r.name];
      if (!geo?.lat) return;

      const id = `rest-${slugName(r.name)}`;
      if (seenIds.has(id)) return;
      seenIds.add(id);

      const rm = RESTAURANT_META[r.name] || {};
      const item = enrichPlace({
        id,
        type: "recommend",
        markerKind: "recommend",
        name: r.name,
        time: "推薦",
        lat: geo.lat + i * 0.00015,
        lng: geo.lng + i * 0.00012,
        address: r.address,
        hours: r.hours || rm.hours,
        image: r.image || rm.image,
        mustSee: r.note ? [r.note] : [],
        transport: `近 ${parent.name}`,
        restaurants: [{ ...r, hours: r.hours || rm.hours, image: r.image || rm.image }],
        booking: null,
      });
      extras.push(item);
      collected.push(item);
    });
  });

  SWAP_MARKERS.filter((s) => s.days.includes(day.id)).forEach((s) => {
    if (seenIds.has(s.id)) return;
    seenIds.add(s.id);
    const item = enrichPlace({
      ...s,
      type: "swap",
      markerKind: "swap",
      time: "互換",
      restaurants: [],
      booking: null,
    });
    extras.push(item);
    collected.push(item);
  });

  getPOIsForDay(day.id).forEach((poi) => {
    if (seenIds.has(poi.id)) return;
    if (collected.some((c) => isDuplicateItem(c, poi))) return;
    seenIds.add(poi.id);
    const item = enrichPlace({
      ...poi,
      markerKind: "poi",
      time: poi.time || "值得去",
      restaurants: poi.restaurants || [],
      booking: poi.booking || null,
      sources: poi.sources || [],
    });
    extras.push(item);
    collected.push(item);
  });

  return [...primary, ...extras];
}

function getAllMapItems(trip) {
  const seen = new Set();
  const items = [];
  trip.days.forEach((day) => {
    getDayMapItems(day).forEach((p) => {
      if (seen.has(p.id)) return;
      seen.add(p.id);
      items.push({ ...p, dayId: day.id });
    });
  });
  return items;
}

function enrichPlace(p) {
  const pm = PLACE_META[p.id] || {};
  return {
    ...p,
    hours: p.hours || pm.hours || null,
    image: p.image || pm.image || null,
    restaurants: (p.restaurants || []).map((r) => {
      const rm = RESTAURANT_META[r.name] || {};
      return {
        ...r,
        hours: r.hours || rm.hours || null,
        image: r.image || rm.image || null,
      };
    }),
  };
}

function enrichTrip(trip) {
  return {
    ...trip,
    days: trip.days.map((d) => ({
      ...d,
      places: d.places.map(enrichPlace),
    })),
  };
}
