import { categories } from '../data/categories.js';
import { createElement, loadHeaderFooter, RequestBody } from './utility.js';

// Loading header and footer
loadHeaderFooter('../HTML/header.html').then((data) => {
	document.getElementById('header-container').innerHTML = data;
	const header = document.getElementById('header-container').childNodes[0];
});
loadHeaderFooter('../HTML/footer.html').then((data) => {
	document.getElementById('footer-container').innerHTML = data;
	const footer = document.getElementById('footer-container').childNodes[0];
});

// Importing elements from details page
const imagesDivs = document.querySelectorAll('.images div');
const rightArrow = document.querySelector('.images .right');
const leftArrow = document.querySelector('.images .left');
const dots = document.querySelector('.dots');
const dark = document.querySelector('.dark');
const close = document.querySelector('.close');
const paymentForm = document.querySelector('.confirm');
const reserveBtn = document.getElementById('reserve');

/* Importing elements from landing page */
// arrows in home page
let leftButton = document.querySelector('.more-to-explore-button-left');
let rightButton = document.querySelector('.more-to-explore-button-right');
let container = document.querySelector('.more-to-explore-wrapper');

// Search controls
const searchDiv = document.querySelector('.search-form div');
const searchInput = document.getElementById('search');
const searchBtn = document.querySelector('.search-btn');

// Create Cards showed in the search result
let indicatorsCounter = 0;
function createCard() {
	indicatorsCounter++;
	let imgNumber = 10;

	const card = createElement('div', [
		'd-flex',
		'flex-column',
		'col-12',
		'col-md-6',
		'col-lg-4',
		'col-xl-3',
		'justify-content-center',
		'card-container',
		'mt-2',
	]);

	const carouselExample = createElement(
		'div',
		['carousel', 'slide', 'carouselExampleIndicators'],
		{
			id: `carouselExampleIndicators${indicatorsCounter}`,
		}
	);

	const carouselIndicator = createElement('div', ['carousel-indicators']);

	for (let i = 0; i < imgNumber; i++) {
		const button = createElement('button', ['carousel-indicators'], {
			type: 'button',
			'data-bs-target': `#carouselExampleIndicators${indicatorsCounter}`,
			'data-bs-slide-to': `${i}`,
		});

		if (i == 0) {
			button.classList.add('active');
		}

		carouselIndicator.appendChild(button);
	}

	carouselExample.appendChild(carouselIndicator);

	const carouselInner = createElement('div', [
		'carousel-inner',
		'position-relative',
		'card1',
	]);

	const i = createElement('div', ['fa-solid', 'fa-heart', 'heart']);

	carouselInner.appendChild(i);
	for (let i = 0; i < imgNumber; i++) {
		const carouselItem = createElement('div', ['carousel-item']);

		if (i == 0) {
			carouselItem.classList.add('active');
		}

		const img = createElement('img', ['rounded-3'], {
			src: `../Assets/images/olive-garden-restaurant.jpg`,
			alt: `slide_${i + 1}`,
		});

		carouselItem.appendChild(img);
		carouselInner.appendChild(carouselItem);
	}
	let k = 0;

	const buttonPrev = createElement('button', ['carousel-control-prev'], {
		type: 'button',
		'data-bs-target': `#carouselExampleIndicators${indicatorsCounter}`,
		'data-bs-slide': 'prev',
	});

	const buttonPrevSpan1 = createElement(
		'span',
		['carousel-control-prev-icon'],
		{
			'aria-hidden': 'true',
		}
	);

	const buttonPrevSpan2 = createElement(
		'span',
		['visually-hidden'],
		{},
		'Previous'
	);

	buttonPrev.appendChild(buttonPrevSpan1);
	buttonPrev.appendChild(buttonPrevSpan2);

	const buttonNext = createElement('button', ['carousel-control-next'], {
		type: 'button',
		'data-bs-target': `#carouselExampleIndicators${k++}`,
		'data-bs-slide': 'next',
	});

	const buttonNextSpan1 = createElement(
		'span',
		['carousel-control-next-icon'],
		{
			'aria-hidden': 'true',
		}
	);

	const buttonNextSpan2 = createElement(
		'span',
		['visually-hidden'],
		{},
		'Next'
	);

	buttonNext.appendChild(buttonNextSpan1);
	buttonNext.appendChild(buttonNextSpan2);

	carouselInner.appendChild(buttonPrev);
	carouselInner.appendChild(buttonNext);

	carouselExample.appendChild(carouselInner);

	card.appendChild(carouselExample);

	const cardBody = createElement('div', ['row', 'card-body']);

	const PCardBody = createElement('p', [
		'col-5',
		'd-inline-block',
		'mb-0',
		'fw-bolder',
	]);

	cardBody.appendChild(PCardBody);

	const RateCardBody = createElement('div', [
		'd-flex',
		'flex-row',
		'col-7',
		'justify-content-end',
	]);

	const RateStar = createElement('img', ['img-rate-star'], {
		src: ``,
	});

	const RateText = createElement('p', [], {}, ``);

	RateCardBody.appendChild(RateStar);
	RateCardBody.appendChild(RateText);

	cardBody.appendChild(RateCardBody);

	const CardDetails = createElement('div', ['d-flex', 'flex-column', 'mt-n3']);

	const CardPlaceName = createElement(
		'span',
		['col-12', 'fw-light', 'period'],
		{},
		``
	);

	CardDetails.appendChild(CardPlaceName);

	const CardPlacePeriod = createElement(
		'span',
		['col-12', 'fw-light', 'period'],
		{},
		``
	);

	CardDetails.appendChild(CardPlacePeriod);

	const Price = createElement('div', [
		'd-flex',
		'flex-row',
		'col-12',
		'justify-content-start',
	]);

	const PriceIcon = createElement('img', ['mt-1'], {
		src: ``,
	});

	Price.appendChild(PriceIcon);

	const PriceText = createElement('span', [], {}, ``);

	Price.appendChild(PriceText);

	const TrapMood = createElement('span', ['ms-1', 'fw-bold'], {}, ``);

	Price.appendChild(TrapMood);

	CardDetails.appendChild(Price);

	cardBody.appendChild(CardDetails);

	carouselExample.appendChild(cardBody);

	// const containCard = document.getElementsByClassName('contain-card')[0];
	const containCard = createElement('div', ['contain-card']);

	containCard.appendChild(carouselExample);
	document.body.appendChild(containCard);
}

// const body = {
// 	languageCode: 'en',
// 	regionCode: 'US',
// 	includedTypes: ['restaurant'],
// 	maxResultCount: 15,
// 	locationRestriction: {
// 		circle: {
// 			center: {
// 				latitude: 40.7128,
// 				longitude: -74.006,
// 			},
// 			radius: 5000,
// 		},
// 	},
// 	rankPreference: 0,
// };

// getData(':searchNearby', 'POST', body)
// 	.then((data) => console.log('API Response:', data))
// 	.catch((err) => console.log('Fetch Error:', err));

document.querySelectorAll('.category-item').forEach((item) => {
	item.addEventListener('click', () => {
		document
			.querySelectorAll('.category-item')
			.forEach((i) => i.classList.remove('active'));
		item.classList.add('active');
	});
});

/*
Error in left hand assignment
document.getElementById("arrow-right") = function () {
    let div1 = document.getElementById("div1");
    let div5 = document.getElementById("div5");

    if (div1 && div5) {
        div1.classList.remove("visible");
        div1.classList.add("hidden");

        setTimeout(() => {
            div5.classList.remove("hidden");
            div5.classList.add("visible");
        }, 500);
    }
}
*/

let currentImage = 0;

// Move the images of a place to left in details page
function MoveImagesToLeft() {
	if (currentImage + 1 < imagesDivs.length) {
		imagesDivs[currentImage].classList.remove('active');
		imagesDivs[currentImage].classList.add('inActive');
		imagesDivs[++currentImage].classList.add('active');

		// Refresh the dots at the bottom of the carousel
		loadDots();
	}
}

// Move the images of a place to right in details page
function MoveImagesToRight() {
	if (currentImage > 0) {
		imagesDivs[currentImage].classList.remove('active');
		imagesDivs[--currentImage].classList.remove('inActive');
		imagesDivs[currentImage].classList.add('active');

		// Refresh the dots at the bottom of the carousel
		loadDots();
	}
}

// Set the dots at the bottom of the carousel according to the number of images
function loadDots() {
	dots.innerHTML = '';
	imagesDivs.forEach((div, index) => {
		let classes = ['dot'];
		if (div.classList.contains('active')) {
			classes.push('active');
		}
		const dot = createElement('span', [...classes]);
		dots.appendChild(dot);
	});
}

// Show/Hide the payment form in the details page
function togglePaymentForm() {
	paymentForm.classList.toggle('active');
	dark.classList.toggle('active');
}

/*
<div class="col-12 col-md-6 col-lg-4 col-xl-3 justify-content-center card-container mt-2">
                    <div class="">
                        <div id="carouselExampleIndicators1"
                            class="carousel slide carouselExampleIndicators justify-content" data-bs-interval="100">

                            <div class="carousel-inner position-relative card1">
                                <i class="fa-solid fa-heart heart"></i>
                                <div class="carousel-item active ">
                                    <img class="rounded-3" src="../Assets/images/olive-garden-restaurant.jpg"
                                        alt="First slide">
                                </div>
                            </div>
                        </div>

                        <div class="card-body row">
                            <p class="col-5 d-inline-block mb-0 fw-bolder ">Alexandria Day Trip From Cairo</p>
                            <div class="d-flex flex-row col-7 justify-content-end rate-div">
                                <img src="../Assets/images/star-icon-vector-removebg-preview.png" alt=""
                                    class="img-rate-star">
                                <p class="">4.5</p>
                            </div>
                            <div class="d-flex flex-column mt-n3 card-details">
                                <span class="col-12 fw-light place-name">Resturant </span>
                                <span class="col-12 fw-light period"> 1 - 6 Mars </span>

                                <div class="d-flex flex-row col-12 justify-content-start">
                                    <img src="../Assets/images/Euro-icon.png" class="mt-1 Price-icon">
                                    <span> 1.999</span>
                                    <span class="ms-1 fw-bold">night</span>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
*/

// Creating the categories list
function createCategories() {
	const categoriesWrapper = createElement('div', ['categories-wrapper']);
	const categoriesContainer = createElement('div', [
		'category-container',
		'container-lg',
		'container-xl',
		'text-center',
		'mt-5',
		'd-flex',
	]);
	const categoriesList = createElement('div', ['category-list', 'm-auto']);

	// categories are imported form categories.js file in data directory
	categories.map((item) => {
		// creating each div for each category in the list depending on its data
		const categoryItem = createElement('div', ['category-item']);
		const iconHTML = item.icon;
		const p = createElement('p', [], {}, item.name);
		categoryItem.innerHTML = iconHTML;
		categoryItem.appendChild(p);
		categoriesList.appendChild(categoryItem);
	});

	categoriesContainer.appendChild(categoriesList);
	categoriesWrapper.appendChild(categoriesContainer);

	return categoriesWrapper; // return the wrapper node
}

function createSearchItem(name, img, rate, type, price) {
	let html = `
		<div class="col-12 col-md-3 card-container mt-2">
                    <div class="">
                        <div id="carouselExampleIndicators1"
                            class="carousel slide carouselExampleIndicators justify-content" data-bs-interval="100">

                            <div class="carousel-inner position-relative card1">
                                <i class="fa-solid fa-heart heart"></i>
                                <div class="carousel-item active ">
                                    <img class="rounded-3" src=${img}
                                        alt=${name}>
                                </div>
                            </div>
                        </div>

                        <div class="card-body row">
                            <p class="col-5 d-inline-block mb-0 fw-bolder ">Alexandria Day Trip From Cairo</p>
                            <div class="d-flex flex-row col-7 justify-content-end rate-div">
                                <img src="../Assets/images/star-icon-vector-removebg-preview.png" alt=""
                                    class="img-rate-star">
                                <p class="">${rate}</p>
                            </div>
                            <div class="d-flex flex-column mt-n3 card-details">
                                <span class="col-12 fw-light place-name">${type}</span>
                                <span class="col-12 fw-light period"> 1 - 6 Mars </span>

                                <div class="d-flex flex-row col-12 justify-content-start">
                                    <img src="../Assets/images/Euro-icon.png" class="mt-1 Price-icon">
                                    <span>${price}</span>
                                    <span class="ms-1 fw-bold">night</span>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
	`;
	return html;
}
// The div to be inserted into the body to show the search result
let div;

// Show the search result
function showSearch() {
	if (!div) {
		div = createElement('div', ['show-search', 'overflow-scroll-y']);
		const wrapper = createCategories();
		div.appendChild(wrapper);
		let content = createElement('div', ['p-3']);
		div.appendChild(content);
		let row = createElement('div', ['row']);
		let item = createSearchItem(
			'Alexandria day trip from cairo',
			'../Assets/images/olive-garden-restaurant.jpg',
			4.5,
			'Restaurant',
			3000
		);
		row.innerHTML += item;
		row.innerHTML += item;
		row.innerHTML += item;
		row.innerHTML += item;
		row.innerHTML += item;
		row.innerHTML += item;
		row.innerHTML += item;
		content.appendChild(row);
	}

	if (!searchDiv.classList.contains('active')) {
		searchDiv.classList.add('active');
		dark.classList.add('active');
		document.body.appendChild(div);
	}
}

// Hide the search result
function hideSearch() {
	document.body.removeChild(div);
	dark.classList.remove('active');
	searchDiv.classList.remove('active');
}

/**
 * Handle the event listeners below
 * CAUTION: This js file is being used inside different pages
 * so it's better to use if conditions to check for the element
 * if it exists or not before adding the event listenerto avoid errors
 */

if (imagesDivs && rightArrow && leftArrow && dots) {
	rightArrow.addEventListener('click', MoveImagesToLeft);
	leftArrow.addEventListener('click', MoveImagesToRight);
	loadDots();
}

if (reserveBtn) {
	reserveBtn.addEventListener('click', togglePaymentForm);
}
if (close && dark) {
	close.addEventListener('click', togglePaymentForm);
	dark.addEventListener('click', togglePaymentForm);
}

document.addEventListener('DOMContentLoaded', function () {
	function scrollCards(direction) {
		let scrollAmount = container.clientWidth * direction;
		container.scrollLeft += scrollAmount;
	}

	leftButton.addEventListener('click', () => scrollCards(-1));
	rightButton.addEventListener('click', () => scrollCards(1));
});

function updateButtonsVisibility() {
	let container = document.querySelector('.more-to-explore-wrapper');
	let leftButton = document.querySelector('.more-to-explore-button-left');
	let rightButton = document.querySelector('.more-to-explore-button-right');

	let scrollLeft = container.scrollLeft;
	let scrollWidth = container.scrollWidth;
	let clientWidth = container.clientWidth;

	if (scrollLeft <= 0) {
		leftButton.style.display = 'none';
	} else {
		leftButton.style.display = 'block';
	}

	if (scrollLeft + clientWidth >= scrollWidth - 1) {
		rightButton.style.display = 'none';
	} else {
		rightButton.style.display = 'block';
	}
}
if (dark && searchDiv) {
	dark.addEventListener('click', hideSearch);
}
if (container) {
	container.addEventListener('scroll', updateButtonsVisibility);
}

if (searchInput) {
	searchInput.addEventListener('focus', showSearch);
}

document.addEventListener('DOMContentLoaded', function () {
	function scrollCards(direction) {
		let scrollAmount = container.clientWidth * direction;
		container.scrollLeft += scrollAmount;
	}

	leftButton.addEventListener('click', () => scrollCards(-1));
	rightButton.addEventListener('click', () => scrollCards(1));
});

document.addEventListener('DOMContentLoaded', updateButtonsVisibility);

document.addEventListener("DOMContentLoaded",function()
{
	if (window.location.pathname.endsWith("profile.html")) { 
		let user_name=find_cookie("user_name");
		let user_email=find_cookie("user_email");
		if(user_name&&user_email)
		{
			document.getElementById("Name").innerHTML=user_name;
			document.getElementById("Email").innerHTML=user_email;
		}
		else{
			window.location.href = "../HTML/login.html";
		}
    }
})
 function find_cookie(cookie_name)
 {
	let cookies=document.cookie.split("; ");
	for(let cookie of cookies)
	{
		
		if(cookie.split("=")[0]===cookie_name)
		{
			return cookie.split("=")[1];
		}
	}
	return false;
 }