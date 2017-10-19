var axios = require('axios');
var appConfig = require('../config/app.config');
var isProduction = process.env.NODE_ENV === 'production';

axios.defaults.baseURL = appConfig.baseURL;
function instanceAxios(options) {

  // 如果是dev的情况，手动设置user信息，即可直接谷歌调试

  var headers = isProduction
    ? options.headers || {}
    : Object.assign({
      'user': appConfig.userID
    }, options.headers || {});

  return axios({
    method: options.method || 'get',
    url: options.url,
    data: options.data || {},
    headers: headers,
  })
}

exports.get = function (url, options) {
  options = options || {};
  return instanceAxios({
    url: url,
    data: options.data || {},
    headers: options.headers || {},
  })
};

exports.post = function (url, options) {
  options = options || {};
  return instanceAxios({
    url: url,
    method: 'post',
    data: options.data || {},
    headers: options.headers || {},
  })
};

exports.put = function (url, options) {
  options = options || {};

  return instanceAxios({
    url: url,
    method: 'put',
    data: options.data || {},
    headers: options.headers || {},
  })
};

exports.delete = function (url, options) {
  options = options || {};
  return instanceAxios({
    url: url,
    method: 'delete',
    data: options.data || {},
    headers: options.headers || {},
  })
};
