# 基于NodeJs + Puppeteer + Mysql的电商数据爬虫

Puppeteer是谷歌官方出品的一个通过DevTools协议控制headless Chrome的Node库。可以通过Puppeteer的提供的api直接控制Chrome模拟大部分用户操作来进行UI Test或者作为爬虫访问页面来收集数据。

本项目当前只对天猫商品详情数据进行爬虫，后期会扩展淘宝登录后搜索爬虫，欢迎继续关注。

![公众号](./documents/qrcode.jpg "关注公众号")


### 配置文件

配置文件位于 `src/config` 目录下，`db.js`是mysql配置，`db.sql`是爬虫数据保存表的创建sql，`tmall.js`是针对天猫商品详情的字段配置和网页解析函数。

用户可在`tmall.js`的`urls`属性中配置需要爬取的url，将天猫商品详情的url复制进去即可。

### 运行

1. 创建mysql数据库，可命名为`cheese`，然后执行`db.sql`即可；
2. 安装nodejs；
3. 在`cmd`或`powershell`环境下执行`npm i -S`进行依赖安装，安装过程中可能会因为网络问题下载失败，可执行`npm install puppeteer --ignore-scripts` 跳过chromuin的安装；
4. 执行 `node index.js`，如果用户希望数据输出到文件，可执行 `node index.js > data.log`。