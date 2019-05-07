function getQuery(url, name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  let urls = url.split("?");
  var r = urls[1].match(reg);
  if (r != null) {
      return unescape(r[2]);
  }
  return null;
}

module.exports = {
	getQuery: getQuery
}