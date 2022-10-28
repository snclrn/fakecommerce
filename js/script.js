let productsSection = document.querySelector(".products"),
  categoriesSection = document.querySelector(".categories"),
  productsCategory = document.querySelector(".products-category"),
  imgSlidesContainer = document.querySelector(".image-slides-container"),
  searchInput = document.querySelector(".search-input"),
  searchResultsWrapper = document.querySelector(".search-results-wrapper"),
  scrollPrevSlide = document.querySelector(".scroll-slide.prev-slide"),
  scrollNextSlide = document.querySelector(".scroll-slide.next-slide"),
  scrollCategoriesLeft = document.querySelector(".scroll-left"),
  scrollCategoriesRight = document.querySelector(".scroll-right"),
  scrollCountContainer = document.querySelector(".slides-count-container"),
  productModalBackdrop = document.querySelector(".product-modal-backdrop"),
  productWholeDetails = document.querySelector(".product-whole-details"),
  productModal = document.querySelector(".product-modal");

let products = [];

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function openProduct(id) {
  fetch(`https://dummyjson.com/products/${id}`).then(async (res) => {
    const product = await res.json();
    const onlyOneImage = product.images.length === 1;
    let curSlide = 0;
    let maxSlide = product.images.length - 1;
    let convertedPrice = product.price * 59.03;
    let discount = product.discountPercentage / 100;
    let discountedPrice = numberWithCommas(
      (convertedPrice - convertedPrice * discount).toFixed(0)
    );
    let discountedPriceCent = numberWithCommas(
      (convertedPrice - convertedPrice * discount).toFixed(2)
    )
      .toString()
      .slice(-3);

    scrollNextSlide.style.display = onlyOneImage ? "none" : "block";
    scrollPrevSlide.style.display = onlyOneImage ? "none" : "block";

    let imgTemplate = "";
    let slideCountTemplate = "";
    product.images.forEach((img, i) => {
      imgTemplate += `<div style="transform: translateX(${
        i * 100
      }%)" class="slide-img-container">
        <img src="${img}" alt="" />
      </div>`;

      slideCountTemplate += `<button class="slide-count"></button>`;
    });

    let productDetailTemplate = `
      <h2 class="wp-name">${product.title}</h2>
      <span class="wp-discount">
        ${product.discountPercentage}% OFF
      </span>
      <h1 class="wp-discounted-price">₱${discountedPrice}<span class="wp-price-cent">${discountedPriceCent}</span></h1>
      <h3 class="wp-original-price">₱${numberWithCommas(
        convertedPrice.toFixed(0)
      )}</h3>
      <span class="wp-category">${product.category}</span>
      <div>
        ★★★★★
      </div>
      `;

    // add open to product modal backdrop which shows the backdrop effect
    productModalBackdrop.classList.add("open");

    // change display of product modal from none to flex
    productModal.style.display = "flex";

    // hide scrollbar
    document.body.style.overflow = "hidden";

    // append images to slides container
    imgSlidesContainer.innerHTML = imgTemplate;

    // append counts to counts container
    scrollCountContainer.innerHTML = slideCountTemplate;

    // append product detail to product detail container
    productWholeDetails.innerHTML = productDetailTemplate;

    // change the color of count of current slide
    document.querySelectorAll(".slide-count")[curSlide].style.background =
      "#000";

    productModalBackdrop.addEventListener("click", () => {
      productModalBackdrop.classList.remove("open");
      productModal.style.display = "none";
      document.body.style.overflow = "auto";
    });

    productModal.addEventListener("click", (e) => {
      e.stopPropagation();
    });

    scrollPrevSlide.addEventListener("click", () => {
      let slides = document.querySelectorAll(".slide-img-container");
      let slideCounts = document.querySelectorAll(".slide-count");
      if (curSlide === 0) {
        curSlide = maxSlide;
      } else {
        curSlide--;
      }

      slides.forEach((slide, i) => {
        slide.style.transform = `translateX(${100 * (i - curSlide)}%)`;
        slideCounts.forEach((sc, i) => {
          sc.style.background = i === curSlide ? "#000" : "#00000099";
        });
      });
    });

    scrollNextSlide.addEventListener("click", () => {
      let slides = document.querySelectorAll(".slide-img-container");
      let slideCounts = document.querySelectorAll(".slide-count");
      if (curSlide === maxSlide) {
        curSlide = 0;
      } else {
        curSlide++;
      }

      slides.forEach((slide, i) => {
        slide.style.transform = `translateX(${100 * (i - curSlide)}%)`;
        slideCounts.forEach((sc, i) => {
          sc.style.background = i === curSlide ? "#000" : "#00000099";
        });
      });
    });
  });
}

function createProductTemplate(product) {
  let convertedPrice = product.price * 59.03;
  let discount = product.discountPercentage / 100;
  let discountedPrice = numberWithCommas(
    (convertedPrice - convertedPrice * discount).toFixed(0)
  );
  let discountedPriceCent = numberWithCommas(
    (convertedPrice - convertedPrice * discount).toFixed(2)
  )
    .toString()
    .slice(-3);

  return `
  <button onclick="openProduct(${product.id})" class="product">
      <img src="${product.thumbnail}" alt="" class="product-image" />
      <span class="product-discount">
        ${product.discountPercentage}% OFF
      </span>
    <div class="product-details">
    <span class="product-category">
      <i class="ai-tag"></i>
      <p>${product.category}</p>
    </span>
    <p class="product-name">${product.title}</p>
    <p class="product-price">
      ₱${discountedPrice}<span class="price-cent">${discountedPriceCent}</span>
    </p>
      <p class="product-brand">${product.brand.replace("APPle", "Apple")}</p>
    </div>
  </button>
`;
}

function filterByCategory(category) {
  productsCategory.innerHTML =
    category === "all"
      ? `<p class="emphasized">For you</p>`
      : `<p>Results for</p> <p style="text-transform: capitalize" class="emphasized">${category.replace(
          "-",
          " "
        )}</p>`;
  fetch(
    category === "all"
      ? `https://dummyjson.com/products`
      : `https://dummyjson.com/products/category/${category}`
  ).then(async (res) => {
    const data = await res.json();
    products = [...data.products];

    let template = "";
    products.map((product) => {
      template += createProductTemplate(product);
    });

    productsSection.innerHTML = template;
  });
}

async function renderProducts() {
  const res = await fetch("https://dummyjson.com/products");
  const data = await res.json();
  products = [...data.products];

  let template = "";
  products.map((product) => {
    template += createProductTemplate(product);
  });

  productsSection.innerHTML = template;
}

async function renderCategories() {
  const res = await fetch("https://dummyjson.com/products/categories");
  const data = await res.json();
  const categories = ["all", ...data];

  let template = "";
  categories.map((category) => {
    template += `
    <button onclick="filterByCategory('${category}', this)" class="category">
      ${category.replace("-", " ")}
    </button>`;
  });

  categoriesSection.innerHTML = template;

  scrollCategoriesLeft.addEventListener("click", () => {
    categoriesSection.scrollLeft += 200;
  });

  scrollCategoriesRight.addEventListener("click", () => {
    categoriesSection.scrollLeft -= 200;
  });
}

async function searchProducts(value) {
  const res = await fetch(`https://dummyjson.com/products/search?q=${value}`);
  const data = await res.json();

  return data;
}

window.addEventListener("DOMContentLoaded", () => {
  renderCategories();
  renderProducts();

  productsCategory.innerHTML = `<p class="emphasized">For you</p>`;
  searchInput.addEventListener("keypress", async (e) => {
    if (e.key === "Enter") {
      if (e.target.value.length > 0) {
        const data = await searchProducts(e.target.value);
        const items = [...data.products];
        let template = "";
        items.map((item) => {
          template += `
          <button onclick="openProduct(${item.id})" class="srp-item">
            <img src="${item.thumbnail}" alt="${item.title}" class="srp-image" />
            <p class="srp-name">${item.title}</p>
          </button>
        `;
        });
        searchResultsWrapper.innerHTML = `
        <div class="srp-results-header">
          <div class="results-count">
            <p>Search results for <b>${e.target.value}</b></p>
            <span>${data.total} items</span>
          </div>

          <button onclick="searchResultsWrapper.classList.remove('show')" class="close-results">
            <i class="ai-cross"></i>
          </button>
        </div>
        <div class="search-results-container">
          ${template}
        </div>
      `;
        searchResultsWrapper.classList.add("show");
      } else {
        searchResultsWrapper.classList.remove("show");
      }
    }
  });
});
