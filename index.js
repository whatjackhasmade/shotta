const puppeteer = require(`puppeteer`);
const fs = require(`fs`);
const moment = require(`moment`);
const dateStamp = moment().format(`DD-MM-YYYY`);
const { sites } = require(`./sites.json`);
const { breakpoints } = require(`./breakpoints.json`);

if (!fs.existsSync(dateStamp)) {
	fs.mkdirSync(dateStamp);
}

async function doScreenCapture(url, site_name, device) {
	try {
		const browser = await puppeteer.launch();
		const page = await browser.newPage();

		const deviceViewport = {
			height: device.height,
			width: device.width
		};

		await page.setViewport(deviceViewport);
		await page.goto(url, { waitUntil: `networkidle0` });

		const bodyHandle = await page.$(`body`);
		const { width, height } = deviceViewport;

		const screenshot = await page.screenshot({
			clip: {
				x: 0,
				y: 0,
				width,
				height
			},
			path: `${dateStamp}/${device.size}-${site_name}.png`
		});

		await browser.close();
	} catch (e) {
		console.error(`Error in capturing site for ${site_name}`, e);
	}
}

sites.map(site => {
	try {
		breakpoints.map(device => {
			setTimeout(() => {
				doScreenCapture(site.url, site.name, device);
			}, 10000);
		});
	} catch (e) {
		console.error(`Error in capturing site for ${site.name}`, e);
	}
});
