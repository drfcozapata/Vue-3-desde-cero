const API = 'https://api.github.com/users/';

const app = Vue.createApp({
	data() {
		return {
			search: null,
			result: null,
			error: null,
		};
	},
	methods: {
		async doSearch() {
			this.result = this.error = null;
			try {
				const res = await fetch(API + this.search);
				if (!res.ok) throw new Error('User not found');
				const data = await res.json();
				console.log(data);
				this.result = true;
			} catch (error) {
				this.error = error;
			} finally {
				this.search = null;
			}
		},
	},
});
