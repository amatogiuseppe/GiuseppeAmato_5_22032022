//================================================================================
//  Retrieving data of cart products + main function call
//================================================================================

// Getting data of cart products from the local storage
let productsInTheCart = JSON.parse(localStorage.getItem("productsInTheCart"));

// Fetching additional data of cart products from the API
for (let i = 0; i < productsInTheCart.length; i++) {
  fetch(`http://localhost:3000/api/products/${productsInTheCart[i].id}`)
    .then(function(res) {
      if (res.ok) {
        return res.json();
      }
    })
    .then(function(productData) {
      summaryTableSetup(productData, i); // main function call
    })
    .catch(function(err) {
    });
}


//================================================================================
//  Main function: setup of the summary table in the DOM
//================================================================================

const summaryTable = document.querySelector("#cart__items");

function summaryTableSetup(productData, i) {

  // Creating and setting up the cart Product
  const cartProduct = document.createElement("article");
  summaryTable.appendChild(cartProduct);
  cartProduct.setAttribute('class', "cart__item");
  cartProduct.setAttribute('data-id', `${productData._id}`);  // Product ID
  cartProduct.setAttribute('data-color', `${productsInTheCart[i].color}`);  // Product Color

  // Creating and setting up the cart product image
  const cartProductImageBox = document.createElement("div");
  cartProduct.appendChild(cartProductImageBox);
  cartProductImageBox.setAttribute('class', "cart__item__img");
  const cartProductImage = document.createElement("img");
  cartProductImageBox.appendChild(cartProductImage);
  cartProductImage.setAttribute('src', `${productData.imageUrl}`);  // Product Image
  cartProductImage.setAttribute('alt', "Photographie d'un canapé");

  // Creating and setting up the cart product content
  const cartProductContent = document.createElement("div");
  cartProduct.appendChild(cartProductContent);
  cartProductContent.setAttribute('class', "cart__item__content");

  // Creating and setting up the cart product description
  const cartProductDescription = document.createElement("div");
  cartProductContent.appendChild(cartProductDescription);
  cartProductDescription.setAttribute('class', "cart__item__content__description");

  // Creating and setting up the product name, product color and product price
  const cartProductName = document.createElement("h2");
  cartProductDescription.appendChild(cartProductName);
  cartProductName.innerHTML = `${productData.name}`;  // Product Name
  const cartProductColor = document.createElement("p");
  cartProductDescription.appendChild(cartProductColor);
  cartProductColor.innerHTML = `${productsInTheCart[i].color}`;  // Product Color
  const cartProductPrice = document.createElement("p");
  cartProductDescription.appendChild(cartProductPrice);
  cartProductPrice.innerHTML = `${productData.price} &euro;`;  // Product Price

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
  cartProductQuantityInput.setAttribute('value', `${productsInTheCart[i].quantity}`);  // Product Quantity

  // Creating and setting up the "remove product" button
  const deleteBox = document.createElement("div");
  cartProductSettings.appendChild(deleteBox);
  deleteBox.setAttribute('class', "cart__item__content__settings__delete");
  const deleteCartProduct = document.createElement("p");
  deleteBox.appendChild(deleteCartProduct);
  deleteCartProduct.setAttribute('class', "deleteItem");
  deleteCartProduct.innerHTML = `Supprimer`;

}