import { productsData } from "./products.js";

const cartBtn = document.querySelector(".cart-btn");
const cartModal = document.querySelector(".cart");
const backDrop = document.querySelector(".backdrop");
const closeModal = document.querySelector(".cart-item-confirm");

const productsDom = document.querySelector(".products-center");
const cartTotal = document.querySelector(".cart-total");
const cartItems = document.querySelector(".cart-items");
const cartContent = document.querySelector(".cart-content");
const clearCart = document.querySelector(".clear-cart");

let cart = [];
let buttonsDom = [];

// ? 1.Get Products
class Products {
  getProducts() {
    return productsData;
  }
}
// ? 2.Display Products
class UI {
  displayProducts(products) {
    let result = "";
    products.forEach((item) => {
      result += `<div class="product">
      <div class="img-container">
      <img src=${item.imageUrl} class="product-img" />
      </div>
      <div class="product-desc">
      <p class="product-price">$ ${item.price}</p>
      <p class="product-title">${item.title}</p>
      </div>
            <button class="btn add-to-cart" data-id=${item.id}>
              <i class="fas fa-shopping-cart"></i>
              add to cart
              </button>
          </div>`;
      productsDom.innerHTML = result;
    });
  }
  getAddToCartBtn() {
    const addToCartBtn = [...document.querySelectorAll(".add-to-cart")];
    // const buttonsDom = addToCartBtn;
    buttonsDom = addToCartBtn;
    addToCartBtn.forEach((btn) => {
      const id = btn.dataset.id;
      // ? check is it on cart?
      const isInCart = cart.find((p) => p.id === parseInt(id));
      if (isInCart) {
        btn.innerHTML = "In cart";
        btn.disabled = true;
      }
      btn.addEventListener("click", (event) => {
        event.target.innerHTML = "In cart";
        event.target.disabled;
        // ? get products from (products class)
        const addedProduct = { ...Storage.getProduct(id), quantity: 1 };
        // ? add to cart
        cart = [...cart, addedProduct];
        // ? save cart in local storage
        Storage.saveCart(cart);
        // ? update cart value
        this.setCartValue(cart);
        // ? add to cart item
        this.addCartItem(addedProduct);
      });
    });
  }
  setCartValue(cart) {
    // ? cart items

    // ? calc total price
    let tempCartItems = 0;
    let totalPrice = cart.reduce((acc, curr) => {
      tempCartItems += curr.quantity;
      return acc + curr.quantity * curr.price;
    }, 0);
    cartTotal.innerHTML = `total price : ${totalPrice.toFixed(2)} $`;
    cartItems.innerHTML = tempCartItems;
  }
  addCartItem(cartItem) {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `<img class="cart-item-img" src=${cartItem.imageUrl} />
            <div class="cart-item-desc">
              <h4>${cartItem.title}</h4>
              <h5>$ ${cartItem.price}</h5>
            </div>
            <div class="cart-item-conteoller">
              <i class="fas fa-chevron-up" data-id=${cartItem.id}></i>
              <p>${cartItem.quantity}</p>
              <i class="fas fa-chevron-down" data-id=${cartItem.id}></i>
              </div>
              <i class="far fa-trash-alt" data-id=${cartItem.id}></i> `;
    cartContent.appendChild(div);
  }
  setUpApp() {
    // ? get cart from storage
    cart = Storage.getCart();
    // ? add cart item
    cart.forEach((cartItem) => this.addCartItem(cartItem));
    // ?
    this.setCartValue(cart);
  }
  cartLogic() {
    clearCart.addEventListener("click", () => this.clearCart());
  }
  clearCart() {
    cart.forEach((cItem) => this.removeItem(cItem.id));
    while (cartContent.children.length) {
      cartContent.removeChild(cartContent.children[0]);
    }
    closeModalFunction();
  }
  removeItem(id) {
    // ? update cart
    cart = cart.filter((cItem) => cItem.id !== id);
    // ? update cart and storage
    this.setCartValue(cart);
    Storage.saveCart(cart);
    // ? get buttons and change it to "default"
    this.getSingleButton(id)
  }
  getSingleButton(id) {
    const button = buttonsDom.find(
      (btn) => parseInt(btn.dataset.id) === parseInt(id)
    );
    button.innerText = "add to cart";
    button.disabled = false;
  }
}
// ? 3.Save to Local Storage
class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }
  static getProduct(id) {
    const _products = JSON.parse(localStorage.getItem("products"));
    return _products.find((p) => p.id === parseInt(id));
  }
  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  static getCart(id) {
    return JSON.parse(localStorage.getItem("cart"))
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
  }
}
// ? when Dom loaded!
document.addEventListener("DOMContentLoaded", () => {
  const products = new Products();
  const productsData = products.getProducts();
  const ui = new UI();
  // ? get cart and setup app
  ui.setUpApp();
  ui.displayProducts(productsData);
  ui.getAddToCartBtn();
  ui.cartLogic();
  Storage.saveProducts(productsData);
});

function showModalFunction() {
  backDrop.style.display = "block";
  cartModal.style.opacity = "1";
  cartModal.style.top = "20%";
}

function closeModalFunction() {
  backDrop.style.display = "none";
  cartModal.style.opacity = "0";
  cartModal.style.top = "-100%";
}

cartBtn.addEventListener("click", showModalFunction);
closeModal.addEventListener("click", closeModalFunction);
backDrop.addEventListener("click", closeModalFunction);
