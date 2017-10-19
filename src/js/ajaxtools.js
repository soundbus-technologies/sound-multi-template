/**
 * 全局调用ajax,默认阻止多次提交问题
 * 以后可以不判断按钮重复提交
 * 支持restful
 * TODO 缺陷! 没有验证data是否相等
 * @param options
 * @example
 url: apiV('test','submit'),
 type : "post",
 data : {
            post :1
        },
 success(res){
            console.log(res,'----post-----');
        }
 })
 */
const isDev = NODE_ENV === 'dev';
let host;
// 根据后端, 配置不同环境下请求的ip或域名
if (process.env === 'development') {
  host = `http://${window.location.host.split(':')[0]}:1600`;
} else if (process.env === 'test') {
  host = '';
} else if (process.env === 'qa') {
  host = '';
} else if (process.env === 'aws') {
  host = '';
} else if (process.env === 'ali'){
  host = '';
}
const cacheXhr = {};
export function ajax(config) {

  const headers = isDev
    ? Object.assign({
      user: '',
    }, config.header || {})
    : Object.assign({
      'x-auth-token' : $.fn.cookie('x-auth-token'),
    }, config.header || {});
  const defaults = {
    url: '',
    type: 'get',
    data: '',
    headers,
    cb: config.success || function success() {},
    error: config.error || function error() {},
  };
  const options = Object.assign({}, defaults, config);

  const getCacheXhr = cacheXhr[`${options.url}, ${options.type}`] || '';
  let [url = '', type = ''] = [getCacheXhr.split(',')[0], getCacheXhr.split(',')[1]];
  type = type && type.trim();
  // console.log(`${host}${options.url}`);
  if (options.url === url && options.type === type) return;
  // return new Promise((resolve,reject) => {
  $.ajax({
    url: `${host}${options.url}`,
    type: options.type,
    data: options.data,
    /*xhrFields: {
      withCredentials: true,
    },*/
    // accepts : 'application/json',
    contentType: options.contentType ? options.contentType : 'application/x-www-form-urlencoded',
    headers: options.headers,
    beforeSend(xhr) {
      const key = `${options.url}, ${options.type}`;
      cacheXhr[key] = key;
      // xhr.setRequestHeader('Authorization', window.localStorage.getItem('Auth'));
    },
    success(res) {
      // resolve && resolve(res)
      if (options.cb) options.cb(res);
    },
    complete(xhr) {
      delete cacheXhr[`${options.url}, ${options.type}`];
      /*if (xhr.status === 401) window.location = '/v1/apply/auth';
       if (xhr.status === 403) {
       alert('非法进入该系统');
       window.location = '/';
       }*/
    },
    error(xhr, errType, err) {
      // if(err === 'Unauthorized') return;
      // if(errType === 'abort') return;
      // alert('网络异常请重试' + errType + err);
      options.error(xhr, errType, err);
    },
  });
}
function rejectError(xhr, reject) {
  if (xhr.status === 401) {
    const ifTrue = confirm('当前会话已失效，请重新登录！');
   if (ifTrue) {
       if (xhr.responseURL.indexOf('/app') > 0) {
           window.location.href = '/app/auth-redirect'
       } else {
           window.location.href = '/agent/auth-redirect'
       }
   }
  }
  console.log(xhr);
  if (xhr.response && JSON.parse(xhr.response).errCode === 'E3810')
    window.location.href = '/agent/static/views/agent/typelist.html';
  else if (xhr.response && JSON.parse(xhr.response).errCode === 'E3815')
  {
    alert('子管理员无效');
    window.location.href = '/agent/auth-redirect';
  }
  else if (xhr.response && JSON.parse(xhr.response).errCode)
    alert (errorMap(JSON.parse(xhr.response).errCode));
  else
    alert(JSON.parse(xhr.response).errMsg ? JSON.parse(xhr.response).errMsg : '系统未知错误。');
	try {
		JSON.parse(xhr.response);
	} catch (e) {
		return console.log(xhr);
	}
	reject(xhr);
}
export function query(name) {
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i');
  const r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}

export function ajaxGet(getUrl, getData = {}) {
  return new Promise((resolve, reject) => {
    ajax({
      accept: "application/json",
      url: getUrl,
      data: getData,
      success(ret) {
        resolve(ret);
      },
      error(xhr) {
	      rejectError(xhr, reject);
      },
    });
  });
}

export function ajaxPost(postUrl, postData = {}, contentType) {
  return new Promise((resolve, reject) => {
    ajax({
      accept: "application/json",
      url: postUrl,
      type: 'post',
      data: postData,
      contentType: contentType,
      success(ret) {
        resolve(ret);
      },
      error(xhr) {
	      rejectError(xhr, reject);
      },
    });
  });
}

export function ajaxDelete(deleteUrl, deleteData = {}) {
  return new Promise((resolve, reject) => {
    ajax({
      url: deleteUrl,
      type: 'delete',
      data: deleteData,
      success(ret) {
        resolve(ret);
      },
      error(xhr) {
        rejectError(xhr, reject);
      },
    });
  });
}

export function ajaxPut(putUrl, putData = {}, contentType) {
    return new Promise((resolve, reject) => {
        ajax({
            url: putUrl,
            type: 'put',
            data: putData,
            contentType: contentType,
            success(ret) {
                resolve(ret);
            },
            error(xhr) {
                rejectError(xhr, reject);
            },
        });
    });
}

export function errorMap(errcode) {
  const errorArr = {
    "E0000": "系统内部错误",
    "E0004": "该账号已经是超级管理员，无法添加成为子管理员",
    "E0107": "该账号已在其他微信登录，退出后才能在新的微信登录",
    "E0110": "该用户不存在",
    "E2000": "有必填项未填",
    "E2001": "唯一性检查错误",
    "E2002": "有效性检查错误",
    "E2003": "无效值检查错误",
    "E2004": "类型检查错误",
    "E2005": "未查询到数据",
    "E0211": "对同一个手机号码发送短信验证码，支持1条/分钟，5条/小时，10条/天。一个手机号码只能收到40条/天。",
    "E3000": "平台未授权",
    "E3001": "平台已停用",
    "E3002": "平台授权已过期",
    "E3100": "声连码已停用",
    "E3101": "声连码授权已过期",
    "E3102": "声连码数量超过限制",
    "E3200": "推送状态已停用",
    "E3201": "无推送内容",
    "E3202": "声连码已使用在其他推送配置",
    "E3300": "内容状态已停用",
    "E3302": "已超过有效保存时间，请重新进入编辑模板",
    "E3400": "应用数量超过限制",
    "E3500": "应用已停用",
    "E3700": "客户已停用",
    "E10001": "未经过授权",
    "E10003": "无权限访问",
    "E10100": "无法识别客户端",
    "E10101": "客户端ID不存在",
    "E10102": "客户端Key/Secret错误",
    "E10202": "验证码错误",
    "E10103": "无法获取AccessToken",
    "E3800": "代理商客户不存在",
    "E3801": "代理商客户账号已存在",
    "E3802": "代理商已存在",
    "E3803": "代理商状态无效",
    "E3804": "代理商已过期",
    "E3805": "代理商不存在",
    "E3806": "合同不存在",
    "E3807": "代理商更新失败",
    "E3808": "该订单已支付成功",
    "E3809": "该账号已经是子管理员",
    "E3811": "库存不足",
    "E3812": "订单创建失败",
    "E3813": "订单不存在",
    "E3814": "您已是一级代理商,无法为自己授权二级代理",
    "E3815": "子管理员无效",
  };
  return errorArr[errcode];
}