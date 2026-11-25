
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

const BASE_URL = process.env.BASE_URL || 'http://localhost:4321';
const BASELINE_DIR = './validation-screenshots/baseline';
const CURRENT_DIR = './validation-screenshots/current';
const DIFF_DIR = './validation-screenshots/diff';

const URLS = [
  '/',
  '/about',
  '/links',
  '/videos',
  '/discog',
  '/discog/amulet',
  '/discog/dependent-origination'
];

// Ensure directories exist
[BASELINE_DIR, CURRENT_DIR, DIFF_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

async function validate() {
  const mode = process.argv[2] || 'baseline'; // 'baseline' or 'compare'
  console.log(`Starting validation in ${mode} mode on ${BASE_URL}...`);

  const browser = await puppeteer.launch({
    headless: "new"
  });
  const page = await browser.newPage();

  // Set viewport for consistent screenshots
  await page.setViewport({ width: 1280, height: 800 });

  let errors = 0;

  for (const url of URLS) {
    const fullUrl = `${BASE_URL}${url}`;
    console.log(`Checking ${fullUrl}...`);

    const pageErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        pageErrors.push(msg.text());
      }
    });
    page.on('pageerror', err => {
      pageErrors.push(err.toString());
    });

    try {
      const response = await page.goto(fullUrl, { waitUntil: 'networkidle0' });
      const status = response.status();

      if (status === 200) {
        console.log(`  ✅ Status: ${status}`);
      } else {
        console.error(`  ❌ Status: ${status}`);
        errors++;
      }

      if (pageErrors.length > 0) {
        console.error(`  ❌ Console Errors:`);
        pageErrors.forEach(e => console.error(`    - ${e}`));
        errors++;
      } else {
        console.log(`  ✅ No Console Errors`);
      }

      // Screenshot
      const safeName = url === '/' ? 'home' : url.replace(/\//g, '-').replace(/^-/, '');
      const filename = `${safeName}.png`;

      if (mode === 'baseline') {
        await page.screenshot({ path: path.join(BASELINE_DIR, filename) });
        console.log(`  📸 Baseline screenshot saved: ${filename}`);
      } else if (mode === 'compare') {
        const currentPath = path.join(CURRENT_DIR, filename);
        await page.screenshot({ path: currentPath });

        const baselinePath = path.join(BASELINE_DIR, filename);
        if (fs.existsSync(baselinePath)) {
          const img1 = PNG.sync.read(fs.readFileSync(baselinePath));
          const img2 = PNG.sync.read(fs.readFileSync(currentPath));
          const { width, height } = img1;
          const diff = new PNG({ width, height });

          const numDiffPixels = pixelmatch(img1.data, img2.data, diff.data, width, height, { threshold: 0.1 });

          if (numDiffPixels > 0) {
            console.error(`  ❌ Visual regression detected: ${numDiffPixels} pixels differ`);
            fs.writeFileSync(path.join(DIFF_DIR, filename), PNG.sync.write(diff));
            errors++;
          } else {
            console.log(`  ✅ Visual check passed`);
          }
        } else {
          console.warn(`  ⚠️ No baseline found for ${filename}, skipping comparison`);
        }
      }

    } catch (e) {
      console.error(`  ❌ Failed to load: ${e.message}`);
      errors++;
    }
  }

  await browser.close();

  if (errors > 0) {
    console.error(`\nValidation finished with ${errors} errors.`);
    process.exit(1);
  } else {
    console.log(`\nValidation passed successfully!`);
    process.exit(0);
  }
}

validate();
