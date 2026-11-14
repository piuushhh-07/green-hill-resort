/* ===========================================================
   VANYA ESTATE — SCRIPT
   Organized by feature. Each section is independent, so you
   can remove a feature block without breaking the others.
   =========================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initIcons();
  initHeaderScroll();
  initMobileMenu();
  initRevealOnScroll();
  initScrollIndicator();
  initGallery();
  initLightbox();
  initRoomModal();
  initTestimonialCarousel();
  initAccordion();
  initBookingForms();
  initDateGuards();
});

/* ---------- Icons ---------- */
function initIcons() {
  if (window.lucide) lucide.createIcons();
}

/* ---------- Header: solid background on scroll ---------- */
function initHeaderScroll() {
  const header = document.getElementById('site-header');
  if (!header) return;
  const update = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 40);
  };
  update();
  window.addEventListener('scroll', update, { passive: true });
}

/* ---------- Mobile hamburger menu ---------- */
function initMobileMenu() {
  const btn = document.getElementById('hamburger');
  const nav = document.getElementById('main-nav');
  if (!btn || !nav) return;

  const close = () => {
    nav.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', 'Open menu');
    document.body.style.overflow = '';
  };
  const open = () => {
    nav.classList.add('is-open');
    btn.setAttribute('aria-expanded', 'true');
    btn.setAttribute('aria-label', 'Close menu');
    document.body.style.overflow = 'hidden';
  };

  btn.addEventListener('click', () => {
    nav.classList.contains('is-open') ? close() : open();
  });
  nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', close));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
}

/* ---------- Reveal-on-scroll ---------- */
function initRevealOnScroll() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );

  items.forEach((el) => observer.observe(el));
}

/* ---------- Hero scroll indicator ---------- */
function initScrollIndicator() {
  const btn = document.getElementById('scroll-indicator');
  if (!btn) return;
  btn.addEventListener('click', () => {
    document.getElementById('villa')?.scrollIntoView({ behavior: 'smooth' });
  });
}

/* ---------- Gallery data + render + filter ---------- */
const GALLERY_ITEMS = [
  { category: 'pool', image: 'assets/media/resort-photo-23.15.09.jpeg', alt: 'Swimming pool at Green Hill Resort' },
  { category: 'garden', image: 'assets/media/resort-photo-23.15.19.jpeg', alt: 'Resort grounds and greenery' },
  { category: 'garden', image: 'assets/media/resort-photo-23.15.20.jpeg', alt: 'Green Hill Resort outdoor grounds' },
  { category: 'interiors', image: 'assets/media/resort-photo-23.15.22.jpeg', alt: 'Covered seating area at the resort' },
  { category: 'interiors', image: 'assets/media/resort-photo-23.15.23.jpeg', alt: 'Outdoor dining and seating area' },
  { category: 'experiences', image: 'assets/media/resort-photo-23.15.24.jpeg', alt: 'Resort recreation area' },
  { category: 'garden', image: 'assets/media/resort-photo-23.15.26.jpeg', alt: 'Palm-lined resort pathway' },
];

function initGallery() {
  const grid = document.getElementById('gallery-grid');
  const filters = document.querySelectorAll('.gallery-filter');
  if (!grid) return;

  grid.innerHTML = GALLERY_ITEMS.map((item, i) => `
    <button class="masonry__item" type="button" data-category="${item.category}" data-index="${i}" aria-label="Open image: ${item.alt}">
      <img src="${item.image}" alt="${item.alt}" loading="lazy" width="600" height="${item.h}">
    </button>
  `).join('');

  filters.forEach((btn) => {
    btn.addEventListener('click', () => {
      filters.forEach((b) => { b.classList.remove('is-active'); b.setAttribute('aria-selected', 'false'); });
      btn.classList.add('is-active');
      btn.setAttribute('aria-selected', 'true');
      const filter = btn.dataset.filter;
      grid.querySelectorAll('.masonry__item').forEach((el) => {
        el.hidden = filter !== 'all' && el.dataset.category !== filter;
      });
    });
  });
}

/* ---------- Lightbox ---------- */
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const img = document.getElementById('lightbox-img');
  const current = document.getElementById('lightbox-current');
  const total = document.getElementById('lightbox-total');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');
  const grid = document.getElementById('gallery-grid');
  if (!lightbox || !grid) return;

  let activeIndex = 0;
  let visibleIndexes = [];

  const getVisibleIndexes = () =>
    Array.from(grid.querySelectorAll('.masonry__item'))
      .filter((el) => !el.hidden)
      .map((el) => Number(el.dataset.index));

  const render = () => {
    const dataIndex = visibleIndexes[activeIndex];
    const item = GALLERY_ITEMS[dataIndex];
    img.src = item.image;
    img.alt = item.alt;
    current.textContent = activeIndex + 1;
    total.textContent = visibleIndexes.length;
  };

  const open = (dataIndex) => {
    visibleIndexes = getVisibleIndexes();
    activeIndex = Math.max(0, visibleIndexes.indexOf(dataIndex));
    render();
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    lightbox.hidden = true;
    document.body.style.overflow = '';
  };
  const step = (dir) => {
    activeIndex = (activeIndex + dir + visibleIndexes.length) % visibleIndexes.length;
    render();
  };

  grid.addEventListener('click', (e) => {
    const trigger = e.target.closest('.masonry__item');
    if (trigger) open(Number(trigger.dataset.index));
  });

  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', () => step(-1));
  nextBtn.addEventListener('click', () => step(1));
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });

  document.addEventListener('keydown', (e) => {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });
}

/* ---------- Room details modal ---------- */
const ROOM_DATA = {
  master: { title: 'Swimming Pool', meta: 'Pool & water slides', image: 'assets/media/resort-photo-23.15.09.jpeg', desc: 'Enjoy the swimming pool and water-slide facilities at Green Hill Resort. Contact the resort to confirm access, timings and package details.', features: ['Swimming pool', 'Water slides', 'Ask about available packages'] },
  premium: { title: 'Banquet Hall', meta: 'Indoor celebrations & gatherings', image: 'assets/media/resort-photo-23.15.23.jpeg', desc: 'A cozy banquet hall for celebrations and private gatherings. Enquire about availability, capacity and event arrangements.', features: ['Banquet hall', 'Weddings and parties', 'Enquire for capacity and availability'] },
  family: { title: 'Open-air Lawn', meta: 'Outdoor event space', image: 'assets/media/resort-photo-23.15.20.jpeg', desc: 'An open-air lawn suitable for weddings, birthday celebrations and private events. Ask the resort about layout and guest arrangements.', features: ['Open-air lawn', 'Private events', 'Enquire for guest capacity'] },
  living: { title: 'Food & Catering', meta: 'Vegetarian & non-vegetarian options', image: 'assets/media/resort-photo-23.15.24.jpeg', desc: 'Food options include vegetarian and non-vegetarian catering. Contact the resort for menus and package details.', features: ['Vegetarian food options', 'Non-vegetarian food options', 'Menu and package on enquiry'] },
};

function initRoomModal() {
  const modal = document.getElementById('room-modal');
  if (!modal) return;
  const img = document.getElementById('room-modal-img');
  const title = document.getElementById('room-modal-title');
  const meta = document.getElementById('room-modal-meta');
  const desc = document.getElementById('room-modal-desc');
  const features = document.getElementById('room-modal-features');

  const open = (key) => {
    const room = ROOM_DATA[key];
    if (!room) return;
    img.src = room.image;
    img.alt = room.title;
    title.textContent = room.title;
    meta.textContent = room.meta;
    desc.textContent = room.desc;
    features.innerHTML = room.features.map((f) => `<li>${f}</li>`).join('');
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    modal.hidden = true;
    document.body.style.overflow = '';
  };

  document.querySelectorAll('[data-modal-trigger]').forEach((btn) => {
    btn.addEventListener('click', () => open(btn.dataset.modalTrigger));
  });
  modal.querySelectorAll('[data-modal-close]').forEach((el) => el.addEventListener('click', close));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !modal.hidden) close(); });
}

/* ---------- Testimonial carousel ---------- */
function initTestimonialCarousel() {
  const track = document.getElementById('testimonial-track');
  const dotsWrap = document.getElementById('testimonial-dots');
  const prevBtn = document.getElementById('testimonial-prev');
  const nextBtn = document.getElementById('testimonial-next');
  if (!track) return;

  const cards = Array.from(track.children);
  let active = 0;
  let timer;

  dotsWrap.innerHTML = cards.map((_, i) => `<button aria-label="Show review ${i + 1}"></button>`).join('');
  const dots = Array.from(dotsWrap.children);

  const render = () => {
    cards.forEach((c, i) => c.classList.toggle('is-active', i === active));
    dots.forEach((d, i) => d.classList.toggle('is-active', i === active));
  };
  const go = (i) => { active = (i + cards.length) % cards.length; render(); resetTimer(); };

  const resetTimer = () => {
    clearInterval(timer);
    timer = setInterval(() => go(active + 1), 7000);
  };

  prevBtn.addEventListener('click', () => go(active - 1));
  nextBtn.addEventListener('click', () => go(active + 1));
  dots.forEach((d, i) => d.addEventListener('click', () => go(i)));
  track.addEventListener('mouseenter', () => clearInterval(timer));
  track.addEventListener('mouseleave', resetTimer);

  render();
  resetTimer();
}

/* ---------- FAQ accordion ---------- */
function initAccordion() {
  const accordion = document.getElementById('accordion');
  if (!accordion) return;
  const triggers = accordion.querySelectorAll('.accordion-item__trigger');

  triggers.forEach((trigger) => {
    const panel = trigger.nextElementSibling;
    panel.style.maxHeight = '0px';

    trigger.addEventListener('click', () => {
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';

      triggers.forEach((t) => {
        t.setAttribute('aria-expanded', 'false');
        t.nextElementSibling.style.maxHeight = '0px';
      });

      if (!isOpen) {
        trigger.setAttribute('aria-expanded', 'true');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });
}

/* ---------- Booking forms: hero strip + main form + WhatsApp link ---------- */
function initBookingForms() {
  const stripForm = document.getElementById('booking-strip-form');
  const mainForm = document.getElementById('booking-form');
  const successBox = document.getElementById('booking-success');
  const waBtn = document.getElementById('whatsapp-book-btn');

  const buildWhatsAppLink = () => {
    const name = mainForm?.name?.value || 'there';
    const checkin = mainForm?.checkin?.value || '';
    const checkout = mainForm?.checkout?.value || '';
    const guests = mainForm?.guests?.value || '';
    let text = `Hi! I'd like to enquire about Green Hill Resort.`;
    text += `\nName: ${name}`;
    if (checkin) text += `\nCheck-in: ${checkin}`;
    if (checkout) text += `\nCheck-out: ${checkout}`;
    if (guests) text += `\nGuests: ${guests}`;
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  };

  const refreshWhatsAppLink = () => {
    if (waBtn) waBtn.href = buildWhatsAppLink();
  };

  if (mainForm) {
    ['name', 'checkin', 'checkout', 'guests'].forEach((field) => {
      mainForm[field]?.addEventListener('input', refreshWhatsAppLink);
    });
    refreshWhatsAppLink();
  }

  // Hero booking strip: carries values into the main form and scrolls down to it.
  if (stripForm) {
    stripForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (mainForm) {
        mainForm.checkin.value = stripForm.checkin.value;
        mainForm.checkout.value = stripForm.checkout.value;
        if (mainForm.occasion && stripForm.guests.value) {
          mainForm.occasion.value = stripForm.guests.value;
        }
        refreshWhatsAppLink();
      }
      document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Main booking form: attempts a Netlify-style submission, then shows success either way.
  if (mainForm) {
    mainForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!datesAreValid(mainForm.checkin.value, mainForm.checkout.value)) {
        alert('Check-out date must be after the check-in date.');
        return;
      }

      const formData = new FormData(mainForm);
      try {
        await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(formData).toString(),
        });
      } catch (err) {
        // Expected on hosts without form handling configured (see README).
        console.warn('Booking form endpoint not configured for this deployment yet.', err);
      }

      mainForm.hidden = true;
      if (successBox) successBox.hidden = false;
    });
  }
}

/* ---------- Date guards: no past dates, check-out after check-in ---------- */
function datesAreValid(checkin, checkout) {
  if (!checkin || !checkout) return true;
  return new Date(checkout) > new Date(checkin);
}

function initDateGuards() {
  const today = new Date().toISOString().split('T')[0];
  const dateInputs = document.querySelectorAll('input[type="date"]');
  dateInputs.forEach((input) => input.setAttribute('min', today));

  const pairs = [
    ['strip-checkin', 'strip-checkout'],
    ['bf-checkin', 'bf-checkout'],
  ];

  pairs.forEach(([inId, outId]) => {
    const inEl = document.getElementById(inId);
    const outEl = document.getElementById(outId);
    if (!inEl || !outEl) return;
    inEl.addEventListener('change', () => {
      outEl.setAttribute('min', inEl.value);
      if (outEl.value && new Date(outEl.value) <= new Date(inEl.value)) {
        const next = new Date(inEl.value);
        next.setDate(next.getDate() + 1);
        outEl.value = next.toISOString().split('T')[0];
      }
    });
  });
}
