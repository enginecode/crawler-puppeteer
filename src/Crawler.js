const puppeteer = require("puppeteer");
const devices = require("puppeteer/DeviceDescriptors");
const chalk = require('chalk');

class Crawler {
	constructor(config) {
		this.urls = config.urls;
		this.config = config;
		this.urlCount = config.urls.length;
		this.browser = {};
		this.data = [];
	}

	async start() {
		this.browser = await puppeteer.launch({
        						//headless: false
    					});

		//不能使用forEach
		console.log("总共"+this.urlCount+"个页面");
		for (let url of this.urls) {
			--this.urlCount;
			console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++\n");
			console.log(chalk.green("第" + (this.urls.length-this.urlCount)+"个爬虫开始..."));
			await this.run(url);
		}

		return Promise.resolve(this.data)
	}

	async run(url) {
		let page = await this.openPage(url);
		let result = await this.parsePage(page);
		console.log("爬虫数据：" + JSON.stringify(result));
		this.data.push(result);
		await this.closePage(page);
	}

	//打开当前连接
	async openPage(url) {
		try {
			let page = await this.browser.newPage();
			await page.emulate(devices["iPhone X"])
			await page.goto(url, {
				waitUntil:'networkidle0',
				timeout: 0
			})

			//处理详情页懒加载图片
			const imgs = await page.$$eval('img', imgs =>   
						      	Promise.all(
								    imgs.map(img => {
								        if (img.getAttribute('data-ks-lazyload')) {
								            img.src = img.getAttribute('data-ks-lazyload');
								            return new Promise(resolve => img.onload = resolve);
								        } else {
								            return new Promise(resolve => resolve())
								        }
								 
								    })
								));
			await page.click("#J_mod13 > div");

			return page;
		} catch (err) {
			console.log(chalk.red("openPage method: " + err.message));
			return page;
		}
	}

	//处理完成后关闭当前页面
	async closePage(page) {
		try {
			await page.close();
			if (this.urlCount <= 0) {
				this.browser.close();
				console.log(chalk.green('爬虫结束,保存数据到数据库！'));
			}
			return true;
		} catch (err) {
			console.log(chalk.red("closePage method: " + err.message));
			return false;
		}
	}

	//解析页面
	async parsePage(page) {
		let result = {};
		console.log(chalk.green("正在解析：" + await page.url()));
		try {
			for (let parser of this.config.parser) {
				result[parser.name] = await parser(page);
			}
			console.log(chalk.green("解析成功!"));
		} catch (err) {
			console.log(chalk.red("解析失败：" + err.message));
		}

		return result;
	}
}

module.exports = Crawler;
