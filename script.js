
/* ==================================
   URBAN FRAGMENTS
   Collections + Gallery + Lightbox
================================== */

// 網站元素
const gallery =
  document.getElementById("photo-gallery");

const filters =
  document.getElementById("collection-filters");

const collectionTitle =
  document.getElementById("collection-title");

const collectionDescription =
  document.getElementById("collection-description");

const emptyMessage =
  document.getElementById("gallery-empty");

// 照片排列樣式
const layoutClasses = [
  "photo-featured",
  "photo-left",
  "photo-right",
  "photo-wide"
];

// 目前顯示的作品
let visiblePhotos = [];
let activeCollection = "all";

// ==================================
// 1. 產生攝影系列按鈕
// ==================================

function renderFilters() {
  filters.replaceChildren();

  const options = [
    {
      id: "all",
      title: "All Works"
    },
    ...collections
  ];

  options.forEach((item) => {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "collection-button";
    button.textContent = item.title;

    const isActive =
      item.id === activeCollection;

    button.classList.toggle("active", isActive);
    button.setAttribute(
      "aria-pressed",
      String(isActive)
    );

    button.addEventListener("click", () => {
      activeCollection = item.id;
      renderFilters();
      renderGallery();
    });

    filters.appendChild(button);
  });
}

// ==================================
// 2. 自動產生攝影作品
// ==================================

function renderGallery() {
  gallery.replaceChildren();

  visiblePhotos =
    activeCollection === "all"
      ? [...photoData]
      : photoData.filter(
          item => item.collection === activeCollection
        );

  const currentCollection = collections.find(
    item => item.id === activeCollection
  );

  collectionTitle.textContent =
    currentCollection?.title || "All Works";

  collectionDescription.textContent =
    currentCollection?.description || "所有攝影作品";

  emptyMessage.hidden = visiblePhotos.length !== 0;

  visiblePhotos.forEach((item, index) => {
    const figure = document.createElement("figure");

    figure.className =
      "editorial-photo " +
      layoutClasses[index % layoutClasses.length];

    const image = document.createElement("img");

    image.src = item.src;
    image.alt = item.description || item.title;
    image.loading = "lazy";

    const button = document.createElement("button");
    button.type = "button";
    button.className = "photo-button";
    button.setAttribute(
      "aria-label",
      "放大" + image.alt
    );

    button.appendChild(image);

    const caption = document.createElement("figcaption");

    const number =
      String(index + 1).padStart(2, "0");

    caption.textContent =
      number + " / " + item.title;

    button.addEventListener("click", () => {
      openLightbox(index);
    });

    figure.appendChild(button);
    figure.appendChild(caption);
    gallery.appendChild(figure);
  });
}

// ==================================
// 3. Lightbox
// ==================================

const lightbox =
  document.getElementById("lightbox");

const lightboxImage =
  document.getElementById("lightbox-image");

const lightboxCaption =
  document.getElementById("lightbox-caption");

const lightboxCounter =
  document.getElementById("lightbox-counter");

const closeButton =
  document.getElementById("lightbox-close");

const prevButton =
  document.getElementById("lightbox-prev");

const nextButton =
  document.getElementById("lightbox-next");

let currentIndex = 0;
let previousFocus = null;

// 顯示指定照片
function showPhoto(index) {
  if (visiblePhotos.length === 0) return;

  currentIndex =
    (index + visiblePhotos.length) %
    visiblePhotos.length;

  const item = visiblePhotos[currentIndex];

  lightboxImage.src = item.src;
  lightboxImage.alt =
    item.description || item.title;

  lightboxCaption.textContent = item.title;

  lightboxCounter.textContent =
    String(currentIndex + 1).padStart(2, "0") +
    " / " +
    String(visiblePhotos.length).padStart(2, "0");
}

// 開啟燈箱
function openLightbox(index) {
  previousFocus = document.activeElement;

  showPhoto(index);

  lightbox.hidden = false;
  document.body.style.overflow = "hidden";

  closeButton.focus();
}

// 關閉燈箱
function closeLightbox() {
  lightbox.hidden = true;
  lightboxImage.removeAttribute("src");

  document.body.style.overflow = "";
  previousFocus?.focus();
}

// ==================================
// 4. 燈箱按鈕
// ==================================

closeButton.addEventListener("click", closeLightbox);

prevButton.addEventListener("click", () => {
  showPhoto(currentIndex - 1);
});

nextButton.addEventListener("click", () => {
  showPhoto(currentIndex + 1);
});

// 點擊背景關閉
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

// ==================================
// 5. 鍵盤操作
// ==================================

document.addEventListener("keydown", (event) => {
  if (lightbox.hidden) return;

  if (event.key === "Escape") {
    closeLightbox();
    return;
  }

  if (event.key === "ArrowLeft") {
    showPhoto(currentIndex - 1);
  }

  if (event.key === "ArrowRight") {
    showPhoto(currentIndex + 1);
  }

  if (event.key === "Tab") {
    const controls = [
      closeButton,
      prevButton,
      nextButton
    ];

    const current =
      controls.indexOf(document.activeElement);

    if (event.shiftKey && current <= 0) {
      event.preventDefault();
      controls[controls.length - 1].focus();
    } else if (
      !event.shiftKey &&
      current === controls.length - 1
    ) {
      event.preventDefault();
      controls[0].focus();
    }
  }
});

// ==================================
// 6. 初始化網站
// ==================================

renderFilters();
renderGallery();
