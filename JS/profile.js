const cont = document.querySelector('.cont');
const favourites = JSON.parse(localStorage.getItem('favourites')) || [];
function createCard(id, name, images, rate, period, price) {
	indicatorsCounter++;

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
		[
			'carousel',
			'slide',
			'carouselExampleIndicators',
			'd-flex',
			'flex-column',
			'col-12',
			'col-md-6',
			'col-lg-4',
			'col-xl-3',
			'justify-content-center',
			'card-container',
			'mt-2',
			'position-relative',
		],
		{
			id: `carouselExampleIndicators${indicatorsCounter}`,
		}
	);

	const a = createElement(
		'a',
		['position-absolute', 'start-0', 'top-0', 'w-100', 'h-100'],
		{
			href: `../HTML/details.html?business_id=${id}`,
			style: 'z-index:3;',
		}
	);
	carouselExample.appendChild(a);
	const carouselIndicator = createElement('div', ['carousel-indicators']);

	// for (let i = 0; i < images.length; i++) {
	images.map((image, index) => {
		const button = createElement('button', [], {
			type: 'button',
			'data-bs-target': `#carouselExampleIndicators${indicatorsCounter}`,
			'data-bs-slide-to': `${index}`,
		});

		if (index == 0) {
			button.classList.add('active');
		}

		carouselIndicator.appendChild(button);
	});
	// }

	const carouselInner = createElement('div', [
		'carousel-inner',
		'position-relative',
		'card1',
	]);

	const i = createElement('div', ['fa-solid', 'fa-heart', 'heart']);

	carouselInner.appendChild(i);
	// for (let i = 0; i < images.length; i++) {
	images.map((image, index) => {
		const carouselItem = createElement('div', ['carousel-item']);

		if (index == 1) {
			carouselItem.classList.add('active');
		}

		const img = createElement('img', ['rounded-3'], {
			src: image.src,
			alt: `slide_${index + 1}`,
			loading: 'lazy',
		});

		carouselItem.appendChild(img);
		carouselInner.appendChild(carouselItem);
	});
	// }

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
		'data-bs-target': `#carouselExampleIndicators${indicatorsCounter}`,
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
	carouselInner.appendChild(carouselIndicator);

	carouselExample.appendChild(carouselInner);

	card.appendChild(carouselExample);

	const cardBody = createElement('div', ['row', 'card-body', 'w-100']);

	const PCardBody = createElement(
		'p',
		['col-9', 'd-inline-block', 'mb-0', 'fw-bolder'],
		{},
		name
	);

	cardBody.appendChild(PCardBody);

	const RateCardBody = createElement('div', [
		'd-flex',
		'flex-row',
		'col-3',
		'justify-content-end',
	]);

	const RateStar = createElement('img', ['img-rate-star'], {
		src: `../Assets/images/star-icon-vector-removebg-preview.png`,
	});

	const RateText = createElement('p', [], {}, rate);

	RateCardBody.appendChild(RateStar);
	RateCardBody.appendChild(RateText);

	cardBody.appendChild(RateCardBody);

	const CardDetails = createElement('div', ['d-flex', 'flex-column', 'mt-n3']);

	// const CardPlaceName = createElement(
	// 	'span',
	// 	['col-12', 'fw-light', 'period'],
	// 	{},
	// 	name
	// );

	// CardDetails.appendChild(CardPlaceName);

	const CardPlacePeriod = createElement(
		'span',
		['col-12', 'fw-light', 'period'],
		{},
		period
	);

	CardDetails.appendChild(CardPlacePeriod);

	const Price = createElement('div', [
		'd-flex',
		'flex-row',
		'col-12',
		'justify-content-start',
	]);

	// const PriceIcon = createElement('img', ['mt-1'], {
	// 	src: ``,
	// });

	// Price.appendChild(PriceIcon);

	const PriceText = createElement(
		'span',
		[],
		{},
		`${price || Math.trunc(Math.random() * 400)} $`
	);

	Price.appendChild(PriceText);

	const TrapMood = createElement('span', ['ms-1', 'fw-bold'], {}, ``);

	Price.appendChild(TrapMood);

	CardDetails.appendChild(Price);

	cardBody.appendChild(CardDetails);

	carouselExample.appendChild(cardBody);

	// const containCard = document.getElementsByClassName('contain-card')[0];
	// const containCard = createElement('div', ['contain-card']);

	// containCard.appendChild(carouselExample);
	// document.body.appendChild(containCard);
	return carouselExample;
}
cont.innerHTML = '';
favourites.forEach((element) => {
	let html = `
        <div class="col-lg-4 col-md-6 col-sm-12">
					<div class="card shadow-sm">
						<img
							src="${element.photos[0]}"
							class="card-img-top res_img"
							alt="${element.name}" />
						<div class="card-body">
							<div class="d-flex justify-content-between align-items-center">
								<span class="fw-bold">${element.name}</span>
								<span class="badge text-dark"
									>${element.rating} <i class="fas fa-star"></i
								></span>
							</div>
							
						</div>
					</div>
				</div>
    `;
	cont.innerHTML += html;
});
