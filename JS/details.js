import { getData, getURLQueries } from './utility.js';

const imagesContainer = document.querySelector('images');
async function loadData() {
	const queries = getURLQueries();
	const params = new URLSearchParams();
	queries.forEach((query) => {
		Object.keys(query).forEach((key) => params.append(key, query[key]));
	});
	try {
		let data = await getData('photos.php', params);
		console.log(data);
	} catch (error) {
		console.log(error);
	}
}

document.addEventListener('DOMContentLoaded', loadData);
