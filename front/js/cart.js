//================================================================================
//  Variables based on cart product data
//================================================================================

// Retrieving cart products from local storage: id, quantity and color
let cartProducts = JSON.parse(localStorage.getItem("cartProducts")) || [];
if (cartProducts.length == 0) {
  let mainTitle = document.querySelector("#cartAndFormContainer h1");
  mainTitle.textContent = "Votre panier est vide";
}

// A container that will collect all the other missing data: name, price and imageUrl
let cartProductsInfo = [];


//================================================================================
//  Collecting the name, price and imageUrl of each single product in the cart
//================================================================================

async function collectMissingData() {

  let promises = [];
  let errors = [];

  for (let i = 0; i < cartProducts.length; i++) {
    promises.push(
      fetch(`http://localhost:3000/api/products/${cartProducts[i].id}`)
        .then(function(response) {
          if (response.ok) {
            return response.json();
          }
        })
        .then(function(catologueProduct) {
          let singleProduct = {};
          singleProduct.id = cartProducts[i].id;
          // Adding information that is missing
          singleProduct.name = catologueProduct.name;
          singleProduct.price = catologueProduct.price;
          singleProduct.imageUrl = catologueProduct.imageUrl;
          cartProductsInfo.push(singleProduct);
        })
        .catch(function(error) {
          errors.push(error);
      })
    );
  }
  await Promise.all(promises);

  // Error warning
  if (errors.length != 0) {
    console.log("Oh no! Fetch errors: ", errors);
    alert("Oups ! Un problème est survenu. Veuillez revenir plus tard. Toutes nos excuses pour ce désagrément.");
    let mainTitle = document.querySelector("#cartAndFormContainer h1");
    mainTitle.textContent = "Votre panier est actuellement indisponible";
  }
}


//================================================================================
//  Creating the layout of the summary table of the cart products
//================================================================================

const summaryTable = document.querySelector("#cart__items");

function summaryTableLayout(cartProductsInfo) {

  for (let i = 0; i < cartProducts.length; i++) {

    let foundIndex = cartProductsInfo.findIndex(element => element.id == cartProducts[i].id);

    // Creating and setting up the cart Product
    const cartProductReport = document.createElement("article");
    summaryTable.appendChild(cartProductReport);
    cartProductReport.setAttribute('class', "cart__item");
    cartProductReport.setAttribute('data-id', `${cartProducts[i].id}`);  // Product ID
    cartProductReport.setAttribute('data-color', `${cartProducts[i].color}`);  // Product Color

    // Creating and setting up the cart product image
    const cartProductImageBox = document.createElement("div");
    cartProductReport.appendChild(cartProductImageBox);
    cartProductImageBox.setAttribute('class', "cart__item__img");
    const cartProductImage = document.createElement("img");
    cartProductImageBox.appendChild(cartProductImage);
    cartProductImage.setAttribute('src', `${cartProductsInfo[foundIndex].imageUrl}`);  // Product Image
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
    cartProductName.innerHTML = `${cartProductsInfo[foundIndex].name}`;  // Product Name
    const cartProductColor = document.createElement("p");
    cartProductDescription.appendChild(cartProductColor);
    cartProductColor.innerHTML = `${cartProducts[i].color}`;  // Product Color
    const cartProductPrice = document.createElement("p");
    cartProductDescription.appendChild(cartProductPrice);
    cartProductPrice.innerHTML = `${cartProductsInfo[foundIndex].price} &euro;`;  // Product Price

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
    cartProductQuantityInput.setAttribute('value', `${cartProducts[i].quantity}`);  // Product Quantity

    // Creating and setting up the "remove product" button
    const deleteBox = document.createElement("div");
    cartProductSettings.appendChild(deleteBox);
    deleteBox.setAttribute('class', "cart__item__content__settings__delete");
    const deleteCartProduct = document.createElement("p");
    deleteBox.appendChild(deleteCartProduct);
    deleteCartProduct.setAttribute('class', "deleteItem");
    deleteCartProduct.innerHTML = `Supprimer`;
  }

  // Buttons with which to interact to change the quantity of a product or delete it from the cart
  let quantityInputs = document.querySelectorAll(".itemQuantity");
  let deleteButtons = document.querySelectorAll(".deleteItem");
  let editButtons = [quantityInputs, deleteButtons];

  return editButtons;
}


//================================================================================
//  Calculating the total number of products and the total price
//================================================================================

function calculateTotal(cartProductsInfo) {

  let totalQuantity = 0;
  let totalPrice = 0;

  for (let i = 0; i < cartProducts.length; i++) {
    let foundIndex = cartProductsInfo.findIndex(element => element.id == cartProducts[i].id);
    totalQuantity += cartProducts[i].quantity;
    totalPrice += cartProductsInfo[foundIndex].price * cartProducts[i].quantity;
  }

  let totalQuantityBox = document.querySelector("#totalQuantity");
  totalQuantityBox.textContent = `${totalQuantity}`;
  let totalPriceBox = document.querySelector("#totalPrice");
  totalPriceBox.textContent = `${totalPrice}`;
}


//================================================================================
//  Managing quantity change or removal of a product in the cart
//================================================================================

function manageAnyChanges(editButtons) {

  let quantityInputs = editButtons[0];
  let deleteButtons = editButtons[1];

  //------------------------------------
  //  Managing the removal of a product
  //------------------------------------

  // Function to remove a specified product
  function removeProduct(productToBeRemoved) {

    let foundIndex = cartProducts.findIndex(element => element.id == productToBeRemoved.dataset.id && element.color == productToBeRemoved.dataset.color);
    cartProducts.splice(foundIndex, 1);
    localStorage.setItem('cartProducts', JSON.stringify(cartProducts));
    productToBeRemoved.parentElement.removeChild(productToBeRemoved);

    if (cartProducts.length == 0) {
      let mainTitle = document.querySelector("#cartAndFormContainer h1");
      mainTitle.textContent = "Votre panier est vide";
    }

    calculateTotal(cartProductsInfo);
  }

  // Clicking the delete button removes the product
  for (let i = 0; i < deleteButtons.length; i++) {
    let currentProduct = deleteButtons[i].closest("article");
    deleteButtons[i].addEventListener('click', function(e) {
      removeProduct(currentProduct);
    });
  }

  //----------------------------------------------------
  //  Managing the modification of the product quantity
  //----------------------------------------------------

  for (let i = 0; i < quantityInputs.length; i++) {

    let currentProduct = quantityInputs[i].closest("article");

    quantityInputs[i].addEventListener('change', function(e) {
      let updatedProductQuantity = e.target.value;

      // If the user enters zero, the product will be removed from the cart
      if (updatedProductQuantity == '0') {
        removeProduct(currentProduct);
      }
      // A message is displayed if the user does not enter a valid number
      else if (updatedProductQuantity < '0' || !updatedProductQuantity) {
      alert("Veuillez saisir une valeur valide");
      quantityInputs[i].value = `${quantityInputs[i].getAttribute('value')}`;
      }
      // When the inserted number is valid the quantity of the product is updated
      else {
        quantityInputs[i].setAttribute('value', `${updatedProductQuantity}`);

        let foundIndex = cartProducts.findIndex(element => element.id == currentProduct.dataset.id && element.color == currentProduct.dataset.color);
        cartProducts[foundIndex]['quantity'] = parseInt(updatedProductQuantity);
        localStorage.setItem('cartProducts', JSON.stringify(cartProducts));

        calculateTotal(cartProductsInfo);
      }
    });
  }
}


//================================================================================
//  Viewing of the summary table of the products in the cart page
//================================================================================

async function main() {
  await collectMissingData();
  let editButtons = summaryTableLayout(cartProductsInfo);
  calculateTotal(cartProductsInfo);
  manageAnyChanges(editButtons);
}
main();


//================================================================================
//  Verifying the data entered on the form is correct
//================================================================================

//---------------
//  Data table
//---------------

//  User data
const userFirstNameInput = document.querySelector('#firstName');
const userLastNameInput = document.querySelector('#lastName');
const userAddressInput = document.querySelector('#address');
const userCityInput = document.querySelector('#city');
const userEmailInput = document.querySelector('#email');

//  Error messages
const userFirstNameErrorMsg = document.querySelector('#firstNameErrorMsg');
const userLastNameErrorMsg = document.querySelector('#lastNameErrorMsg');
const userAddressErrorMsg = document.querySelector('#addressErrorMsg');
const userCityErrorMsg = document.querySelector('#cityErrorMsg');
const userEmailErrorMsg = document.querySelector('#emailErrorMsg');

// Order Button
const orderButton = document.querySelector('#order');

//-------------------------------------------
//  Same verification process for all fields
//-------------------------------------------

// Standard function for verifying that each field has been filled in correctly
function checkFormField(formFieldInputValue, formFieldErrorMsg, wordInErrorMsg) {

  // Applying the appropriate pattern
  let re = /^[A-Za-z ]{3,30}$/;
  if (wordInErrorMsg == "une adresse e-mail") {
    re = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
  }
  if (wordInErrorMsg == "une adresse") {
    re = /^([0-9]{1,5})\s([A-Za-z ]{5,30})$/;
  }

  // Making sure the pattern is respected
  let isFieldValid = re.test(formFieldInputValue);

  // Checking results
  if (isFieldValid == false) {
    formFieldErrorMsg.textContent = `Veuillez saisir ${wordInErrorMsg} valide.`;
    if (wordInErrorMsg == "une adresse") {
      formFieldErrorMsg.textContent += " Exemple: 10 quai de la charente";
    }
  } else {
    formFieldErrorMsg.textContent = "";
  }

  return isFieldValid;
}


//--------------------------------------------------
//  Main process applied for all fields of the form
//--------------------------------------------------

// Validation functions to determine the validity of each field's contents
function checkFirstName() {
  let wordInErrorMsg = "un prénom";
  let isValidFirstName = checkFormField(userFirstNameInput.value, userFirstNameErrorMsg, wordInErrorMsg);
  return isValidFirstName;
}
function checkLastName() {
  let wordInErrorMsg = "un nom de famille";
  let isValidLastName = checkFormField(userLastNameInput.value, userLastNameErrorMsg, wordInErrorMsg);
  return isValidLastName;
}
function checkAddress() {
  let wordInErrorMsg = "une adresse";
  let isValidAddress = checkFormField(userAddressInput.value, userAddressErrorMsg, wordInErrorMsg);
  return isValidAddress;
}
function checkCity() {
  let wordInErrorMsg = "le nom d'une ville";
  let isValidCity = checkFormField(userCityInput.value, userCityErrorMsg, wordInErrorMsg);
  return isValidCity;
}
function checkEmail() {
  let wordInErrorMsg = "une adresse e-mail";
  let isValidEmail = checkFormField(userEmailInput.value, userEmailErrorMsg, wordInErrorMsg);
  return isValidEmail;
}

// A quick check to ensure each field is filled in correctly
userFirstNameInput.addEventListener('change', function(e) {
  checkFirstName();
});
userLastNameInput.addEventListener('change', function(e) {
  checkLastName();
});
userAddressInput.addEventListener('change', function(e) {
  checkAddress();
});
userCityInput.addEventListener('change', function(e) {
  checkCity();
});
userEmailInput.addEventListener('change', function(e) {
  checkEmail();
});

//------------------------------
//  Global verification process
//------------------------------

// An extensive verification process is conducted before the products order is sent
orderButton.addEventListener('click', function(e) {
  e.preventDefault();

  if (cartProductsInfo.length == 0 && cartProducts != 0) {
    alert("La commande a échoué. Votre panier est actuellement indisponible.");
  } else if (cartProducts.length == 0) {
    alert("Votre panier est vide !");
  } else {

    let isValidFirstName = checkFirstName();
    let isValidLastName = checkLastName();
    let isValidAddress = checkAddress();
    let isValidCity = checkCity();
    let isValidEmail = checkEmail();

    if (isValidFirstName && isValidLastName && isValidAddress && isValidCity && isValidEmail) {

      // Data to be sent to the server
      let contact = {
      firstName: userFirstNameInput.value,
      lastName: userLastNameInput.value,
      address: userAddressInput.value,
      city: userCityInput.value,
      email: userEmailInput.value
      }
      let productIds = [];
      for (let i = 0; i < cartProducts.length; i++) {
        productIds.push(cartProducts[i].id);
      }
      let dataPackage = {
        contact: contact,
        products: productIds
      }

      // Checking if each product ID is a string (if local storage is tampered with, the order will not be sent)
      let areValidProductIds = productIds.every(i => (typeof i === "string" && i.length > 0));

      // Once all data has been verified, an order can be placed
      if (areValidProductIds) {
        placeOrder(dataPackage);
      }

    } else {
      alert("Assurez-vous de remplir correctement le formulaire.");
    }
  }
});


//================================================================================
//  Placement of user order
//================================================================================

// Sending a POST request to the API to retrieve the order ID and being directed to the confirmation page
async function placeOrder(dataPackage) {
  try {
    const settings = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataPackage)
    }
    const response = await fetch("http://localhost:3000/api/products/order", settings);
    const responseJson = await response.json();
    const orderId = responseJson.orderId;

    localStorage.clear();
    window.location.href = `confirmation.html?orderId=${orderId}`;
  }
  catch (err) {
    console.log("Oh no! Fetch error: ", err);
    alert("Oups ! Un problème est survenu. Veuillez revenir plus tard. Toutes nos excuses pour ce désagrément.");
  }
}