import puppeteer from 'puppeteer';
const browser = await puppeteer.launch({
  headless: 'shell',
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 900 });
await page.goto('http://localhost:5000/login', { waitUntil: 'networkidle0', timeout: 15000 });
await new Promise(r => setTimeout(r, 2000));
await page.screenshot({ path: '/tmp/login-page.png', fullPage: true });
await browser.close();
console.log('Done');
