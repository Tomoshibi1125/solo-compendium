import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => {
    console.log(`[Browser Console ${msg.type()}] ${msg.text()}`);
  });
  
  page.on('pageerror', error => {
    console.log(`[Browser PageError] ${error.message}`);
  });

  page.on('requestfailed', request => {
    console.log(`[Browser Request Failed] ${request.url()} - ${request.failure().errorText}`);
  });

  try {
    await page.goto('http://localhost:8080', { waitUntil: 'networkidle', timeout: 10000 });
  } catch (err) {
    console.log(`[Goto Error] ${err.message}`);
  }

  await browser.close();
})();
