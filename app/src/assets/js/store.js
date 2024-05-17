const baseURL = "http://localhost:3000";

const buttons = document.querySelectorAll(".store__category-button");
const productList = document.querySelector(".store__list");
const cartButton = document.querySelector(".store__cart-button");
const modalOverlay = document.querySelector(".modal-overlay");
const modalCartItems = document.querySelector(".modal__cart-items");
const modalOverlayCloseButton = cartButton.querySelector(
  ".modal-overlay__close-button"
);
const cartCount = document.querySelector(".store__cart-count");

const fetchProductByCategory = async (category = "") => {
  const fetch_url = `/api/products/category/${category}`;
  const url = new URL(fetch_url, baseURL);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(response.status);
  }
  const products = await response.json();
  renderProducts(products);
};

const getCartItemsFromLocalStorage = () => {
  return JSON.parse(localStorage.getItem("cartItems") || "[]");
};

const changeCategory = ({ target }) => {
  buttons.forEach((button) => {
    button.classList.remove("store__category-button_active");
  });
  target.classList.add("store__category-button_active");
  const category = target.dataset.category;
  if (category) fetchProductByCategory(category);
};

buttons.forEach((button) => {
  button.addEventListener("click", changeCategory);

  if (button.classList.contains("store__category-button_active")) {
    fetchProductByCategory(button.dataset.category);
  }
});

const createProductCard = ({ name, price, id, photoUrl }) => {
  const element = document.createElement("li");
  element.classList.add("store__item");
  element.innerHTML = `
    <article class="store__product product">
      <img
        class="product__image"
        src=${baseURL + photoUrl}
        alt=${name}
        width="388"
        height="261"
      />
      <h3 class="product__title">${name}</h3>
      <p class="product__price">${price}&nbsp;₽</p>
      <button class="product__btn-add-cart" data-id=${id} data-name=${encodeURIComponent(
    name
  )}>Заказать</button>
    </article>
  `;
  return element;
};

const renderProducts = (products) => {
  productList.textContent = "";
  const productElements = products.map((product) => createProductCard(product));
  productList.append(...productElements);
};

const renderCartItems = () => {
  modalCartItems.textContent = "";
  const cartItems = getCartItemsFromLocalStorage();
  const items = cartItems.map((item) => {
    const element = document.createElement("li");
    element.classList.add("modal__cart-item-title");
    element.textContent = item;
    return element;
  });
  modalCartItems.append(...items);
};

cartButton.addEventListener("click", () => {
  modalOverlay.style.display = "flex";
  renderCartItems();
});

modalOverlay.addEventListener("click", ({ target }) => {
  if (
    target === modalOverlay ||
    target.closest(".modal-overlay__close-button")
  ) {
    modalOverlay.style.display = "none";
  }
});

const updateCartCount = () => {
  const cartItems = getCartItemsFromLocalStorage();
  cartCount.textContent = "";
  const itemsLength = cartItems.length;
  if (itemsLength) {
    cartCount.textContent = itemsLength;
  }
};

const addToCart = ({ id, name }) => {
  const cartItems = getCartItemsFromLocalStorage();
  cartItems.push(name);
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
  updateCartCount();
};

productList.addEventListener("click", ({ target }) => {
  if (target.closest(".product__btn-add-cart")) {
    const productId = target.dataset.id;
    const productName = decodeURIComponent(target.dataset.name);
    addToCart({ id: productId, name: productName });
  }
});

updateCartCount();
