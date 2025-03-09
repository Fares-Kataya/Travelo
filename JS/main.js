import { createElement } from './utility.js';

function createCard() {
	let imgNumber = 10;

	const card = createElement('div', ['d-flex', 'flex-column', 'col-3']);

	const carouselExample = createElement('div', [
		'carousel',
		'slide',
		'carouselExampleIndicators',
	]);

	const carouselIndicator = createElement('div', ['carousel-indicators']);

	for (let i = 0; i < imgNumber; i++) {
		const button = createElement('button', ['carousel-indicators'], {
			type: 'button',
			'data-bs-target': `#carouselExampleIndicators${i + 1}`,
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
			src: ``,
			alt: `slide_${i + 1}`,
		});

		carouselItem.appendChild(img);
		carouselInner.appendChild(carouselItem);
	}

	let responseNumber = 5;

	const buttonPrev = createElement('button', ['carousel-control-prev'], {
		type: 'button',
		'data-bs-target': `#carouselExampleIndicators${k++}`,
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

	const cardBody = createElement('div', ['row']);

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

	const containCard = document.getElementsByClassName('contain-card')[0];

	containCard.appendChild(carouselExample);
}

import { getData } from './utility.js';

const body = {
	languageCode: 'en',
	regionCode: 'US',
	includedTypes: ['restaurant'],
	maxResultCount: 15,
	locationRestriction: {
		circle: {
			center: {
				latitude: 40.7128,
				longitude: -74.006,
			},
			radius: 5000,
		},
	},
	rankPreference: 0,
};

getData(':searchNearby', 'POST', body)
	.then((data) => console.log('API Response:', data))
	.catch((err) => console.error('Fetch Error:', err));

document.querySelectorAll('.category-item').forEach((item) => {
	item.addEventListener('click', () => {
		document
			.querySelectorAll('.category-item')
			.forEach((i) => i.classList.remove('active'));
		item.classList.add('active');
	});
});

// Error in left hand assignment
// document.getElementById("arrow-right") = function () {
//     let div1 = document.getElementById("div1");
//     let div5 = document.getElementById("div5");

//     if (div1 && div5) {
//         div1.classList.remove("visible");
//         div1.classList.add("hidden");

//         setTimeout(() => {
//             div5.classList.remove("hidden");
//             div5.classList.add("visible");
//         }, 500);
//     }
// }

// Importin elements from details page
const imagesDivs = document.querySelectorAll('.images div');
const rightArrow = document.querySelector('.images .right');
const leftArrow = document.querySelector('.images .left');
const dots = document.querySelector('.dots');
const dark = document.querySelector('.dark');
const close = document.querySelector('.close');
const paymentForm = document.querySelector('.confirm');
const reserveBtn = document.getElementById('reserve');

let currentImage = 0;
function MoveImagesToLeft() {
	if (currentImage + 1 < imagesDivs.length) {
		imagesDivs[currentImage].classList.remove('active');
		imagesDivs[currentImage].classList.add('inActive');
		imagesDivs[++currentImage].classList.add('active');
		loadDots();
	}
}

function MoveImagesToRight() {
	if (currentImage > 0) {
		imagesDivs[currentImage].classList.remove('active');
		imagesDivs[--currentImage].classList.remove('inActive');
		imagesDivs[currentImage].classList.add('active');
		loadDots();
	}
}

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

function togglePaymentForm() {
	paymentForm.classList.toggle('active');
	dark.classList.toggle('active');
}

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



// arrows in home page
let leftButton = document.querySelector(".more-to-explore-button-left");
let rightButton = document.querySelector(".more-to-explore-button-right");
let container = document.querySelector(".more-to-explore-wrapper");


document.addEventListener("DOMContentLoaded", function () {
    function scrollCards(direction) {
        let scrollAmount = container.clientWidth * direction;
        container.scrollLeft += scrollAmount;
    }

    leftButton.addEventListener("click", () => scrollCards(-1));
    rightButton.addEventListener("click", () => scrollCards(1));
});


function updateButtonsVisibility() {
    let container = document.querySelector(".more-to-explore-wrapper");
    let leftButton = document.querySelector(".more-to-explore-button-left");
    let rightButton = document.querySelector(".more-to-explore-button-right");

    let scrollLeft = container.scrollLeft;
    let scrollWidth = container.scrollWidth;
    let clientWidth = container.clientWidth;

    if (scrollLeft <= 0) {
        leftButton.style.display = "none";
    } else {
        leftButton.style.display = "block";
    }

    if (scrollLeft + clientWidth >= scrollWidth) {
        rightButton.style.display = "none";
    } else {
        rightButton.style.display = "block";
    }
}

document.addEventListener("DOMContentLoaded", updateButtonsVisibility);

container.addEventListener("scroll", updateButtonsVisibility);


