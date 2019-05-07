const mysql = require('mysql'); 
const config = require("./config/db.js");

const pool = mysql.createPool(config.db);

function query( sql, values ) {
  // 返回一个 Promise
  return new Promise(( resolve, reject ) => {
    pool.getConnection(function(err, connection) {
      if (err) {
        reject( err )
      } else {
        connection.query(sql, values, ( err, rows) => {

          if ( err ) {
            reject( err )
          } else {
            resolve( rows )
          }
          // 结束会话
          connection.release()
        })
      }
    })
  })
}

async function saveProduct(params) {
	try {
		let rows = await query("SELECT count(*) as num from `ch_products` where good_id= ?", [params.good_id]);
		if (rows[0].num == 0)
			addProduct(params);
		else 
			updateProduct(params);	
	} catch (err) {
		throw new Error("检查数据跟新出错：" + err.message);
		return '';
	}
}

async function addProduct(params) {
	try {
		let paramsArr = [params.localName, params.price, params.sourceUrl, params.sourceName, params.shopName, params.sales, params.express, params.shopAddress, params.originPrice, params.props, params.swips, params.detailImgs, params.good_id];
		let result = await query("INSERT INTO `ch_products`(`title`, `price`, `source_url`, `source_name`, `shop_name`, `sales`, `express`, `shop_address`, `originprice`, `props`, `swips`, `detailimgs`, `good_id`) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", paramsArr);
		console.log(result);
		return result;	
	} catch (err) {
		throw new Error("添加商品出错：" +err.message + " good_id: " + params.good_id);
		return '';
	}

}

async function updateProduct(params) {
	try {
		let paramsArr = [params.localName, params.price, params.originPrice, params.sales, params.swips, params.detailImgs, params.props, params.sourceUrl, params.good_id];
		let result = await query("UPDATE `ch_products` set `title` = ?, `price` = ?, `originPrice` = ?, `sales` = ?, `swips` =?, `detailimgs`=?, `props` = ?, `source_url` = ? WHERE `good_id`=?", paramsArr);
		console.log(result);
		return result;
	} catch (err) {
		throw new Error("更新商品出错：" + err.message + " good_id: " + params.good_id);
		return '';
	}
}

module.exports = {
	saveProduct: saveProduct
}