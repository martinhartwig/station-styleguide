const puppeteer = require('puppeteer');
const sleep = require('yoctodelay');

module.exports = async ({
    urls: urls = [],
    width: width = 1024,
    height: height = 768,
    wait: wait = 0
}) => {
    console.log('Starting browser ...');
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setViewport({ width, height });

    await urls.reduce(async (promise, urlItem) => {
        // This line will wait for the last async function to finish.
        // The first iteration uses an already resolved Promise
        // so, it will immediately continue.
        await promise;
        console.log(`Capture screenshot from ${urlItem.url}`);
        await page.goto(urlItem.url, { waitUntil: 'networkidle2' });
        await sleep(wait);
        await page.screenshot({ path: urlItem.dest });
    }, Promise.resolve());

    browser.close();
    console.log('Closing browser.');

    return true;
};