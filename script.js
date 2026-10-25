
/* ==========================================
   URBAN FRAGMENTS
   Automatic Gallery + WebP + Lightbox
========================================== */

// 取得網頁元素
const gallery =
  document.getElementById("photo-gallery");

const emptyMessage =
  document.getElementById("gallery-empty");

// Lightbox元素
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

// 不規則相簿版型
const layoutClasses = [
  "photo-featured",
  "photo-left",
  "photo-right",
  "photo-wide"
];

// 狀態
let currentIndex = 0;
let previousFocus = null;
let imageRequestId = 0;

// ==========================================
// 1. 自動建立相簿
// ==========================================

function renderGallery() {

  gallery.replaceChildren();

  emptyMessage.hidden = photoData.length !== 0;

  photoData.forEach((item, index) => {

    // 建立作品容器
    const figure = document.createElement("figure");

    figure.className =
      "editorial-photo " +
      layoutClasses[index % layoutClasses.length];

    // 建立可點擊的按鈕
    const button = document.createElement("button");

    button.type = "button";
    button.className = "photo-button";

    button.setAttribute(
      "aria-label",
      "放大" + (item.description || item.title)
    );

    // 展示縮圖
    const image = document.createElement("img");

    image.src = item.thumbnail;
    image.alt = item.description || item.title;

    image.loading = "lazy";
    image.decoding = "async";

    // 照片文字
    const caption = document.createElement("figcaption");

    const number =
      String(index + 1).padStart(2, "0");

    caption.textContent =
      number + " / " + item.title;

    // 點擊照片
    button.addEventListener("click", () => {
      openLightbox(index);
    });

    button.appendChild(image);
    figure.append(button, caption);

    gallery.appendChild(figure);

  });

}

// ==========================================
// 2. 顯示Lightbox照片
// ==========================================

function showPhoto(index) {

  if (photoData.length === 0) return;

  currentIndex =
    (index + photoData.length) % photoData.length;

  const item = photoData[currentIndex];

  // 防止舊照片載入完成後覆蓋新照片
  const requestId = ++imageRequestId;

  // 先顯示縮圖，避免放大視窗空白
  lightboxImage.src = item.thumbnail;
  lightboxImage.alt =
    item.description || item.title;

  lightboxCaption.textContent = item.title;

  lightboxCounter.textContent =
    String(currentIndex + 1).padStart(2, "0") +
    " / " +
    String(photoData.length).padStart(2, "0");

  // 載入高畫質WebP
  const fullImage = new Image();

  fullImage.onload = () => {

    if (
      requestId === imageRequestId &&
      !lightbox.hidden
    ) {
      lightboxImage.src = item.full;
    }

  };

  fullImage.onerror = () => {
    console.warn(
      "高畫質照片載入失敗：",
      item.full
    );
  };

  fullImage.src = item.full;

}

// ==========================================
// 3. 開啟Lightbox
// ==========================================

function openLightbox(index) {

  previousFocus = document.activeElement;

  lightbox.hidden = false;

  document.body.style.overflow = "hidden";

  showPhoto(index);

  closeButton.focus();

}

// ==========================================
// 4. 關閉Lightbox
// ==========================================

function closeLightbox() {

  imageRequestId++;

  lightbox.hidden = true;

  lightboxImage.removeAttribute("src");

  document.body.style.overflow = "";

  if (previousFocus) {
    previousFocus.focus();
  }

}

// ==========================================
// 5. Lightbox按鈕
// ==========================================

closeButton.addEventListener(
  "click",
  closeLightbox
);

prevButton.addEventListener("click", () => {
  showPhoto(currentIndex - 1);
});

nextButton.addEventListener("click", () => {
  showPhoto(currentIndex + 1);
});

// 點擊燈箱背景關閉
lightbox.addEventListener("click", event => {

  if (event.target === lightbox) {
    closeLightbox();
  }

});

// ==========================================
// 6. 鍵盤操作
// ==========================================

document.addEventListener("keydown", event => {

  if (lightbox.hidden) return;

  if (event.key === "Escape") {
    event.preventDefault();
    closeLightbox();
    return;
  }

  if (event.key === "ArrowLeft") {
    event.preventDefault();
    showPhoto(currentIndex - 1);
    return;
  }

  if (event.key === "ArrowRight") {
    event.preventDefault();
    showPhoto(currentIndex + 1);
    return;
  }

  // Tab焦點保持在Lightbox內
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
      (
        index === controls.length - 1 ||
        index === -1
      )
    ) {

      event.preventDefault();
      controls[0].focus();

    }

  }

});

// ==========================================
// 7. 啟動相簿
// ==========================================

renderGallery();
