import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];
const warnings = [];

const requiredFiles = [
  "index.html",
  "robots.txt",
  "sitemap.xml",
  "netlify.toml",
  "assets/fullproof-primary-wordmark.svg",
  "assets/fullproof-horizontal-lockup.svg",
  "assets/fullproof-fp-seal.svg",
];

const bannedPatterns = [
  /Two for the Road/i,
  /TWO FOR THE ROAD/i,
  /mobile-bar-setup-real\.jpg/i,
  /black-mobile-bar-full-setup\.jpg/i,
];

const requiredHomepagePatterns = [
  /joe@fullproofbartending\.com/i,
  /\(?562\)?[\s.-]*444[\s.-]*8030/,
  /Check availability/i,
  /Standard Service/i,
  /\$599\s*\/\s*3 hours/i,
  /\$699\s*\/\s*4 hours/i,
  /Launch Clear Ice/i,
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

for (const file of requiredFiles) {
  if (!exists(file)) failures.push(`Missing required file: ${file}`);
}

const htmlFiles = fs
  .readdirSync(root)
  .filter((file) => file.endsWith(".html"));

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
    const cleanRef = ref.split("#")[0].split("?")[0];
    if (cleanRef && !exists(cleanRef)) failures.push(`${file} references missing file: ${ref}`);
  }

  const imageRefs = [...html.matchAll(/<img\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi)];
  for (const [tag, src] of imageRefs) {
    if (!/alt=["'][^"']+["']/i.test(tag)) {
      failures.push(`${file} image is missing useful alt text: ${src}`);
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
