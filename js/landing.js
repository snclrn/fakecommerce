let productsContainer = document.querySelector(".products-container");

function goToRegister() {
  window.location.href = "/register.html";
}

async function renderTenProducts() {
  const res = await fetch("https://dummyjson.com/products?limit=10&skip=10&select=title,price,thumbnail");
  const { products } = await res.json();

  template = "";
  products.map((product) => {
    template += `
      <div class="product">
        <div class="details">
          <img class="product-img" src="${product.thumbnail}" />
          <p class="product-price">₱${formatPrice(product.price * (59.03).toFixed(0))}</p>
          <p class="product-name">${product.title}</p>
        </div>
        <button onclick="goToRegister()" class="product-view">View</button>
      </div>
    `;
  });

  productsContainer.innerHTML = template;
}

window.addEventListener("DOMContentLoaded", () => {
  renderTenProducts();
});
