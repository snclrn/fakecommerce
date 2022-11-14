const user = getLoggedInUser();

function updateWishlistItemCount() {
  if (localStorage.getItem("wishlists")) {
    let wishlists = JSON.parse(localStorage.getItem("wishlists"));
    const userWishlists = wishlists.filter((cart) => cart.userId === user.id);
    if (userWishlists.length > 0) {
      document.querySelector(".items-count.wishlist").innerText = JSON.parse(localStorage.getItem("wishlists")).length;
      document.querySelector(".items-count.wishlist").style.display = "block";
    } else {
      document.querySelector(".items-count.wishlist").style.display = "none";
    }
  } else {
    document.querySelector(".items-count.wishlist").style.display = "none";
  }
}

function updateCartItemCount() {
  if (localStorage.getItem("carts")) {
    let carts = JSON.parse(localStorage.getItem("carts"));
    const userCarts = carts.filter((cart) => cart.userId === user.id);
    if (userCarts.length > 0) {
      document.querySelector(".items-count.cart").innerText = JSON.parse(localStorage.getItem("carts")).length;
      document.querySelector(".items-count.cart").style.display = "block";
    } else {
      document.querySelector(".items-count.cart").style.display = "none";
    }
  } else {
    document.querySelector(".items-count.cart").style.display = "none";
  }
}

function removeProductFromWishlist(id) {
  const wishlists = JSON.parse(localStorage.getItem("wishlists"));
  const newWishlist = wishlists.filter((wishlist) => wishlist.id != id);
  localStorage.setItem("wishlists", JSON.stringify(newWishlist));
  renderUserWishlist();
  updateWishlistItemCount();
}

function removeProductFromCart(id) {
  const carts = JSON.parse(localStorage.getItem("carts"));
  const newCarts = carts.filter((item) => item.id != id);
  localStorage.setItem("carts", JSON.stringify(newCarts));
  renderUserCart();
  updateCartItemCount();
}

function renderUserWishlist() {
  let wishlistItems = document.querySelector(".nav-menu .list-items.wishlist");
  if (localStorage.getItem("wishlists")) {
    const wishlists = JSON.parse(localStorage.getItem("wishlists"));
    const user = getLoggedInUser();

    const userWishlists = wishlists.filter((wishlist) => wishlist.userId === user.id);

    if (userWishlists.length > 0) {
      let template = "";
      userWishlists.map((userWishlist) => {
        const convertedPrice = userWishlist.price * 59.03;

        template += `
        <div class="wishlist-item">
          <img src="${userWishlist.thumbnail}" alt="${userWishlist.title}" />
          <div>
            <p class="item-name">${userWishlist.title}</p>
            <p class="item-price">₱${formatPrice(convertedPrice.toFixed(0))}</p>
            <p class="item-stock">${userWishlist.stock} in stock</p>
            <button onclick="removeProductFromWishlist(${userWishlist.id})" class="remove-item-btn">Remove</button>
          </div>
        </div>
      `;
      });

      wishlistItems.innerHTML = `
      <div class="wishlist-items">
        ${template}
      </div>
    `;
    } else {
      wishlistItems.innerHTML = `<div style="padding: 20px;">
        <p style="text-align: center">No items found</p>
      </div>`;
    }
  }
}

function renderUserCart() {
  let cartItems = document.querySelector(".nav-menu .list-items.cart");
  if (localStorage.getItem("carts")) {
    const carts = JSON.parse(localStorage.getItem("carts"));
    const user = getLoggedInUser();

    const userCart = carts.filter((item) => item.userId === user.id);

    if (userCart.length > 0) {
      let template = "";
      userCart.map((cartItem) => {
        const convertedPrice = cartItem.price * 59.03;

        template += `
        <div class="wishlist-item">
          <img src="${cartItem.thumbnail}" alt="${cartItem.title}" />
          <div>
            <p class="item-name">${cartItem.title}</p>
            <p class="item-price">₱${formatPrice(convertedPrice.toFixed(0))}</p>
            <p class="item-stock">${cartItem.stock} in stock</p>
            <p class="item-quantity"><b>${cartItem.quantity}</b> ${cartItem.quantity > 1 ? "items" : "item"}</p>
            <button onclick="removeProductFromCart(${cartItem.id})" class="remove-item-btn">Remove</button>
          </div>
        </div>
      `;
      });

      cartItems.innerHTML = `
      <div class="cart-items">
        ${template}
      </div>
    `;
    } else {
      cartItems.innerHTML = `<div style="padding: 20px;">
      <p style="text-align: center">No items found</p>
    </div>
    `;
    }
  }
}

let wishlists = [];
function addProductToWishlist(id, img, name, price, stock) {
  if (localStorage.getItem("wishlists")) {
    const existingWishlists = JSON.parse(localStorage.getItem("wishlists"));
    wishlists = [...existingWishlists];
  }

  const user = getLoggedInUser();

  wishlists.push({
    id: id,
    userId: user.id,
    thumbnail: img,
    title: name,
    price: price,
    stock: stock,
  });

  localStorage.setItem("wishlists", JSON.stringify(wishlists));
  updateWishlistItemCount();
}

let cartItems = [];
function addProductToCart(id, img, name, price, stock, quantity) {
  if (localStorage.getItem("carts")) {
    const existingCartItems = JSON.parse(localStorage.getItem("carts"));
    cartItems = [...existingCartItems];
  }

  const user = getLoggedInUser();

  cartItems.push({
    id: id,
    userId: user.id,
    thumbnail: img,
    title: name,
    price: price,
    stock: stock,
    quantity: quantity,
  });

  localStorage.setItem("carts", JSON.stringify(cartItems));
  updateCartItemCount();
}

function formatPrice(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
