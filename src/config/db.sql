/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 50505
Source Host           : localhost:3306
Source Database       : cheese

Target Server Type    : MYSQL
Target Server Version : 50505
File Encoding         : 65001

Date: 2019-05-07 15:27:56
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for ch_products
-- ----------------------------
DROP TABLE IF EXISTS `ch_products`;
CREATE TABLE `ch_products` (
  `pid` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL COMMENT '商品名称',
  `price` decimal(10,2) NOT NULL COMMENT '当前价格',
  `originprice` decimal(10,2) DEFAULT NULL COMMENT '原价',
  `express` decimal(6,2) NOT NULL DEFAULT '0.00' COMMENT '快递费',
  `sales` varchar(20) DEFAULT '' COMMENT '销量',
  `shop_name` varchar(255) NOT NULL,
  `shop_address` varchar(255) DEFAULT NULL,
  `swips` text NOT NULL COMMENT '轮播图',
  `detailimgs` text NOT NULL COMMENT '详情图片',
  `props` text COMMENT '商品属性',
  `source_url` varchar(255) NOT NULL COMMENT '来源地址',
  `source_name` varchar(30) NOT NULL COMMENT '来源平台',
  `good_id` varchar(30) NOT NULL COMMENT '商品ID',
  PRIMARY KEY (`pid`),
  UNIQUE KEY `unique_good` (`source_name`,`good_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=382 DEFAULT CHARSET=utf8mb4;
