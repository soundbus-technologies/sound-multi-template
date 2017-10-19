var LOCALHOST;
if(global.location) {
	if(global.location.port === '') {
		LOCALHOST = '';
	} else {
		LOCALHOST = 'http://'+ global.location.hostname +':1600';
	}
}


function getApiVersion(module,action) {
	var pre = process.env.NODE_ENV === 'dev' ? '' : LOCALHOST;
	return pre + '/' + module +'/' + action;
}

module.exports.apiV = getApiVersion;
