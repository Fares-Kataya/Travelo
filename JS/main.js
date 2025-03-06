import { createElement } from './utility.js';
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
