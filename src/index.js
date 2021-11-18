// const InfiniteScroll = require('infinite-scroll');
import './sass/main.scss';
import FetchClass from './js/fetch.js';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const formEl = document.querySelector('#search-form');
const inputEl = document.querySelector([(name = 'searchQuery')]);
const galleryEl = document.querySelector('.gallery');
const btn = document.querySelector('button[type="button"]');
// const btnload = document.querySelector('.load-more');

let lastKnownScrollPosition = 0;
function infinitScrollFunc(e) {
  const scrHeight = document.documentElement.scrollHeight;
  const clientHeight = document.documentElement.clientHeight;
  const scrTop = document.documentElement.scrollTop;
  lastKnownScrollPosition = scrHeight - clientHeight - scrTop;
  if (lastKnownScrollPosition === 0) {
    loadMoreFunc();
  }
}

const fetchCl = new FetchClass();

formEl.addEventListener('submit', submitFunc);
// btnload.addEventListener('click', loadMoreFunc);
window.addEventListener('scroll', infinitScrollFunc);

async function submitFunc(event) {
  event.preventDefault();
  fetchCl.inputT = formEl.elements.searchQuery.value;
  fetchCl.resetPage();
  // btnload.classList.add('js-hidden');
  galleryEl.innerHTML = '';

  try {
    const post = await fetchCl.fetchCards();
    if (post.total === 0) {
      return Notiflix.Notify.info(
        'Sorry, there are no images matching your search query. Please try again.',
      );
    } else if (post.total > 40) {
      // btnload.classList.remove('js-hidden');
      renderPic(post);
      new SimpleLightbox('.gallery a', {
        captionsData: 'alt',
        captionDelay: 250,
      });
      smoothScroll();
      // InfinScroll();
    }
    if (checkCollection(post)) return;
  } catch (error) {
    console.log(error);
  }
}

// export default
function renderPic(post) {
  galleryEl.innerHTML = render(post);
}

// export default
function renderPicLoad(post) {
  galleryEl.insertAdjacentHTML('beforeend', render(post));
}
/////////////////////

function loadMoreFunc() {
  fetchCl
    .fetchCards()
    .then(post => {
      renderPicLoad(post);
      smoothScroll();
      // InfinScroll();
      if (checkCollection(post)) return;
    })
    .then(post => {
      console.log(post);
    });
}
///////////////////////////

function checkCollection(post) {
  if (Math.ceil(post.totalHits / 40) <= fetchCl.page - 1) {
    Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
    // btnload.disabled = true;
    return true;
  }
  return false;
}

function render(post) {
  let getItem = post.hits
    .map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
      return `<div class="photo-card">
      <a href="${largeImageURL}"><img class="photo" src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
          <div class="info">
            <p class="info-item">
              <b>Likes: <span>${likes}</span></b>
            </p>
            <p class="info-item">
              <b>Views:<span>${views}</span></b>
            </p>
            <p class="info-item">
              <b>Comments:
              <span>${comments}</span></b>
            </p>
            <p class="info-item">
              <b>Downloads:<span> ${downloads}</span></b>
            </p>
          </div>
        </div>`;
    })
    .join('');
  return getItem;
}

function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
