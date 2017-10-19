#!/usr/bin/env node

/* eslint-disable */
const co = require('co');
const glob = require('glob');
const Promise = require('bluebird');
const argv = require('yargs').argv;
const OSS = require('ali-oss').Wrapper;
const path = require('path');

const DIST_PATH = path.resolve(__dirname, './public');
const LIMIT = 10;

const options = {
	root: DIST_PATH
};

// 配置阿里云的配置
const config = {
	region: '',
	accessKeyId: '',
	accessKeySecret: '',
	bucket: ''
};

const getFiles = {
	image(opts) {
		return new Promise((rs, rj) => {
			glob('/**/*.@(svg|png|jpg|jpeg|gif|eot|ttf|woff|woff2)', opts, (err, files) => {
				if (err) {
					rj(err);
				} else {
					rs(files);
				}
			});
		});
	},
	css(opts) {
		return new Promise((rs, rj) => {
			glob('/**/*.css', opts, (err, files) => {
				if (err) {
					rj(err);
				} else {
					rs(files);
				}
			});
		});
	},
	js(opts) {
		return new Promise((rs, rj) => {
			glob('/**/*.js', opts, (err, files) => {
				if (err) {
					rj(err);
				} else {
					rs(files);
				}
			});
		});
	},
	font(opts) {
		return new Promise((rs, rj) => {
			glob('/**/*.@(eot|ttf|woff|woff2)', opts, (err, files) => {
				if (err) {
					rj(err);
				} else {
					rs(files);
				}
			});
		});
	}
};

let client = new OSS(config);

function upload(type, limit) {
	return co(function* () {
		let file, dest, count, pm, pendingFiles;
		let files = yield getFiles[type](options);
		if (!Array.isArray(files)) {
			console.error('Files not found');
			process.exit(1);
		}
		while (files.length) {
			let group = [];
			pendingFiles = [];
			count = files.length < limit ? files.length : limit;
			console.log('Start upload');
			for (let i = 0; i < count; ++i) {
				file = files.shift();
				dest = file.split('public')[1].replace(/\\/g, '/').slice(1);
				pm = client.put(dest, file);
				group.push(pm);
				pendingFiles.push(file);
				console.log(`Uploading ${file}...`);
			}
			let results = yield Promise.all(group).catch(err => {
				console.log('Error occured:');
				console.log(err);
				console.log('Attempt to retry upload');
				// 失败重传该组，因为这步无法知道是第几个Promise导致失败，只能选择回滚所有
				pendingFiles.forEach(file => files.push(file));
				return null;
			});
			if (results) {
				results.forEach((rst, idx) => {
					// 响应不为200也重传该文件
					if (rst.res.status != 200) {
						files.push(pendingFiles[idx]);
					}
				});
			}
		}
		console.log('DONE.');
	});
}

let type = argv.type || argv.t;
let limit = argv.limit || argv.l;

if (type) {
	upload(type, parseInt(limit) || LIMIT);
} else {
	upload('image', parseInt(limit) || LIMIT)
	.then(() => upload('js', parseInt(limit) || LIMIT))
	.then(() => upload('css', parseInt(limit) || LIMIT))
	.then(() => upload('font', parseInt(limit) || LIMIT));
}