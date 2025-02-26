import { createElement } from './utility.js';
const imagesDivs = document.querySelectorAll('.images div');
const rightArrow = document.querySelector('.images .right');
const leftArrow = document.querySelector('.images .left');
const dots = document.querySelector('.dots');

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

if (imagesDivs && rightArrow && leftArrow && dots) {
	rightArrow.addEventListener('click', MoveImagesToLeft);
	leftArrow.addEventListener('click', MoveImagesToRight);
	loadDots();
}
