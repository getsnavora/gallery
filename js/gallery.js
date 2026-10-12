const photos = [
  { src: 'assets/images/app-shop.webp', category: 'App', title: 'Fresh at your fingertips', description: 'Everyday essentials, just a few taps away.', alt: 'A hand holding a grocery shopping app on a phone' },
  { src: 'assets/images/delivery-door.webp', category: 'Delivery', title: 'Delivered with care', description: 'A little more ease at your doorstep.', alt: 'Delivery rider carrying groceries to a home' },
  { src: 'assets/images/store-front.webp', category: 'Stores', title: 'Your neighborhood store', description: 'A bright, welcoming place for daily essentials.', alt: 'Illuminated Navora grocery storefront at night' },
  { src: 'assets/images/packaging-box.webp', category: 'Packaging', title: 'Packed fresh for you', description: 'Good things, thoughtfully gathered.', alt: 'Open grocery delivery box with fruit, eggs, milk and produce' },
  { src: 'assets/images/brand-fabric.webp', category: 'Brand', title: 'The details matter', description: 'A closer look at the colors we carry.', alt: 'Close-up of green embroidery on navy fabric' },
  { src: 'assets/images/packaging-bag.webp', category: 'Packaging', title: 'Packed with care', description: 'Fresh essentials, thoughtfully packed.', alt: 'Kraft grocery bag filled with fresh vegetables' },
  { src: 'assets/images/app-tracking.webp', category: 'App', title: 'On its way', description: 'Follow your order from store to door.', alt: 'Phone showing a grocery order delivery map' },
  { src: 'assets/images/delivery-backpack.webp', category: 'Delivery', title: 'Ready to go', description: 'The everyday journey behind every delivery.', alt: 'Navy and green insulated delivery backpack' },
  { src: 'assets/images/community-family.webp', category: 'Community', title: 'Better together', description: 'Fresh moments shared around the table.', alt: 'Family smiling while unpacking fresh groceries together' },
  { src: 'assets/images/packaging-merch.webp', category: 'Packaging', title: 'Made for everyday', description: 'Simple packaging for the little things that count.', alt: 'Kraft bag, white box and insulated bag beside fresh produce' },
  { src: 'assets/images/delivery-rider.webp', category: 'Delivery', title: 'A friendly face', description: 'People who bring the neighborhood closer.', alt: 'Smiling grocery delivery rider in navy and green' },
  { src: 'assets/images/store-interior.webp', category: 'Stores', title: 'Fresh on every shelf', description: 'Colorful produce and everyday favorites.', alt: 'Bright grocery store interior with abundant fresh produce' },
  { src: 'assets/images/store-vietnam.webp', category: 'Stores', title: 'Local by nature', description: 'A familiar stop in the neighborhood.', alt: 'Navora storefront in Vietnam' },
  { src: 'assets/images/navo-illustration.webp', category: 'Brand', title: 'Meet Navo', description: 'Our cheerful companion for brighter days.', alt: 'Illustration of a blue squirrel carrying groceries' }
];

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
  grid.replaceChildren();
  grid.dataset.filtered = String(activeFilter !== 'All');
  activePhotos.forEach((photo, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'gallery-card';
    button.setAttribute('aria-label', `Open image ${index + 1} of ${activePhotos.length}: ${photo.title}`);
    const img = document.createElement('img');
    img.src = photo.src;
    img.alt = photo.alt;
    img.loading = 'lazy';
    img.decoding = 'async';
    const hint = document.createElement('span');
    hint.className = 'card-hint';
    hint.textContent = 'View image ↗';
    hint.setAttribute('aria-hidden', 'true');
    button.append(img, hint);
    button.addEventListener('click', () => openLightbox(index, button));
    grid.append(button);
  });
}

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
    img.src = photo.src;
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
