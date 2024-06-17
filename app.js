import { productsData } from "./products.js";

const cartBtn = document.querySelector(".cart-btn");
const cartModal = document.querySelector(".cart");
const backDrop = document.querySelector(".backdrop");
const closeModal = document.querySelector(".cart-item-confirm");

const productsDom = document.querySelector(".products-center");
const cartTotal = document.querySelector(".cart-total");
const cartItems = document.querySelector(".cart-items");

let cart = [];
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
    const addToCartBtn = document.querySelectorAll(".add-to-cart");
    const buttons = [...addToCartBtn];

    buttons.forEach((btn) => {
      const id = btn.dataset.id;
      // ? check is it on cart?
      const isInCart = cart.find((p) => p.id === id);
      if (isInCart) {
        btn.innerHTML = "In cart";
        btn.disabled = true;
      }
      btn.addEventListener("click", (event) => {
        event.target.innerHTML = "In cart";
        event.target.disabled;
        // ? get products from (products class)
        const addedProduct = Storage.getProduct(id);
        // ? add to cart
        cart = [...cart, { ...addedProduct, quantity: 1 }];
        // ? save cart in local storage
        Storage.saveCart(cart);
        // ? update cart value
        this.setCartValue(cart)
        // ? get cart from storage
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
    cartItems.innerHTML = tempCartItems
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
}
// ? when Dom loaded!
document.addEventListener("DOMContentLoaded", () => {
  const products = new Products();
  const productsData = products.getProducts();
  const ui = new UI();
  ui.displayProducts(productsData);
  ui.getAddToCartBtn();
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
