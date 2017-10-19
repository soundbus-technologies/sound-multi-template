/*
 ## 配置user id

 */
var isProduction = process.env.NODE_ENV === 'production';

var dev = {
  port : '1600',
  router:'router',
  userID : '', // 本机谷歌直接测试，header需要携带的userid
  baseURL : 'http://sonicmoving.com',
};

var pro =  {
  port : '3000',
  router:'routes',
  baseURL : '',
};

module.exports = isProduction ? pro : dev;
