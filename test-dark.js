import puppeteer from 'puppeteer';

(async () => {
    console.log('Launching browser...');
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    // Forward console logs
    page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
    page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));

    console.log('Navigating to http://localhost:5173...');
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });

    console.log('Checking current theme...');
    const htmlTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    console.log('Initial data-theme:', htmlTheme);

    console.log('Clicking the toggle button...');
    const button = await page.$('.theme-toggle');
    if (!button) {
        console.log('COULD NOT FIND BUTTON!');
    } else {
        await button.click();
        
        // Wait a bit
        await new Promise(r => setTimeout(r, 500));
        
        const newTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
        console.log('New data-theme:', newTheme);
    }

    await browser.close();
})();
