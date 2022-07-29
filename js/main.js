const API = 'https://api.github.com/users/';

const app = Vue.createApp({
	data() {
		return {
			search: null,
		};
	},
	methods: {
		async doSearch() {
			const res = await fetch(API + this.search);
			const data = await res.json();
			console.log(data);
			this.search = null;
		},
	},
});
