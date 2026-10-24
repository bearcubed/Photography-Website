
/* =====================================
   URBAN FRAGMENTS
   Photography Lightbox
   照片放大與切換功能
===================================== */

// 取得所有攝影作品
const photos = Array.from(
  document.querySelectorAll(".editorial-photo")
);

// 取得燈箱相關元素
const lightbox = document.getElementById("lightbox");

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

// 紀錄目前顯示第幾張照片
let currentIndex = 0;
let previousFocus = null;

// 顯示指定照片
function showPhoto(index) {

  currentIndex =
    (index + photos.length) % photos.length;

  const photo = photos[currentIndex];
  const image = photo.querySelector("img");
  const caption = photo.querySelector("figcaption");

  lightboxImage.src = image.src;
  lightboxImage.alt = image.alt;

  lightboxCaption.textContent =
    caption.textContent.trim();

  lightboxCounter.textContent =
    `${String(currentIndex + 1).padStart(2, "0")} / ` +
    `${String(photos.length).padStart(2, "0")}`;
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

// 點擊照片時開啟燈箱
photos.forEach((photo, index) => {

  const image = photo.querySelector("img");

  image.tabIndex = 0;
  image.setAttribute("role", "button");
  image.setAttribute(
    "aria-label",
    `放大${image.alt}`
  );

  image.addEventListener("click", () => {
    openLightbox(index);
  });

  // 支援鍵盤操作
  image.addEventListener("keydown", (event) => {

    if (
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();
      openLightbox(index);
    }

  });

});

// 關閉按鈕
closeButton.addEventListener(
  "click",
  closeLightbox
);

// 上一張照片
prevButton.addEventListener("click", () => {
  showPhoto(currentIndex - 1);
});

// 下一張照片
nextButton.addEventListener("click", () => {
  showPhoto(currentIndex + 1);
});

// 鍵盤控制
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

  // 將Tab焦點留在燈箱控制按鈕內
  if (event.key === "Tab") {
    const controls = [
      closeButton,
      prevButton,
      nextButton
    ];

    const index =
      controls.indexOf(document.activeElement);

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

// 點擊燈箱背景時關閉
lightbox.addEventListener("click", (event) => {

  if (event.target === lightbox) {
    closeLightbox();
  }

});
