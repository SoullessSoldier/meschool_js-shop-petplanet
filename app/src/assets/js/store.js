const buttons = document.querySelectorAll(".store__category-button");

const changeActiveBtn = ({ target }) => {
  buttons.forEach((button) => {
    button.classList.remove("store__category-button_active");
  });
  target.classList.add("store__category-button_active");
  const category = target.dataset.category;
  if (category) fetchProductByCategory(category);
};

buttons.forEach((button) => {
  button.addEventListener("click", changeActiveBtn);
});

const productList = document.querySelector(".store__list");
const baseURL = "http://localhost:3000";

const createProductCard = (product) => {
  const element = document.createElement("li");
  element.classList.add("store__item");
  element.innerHTML = `
    <article class="store__product product">
      <img
        class="product__image"
        src=${baseURL + product.photoUrl}
        alt=${product.name}
        width="388"
        height="261"
      />
      <h3 class="product__title">${product.name}</h3>
      <p class="product__price">${product.price}&nbsp;₽</p>
      <button class="product__btn-add-cart" data-id=${
        product.id
      }>Заказать</button>
    </article>
  `;
  return element;
};

const renderProducts = (products) => {
  productList.textContent = "";
  products.forEach((product) => {
    productList.append(createProductCard(product));
  });
};

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

fetchProductByCategory("Домики");
