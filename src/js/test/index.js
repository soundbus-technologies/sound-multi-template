const state = INIT_STATE;
import { getInitList } from './../../apis/test.api';

new Vue ({
	el: '#container',
	data: {
		status: 0, // 0:enabled-启动, 1:disabled-停用, 2:canceled-注销, 3:deleted-删除
		nickName: 'Tom',
		list: []
	},
	mounted() {
		getInitList().then(response => {
			this.status   = response.status;
			this.nickName = response.nickName;
			this.list     = response.list;
		});
	},
	methods: {
	},
	computed: {
		listLength() {
			return this.list.length;
		}
	},
});



