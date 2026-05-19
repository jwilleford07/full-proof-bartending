import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];
const warnings = [];

const requiredFiles = [
  "index.html",
  "custom-mobile-bar/index.html",
  "why-mobile-bartender/index.html",
  "clear-ice/index.html",
  "smoked-cocktails/index.html",
  "robots.txt",
  "sitemap.xml",
  "netlify.toml",
  "assets/css/addon-pages.css",
  "assets/fullproof-primary-wordmark.svg",
  "assets/fullproof-horizontal-lockup.svg",
  "assets/fullproof-fp-seal.svg",
  "assets/photos/decent-rinser-stock.jpg",
  "assets/photos/ori-glazer-ice-press-stock.jpg",
  "assets/photos/nespresso-essenza-mini-stock.webp",
];

const bannedPatterns = [
  /Two for the Road/i,
  /TWO FOR THE ROAD/i,
  /mobile-bar-setup-real\.jpg/i,
  /black-mobile-bar-full-setup\.jpg/i,
  /professional-bar-setup\.(?:png|jpe?g|webp)/i,
  /reserve-standard-service\.html/i,
  /payment-timing/i,
  /Ready to reserve with 50% deposit/i,
];

const bannedPublicFiles = [
  "assets/photos/professional-bar-setup.png",
  "assets/photos/bartender-service-action.jpg",
  "assets/photos/bartender-shaking-cocktail.jpg",
  "assets/photos/bartender-side-mobile-bar-setup.jpg",
  "assets/photos/event-bar-setup-menu.jpg",
  "assets/photos/founder-behind-bar.jpg",
  "assets/photos/full-mobile-bar-sink-rinser.jpg",
  "assets/photos/hero-rooftop-bartending.jpg",
  "assets/photos/mobile-bar-garnish-detail.jpg",
  "assets/photos/mobile-bar-tools-rinser-detail.jpg",
  "assets/photos/mobile-bar-water-detail.jpg",
];

const requiredHomepagePatterns = [
  /joe@fullproofbartending\.com/i,
  /\(?562\)?[\s.-]*444[\s.-]*8030/,
  /Reserve your date/i,
  /Launch Special/i,
  /FOUNDER/i,
  /\$699\s*\/\s*3 hours/i,
  /\$799\s*\/\s*3 hours/i,
  /Cups \+ Garnishes/i,
  /Basic becomes \$599/i,
  /fresh-pulled espresso/i,
  /date-hold deposit/i,
  /full-proof-event-inquiry/i,
  /self-contained/i,
  /Full custom mobile bar/i,
  /Smoked cocktails or smoke bubbles/i,
  /Select all that apply/i,
  /generator/i,
  /fresh and gray water/i,
  /110v pump/i,
  /rinsers/i,
  /hand-wash station/i,
  /Los Angeles/i,
  /Long Beach/i,
  /Orange County|OC/i,
];

function exists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function walkHtml(dir = root) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name === ".git" || entry.name === "node_modules") continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walkHtml(fullPath));
    if (entry.isFile() && entry.name.endsWith(".html")) files.push(path.relative(root, fullPath));
  }
  return files;
}

for (const file of requiredFiles) {
  if (!exists(file)) failures.push(`Missing required file: ${file}`);
}

for (const file of bannedPublicFiles) {
  if (exists(file)) failures.push(`Banned public-facing old/weak photo remains: ${file}`);
}

const htmlFiles = walkHtml();

if (!htmlFiles.length) failures.push("No HTML files found.");

for (const file of htmlFiles) {
  const html = read(file);

  for (const pattern of bannedPatterns) {
    if (pattern.test(html)) failures.push(`${file} contains banned legacy reference: ${pattern}`);
  }

  const localRefs = [...html.matchAll(/\b(?:src|href)=["']([^"']+)["']/gi)]
    .map((match) => match[1])
    .filter((ref) => {
      if (/^(https?:|mailto:|tel:|#)/i.test(ref)) return false;
      if (ref.startsWith("data:")) return false;
      return true;
    });

  for (const ref of localRefs) {
    let cleanRef = ref.split("#")[0].split("?")[0];
    if (cleanRef.startsWith("/")) cleanRef = cleanRef.slice(1);
    if (cleanRef && !cleanRef.includes(".")) cleanRef = path.join(cleanRef, "index.html");
    if (cleanRef && !exists(cleanRef)) failures.push(`${file} references missing file: ${ref}`);
  }

  const imageRefs = [...html.matchAll(/<img\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi)];
  const localImageRefs = [];
  for (const [tag, src] of imageRefs) {
    if (!/alt=["'][^"']+["']/i.test(tag)) {
      failures.push(`${file} image is missing useful alt text: ${src}`);
    }
    if (/^assets\/photos\//i.test(src)) localImageRefs.push(src);
  }

  if (file === "index.html") {
    const counts = new Map();
    for (const src of localImageRefs) counts.set(src, (counts.get(src) || 0) + 1);
    for (const [src, count] of counts) {
      if (count > 1) failures.push(`Homepage repeats image ${count} times: ${src}`);
    }
  }
}

if (exists("index.html")) {
  const homepage = read("index.html");
  for (const pattern of requiredHomepagePatterns) {
    if (!pattern.test(homepage)) warnings.push(`Homepage may be missing launch/conversion signal: ${pattern}`);
  }
}

if (exists("robots.txt")) {
  const robots = read("robots.txt");
  if (!/Sitemap:\s*https:\/\/fullproofbartending\.com\/sitemap\.xml/i.test(robots)) {
    failures.push("robots.txt must point to https://fullproofbartending.com/sitemap.xml");
  }
}

if (exists("sitemap.xml")) {
  const sitemap = read("sitemap.xml");
  if (!/<loc>https:\/\/fullproofbartending\.com\/<\/loc>/i.test(sitemap)) {
    failures.push("sitemap.xml must include the canonical homepage URL.");
  }
  for (const slug of ["custom-mobile-bar", "why-mobile-bartender", "clear-ice", "smoked-cocktails"]) {
    if (!new RegExp(`<loc>https://fullproofbartending\\.com/${slug}/</loc>`).test(sitemap)) {
      failures.push(`sitemap.xml must include /${slug}/.`);
    }
  }
}

if (warnings.length) {
  console.warn("Warnings:");
  for (const warning of warnings) console.warn(`- ${warning}`);
}

if (failures.length) {
  console.error("Site check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Site check passed for ${htmlFiles.length} HTML file(s).`);
