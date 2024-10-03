// Referencias a los elementos de la página (plantillas, contenedores)
const templateProducts = document.querySelector(".products-template");
const templateCart = document.querySelector(".cart-template");
const productsContent = document.querySelector(".products");
const totalProducts = document.querySelector(".total-item");
const cartContent = document.querySelector(".cart-content");
const fragment = document.createDocumentFragment(); // Fragmento para evitar múltiples reflows
const productList = {}; // Objeto donde se almacenan los productos agregados al carrito

// Evento que se dispara cuando la página ha cargado completamente
document.addEventListener("DOMContentLoaded", () => {
  fetchProducts(); // Llamar a la función para obtener los productos
});

// Función para obtener los productos de un archivo JSON
const fetchProducts = async () => {
  try {
    const response = await fetch("./data.json"); // Obtener datos del archivo JSON
    const products = await response.json(); // Convertir la respuesta a JSON
    displayProducts(products); // Mostrar los productos en la página
  } catch (error) {
    console.error("Error fetching products:", error); // Manejo de errores
  }
};

// Función para mostrar los productos en la página
const displayProducts = (products) => {
  products.forEach((product) => {
    const productClone = templateProducts.content.cloneNode(true); // Clonar la plantilla del producto
    // Asignar valores a los elementos del producto clonado
    productClone.querySelector(".product-title").textContent = product.name;
    productClone.querySelector(".product-categiry").textContent =
      product.category;
    productClone.querySelector(
      ".product-price"
    ).textContent = `$${product.price.toFixed(2)}`;
    productClone.querySelector(".products-img").src = product.image.desktop;

    // Añadir evento para agregar el producto al carrito
    productClone
      .querySelector(".add-to-cart")
      .addEventListener("click", setCart);

    fragment.appendChild(productClone); // Añadir el producto al fragmento
  });
  productsContent.appendChild(fragment); // Insertar los productos en el DOM
};

// Función que maneja el clic en "Agregar al carrito"
const setCart = (e) => {
  e.preventDefault();
  const btnAction = e.target.closest(".add-to-cart").parentElement; // Obtener el contenedor del producto
  addToCart(btnAction); // Llamar a la función que agrega el producto al carrito
};

// Función para agregar productos al carrito
const addToCart = (item) => {
  // Obtener la información del producto a partir del botón clicado
  const products = {
    name: item.querySelector(".product-title").textContent,
    price: parseFloat(
      item.querySelector(".product-price").textContent.slice(1)
    ),
    image: item.querySelector(".products-img").src,
    quantity: 1 // Cantidad inicial de producto
  };

  // Si el producto ya existe en el carrito, aumentar la cantidad
  if (productList[products.name]) {
    productList[products.name].quantity++;
  } else {
    productList[products.name] = products; // Si no existe, añadirlo al carrito
  }
  showCart(); // Actualizar el carrito en la pantalla
};

// Función para mostrar los productos en el carrito
const showCart = () => {
  cartContent.innerHTML = ""; // Limpiar el contenido actual del carrito

  const fragment = document.createDocumentFragment(); // Crear un nuevo fragmento
  let total = 0; // Total en dinero
  let totalItems = 0; // Total de ítems en el carrito

  // Si el carrito está vacío, mostrar un mensaje de "Carrito vacío"
  if (Object.keys(productList).length === 0) {
    cartContent.innerHTML = `
      <div class="empty-item">
        <img src="./assets/images/illustration-empty-cart.svg" alt="" />
        <p>Your added items will appear here</p>
      </div>
    `;

    totalProducts.textContent = 0; // Establecer total de productos a 0
  } else {
    // Si el carrito tiene productos, recorrer cada producto
    Object.values(productList).forEach((product) => {
      const cartClone = templateCart.content.cloneNode(true); // Clonar la plantilla del carrito

      // Asignar valores a los elementos del carrito clonado
      cartClone.querySelector(".cart-title").textContent = product.name;
      cartClone.querySelector(
        ".cart-quantity"
      ).textContent = `x${product.quantity}`;
      cartClone.querySelector(
        ".cart-price"
      ).textContent = `$${product.price.toFixed(2)}`;
      cartClone.querySelector(".cart-total").textContent = `$${(
        product.price * product.quantity
      ).toFixed(2)}`;
      cartClone
        .querySelector(".remove-btn")
        .addEventListener("click", removeItemCart);

      // Actualizar los totales
      total += product.price * product.quantity;
      totalItems += product.quantity;

      fragment.appendChild(cartClone); // Añadir el producto clonado al fragmento
    });

    totalProducts.textContent = totalItems; // Actualizar el número total de productos
  }

  cartContent.appendChild(fragment); // Insertar los productos del carrito en el DOM

  // Crear o actualizar el div con los totales si aún no existe
  let totalDiv = document.querySelector(".cart-total-value");
  if (!totalDiv) {
    totalDiv = document.createElement("div");
    totalDiv.classList.add("cart-total-value");
    totalDiv.innerHTML = `
      <div class="cart-total-price">
        <p>Order total</p>
        <h3 class="total-price">$${total.toFixed(2)}</h3>
      </div>
      <div class="carbon-message">
        <p><img src="./assets/images/icon-carbon-neutral.svg" alt="carbon-neutral"> this is a <span>carbon-neutral</span> delivery</p>
      </div>
      <button class="checkout-btn">Confirm order</button>
    `;
    cartContent.appendChild(totalDiv); // Añadir el div con el total al final del carrito
  } else {
    // Si el div ya existe, simplemente actualizar el total
    totalDiv.querySelector(".total-price").textContent = `$${total.toFixed(2)}`;
  }

  // Si no hay artículos en el carrito, limpiar el contenido
  if (totalItems === 0) {
    totalDiv.innerHTML = "";
  }
};

cartContent.appendChild(fragment); // Insertar los productos del carrito en el DOM

// Función para eliminar productos del carrito
const removeItemCart = (e) => {
  e.preventDefault();
  console.log("Remove");
  const btnRemove = e.target.closest(".remove-btn").parentElement; // Obtener el contenedor del producto a eliminar
  const productName = btnRemove.querySelector(".cart-title").textContent; // Obtener el nombre del producto
  delete productList[productName]; // Eliminar el producto del carrito

  showCart(); // Actualizar el carrito en la pantalla
};
