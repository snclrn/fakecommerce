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

if (!localStorage.getItem("wishlists")) {
  localStorage.setItem("wishlists", JSON.stringify([]));
}

if (!localStorage.getItem("carts")) {
  localStorage.setItem("carts", JSON.stringify([]));
}

function openProduct(id) {
  fetch(`https://dummyjson.com/products/${id}`).then(async (res) => {
    const product = await res.json();
    const onlyOneImage = product.images.length === 1;
    let productQuantity = 1;
    let curSlide = 0;
    let maxSlide = product.images.length - 1;
    let convertedPrice = product.price * 59.03;
    let discount = product.discountPercentage / 100;
    let discountedPrice = formatPrice((convertedPrice - convertedPrice * discount).toFixed(0));
    let discountedPriceCent = formatPrice((convertedPrice - convertedPrice * discount).toFixed(2))
      .toString()
      .slice(-3);

    scrollNextSlide.style.display = onlyOneImage ? "none" : "block";
    scrollPrevSlide.style.display = onlyOneImage ? "none" : "block";

    let imgTemplate = "";
    let slideCountTemplate = "";
    product.images.forEach((img, i) => {
      imgTemplate += `<div style="transform: translateX(${i * 100}%)" class="slide-img-container">
        <img src="${img}" alt="" />
      </div>`;

      slideCountTemplate += `<button class="slide-count"></button>`;
    });

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

    // set all data to the details container
    productWholeDetails.querySelector(".wp-name").innerText = product.title;
    productWholeDetails.querySelector(".wp-discount").innerText = `${product.discountPercentage}% OFF`;
    productWholeDetails.querySelector(
      ".wp-discounted-price"
    ).innerHTML = `₱${discountedPrice}<span class="wp-price-cent">${discountedPriceCent}</span>`;
    productWholeDetails.querySelector(".wp-original-price").innerText = `₱${formatPrice(convertedPrice.toFixed(0))}`;
    productWholeDetails.querySelector(".product-category p").innerText = `${product.category}`;
    productWholeDetails.querySelector(".wp-rating").setAttribute("style", `--percent: calc(${product.rating} / 5 * 100%)`);
    productWholeDetails.querySelector(".wp-rate").innerText = `${product.rating}`;
    productWholeDetails.querySelector(".wp-rating").style.backgroundSize = `${(product.rating / 5) * 100}% 100%`;
    productWholeDetails.querySelector(".quantity-count").innerText = `${productQuantity}`;

    handleWishlistButton(product.id, `${product.thumbnail}`, `${product.title}`, product.price, product.stock);
    handleCartButton(product.id, `${product.thumbnail}`, `${product.title}`, product.price, product.stock, productQuantity);

    document.querySelector("[data-increase-quantity]").addEventListener("click", () => {
      productQuantity = productQuantity < 30 ? productQuantity + 1 : 30;
      document.querySelector(".quantity-count").innerText = productQuantity;
      handleCartButton(product.id, `${product.thumbnail}`, `${product.title}`, product.price, product.stock, productQuantity);
    });

    document.querySelector("[data-decrease-quantity]").addEventListener("click", () => {
      productQuantity = productQuantity > 1 ? productQuantity - 1 : 1;
      document.querySelector(".quantity-count").innerText = productQuantity;
      handleCartButton(product.id, `${product.thumbnail}`, `${product.title}`, product.price, product.stock, productQuantity);
    });

    // change the color of count of current slide
    document.querySelectorAll(".slide-count")[curSlide].style.background = "#000";

    productModalBackdrop.addEventListener("click", () => {
      productModalBackdrop.classList.remove("open");
      productModal.style.display = "none";
      document.body.style.overflow = "auto";
    });

    document.querySelector(".close-modal-btn").addEventListener("click", () => {
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

function isAddedToWishlist(productId) {
  return JSON.parse(localStorage.getItem("wishlists")).find((wishlist) => wishlist.id === productId) ? true : false;
}

function isAddedToCart(productId) {
  return JSON.parse(localStorage.getItem("carts")).find((wishlist) => wishlist.id === productId) ? true : false;
}

function handleWishlistButton(id, thumbnail, title, price, stock) {
  if (isAddedToWishlist(id)) {
    document.querySelector(".wishlist-btn-container").innerHTML = `<button
      onclick="removeProductFromWishlist(${id}); handleWishlistButton(${id}, '${thumbnail}', '${title}', ${price}, ${stock})"
      class="wishlist-btn remove"
      ><i class="ai-heart"></i>
      <span>Added to wishlist</span>
    </button>`;
  } else {
    document.querySelector(".wishlist-btn-container").innerHTML = `<button onclick="addProductToWishlist(
      ${id},
     '${thumbnail}',
     '${title}',
      ${price},
      ${stock}); handleWishlistButton(${id}, '${thumbnail}', '${title}', ${price}, ${stock})" class="wishlist-btn add">
       <i class="ai-heart"></i>
       <span>Add to wishlist</span>
     </button>`;
  }
}

function handleCartButton(id, thumbnail, title, price, stock, quantity) {
  if (isAddedToCart(id)) {
    document.querySelector(".cart-btn-container").innerHTML = `<button
      onclick="removeProductFromCart(${id}); handleCartButton(${id}, '${thumbnail}', '${title}', ${price}, ${stock}, ${quantity})"
      class="cart-btn remove"
      ><i class="ai-cart"></i>
      <span>Remove to Cart</span>
    </button>`;
  } else {
    document.querySelector(".cart-btn-container").innerHTML = `<button onclick="addProductToCart(
      ${id},
     '${thumbnail}',
     '${title}',
      ${price},
      ${stock},
      ${quantity},
      ); handleCartButton(${id}, '${thumbnail}', '${title}', ${price}, ${stock}, ${quantity})" class="cart-btn add">
       <i class="ai-cart"></i>
       <span>Add to Cart</span>
     </button>`;
  }
}

function createProductTemplate(product) {
  let convertedPrice = product.price * 59.03;
  let discount = product.discountPercentage / 100;
  let discountedPrice = formatPrice((convertedPrice - convertedPrice * discount).toFixed(0));
  let discountedPriceCent = formatPrice((convertedPrice - convertedPrice * discount).toFixed(2))
    .toString()
    .slice(-3);

  return `
  <button onclick="openProduct(${product.id})" class="product">
      <div class="product-image">
        <img src="${product.thumbnail}" alt="" />
        <span class="product-discount">
        ${product.discountPercentage}% OFF
      </span>
      </div>
    <div class="product-details">
    <span class="product-category">
      <i class="ai-tag"></i>
      <p>${product.category}</p>
    </span>
    <p class="product-name">${product.title}</p>
    <p class="product-price">
      <span class="price-symbol">₱</span>${discountedPrice}<span class="price-cent">${discountedPriceCent}</span>
    </p>
      <p class="product-brand">${product.brand.replace("APPle", "Apple")}</p>
    </div>
  </button>
`;
}

function filterByCategory(category) {
  productsCategory.innerHTML =
    category === "recommended"
      ? `<p class="emphasized">Recommended for you</p>`
      : `<p>Results for</p> <p style="text-transform: capitalize" class="emphasized">${category.replace("-", " ")}</p>`;
  fetch(category === "recommended" ? `https://dummyjson.com/products` : `https://dummyjson.com/products/category/${category}`).then(
    async (res) => {
      const data = await res.json();
      products = [...data.products];

      let template = "";
      products.map((product) => {
        template += createProductTemplate(product);
      });

      productsSection.innerHTML = template;
    }
  );
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
  const categories = ["recommended", ...data];

  let template = "";
  categories.map((category) => {
    template += `
    <button onclick="filterByCategory('${category}', this)" class="category">
      <i class="ai-tag"></i>
      <span>${category.replace("-", " ")}</span>
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

async function handleSearch(e) {
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
}

window.addEventListener("DOMContentLoaded", () => {
  renderCategories();
  renderProducts();

  productsCategory.innerHTML = `<p class="emphasized">Recommended for you</p>`;
  searchInput.addEventListener("keypress", handleSearch);
});
