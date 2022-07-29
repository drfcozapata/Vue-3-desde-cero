const API = 'https://api.github.com/users/';

async function doSearch() {
	const res = await fetch(API + 'drfcozapata');
	const data = await res.json();
	console.log(data);
}

const app = Vue.createApp({
	data() {
		return {
			message: 'Hello Vue 3!',
		};
	},
});
