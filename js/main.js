const API = 'https://api.github.com/users/';

const app = Vue.createApp({
	data() {
		return {
			message: 'Hello Vue 3!',
		};
	},
	methods: {
		async doSearch() {
			const res = await fetch(API + 'drfcozapata');
			const data = await res.json();
			console.log(data);
		},
	},
});
