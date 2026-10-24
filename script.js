
/* ==================================
   URBAN FRAGMENTS
   Auto Gallery + Lightbox
================================== */

// 1. 自動產生相簿

const gallery = document.getElementById("photo-gallery");

const layoutClasses = [
  "photo-featured",
  "photo-left",
  "photo-right",
  "photo-wide"
];

photoData.forEach((item, index) => {
  const figure = document.createElement("figure");

  figure.className =
    "editorial-photo " +
    layoutClasses[index % layoutClasses.length];

  const image = document.createElement("img");
  image.src = item.src;
  image.alt = item.description || item.title;
  image.loading = "lazy";
  image.tabIndex = 0;
  image.setAttribute("role", "button");
  image.setAttribute("aria-label", "放大" + image.alt);

  const caption = document.createElement("figcaption");

  const number = String(index + 1).padStart(2, "0");
  caption.textContent = number + " / " + item.title;

  figure.appendChild(image);
  figure.appendChild(caption);
  gallery.appendChild(figure);
});

// 2. 取得所有照片與燈箱元素

const photos = Array.from(
  document.querySelectorAll(".editorial-photo")
);

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const lightboxCaption = document.getElementById("lightbox-caption");
const lightboxCounter = document.getElementById("lightbox-counter");

const closeButton = document.getElementById("lightbox-close");
const prevButton = document.getElementById("lightbox-prev");
const nextButton = document.getElementById("lightbox-next");

let currentIndex = 0;
let previousFocus = null;

// 3. 顯示照片

function showPhoto(index) {
  currentIndex = (index + photos.length) % photos.length;

  const photo = photos[currentIndex];
  const image = photo.querySelector("img");
  const caption = photo.querySelector("figcaption");

  lightboxImage.src = image.src;
  lightboxImage.alt = image.alt;
  lightboxCaption.textContent = caption.textContent.trim();

  lightboxCounter.textContent =
    String(currentIndex + 1).padStart(2, "0") +
    " / " +
    String(photos.length).padStart(2, "0");
}

// 4. 開啟燈箱

function openLightbox(index) {
  previousFocus = document.activeElement;

  showPhoto(index);
  lightbox.hidden = false;

  document.body.style.overflow = "hidden";
  closeButton.focus();
}

// 5. 關閉燈箱

function closeLightbox() {
  lightbox.hidden = true;
  lightboxImage.removeAttribute("src");

  document.body.style.overflow = "";
  previousFocus?.focus();
}

// 6. 為照片加入互動功能

photos.forEach((photo, index) => {
  const image = photo.querySelector("img");

  image.addEventListener("click", () => {
    openLightbox(index);
  });

  image.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openLightbox(index);
    }
  });
});

// 7. 燈箱按鈕

closeButton.addEventListener("click", closeLightbox);

prevButton.addEventListener("click", () => {
  showPhoto(currentIndex - 1);
});

nextButton.addEventListener("click", () => {
  showPhoto(currentIndex + 1);
});

// 8. 鍵盤操作

document.addEventListener("keydown", (event) => {
  if (lightbox.hidden) return;

  if (event.key === "Escape") {
    closeLightbox();
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

    const index = controls.indexOf(document.activeElement);

    if (event.shiftKey && index <= 0) {
      event.preventDefault();
      controls[controls.length - 1].focus();
    } else if (
      !event.shiftKey &&
      index === controls.length - 1
    ) {
      event.preventDefault();
      controls[0].focus();
    }
  }
});

// 9. 點擊燈箱背景關閉

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});
