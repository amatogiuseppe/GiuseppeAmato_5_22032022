//================================================================================
//  Retrieving data of cart products
//================================================================================

// Getting data of cart products from the local storage: id, quantity, color
function getDataFromLocalStorage() {
  let selectedProducts = JSON.parse(localStorage.getItem("cartProducts")) || [];
  if (selectedProducts.length == 0) {
    let mainTitle = document.querySelector("#cartAndFormContainer h1");
    mainTitle.textContent = "Votre panier est vide";
  }
  return selectedProducts;
}

// Fetching and adding the missing data from the API: name, price, imageUrl
async function addMissingDataFromApi(selectedProducts) {
  try {
    for (let i = 0; i < selectedProducts.length; i++) {
      let response = await fetch(`http://localhost:3000/api/products/${selectedProducts[i].id}`);
      let catologueProduct = await response.json();
      selectedProducts[i].name = catologueProduct.name;
      selectedProducts[i].price = catologueProduct.price;
      selectedProducts[i].imageUrl = catologueProduct.imageUrl;
    }
    let cartProducts = selectedProducts;
    return cartProducts;
  }
  catch (err) {
    console.log("Oh no! Fetch error: ", err);
    alert("Oups ! Un problème est survenu. Veuillez revenir plus tard. Toutes nos excuses pour ce désagrément.");
    let mainTitle = document.querySelector("#cartAndFormContainer h1");
    mainTitle.textContent = "Votre panier est actuellement indisponible";
  }
}


//================================================================================
//  Creating the layout of the summary table of the cart products
//================================================================================

const summaryTable = document.querySelector("#cart__items");

function summaryTableLayout(cartProducts) {
  for (let i = 0; i < cartProducts.length; i++) {

    let cartProduct = cartProducts[i];
    // Creating and setting up the cart Product
    const cartProductReport = document.createElement("article");
    summaryTable.appendChild(cartProductReport);
    cartProductReport.setAttribute('class', "cart__item");
    cartProductReport.setAttribute('data-id', `${cartProduct.id}`);  // Product ID
    cartProductReport.setAttribute('data-color', `${cartProduct.color}`);  // Product Color

    // Creating and setting up the cart product image
    const cartProductImageBox = document.createElement("div");
    cartProductReport.appendChild(cartProductImageBox);
    cartProductImageBox.setAttribute('class', "cart__item__img");
    const cartProductImage = document.createElement("img");
    cartProductImageBox.appendChild(cartProductImage);
    cartProductImage.setAttribute('src', `${cartProduct.imageUrl}`);  // Product Image
    cartProductImage.setAttribute('alt', "Photographie d'un canapé");

    // Creating and setting up the cart product content
    const cartProductContent = document.createElement("div");
    cartProductReport.appendChild(cartProductContent);
    cartProductContent.setAttribute('class', "cart__item__content");

    // Creating and setting up the cart product description
    const cartProductDescription = document.createElement("div");
    cartProductContent.appendChild(cartProductDescription);
    cartProductDescription.setAttribute('class', "cart__item__content__description");

    // Creating and setting up the product name, product color and product price
    const cartProductName = document.createElement("h2");
    cartProductDescription.appendChild(cartProductName);
    cartProductName.innerHTML = `${cartProduct.name}`;  // Product Name
    const cartProductColor = document.createElement("p");
    cartProductDescription.appendChild(cartProductColor);
    cartProductColor.innerHTML = `${cartProduct.color}`;  // Product Color
    const cartProductPrice = document.createElement("p");
    cartProductDescription.appendChild(cartProductPrice);
    cartProductPrice.innerHTML = `${cartProduct.price} &euro;`;  // Product Price

    // Creating and setting up the cart product settings
    const cartProductSettings = document.createElement("div");
    cartProductContent.appendChild(cartProductSettings);
    cartProductSettings.setAttribute('class', "cart__item__content__settings");

    // Creating and setting up the cart product quantity
    const cartProductQuantityBox = document.createElement("div");
    cartProductSettings.appendChild(cartProductQuantityBox);
    cartProductQuantityBox.setAttribute('class', "cart__item__content__settings__quantity");
    const cartProductQuantity = document.createElement("p");
    cartProductQuantityBox.appendChild(cartProductQuantity);
    cartProductQuantity.innerHTML = `Qté : `;
    //input:
    const cartProductQuantityInput = document.createElement("input");
    cartProductQuantityBox.appendChild(cartProductQuantityInput);
    cartProductQuantityInput.setAttribute('type', "number");
    cartProductQuantityInput.setAttribute('class', "itemQuantity");
    cartProductQuantityInput.setAttribute('name', "itemQuantity");
    cartProductQuantityInput.setAttribute('min', "1");
    cartProductQuantityInput.setAttribute('max', "100");
    cartProductQuantityInput.setAttribute('value', `${cartProduct.quantity}`);  // Product Quantity

    // Creating and setting up the "remove product" button
    const deleteBox = document.createElement("div");
    cartProductSettings.appendChild(deleteBox);
    deleteBox.setAttribute('class', "cart__item__content__settings__delete");
    const deleteCartProduct = document.createElement("p");
    deleteBox.appendChild(deleteCartProduct);
    deleteCartProduct.setAttribute('class', "deleteItem");
    deleteCartProduct.innerHTML = `Supprimer`;
  }
}


//================================================================================
//  Viewing of the summary table of the products in the cart page
//================================================================================

async function main() {
  let selectedProducts = getDataFromLocalStorage();
  let cartProducts = await addMissingDataFromApi(selectedProducts);
  summaryTableLayout(cartProducts);
}
main();