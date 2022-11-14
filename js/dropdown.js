function openDropdown(dataAttr) {
  document.querySelector(dataAttr).setAttribute("open", true);
  document.querySelector("[data-menu]").removeAttribute("open");
}

window.addEventListener("DOMContentLoaded", () => {
  document.querySelector("[data-wishlist]").addEventListener("toggle", () => {
    renderUserWishlist();
  });

  document.querySelector("[data-cart]").addEventListener("toggle", () => {
    renderUserCart();
  });

  updateWishlistItemCount();
  updateCartItemCount();
});
