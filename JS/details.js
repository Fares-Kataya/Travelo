import {
	createElement,
	generateSpinner,
	getData,
	getURLQueries,
} from './utility.js';

const name = document.querySelectorAll('.name');
const imagesContainer = document.querySelector('.images');
const placeImage = document.getElementById('placeImage');
const rightBtn = document.querySelector('.right');
const leftBtn = document.querySelector('.left');
const dots = document.querySelector('.dots');
const rating = document.querySelectorAll('.rating');
const count = document.querySelectorAll('.count');
const phone = document.getElementById('phone');
const desc = document.querySelector('.description');
const moreImgs = document.querySelector('.more-images');
const reviewsContainer = document.querySelector('.reviews');
const totalReviews = document.querySelector('.total-reviews');
const price = document.getElementById('price');
const oneDay = document.querySelector('.oneDay');
const checkInOut = document.querySelector('.check-in-out');
const noOfGuests = document.querySelectorAll('.numberOfGuests');
const guestPrice = document.querySelectorAll('.guestPrice');
const taxPrice = document.querySelectorAll('.taxPrice');
const totalPrice = document.querySelectorAll('.totalPrice');
const selectGusets = document.getElementById('selectGuests');
const initprice = document.getElementById('initPrice');
const confirmForm = document.querySelector('.confirm-form');
const checkOutBtn = document.querySelector('.checkout');
const thanks = document.querySelector('.thanks');
const stars = document.querySelectorAll('.star');
const end = document.querySelector('.end');
const dark = document.querySelector('.dark');
const close = document.querySelector('.close');
const closeBtn = document.querySelector('.btn-close-white');
const paymentForm = document.querySelector('.confirm');
let calcBill = {
	initalPrice: 0,
	noGuests: 1,
	firstDay: new Date().getDate(),
	lastDay: new Date().getDate() + 1,
	tax: Math.trunc(Math.random() * 100),
};

function setprices() {
	calcBill.price = parseInt(price.innerText) * calcBill.noGuests;
	console.log(guestPrice);
	guestPrice.forEach((item) => (item.innerText = `${calcBill.price} $`));
	calcBill.total = calcBill.price + calcBill.tax;
	totalPrice.forEach((item) => (item.innerText = `${calcBill.total} $`));
	console.log(totalPrice);
}

function chooseNumberOfGuests(e) {
	let value = e.target.value;
	noOfGuests.forEach((item) => (item.innerText = value));
	calcBill.noGuests = parseInt(value);
	setprices();
}

function setData(data) {
	if (
		data.types.includes('Restaurant') ||
		data.types.includes('restaurant') ||
		data.types.includes('cafe') ||
		data.types.includes('Cafe')
	) {
		oneDay.classList.remove('d-none');
	} else {
		checkInOut.classList.remove('d-none');
	}
	name.forEach((item) => (item.innerText = data.name));
	placeImage.setAttribute('src', data.photos[0]);
	rating.forEach((rate) => {
		rate.innerText = data.rating;
	});
	count.forEach((item) => (item.innerText = data.review_count));
	phone.innerText = data.phone_number;
	desc.innerText =
		data.description && data.description.length > 0
			? data?.description.join('. ')
			: "Exceptional service meets a warm and inviting atmosphere. Whether you're here to savor a delicious meal, enjoy a relaxing stay, or unwind with a perfectly brewed cup of coffee, we are dedicated to providing you with an unforgettable experience. Our carefully curated menu, cozy ambiance, and commitment to quality ensure that every visit is special. Whether you're gathering with friends, enjoying a solo retreat, or celebrating a special occasion, this place is the perfect destination. We look forward to welcoming you!";
	price.innerText = `${data.price_level || Math.trunc(Math.random() * 400)} $`;
	calcBill.initalPrice = parseInt(price.innerText);
	initprice.innerText = calcBill.initalPrice;
	taxPrice.forEach((item) => (item.innerText = `${calcBill.tax} $`));

	setprices();
	rightBtn.remove();
	leftBtn.remove();
	dots.remove();
	data.photos.slice(0, 5).map((item, index) => {
		const div = createElement('div');
		const img = createElement('img', [], { src: item, alt: data.name });

		if (index === 0) {
			div.classList.add('active');
		}
		div.appendChild(img);
		imagesContainer.appendChild(div);
	});

	data.photos.slice(5, 9).map((item) => {
		const div = createElement('div', ['col-6', 'overflow-hidden']);
		const img = createElement('img', ['rounded-3'], {
			src: item,
			alt: data.name,
		});
		div.appendChild(img);
		moreImgs.appendChild(div);
	});

	createInteractiveMap([data.longitude, data.latitude]);
	imagesContainer.appendChild(rightBtn);
	imagesContainer.appendChild(leftBtn);
	imagesContainer.appendChild(dots);
}

async function loadData() {
	const queries = getURLQueries();
	const params = new URLSearchParams();
	queries.forEach((query) => {
		Object.keys(query).forEach((key) => params.append(key, query[key]));
	});
	try {
		let data = await getData('photos.php', params);
		console.log(data);
		setData(data.data);
	} catch (error) {
		console.log(error);
	}
}

function createReview(review) {
	const personReview = createElement('div', ['person-review']);
	const personData = createElement('div', [
		'd-flex',
		'align-items-center',
		'gap-3',
	]);

	const imgContainer = createElement('div', ['person-img']);
	const img = createElement('img', [], {
		src: review.user_avatar,
		alt: review.user_name,
	});
	imgContainer.appendChild(img);

	const text = createElement('div');
	const name = createElement('p', ['m-0'], {}, review.user_name);
	const time = createElement('p', ['m-0'], {}, review.review_time);
	text.appendChild(name);
	text.appendChild(time);

	personData.appendChild(imgContainer);
	personData.appendChild(text);

	const reviewContainer = createElement('div');
	const reviewText = createElement(
		'p',
		[],
		{},
		`${review.review_text.substring(0, 300)}...`
	);

	reviewContainer.appendChild(reviewText);
	personReview.appendChild(personData);
	personReview.appendChild(reviewContainer);
	return personReview;
}

let reviewsLoaded = false;
function loadReviews() {
	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach(async (entry) => {
				if (entry.isIntersecting && !reviewsLoaded) {
					reviewsLoaded = true;
					const spinner = generateSpinner();
					reviewsContainer.appendChild(spinner);
					try {
						const queries = getURLQueries();
						const params = new URLSearchParams();
						queries.forEach((query) => {
							Object.keys(query).forEach((key) =>
								params.append(key, query[key])
							);
						});
						const data = await getData('reviews.php', params);
						console.log(data);
						reviewsContainer.removeChild(spinner);
						const reviews = data.data.reviews;
						reviews.slice(0, 6).forEach((review) => {
							const personReview = createReview(review);
							reviewsContainer.appendChild(personReview);
						});
					} catch (error) {
						console.log(error);
					}
				}
			});
		},
		{ threshold: 0.1 }
	);
	observer.observe(totalReviews);
}
function sayThanks() {
	confirmForm.classList.add('d-none');
	thanks.classList.remove('opacity-0');
	thanks.classList.remove('position-absolute');
	thanks.classList.add('w-100');
}

let hasSet = false;
function moveRate(e, i) {
	stars.forEach((star, index) => {
		if (index <= i) star.classList.remove('no-rate');
	});
}
function removeRate(e, i) {
	stars.forEach((star, index) => {
		if (index >= i) star.classList.add('no-rate');
	});
}

async function createInteractiveMap(coordinates) {
	mapboxgl.accessToken =
		'pk.eyJ1IjoiZmFyZXN0eWsiLCJhIjoiY204M2c3OTl3MHFrMTJpcjR2Z2ZrYWgybSJ9.elrKNi3eYJ-He6z0zEjjtQ';

	// Initialize the map
	const map = new mapboxgl.Map({
		container: 'map',
		style: 'mapbox://styles/mapbox/streets-v12',
		center: coordinates,
		zoom: 10,
	});

	// Add a custom marker with a popup
	const marker = new mapboxgl.Marker().setLngLat(coordinates).addTo(map);

	// Show user's current location
	map.addControl(
		new mapboxgl.GeolocateControl({
			positionOptions: { enableHighAccuracy: true },
			trackUserLocation: true,
		})
	);

	// Add GeoJSON data layer
	map.on('load', () => {
		map.addSource('places', {
			type: 'geojson',
			data: {
				type: 'FeatureCollection',
				features: [
					{
						type: 'Feature',
						geometry: { type: 'Point', coordinates: coordinates },
						properties: { title: 'Sample Location' },
					},
				],
			},
		});

		map.addLayer({
			id: 'places-layer',
			type: 'circle',
			source: 'places',
			paint: {
				'circle-radius': 8,
				'circle-color': '#007cbf',
			},
		});
	});

	// Add search functionality
	// map.addControl(
	// 	new MapboxGeocoder({
	// 		accessToken: mapboxgl.accessToken,
	// 		mapboxgl: mapboxgl,
	// 	})
	// );
}

// Show/Hide the payment form in the details page
function togglePaymentForm() {
	paymentForm.classList.toggle('active');
	dark.classList.toggle('active');
}

loadReviews();
document.addEventListener('DOMContentLoaded', loadData);
selectGusets.addEventListener('change', chooseNumberOfGuests);
checkOutBtn.addEventListener('click', sayThanks);

stars.forEach((star, index) =>
	star.addEventListener('mouseenter', (e) => {
		if (!hasSet) {
			moveRate(e, index);
		}
	})
);
stars.forEach((star, index) =>
	star.addEventListener('mouseleave', (e) => {
		if (!hasSet) {
			removeRate(e, index);
		}
	})
);

stars.forEach((star, index) =>
	star.addEventListener('click', (e) => {
		hasSet = true;
		moveRate(e, index);
		end.classList.remove('opacity-0');
	})
);

close.addEventListener('click', togglePaymentForm);
closeBtn.addEventListener('click', togglePaymentForm);
dark.addEventListener('click', togglePaymentForm);
