const puppeteer = require(`puppeteer`);
const fs = require(`fs`);
const moment = require(`moment`);
const dateStamp = moment().format(`DD-MM-YYYY`);

if (!fs.existsSync(dateStamp)) {
	fs.mkdirSync(dateStamp);
}

async function doScreenCapture(url, site_name, device) {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();

	let deviceViewport = {
		height: 1080,
		width: 1920
	};

	if (device === `tablet`) {
		deviceViewport = {
			height: 768,
			width: 1024
		};
	}

	if (device === `tablet-portrait`) {
		deviceViewport = {
			height: 1024,
			width: 768
		};
	}

	if (device === `mobile`) {
		deviceViewport = {
			height: 550,
			width: 320
		};
	}

	await page.setViewport(deviceViewport);

	await page.goto(url, { waitUntil: `networkidle0` });
	const bodyHandle = await page.$(`body`);
	const { width, height } = await bodyHandle.boundingBox();

	const screenshot = await page.screenshot({
		clip: {
			x: 0,
			y: 0,
			width,
			height
		},
		path: `${dateStamp}/${device}-${site_name}.png`
	});

	await browser.close();
}

const sites = [
	{
		name: `whatjackhasmade-homepage`,
		url: `https://whatjackhasmade.co.uk`
	},
	{
		name: `whatjackhasmade-posts`,
		url: `https://whatjackhasmade.co.uk/posts`
	},
	{
		name: `whatjackhasmade-about`,
		url: `https://whatjackhasmade.co.uk/about`
	},
	{
		name: `leomik-homepage`,
		url: `https://www.leomik.com/`
	},
	{
		name: `leomik-digital-adverts`,
		url: `https://www.leomik.com/digital-adverts`
	},
	{
		name: `leomik-social-media`,
		url: `https://www.leomik.com/social-media`
	},
	{
		name: `leomik-about`,
		url: `https://www.leomik.com/about`
	},
	{
		name: `leomik-contact`,
		url: `https://www.leomik.com/contact`
	}
];

const breakpoints = [`desktop`, `tablet`, `tablet-portrait`, `mobile`];

sites.map(site => {
	try {
		breakpoints.map(device => {
			doScreenCapture(site.url, site.name, device);
		});
	} catch (e) {
		console.error(`Error in capturing site for ${site.name}`, e);
	}
});
