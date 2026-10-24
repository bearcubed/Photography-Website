
/* ==========================================
   URBAN FRAGMENTS
   Collections + Optimized Gallery + Lightbox
========================================== */

// ==========================================
// 1. 取得網頁元素
// ==========================================

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

// 不對稱攝影誌版型
const layoutClasses = [
  "photo-featured",
  "photo-left",
  "photo-right",
  "photo-wide"
];

// 目前的狀態
let activeCollection = "all";
let visiblePhotos = [];
let currentIndex = 0;
let previousFocus = null;


// ==========================================
// 2. 建立攝影系列選單
// ==========================================

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


// ==========================================
// 3. 自動產生攝影相簿
// ==========================================

function renderGallery() {

  gallery.replaceChildren();

  // 根據選擇的系列篩選照片
  visiblePhotos =
    activeCollection === "all"
      ? [...photoData]
      : photoData.filter(
          item => item.collection === activeCollection
        );

  const currentCollection = collections.find(
    item => item.id === activeCollection
  );

  // 更新系列標題
  collectionTitle.textContent =
    currentCollection?.title || "All Works";

  collectionDescription.textContent =
    currentCollection?.description || "所有攝影作品";

  // 沒有作品時顯示提示
  emptyMessage.hidden =
    visiblePhotos.length !== 0;

  visiblePhotos.forEach((item, index) => {

    // 建立figure
    const figure =
      document.createElement("figure");

    figure.className =
      "editorial-photo " +
      layoutClasses[index % layoutClasses.length];

    // 建立照片按鈕
    const button =
      document.createElement("button");

    button.type = "button";
    button.className = "photo-button";

    button.setAttribute(
      "aria-label",
      "放大" + (item.description || item.title)
    );

    // 建立縮圖
    const image =
      document.createElement("img");

    image.src = item.thumbnail;
    image.alt =
      item.description || item.title;

    // 延遲載入畫面外的照片
    image.loading = "lazy";

    // 瀏覽器可解碼時非同步解碼
    image.decoding = "async";

    button.appendChild(image);

    // 建立照片說明
    const caption =
      document.createElement("figcaption");

    const number =
      String(index + 1).padStart(2, "0");

    caption.textContent =
      number + " / " + item.title;

    // 點擊後開啟高畫質照片
    button.addEventListener("click", () => {
      openLightbox(index);
    });

    figure.appendChild(button);
    figure.appendChild(caption);

    gallery.appendChild(figure);
  });
}


// ==========================================
// 4. 顯示高畫質照片
// ==========================================

function showPhoto(index) {

  if (visiblePhotos.length === 0) return;

  currentIndex =
    (index + visiblePhotos.length) %
    visiblePhotos.length;

  const item = visiblePhotos[currentIndex];

  // 優先清除上一張，避免下載期間顯示舊圖
  lightboxImage.removeAttribute("src");

  // Lightbox使用高畫質版本
  lightboxImage.src = item.full;

  lightboxImage.alt =
    item.description || item.title;

  lightboxCaption.textContent =
    item.title;

  lightboxCounter.textContent =
    String(currentIndex + 1).padStart(2, "0") +
    " / " +
    String(visiblePhotos.length).padStart(2, "0");
}


// ==========================================
// 5. 開啟Lightbox
// ==========================================

function openLightbox(index) {

  previousFocus = document.activeElement;

  showPhoto(index);

  lightbox.hidden = false;

  // 防止背景捲動
  document.body.style.overflow = "hidden";

  closeButton.focus();
}


// ==========================================
// 6. 關閉Lightbox
// ==========================================

function closeLightbox() {

  lightbox.hidden = true;

  lightboxImage.removeAttribute("src");

  document.body.style.overflow = "";

  // 返回先前操作的元素
  previousFocus?.focus();
}


// ==========================================
// 7. Lightbox按鈕
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


// ==========================================
// 8. 點擊背景關閉
// ==========================================

lightbox.addEventListener("click", (event) => {

  if (event.target === lightbox) {
    closeLightbox();
  }
});


// ==========================================
// 9. 鍵盤操作
// ==========================================

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

  // 將Tab焦點限制在燈箱按鈕
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


// ==========================================
// 10. 初始化網站
// ==========================================

renderFilters();
renderGallery();
