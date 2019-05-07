### 配置文件

配置文件位于 `src/config` 目录下，`db.js`是mysql配置，`db.sql`是爬虫数据保存表的创建sql，`tmall.js`是针对天猫商品详情的字段配置和网页解析函数。

用户可在`tmall.js`的`urls`属性中配置需要爬取的url，将天猫商品详情的url复制进去即可。

### 运行

1. 创建mysql数据库，可命名为`cheese`，然后执行`db.sql`即可；
2. 安装nodejs；
3. 在`cmd`或`powershell`环境下执行`npm i -S`进行依赖安装，安装过程中可能会因为网络问题下载失败，可执行`npm install puppeteer --ignore-scripts` 跳过chromuin的安装；
4. 执行 `node index.js`，如果用户希望数据输出到文件，可执行 `node index.js > data.log`。