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
    localStorage.setItem('cartProducts', JSON.stringify(selectedProducts));
    let cartProducts = JSON.parse(localStorage.getItem("cartProducts")) || [];
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

async function summaryTableLayout(cartProducts) {
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
  // Buttons with which to interact to change the quantity of a product or delete it from the cart
  let quantityInputs = document.querySelectorAll(".itemQuantity");
  let deleteButtons = document.querySelectorAll(".deleteItem");
  let editButtons = [quantityInputs, deleteButtons];
  return editButtons;
}


//================================================================================
//  Calculating the total number of products and the total price
//================================================================================

function calculateTotal(cartProducts) {

  let totalQuantity = 0;
  let totalPrice = 0;

  for (let i = 0; i < cartProducts.length; i++) {
    totalQuantity += cartProducts[i].quantity;
    totalPrice += cartProducts[i].price * cartProducts[i].quantity;
  }

  let totalQuantityBox = document.querySelector("#totalQuantity");
  totalQuantityBox.textContent = `${totalQuantity}`;
  let totalPriceBox = document.querySelector("#totalPrice");
  totalPriceBox.textContent = `${totalPrice}`;
}


//================================================================================
//  Managing quantity change or removal of a product in the cart
//================================================================================

function manageAnyChanges(editButtons, cartProducts) {

  let quantityInputs = editButtons[0];
  let deleteButtons = editButtons[1];

  //------------------------------------
  //  Managing the removal of a product
  //------------------------------------

  // Function to remove a specified product
  function removeProduct(productToBeRemoved) {

    const foundIndex = cartProducts.findIndex(element => element.id == productToBeRemoved.dataset.id && element.color == productToBeRemoved.dataset.color);
    cartProducts.splice(foundIndex, 1);
    localStorage.setItem('cartProducts', JSON.stringify(cartProducts));
    productToBeRemoved.parentElement.removeChild(productToBeRemoved);

    if (cartProducts.length == 0) {
      let mainTitle = document.querySelector("#cartAndFormContainer h1");
      mainTitle.textContent = "Votre panier est vide";
    }

    calculateTotal(cartProducts);
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

        calculateTotal(cartProducts);
      }
    });
  }
}


//================================================================================
//  Viewing of the summary table of the products in the cart page
//================================================================================

async function main() {
  let selectedProducts = getDataFromLocalStorage();
  let cartProducts = await addMissingDataFromApi(selectedProducts);
  let editButtons = await summaryTableLayout(cartProducts);
  calculateTotal(cartProducts);
  manageAnyChanges(editButtons, cartProducts);
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

// Checking that each field conforms to the pattern
function isRegexRespected(inputValue, fieldType) {
  let re = /^[A-Za-z ]{3,30}$/;
  if (fieldType == "une adresse e-mail") {
    re = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
  }
  let isValid = true;
  if (!re.test(inputValue)) {
    isValid = false;
  }
  return isValid;
}

// Standard function for verifying that each field has been filled in correctly
function checkFormField(formFieldInputValue, formFieldErrorMsg, wordInErrorMsg) {
  let isFieldValid = isRegexRespected(formFieldInputValue, wordInErrorMsg);
  if (isFieldValid == false) {
    formFieldErrorMsg.textContent = `Veuillez saisir ${wordInErrorMsg} valide`;
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

  let cartProducts = JSON.parse(localStorage.getItem("cartProducts")) || [];

  let isValidFirstName = checkFirstName();
  let isValidLastName = checkLastName();
  let isValidAddress = checkAddress();
  let isValidCity = checkCity();
  let isValidEmail = checkEmail();

  if (cartProducts.length == 0) {
    alert("Votre panier est vide !");
  } else if (isValidFirstName && isValidLastName && isValidAddress && isValidCity && isValidEmail) {

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

    // Checking if each product ID is a string
    function areStrings(arrayOfElements) {
      return arrayOfElements.every(i => (typeof i === "string"));
    }
    let areValid = areStrings(productIds);

    // POST Request
    if (areValid) {
      postRequest(dataPackage);
    }

  } else {
    alert("Assurez-vous de remplir correctement le formulaire");
  }
});

// Making a POST request to the API
async function postRequest(dataPackage) {
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
  } catch (err) {
    console.log("Oh no! Fetch error: ", err);
    alert("Oups ! Un problème est survenu. Veuillez revenir plus tard. Toutes nos excuses pour ce désagrément.");
  }
}