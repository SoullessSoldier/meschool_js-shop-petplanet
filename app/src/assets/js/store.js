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
const modalCartPrice = document.querySelector(".modal__cart-price");
const modalCartForm = document.querySelector(".modal__cart-form");

const orderMessageElement = document.createElement("div");
orderMessageElement.classList.add("order-message");
const orderMessageText = document.createElement("p");
orderMessageText.classList.add("order-message__text");
const orderMessageCloseButton = document.createElement("button");
orderMessageCloseButton.classList.add("order-message__close-button");
orderMessageCloseButton.textContent = "Закрыть";

orderMessageElement.append(orderMessageText, orderMessageCloseButton);

orderMessageCloseButton.addEventListener("click", () => {
  orderMessageElement.remove();
});

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

const fetchProductById = async (id) => {
  const fetch_url = `/api/products/${id}`;
  const url = new URL(fetch_url, baseURL);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(response.status);
  }
  const product = await response.json();
  return product;
};

const fetchCartItems = async (ids) => {
  const idsString = ids.join(",");
  const fetch_url = `/api/products/list/${idsString}`;
  const url = new URL(fetch_url, baseURL);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(response.status);
  }
  const products = await response.json();
  return products;
};

const getItemsFromLocalStorage = (name) => {
  return JSON.parse(localStorage.getItem(name) || "[]");
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

const calcTotalPrice = (productsDetails, cartItems) => {
  return cartItems.reduce((acc, item) => {
    const product = productsDetails.find((el) => el.id === item.id);
    return acc + item.count * parseInt(product.price);
  }, 0);
};

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
  const productsDetails = getItemsFromLocalStorage("cartProductsDetails");
  const cartItems = getItemsFromLocalStorage("cartItems");

  const items = productsDetails.map(({ id, name, price, photoUrl }) => {
    const cartItem = cartItems.find((item) => item.id === id);
    if (!cartItem) {
      return "";
    }
    const element = document.createElement("li");
    element.classList.add("modal__cart-item-title");
    element.innerHTML = `
      <img
        class="modal__cart-item-image"
        src=${baseURL + photoUrl}
        alt=${name}
      />
      <h3 class="modal__cart-item-title">${name}</h3>
      <div class="modal__cart-item-count">
        <button class="modal__control modal__minus" data-id=${id}>-</button>
        <span class="modal__count">${cartItem.count}</span>
        <button class="modal__control modal__plus" data-id=${id}>+</button>
      </div>
      <p class="modal__cart-item-price">${
        parseInt(price) * cartItem.count
      }&nbsp;₽</p>
    `;
    return element;
  });
  modalCartItems.append(...items);
  const totalPrice = calcTotalPrice(productsDetails, cartItems);
  modalCartPrice.innerHTML = `${parseInt(totalPrice)}&nbsp;₽`;
};

cartButton.addEventListener("click", async () => {
  modalOverlay.style.display = "flex";
  const cartItems = getItemsFromLocalStorage("cartItems");
  const ids = cartItems.map((item) => item.id);
  if (!ids.length) {
    const element = document.createElement("li");
    element.classList.add("modal__cart-item-title");
    element.textContent = "Корзина пуста";
    modalCartItems.append(element);
    modalCartPrice.innerHTML = `0&nbsp;₽`;
    return;
  }
  const products = await fetchCartItems(ids);
  localStorage.setItem("cartProductsDetails", JSON.stringify(products));
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
  const cartItems = getItemsFromLocalStorage("cartItems");
  cartCount.textContent = "";
  const itemsLength = cartItems.reduce(
    (acc, currentElement) => acc + currentElement.count,
    0
  );
  if (itemsLength) {
    cartCount.textContent = itemsLength;
  }
};

const addToCart = (productId) => {
  const cartItems = getItemsFromLocalStorage("cartItems");
  const existingItem = cartItems.find((item) => item.id === productId);
  if (existingItem) {
    existingItem.count += 1;
  } else {
    cartItems.push({ id: productId, count: 1 });
  }
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
  updateCartCount();
};

productList.addEventListener("click", ({ target }) => {
  if (target.closest(".product__btn-add-cart")) {
    const productId = target.dataset.id;
    addToCart(productId);
  }
});

const updateCartItem = (productId, modifier) => {
  const cartItems = getItemsFromLocalStorage("cartItems");
  const itemIndex = cartItems.findIndex((item) => item.id === productId);
  if (itemIndex !== -1) {
    cartItems[itemIndex].count += modifier;
    if (cartItems[itemIndex].count <= 0) {
      cartItems.splice(itemIndex, 1);
    }
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    renderCartItems();
    updateCartCount();
  }
};

modalCartItems.addEventListener("click", ({ target }) => {
  if (target.classList.contains("modal__plus")) {
    const productId = target.dataset.id;
    updateCartItem(productId, 1);
  }

  if (target.classList.contains("modal__minus")) {
    const productId = target.dataset.id;
    updateCartItem(productId, -1);
  }
});

const handleSubmit = async (e) => {
  e.preventDefault();
  const storeId = modalCartForm.store.value;
  const cartItems = getItemsFromLocalStorage("cartItems");
  const products = cartItems.map(({ id, count }) => ({ id, quantity: count }));
  const orderData = JSON.stringify({ products, storeId });
  const post_url = `/api/orders`;
  const url = new URL(post_url, baseURL);
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: orderData,
  });
  if (!response.ok) {
    throw new Error(response.status);
  }
  try {
    localStorage.removeItem("cartItems");
    localStorage.removeItem("cartProductsDetails");

    const { orderId } = await response.json();

    orderMessageText.textContent = `Ваш заказ оформлен, номер заказа: ${orderId}. 
    Вы можете его забрать завтра с 12:00`;
    document.body.append(orderMessageElement);
    modalOverlay.style.display = "none";
    orderMessageElement.style.display = "block";
    updateCartCount();
  } catch (error) {
    console.log("Ошибка оформления заказа");
  }
};

modalCartForm.addEventListener("submit", handleSubmit);

updateCartCount();
