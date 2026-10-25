// Photos are written in index.html so search engines can see them without JavaScript.
const photos = [...document.querySelectorAll('#gallery-grid .gallery-card')].map(card => {
  const img = card.querySelector('img');
  return { card, src: img.dataset.full || img.getAttribute('src'), thumb: img.getAttribute('src'), alt: img.alt, category: card.dataset.category, title: card.dataset.title, description: card.dataset.description };
});

const grid = document.getElementById('gallery-grid');
const filters = [...document.querySelectorAll('.filter-button')];
const dialog = document.getElementById('lightbox');
const mainImage = document.getElementById('lightbox-image');
const category = document.getElementById('lightbox-category');
const title = document.getElementById('lightbox-title');
const description = document.getElementById('lightbox-description');
const count = document.getElementById('lightbox-count');
const thumbnails = document.getElementById('thumbnail-list');
const closeButton = document.getElementById('lightbox-close');
const previousButton = document.getElementById('lightbox-previous');
const nextButton = document.getElementById('lightbox-next');
let activeFilter = 'All';
let activePhotos = photos;
let activeIndex = 0;
let returnFocusTo = null;
let touchStartX = null;

function renderGallery() {
  grid.dataset.filtered = String(activeFilter !== 'All');
  photos.forEach(photo => { photo.card.hidden = !activePhotos.includes(photo); });
  activePhotos.forEach((photo, index) => {
    photo.card.setAttribute('aria-label', `Open image ${index + 1} of ${activePhotos.length}: ${photo.title}`);
  });
}

photos.forEach(photo => photo.card.addEventListener('click', () => {
  photo.card.querySelector('img').loading = 'eager';
  openLightbox(activePhotos.indexOf(photo), photo.card);
}));

function setFilter(value) {
  activeFilter = value;
  activePhotos = value === 'All' ? photos : photos.filter(photo => photo.category === value);
  filters.forEach(button => {
    const selected = button.dataset.filter === value;
    button.classList.toggle('is-active', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
  renderGallery();
}

function renderThumbnails() {
  thumbnails.replaceChildren();
  activePhotos.forEach((photo, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'thumbnail-button';
    button.setAttribute('aria-label', `Show image ${index + 1}: ${photo.title}`);
    button.setAttribute('aria-current', String(index === activeIndex));
    const img = document.createElement('img');
    img.src = photo.thumb;
    img.alt = '';
    img.loading = 'lazy';
    button.append(img);
    button.addEventListener('click', () => showImage(index));
    thumbnails.append(button);
  });
}

function showImage(index) {
  activeIndex = (index + activePhotos.length) % activePhotos.length;
  const photo = activePhotos[activeIndex];
  mainImage.src = photo.src;
  mainImage.alt = photo.alt;
  category.textContent = photo.category;
  title.textContent = photo.title;
  description.textContent = photo.description;
  count.textContent = `${String(activeIndex + 1).padStart(2, '0')} / ${String(activePhotos.length).padStart(2, '0')}`;
  [...thumbnails.children].forEach((button, thumbnailIndex) => {
    button.setAttribute('aria-current', String(thumbnailIndex === activeIndex));
  });
  thumbnails.children[activeIndex]?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
}

function openLightbox(index, trigger) {
  returnFocusTo = trigger;
  activeIndex = index;
  renderThumbnails();
  showImage(index);
  dialog.showModal();
  document.body.classList.add('modal-open');
  closeButton.focus();
}

function closeLightbox() { dialog.close(); }

filters.forEach(button => button.addEventListener('click', () => setFilter(button.dataset.filter)));
closeButton.addEventListener('click', closeLightbox);
previousButton.addEventListener('click', () => showImage(activeIndex - 1));
nextButton.addEventListener('click', () => showImage(activeIndex + 1));
dialog.addEventListener('click', event => { if (event.target === dialog) closeLightbox(); });
dialog.addEventListener('close', () => {
  document.body.classList.remove('modal-open');
  returnFocusTo?.focus();
});
dialog.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft') { event.preventDefault(); showImage(activeIndex - 1); }
  if (event.key === 'ArrowRight') { event.preventDefault(); showImage(activeIndex + 1); }
  if (event.key === 'Tab') {
    const focusable = [...dialog.querySelectorAll('button:not([disabled])')];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
});
dialog.addEventListener('touchstart', event => {
  touchStartX = event.changedTouches[0]?.screenX ?? null;
}, { passive: true });
dialog.addEventListener('touchend', event => {
  if (touchStartX === null) return;
  const delta = (event.changedTouches[0]?.screenX ?? touchStartX) - touchStartX;
  if (Math.abs(delta) > 55) showImage(activeIndex + (delta < 0 ? 1 : -1));
  touchStartX = null;
}, { passive: true });

renderGallery();
