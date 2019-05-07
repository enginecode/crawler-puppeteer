const util = require("../utils/util.js");

module.exports = {
	urls: [
		"https://detail.tmall.com/item.htm?id=591689005304&rn=2b2238396fecaab6d7c864ae31f3d72f&abbucket=7"	
	],
	items: [
		{
			key: 'localName',
			name: '商品名称'
		},
		{
			key: 'price',
			name: '当前价格'
		},
    	{ 
    		key: 'sourceUrl', 
    		name: '当前页面地址' 
    	}, 
    	{
    		key: 'sourceName',
    		name: '来源名称'
    	},
    	{
    		key: 'shopName',
    		name: '当前店铺'
    	},
    	{
    		key: 'sales',
    		name: '销量'
    	},
    	{
    		key: 'express',
    		name: '快递费'
    	},
    	{ 
    		key: 'shopAddress', 
    		name: '商家地址' 
    	}, 
    	{ 
    		key: 'originPrice', 
    		name: '原价' 
    	},
    	{ 
    		key: 'props', 
    		name: '产品属性'
    	},
    	{ 	key: "swips", 
    		name: '轮播图'
    	},
    	{ 
    		key: "detailImgs", 
    		name: "详情图片"
    	},
    	{ 
    		key: 'good_id', 
    		name: '商品ID'
    	}
	],
	parser: [
		async function localName(page) {
			return await page.$eval(".module-title .main", ele => ele.innerText);
		},
		async function price(page) {
			try {
				await page.waitForSelector(".module-price .real-price .ui-yen .price");
				return await page.$eval(".module-price .real-price .ui-yen .price", ele => ele.innerText);
			} catch (err) {
				throw new Error("获取Price出错！");
				return 0;
			}
		},
		async function sourceUrl(page) {
			try {
				return "https://detail.tmall.com/item.htm?id=" + util.getQuery(await page.url(), 'id');
			} catch (err) {
				throw new Error("获取页面地址失败！");
				return '';
			}
		},
		async function sourceName(page) {
			return 'tmall';
		},
		async function shopName(page) {
			try {
				await page.waitForSelector(".shop-name");
				return await page.$eval(".shop-name", ele => ele.innerText);
			} catch (err) {
				throw new Error("获取店铺名称失败！");
				return '';
			}
		},
		async function sales(page) {
			try {
				await page.waitForSelector(".sales");
        		return await page.$eval('.sales', ele => {
        			return ele.innerText.replace(/(月销量\s)(\d+)([\u4e00-\u9fa5])/, "$2") || '';
        		})
			} catch (err) {
				throw new Error("获取销量失败！");
				return '';
			}
		},
		async function express(page) {
			try {
				await page.waitForSelector(".postage");
				return await page.$eval(".postage", ele => {
					return ele.innerText.replace(/[\u4e00-\u9fa5]+:\s/, "") || ""
				})
			} catch (err) {
				throw new Error("获取快递费失败！");
				return 0;
			}
		},
		async function shopAddress(page) {
			try {
				await page.waitForSelector(".delivery");
				return await page.$eval(".delivery", ele => ele.innerText);
			} catch (err) {
				throw new Error("获取店铺地址失败！");
				return 0;
			}
		},
		async function originPrice(page) {
			try {
				await page.waitForSelector(".item-price del");
				return await page.$eval(".item-price del", ele => ele.innerText.replace(/(.{1})(\d+)/, "$2"));
			} catch (err) {
				//throw new Error("获取原价：" + err.message);
				return 0;
			}
		},
		async function props(page) {
			try {
				await page.waitForSelector(".prop-cover-container .field");
				let trs = await page.$$(".prop-cover-container .field tr");
				let props = [];
				for (let tr of trs) {
					let temp = {};
					temp['name'] =  await tr.$eval("th", ele => ele.innerText);
					temp['value'] = await tr.$eval("td", ele => ele.innerText);
					props.push(temp);
				}
				return JSON.stringify(props);
			} catch (err) {
				throw new Error("获取商品属性失败！");
				return '';
			}
		},
		async function good_id(page) {
			try {
				return util.getQuery(await page.url(), 'id');
			} catch (err) {
				throw new Error("获取商品ID失败！");
				return '';
			}
		},
		async function swips(page) {
			try {
				await page.waitForSelector(".preview-slider .item img");
				return await page.$$eval(".preview-slider .item img", nodes => {
					return nodes.map((node) => {
						let src = node.src;
						console.log(src);
						if (!(new RegExp(/(.*)(.jpg|png)(.*\.jpg|png)(_\.webp)?/)).test(src)) {
							return "https:" + src.replace(/https:/, '');
						} else {
							return "https:" + src.replace(/(.*)(.jpg|png)(.*\.jpg|png)(_\.webp)?/, "$1$2").replace(/https:/, '');
						}
					}).join(',');
				})
			} catch (err) {
				throw new Error("获取轮播图：" + err.message);
				return '';
			}
		},

		async function detailImgs(page) {
			try {
				await page.waitForSelector("#modules-desc .lazyImg");

				return await page.$$eval("#modules-desc .lazyImg", nodes => {
					return nodes.map((node) => {
						let src = node.src;
						if (!(new RegExp(/(.*)(.jpg|png)(.*\.jpg|png)(_\.webp)?/)).test(src)) {
							return "https:" + src.replace(/https:/, '');
						} else {
							return "https:" + src.replace(/(.*)(.jpg|png)(.*\.jpg|png)(_\.webp)?/, "$1$2").replace(/https:/, '');
						}
					}).join(',');
				})
			} catch (err) {
				try {
					await page.waitForSelector("#s-desc img");

					return await page.$$eval("#s-desc img", nodes => {
						return nodes.map((node) => {
							let src = node.src;
							if (!(new RegExp(/(.*)(.jpg|png)(.*\.jpg|png)(_\.webp)?/)).test(src)) {
								return "https:" + src.replace(/https:/, '');
							} else {
								return "https:" + src.replace(/(.*)(.jpg|png)(.*\.jpg|png)(_\.webp)?/, "$1$2").replace(/https:/, '');
							}
						}).join(',');
					})
				} catch (err) {
					throw new Error("详情解析失败：" + err.message);
					return '';
				}
			}
		}
	]
}