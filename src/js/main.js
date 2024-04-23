const debounce = (func, delay) => {
  let timeoutId;

  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

const parseNews = (html) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const newsCards = doc.querySelectorAll('.news-card');
  const data = [];

  newsCards.forEach(newsCard => {
    const header = newsCard.querySelector('.news-card-title').textContent.trim();
    const description = newsCard.querySelector('.news-card-description').textContent.trim();
    const image = newsCard.querySelector('.img-responsive img').getAttribute('src').trim();
    const date = newsCard.querySelector('.news-card-date').textContent.trim();

    data.push({ header, description, image, date });
  });

  return data;
}

const initiateSlider = (sliderId, dates = false) => {
  const sliderMain = document.querySelector(sliderId);

  const sliderImages = sliderMain.getElementsByClassName("slider-image");
  const sliderHeaders = sliderMain.getElementsByClassName("slider-header");
  const sliderDescriptions = sliderMain.getElementsByClassName("slider-description");
  const sliderDates = sliderMain.getElementsByClassName("slider-date");

  const sliderNext = sliderMain.querySelector(".controls > .next");
  const sliderPrevious = sliderMain.querySelector(".controls > .previous");

  let sliderIndex = 0;

  const nextSlide = (e) => {
    e.preventDefault();
    sliderImages[sliderIndex].classList.remove("active");
    sliderHeaders[sliderIndex].classList.remove("active");
    sliderDescriptions[sliderIndex].classList.remove("active");
    if (dates) sliderDates[sliderIndex].classList.remove("active");

    sliderIndex = (sliderIndex === sliderImages.length - 1) ? 0 : sliderIndex + 1;
    sliderImages[sliderIndex].classList.add("active");
    sliderHeaders[sliderIndex].classList.add("active");
    sliderDescriptions[sliderIndex].classList.add("active");
    if (dates) sliderDates[sliderIndex].classList.add("active");
  }

  const previousSlide = (e) => {
    e.preventDefault();
    sliderImages[sliderIndex].classList.remove("active");
    sliderHeaders[sliderIndex].classList.remove("active");
    sliderDescriptions[sliderIndex].classList.remove("active");
    if (dates) sliderDates[sliderIndex].classList.remove("active");

    sliderIndex = (sliderIndex === 0) ? sliderImages.length - 1 : sliderIndex - 1;
    sliderImages[sliderIndex].classList.add("active");
    sliderHeaders[sliderIndex].classList.add("active");
    sliderDescriptions[sliderIndex].classList.add("active");
    if (dates) sliderDates[sliderIndex].classList.add("active");
  }

  sliderNext.addEventListener("click", nextSlide);
  sliderPrevious.addEventListener("click", previousSlide);
}


const transformNewsToSlider = (data) => {
  const newsSection = document.querySelector(".news");

  const hasDates = ('date' in data[0]);

  const datesHtml = (hasDates) ? `
      <ul class="slider-dates">
        ${data.map((item, index) => `<li><span class="slider-date ${index === 0 ? 'active' : ''}">${item.date}</span></li>`).join('')}
      </ul>
    ` : '';

  const sliderHTML = `
    <div class="columns-2">
      <div class="column order-2-sm">
        <ul class="slider-headers">
          ${data.map((item, index) => `<li><h2 class="slider-header ${index === 0 ? 'active' : ''}">${item.header}</h2></li>`).join('')}
        </ul>
        <ul class="slider-descriptions">
          ${data.map((item, index) => `<li><p class="slider-description ${index === 0 ? 'active' : ''}">${item.description}</p></li>`).join('')}
        </ul>
        
        ${datesHtml}

        <ul class="controls">
          <li class="previous">
            <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M10.9126 26.4627L25.1591 40.7092L27.8765 37.9917L18.2689 28.3842H40.5312L40.5312 24.5412L18.2689 24.5412L27.8765 14.9336L25.1591 12.2162L10.9126 26.4627Z" fill="white" />
            </svg>
          </li>
          <li class="next">
            <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M41.0874 26.4627L26.8409 40.7092L24.1235 37.9917L33.7311 28.3842H11.4688L11.4688 24.5412L33.7311 24.5412L24.1235 14.9336L26.8409 12.2162L41.0874 26.4627Z" fill="white" />
            </svg>
          </li>
        </ul>
      </div>
      <div class="column">
        <ul class="slider-images">
          ${data.map((item, index) => `<li class="slider-image ${index === 0 ? 'active' : ''}"><figure class="img-responsive"><img src="${item.image}" alt=""></figure></li>`).join('')}
        </ul>
      </div>
    </div>
  `;
  newsSection.innerHTML = sliderHTML;
  newsSection.classList.add("slider-section");
  newsSection.id = "slider-2";

  initiateSlider('#slider-2', true);
}

let transformedNews = false;

const newsToSlider = () => {
  const newsSection = document.querySelector(".news");
  const data = parseNews(newsSection.innerHTML);
  transformNewsToSlider(data);
  transformedNews = true;
}

const debouncedNewsToSlider = debounce(newsToSlider, 400);

if (window.innerWidth <= 916) {
  newsToSlider();
}

const drawersButtons = Array.from(document.getElementsByClassName("drawer-btn"));
const navbarSel = document.getElementsByClassName("main-navbar")[0];

const toggleClassName = (target, className) => {
  if (target.classList.contains(className)) return target.classList.remove(className);
  return target.classList.add(className);
}

const toggleDrawer = (e) => {
  e.preventDefault();
  const target = e.target;
  toggleClassName(target, "active");

  const isMobile = navbarSel.classList.contains("open-mobile");
  const drawer = (isMobile) ? document.getElementById("mobile-" + target.dataset.drawerLink) : document.getElementById(target.dataset.drawerLink);
  toggleClassName(drawer, "open");

  toggleClassName(e.target.parentNode, "navbar-drawer-is-open");
  toggleClassName(document.getElementById("overlay"), "open")
}

drawersButtons.forEach((button) => {
  button.addEventListener("click", toggleDrawer);
})

///////////// 

initiateSlider("#slider-1");

const headers = document.querySelectorAll('.accordion-header');
const contents = document.querySelectorAll('.accordion-content');

let lastHeader;
headers.forEach(header => {
  header.addEventListener('click', function () {
    headers.forEach((header) => {
      header.classList.remove("active")
    })

    contents.forEach((content) => {
      content.classList.remove('active');
    })
    const content = this.nextElementSibling;

    if (lastHeader === header) {
      header.classList.remove("active");
      content.classList.remove('active');
      lastHeader = undefined;
    } else {
      header.classList.add("active");
      content.classList.add('active');
      lastHeader = header;
    }

  });
});

const modal = document.getElementById('modal');
const closeButton = document.querySelector('.close');
const openButton = document.querySelector('.btn-peach-sky');

openButton.addEventListener('click', function () {
  modal.style.display = 'block';
});

closeButton.addEventListener('click', function () {
  modal.style.display = 'none';
});

window.addEventListener('click', function (event) {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
});

modal.addEventListener('click', function (event) {
  event.stopPropagation();
});

const contactForm = document.getElementById('contact-form');
contactForm.addEventListener('submit', function (event) {
  event.preventDefault();
  modal.style.display = 'none';
});

const hamburgerMenuBtn = document.getElementById("hamburger-menu");

hamburgerMenuBtn.addEventListener("click", (e) => {
  toggleClassName(hamburgerMenuBtn, "active");
  if (hamburgerMenuBtn.classList.contains("active")) {
    hamburgerMenuBtn.innerHTML = '<svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M20.7 22.9999L0 2.29999L2.3 0L23 20.6999L20.7 22.9999Z" fill="white"/><path fill-rule="evenodd" clip-rule="evenodd" d="M20.7 0.000124467L0 20.7L2.3 23L23 2.30011L20.7 0.000124467Z" fill="white"/></svg>';
  } else {
    hamburgerMenuBtn.innerHTML = '<svg width="36" height="12" viewBox="0 0 36 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M36 3.42857H0V0H36V3.42857Z" fill="white" /><path fill-rule="evenodd" clip-rule="evenodd" d="M36 12H0V8.57143H36V12Z" fill="white" /></svg>';
  }
  toggleClassName(navbarSel, "open-mobile");
  toggleClassName(document.documentElement, "overflow-hidden");
})

window.addEventListener('resize', (e) => {
  const isMobileOpen = navbarSel.classList.contains("open-mobile")

  if (window.innerWidth >= 768 && isMobileOpen) {
    hamburgerMenuBtn.classList.remove("active");
    hamburgerMenuBtn.innerHTML = '<svg width="36" height="12" viewBox="0 0 36 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M36 3.42857H0V0H36V3.42857Z" fill="white" /><path fill-rule="evenodd" clip-rule="evenodd" d="M36 12H0V8.57143H36V12Z" fill="white" /></svg>';
    navbarSel.classList.remove("open-mobile");

    document.documentElement.classList.remove("overflow-hidden");
  }

  if (window.innerWidth <= 916) {
    if (transformedNews) return;
    debouncedNewsToSlider();
    transformedNews = true;
  }
});

const phoneInput = document.querySelectorAll('input[type="tel"]');

phoneInput.forEach((input) => {
  input.addEventListener('input', (e) => {
    let { value } = e.target;
    value = value.replace(/\D/g, '');
    // Если первая цифра - 8, заменяем на 7
    if (value.charAt(0) === '8') {
      value = '7' + value.slice(1);
    }
    const formattedValue = value.match(/^(\d{1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
    e.target.value = !formattedValue[2]
      ? formattedValue[1]
      : `+${formattedValue[1]} ${formattedValue[2]}${formattedValue[3] ? ` ${formattedValue[3]}` : ''}${formattedValue[4] ? ` ${formattedValue[4]}` : ''}${formattedValue[5] ? ` ${formattedValue[5]}` : ''}`;
  });
});