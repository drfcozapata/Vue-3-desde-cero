const API = 'https://api.github.com/users/';

const app = Vue.createApp({
	data() {
		return {
			search: null,
			result: null,
			error: null,
			favorites: new Map(),
		};
	},
	computed: {
		isFavorite() {
			return this.favorites.has(this.result.id);
		},
	},
	methods: {
		async doSearch() {
			this.result = this.error = null;
			try {
				const res = await fetch(API + this.search);
				if (!res.ok) throw new Error('User not found');
				const data = await res.json();
				console.log(data);
				this.result = data;
			} catch (error) {
				this.error = error;
			} finally {
				this.search = null;
			}
		},
		addFavorite() {
			this.favorites.set(this.result.id, this.result);
		},
		removeFavorite() {
			this.favorites.delete(this.result.id);
		},
	},
});
