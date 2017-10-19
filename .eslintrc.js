module.exports = {
	"extends": "airbnb-base",
	"parser": "babel-eslint",
	"globals" : {
		"Vue" : true,
		"$": true,
		"wx": true,
		"pingpp": true,
		"etouch": true,
		"INIT_STATE":true,
		"NODE_ENV":true,
		"FastClick":true,
		"MultiPicker":true,
	},
	env: {
		browser: true,
	},
	"plugins": [
		'html'
	],
	"rules" : {
		"global-require": 0,
		"indent": [0, "tab"], // 去掉tab约定,IDE会有问题
		"no-new" : 0, // 避免vue 必须new调用的注释
		"no-trailing-spaces": [0, { "skipBlankLines": true }],// 去掉行未得空格
		"no-param-reassign": 0,
		"no-tabs": 0,
		"key-spacing": 0,
		"no-alert": 0,
		"no-console": 0,
		"no-mixed-operators": 0,
		"object-shorthand": 0,
		"no-mixed-spaces-and-tabs": 0,
		"no-plusplus": 0,
		"linebreak-style": 0
	},
};