const config = require("./src/config/tmall.js");
const model = require("./src/Model.js");
const crawler = require("./src/Crawler.js");

try {
	(new crawler(config)).start()
	.then((data) => {

		//输出爬取的数据
		console.log(data);

		//保存数据到数据表
		// data.forEach((n,i) => {
	 //       model.saveProduct(n);
	 //    })
	});
} catch (err) {
	console.log(err.message)
}