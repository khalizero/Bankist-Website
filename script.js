'use strict';

// ///////////////////
// Generating random color
// no need of this code in this project /////
// const randomNum = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1) + min);

// const randomCol = () =>
//   `rgb(${randomNum(0, 255)},${randomNum(0, 255)},${randomNum(0, 255)})`;

// console.log(randomCol());

/////////////////////////////
// DOM ELEMENTS

const scorllToBtn = document.querySelector(`.btn--scroll-to`);
const section1 = document.querySelector(`#section--1`);

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const navbar = document.querySelector(`.nav`);
const operations = document.querySelector('.operations');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabs = document.querySelectorAll('.operations__tab');
const tabContent = document.querySelectorAll('.operations__content');
const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');
const lazyImgs = document.querySelectorAll(`img[data-src]`);
const slides = document.querySelectorAll(`.slide`);
const btnLeft = document.querySelector(`.slider__btn--left`);
const btnRight = document.querySelector(`.slider__btn--right`);
const dotContainer = document.querySelector(`.dots`);
///////////////////////////////////////
// Modal window

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};
// Applying function on a nodelist with foreach/loop
btnsOpenModal.forEach(btn => btn.addEventListener(`click`, openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//////////////////////////////
/// Implementing the Smooth Scrolling

scorllToBtn.addEventListener(`click`, function (e) {
  //// OLD WAY : IMPLEMENTING SMOOTH SCROLL ////

  // const secCoords = section1.getBoundingClientRect();
  // console.log(secCoords);
  // window.scrollTo({
  //   left: secCoords.left + pageXOffset,
  //   top: secCoords.top + pageYOffset,
  //   behavior: `smooth`,
  // });

  //// MODERNWAY : IMPLEMENTING SMOOTH SCROLL
  section1.scrollIntoView({ behavior: `smooth` });
});

// Implementing smooth scroll to sections from navlinks

navbar.addEventListener(`click`, function (e) {
  e.preventDefault();
  // Matching Strategy

  if (e.target.classList.contains(`nav__link`)) {
    const id = e.target.getAttribute(`href`);
    const sect = document.querySelector(id);
    sect.scrollIntoView({ behavior: `smooth` });
  }
});

/////////////////////////////
//  IMPLEMENTING THE TABBED COMPONENT

// changing active tab on click
tabsContainer.addEventListener(`click`, function (e) {
  const clicked = e.target.closest(`.operations__tab`);

  if (!clicked) return;

  tabs.forEach(el => el.classList.remove(`operations__tab--active`));
  clicked.classList.add(`operations__tab--active`);

  // changing active content on tab click
  tabContent.forEach(el => el.classList.remove(`operations__content--active`));

  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add(`operations__content--active`);
});

////////////////////////
// IMPLEMENTING THE NAVBAR OPACITY ON HOVER
function handleHover(e) {
  if (e.target.classList.contains(`nav__link`)) {
    const link = e.target;
    const siblings = link.closest(`.nav`).querySelectorAll(`.nav__link`);
    const logo = link.closest(`.nav`).querySelector(`img`);

    siblings.forEach(el => {
      if (el != link) {
        el.style.opacity = this;
      }
      logo.style.opacity = this;
    });
  }
}
navbar.addEventListener(`mouseover`, handleHover.bind(0.5));
navbar.addEventListener(`mouseout`, handleHover.bind(1));

/////////////////////////////////////
///// One Way : IMPLEMENTING THE STICKY NAVBAR

// const initialCoords = section1.getBoundingClientRect();

// window.addEventListener(`scroll`, function (e) {
//   if (window.scrollY > initialCoords.top) {
//     navbar.classList.add(`sticky`);
//   } else {
//     navbar.classList.remove(`sticky`);
//   }
// });

///////////////////////////////
//  BETTER WAY : IMPLEMENTING THE STICKY NAVBAR
//  INTERSECTION OBSERVER API : STICKY NAVBAR
const navHeight = navbar.getBoundingClientRect().height;
function stickyNav(entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) navbar.classList.add(`sticky`);
  else navbar.classList.remove(`sticky`);
}
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `${-navHeight}px`,
});
headerObserver.observe(header);

////////////////////////////
/// INTERSECTION OBSERVER API : REVEALING HIDDEN SECTIONS ON SCROLL

function revealSection(entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove(`section--hidden`);
  observer.unobserve(entry.target);
}

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add(`section--hidden`);
});

//////////////////////////
//// INTERSECTION OBSERVER API : IMPLEMENTING LAZY LOADING
function lazyLoad(entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener(`load`, function (e) {
    this.classList.remove(`lazy-img`);
  });
  observer.unobserve(entry.target);
}

const lazyObserver = new IntersectionObserver(lazyLoad, {
  root: null,
  threshold: 0,
  // rootMargin: `200px`,
});

lazyImgs.forEach(img => lazyObserver.observe(img));

////////////////////////////////
///  IMPLEMENTING THE SLIDER
function slider() {
  // SOME REQUIRED VARIABLES
  let curSlide = 0;
  const maxSlide = slides.length;

  // MOVING SLIDES FUNCTION
  function goToSlide(slide) {
    slides.forEach(
      (sli, index) =>
        (sli.style.transform = `translateX(${100 * (index - slide)}%)`)
    );
  }

  // NEXT SLIDE LISTENER
  function nextSlide() {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    goToSlide(curSlide);
    activeDot(curSlide);
  }

  // PREVIOUS SLIDE LISTENER
  function prevSlide() {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activeDot(curSlide);
  }

  // Button Listeners
  btnRight.addEventListener(`click`, nextSlide);
  btnLeft.addEventListener(`click`, prevSlide);

  // Moving througn Slides on Arrow down listener
  document.addEventListener(`keydown`, function (e) {
    e.key === `ArrowRight` && nextSlide();
    e.key === `ArrowLeft` && prevSlide();
  });

  // Dots Creation Function
  function createDots() {
    slides.forEach((_, i) =>
      dotContainer.insertAdjacentHTML(
        `beforeend`,
        `<button class="dots__dot dots__dot--active" data-slide="${i}"></button>`
      )
    );
  }

  // Initializing all Functions
  function initialize() {
    createDots();
    activeDot(curSlide);
    goToSlide(curSlide);
  }
  initialize();

  // activating Dots listener
  function activeDot(slide) {
    document
      .querySelectorAll(`.dots__dot`)
      .forEach(dot => dot.classList.remove(`dots__dot--active`));
    document
      .querySelector(`.dots__dot[data-slide = "${slide}"]`)
      .classList.add(`dots__dot--active`);
  }

  // sliding on dots click listener
  dotContainer.addEventListener(`click`, function (e) {
    if (e.target.classList.contains(`dots__dot`)) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activeDot(slide);
    }
  });
}
slider();
