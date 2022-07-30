const API = 'https://api.github.com/users/';

const requestMaxTimeMs = 300000;

const app = Vue.createApp({
	data() {
		return {
			search: null,
			result: null,
			error: null,
			favorites: new Map(),
		};
	},
	created() {
		const savedFavorites = JSON.parse(window.localStorage.getItem('favorites'));
		if (savedFavorites?.length) {
			const favorites = new Map(
				savedFavorites.map(favorite => [favorite.login, favorite])
			);
			this.favorites = favorites;
		}
	},
	computed: {
		isFavorite() {
			return this.favorites.has(this.result.login);
		},
		allFavorites() {
			return Array.from(this.favorites.values());
		},
	},
	methods: {
		async doSearch() {
			this.result = this.error = null;

			/* Para evitar volver a hacer búsquedas de perfiles que ya están en favoritos */
			const foundInFavorites = this.favorites.get(this.search);

			/* Establece el tiempo mínimo para tener que volver a hacer
			la búsqueda del favorito para actualizar su información */
			const shouldRequestAgain = (() => {
				if (!!foundInFavorites) {
					const { lastRequestTime } = foundInFavorites;
					const now = Date.now();
					return now - lastRequestTime > requestMaxTimeMs;
				}
				return false;
			})(); // IIFE

			if (!!foundInFavorites && !shouldRequestAgain) {
				console.log('Found and we use the cached version');
				return (this.result = foundInFavorites);
			}

			/* Si no está en favoritos o tiene más tiempo allí del 
			establecido, realiza nuevamente la búsqueda */
			try {
				console.log('Not found or cached version is too old');
				const res = await fetch(API + this.search);
				if (!res.ok) throw new Error('User not found');
				const data = await res.json();
				console.log(data);
				this.result = data;
				foundInFavorites.lastRequestTime = Date.now(); // Fija la nueva fecha de adición
			} catch (error) {
				this.error = error;
				setTimeout(() => {
					this.error = '';
				}, 3000);
			} finally {
				this.search = null;
			}
		},
		addFavorite() {
			this.result.lastRequestTime =
				Date.now(); /* Agrega la fecha en que fue agregado el favorito */
			this.favorites.set(this.result.login, this.result);
			this.updateStorage();
		},
		removeFavorite() {
			this.favorites.delete(this.result.login);
			this.updateStorage();
		},
		showFavorite(favorite) {
			this.result = favorite;
		},
		updateStorage() {
			window.localStorage.setItem(
				'favorites',
				JSON.stringify(this.allFavorites)
			);
		},
	},
});
