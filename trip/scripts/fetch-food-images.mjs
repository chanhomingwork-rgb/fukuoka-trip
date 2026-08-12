import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "../assets/food");
fs.mkdirSync(outDir, { recursive: true });

const items = [
  ["yatai", "yatai fukuoka nakasu"],
  ["unagi", "unagi seiro mushi japan"],
  ["ramen", "hakata ramen"],
  ["mentaiko", "mentaiko fukuoka"],
  ["curry", "yaki curry mojiko"],
  ["gyoza", "tetsunabe gyoza hakata"],
  ["mizutaki", "mizutaki fukuoka"],
  ["motsunabe", "motsunabe hakata"],
  ["karato", "karato ichiba"],
  ["canal-city", "canal city hakata"],
  ["starbucks-dazaifu", "starbucks dazaifu tenmangu"],
  ["umegae", "umegae mochi dazaifu"],
  ["sushi", "sushi japan plate"],
  ["fireworks", "kanmon fireworks"],
  ["gundam", "nu gundam fukuoka"],
  ["croissant", "croissant bakery japan"],
  ["cheese-tart", "bake cheese tart"],
  ["udon", "udon japan"],
  ["sashimi", "sashimi market japan"],
];

async function fetchThumb(query) {
  const url =
    "https://commons.wikimedia.org/w/api.php?action=query&generator=search" +
    `&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=6&prop=imageinfo` +
    "&iiprop=url&iiurlwidth=960&format=json";
  const res = await fetch(url);
  const json = await res.json();
  const pages = Object.values(json.query?.pages || {});
  const info = pages[0]?.imageinfo?.[0];
  return info?.thumburl || info?.url || null;
}

for (const [name, query] of items) {
  try {
    const thumb = await fetchThumb(query);
    if (!thumb) {
      console.log("skip", name);
      continue;
    }
    const clean = thumb.split("?")[0];
    const img = await fetch(clean, { headers: { "User-Agent": "FukuokaTripApp/1.0" } });
    if (!img.ok) throw new Error(img.statusText);
    const buf = Buffer.from(await img.arrayBuffer());
    fs.writeFileSync(path.join(outDir, `${name}.jpg`), buf);
    console.log("ok", name, buf.length);
  } catch (e) {
    console.log("fail", name, e.message);
  }
}
