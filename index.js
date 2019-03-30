const puppeteer = require(`puppeteer`);

async function doScreenCapture(url, site_name) {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.setViewport({
		height: 1080,
		width: 1920
	});
	await page.goto(url, { waitUntil: `networkidle0` });
	const bodyHandle = await page.$("body");
	const { width, height } = await bodyHandle.boundingBox();
	const screenshot = await page.screenshot({
		clip: {
			x: 0,
			y: 0,
			width,
			height
		},
		path: `${site_name}.png`
	});
	await browser.close();
}

const today = new Date();
const dd = String(today.getDate()).padStart(2, "0"),
	mm = String(today.getMonth() + 1).padStart(2, "0"),
	yyyy = today.getFullYear();

const dateStamp = `${dd}-${mm}-${yyyy}-`;

const sites = [
	{
		name: `${dateStamp}whatjackhasmade-homepage`,
		url: `https://whatjackhasmade.co.uk`
	},
	{
		name: `${dateStamp}whatjackhasmade-posts`,
		url: `https://whatjackhasmade.co.uk/posts`
	},
	{
		name: `${dateStamp}whatjackhasmade-about`,
		url: `https://whatjackhasmade.co.uk/about`
	},
	{
		name: `${dateStamp}leomik-homepage`,
		url: `https://www.leomik.com/`
	},
	{
		name: `${dateStamp}leomik-digital-adverts`,
		url: `https://www.leomik.com/digital-adverts`
	},
	{
		name: `${dateStamp}leomik-social-media`,
		url: `https://www.leomik.com/social-media`
	},
	{
		name: `${dateStamp}leomik-about`,
		url: `https://www.leomik.com/about`
	},
	{
		name: `${dateStamp}leomik-contact`,
		url: `https://www.leomik.com/contact`
	}
];

for (let i = 0; i < sites.length; i++) {
	try {
		doScreenCapture(sites[i][`url`], sites[i][`name`]);
	} catch (e) {
		console.error(`Error in capturing site for ${sites[i][`name`]}`, e);
	}
}
