//================================================================================
//  Product data table
//================================================================================

const imageBox = document.querySelector(".item__img");
const productTitle = document.querySelector("#title");
const productPrice = document.querySelector("#price");
const productDescription = document.querySelector("#description");
const productColors = document.querySelector("#colors");
const productQuantity = document.querySelector("#quantity");
const addToCartButton = document.querySelector("#addToCart");
const boxButton = document.querySelector(".item__content__addButton");


//================================================================================
//  Inserting product information
//================================================================================

// Getting the product id
const productURL = new URLSearchParams(window.location.search);
const productId = productURL.get("id");

initProductPage();

/**
 * Fetching product information from the API
 */
function initProductPage() {
  fetch(`http://localhost:3000/api/products/${productId}`)
    .then(function(res) {
      if (res.ok) {
        return res.json();
      }
    })
    .then(function(productInfo) {
      displayProduct(productInfo);
    })
    .catch(function(err) {
      console.log("Oh no! Fetch error: ", err);
      alert("Oups ! Veuillez nous excuser mais ce produit n'est pas disponible actuellement");
      productTitle.textContent = "Produit non disponible";
    });
}

/**
 * Making product details viewable
 * @param {*} productInfo all product information
 */
function displayProduct(productInfo) {

  // Creating and setting up the product image
  const productImage = document.createElement("img");
  imageBox.appendChild(productImage);
  productImage.setAttribute('src', `${productInfo.imageUrl}`);
  productImage.setAttribute('alt', `${productInfo.altTxt}`);

  // Setting product title, description and price
  productTitle.textContent = `${productInfo.name}`;
  productPrice.textContent = `${productInfo.price}`;
  productDescription.textContent = `${productInfo.description}`;

  // Creating and setting up the product colors
  for (i = 0; i < productInfo.colors.length; i++) {
    let currentColor = productInfo.colors[i];
    displayColors(currentColor);
  }
}

/**
 * Making product color options viewable
 * @param {*} currentColor color available to be selected eventually
 */
function displayColors(currentColor) {
  const colorOption = document.createElement("option");
  productColors.appendChild(colorOption);
  colorOption.setAttribute('value', `${currentColor}`);
  colorOption.textContent = `${currentColor}`;
}


//================================================================================
//  Adding product to cart using LocalStorage
//================================================================================

// Checking the values entered when the user wishes to add the product to the cart
addToCartButton.addEventListener('click', function() {
  if (productQuantity.value <= '0' || !productQuantity.value || productQuantity.value > 100) {
    alert("Veuillez indiquer un nombre valide d'articles entre 1 et 100.");
    productQuantity.value = "0";
  } else if (productColors.value == ''){
      alert("Veuillez choisir la couleur de l'article");
    } else {
      addProductToCart();
  }
});

/**
 * Function to add the product to the cart
 */
function addProductToCart() {
  // Product to be purchased
  let productToPurchase = {
    id : productId,
    quantity : parseInt(productQuantity.value),
    color : productColors.value
  }
  // Checking if the product is already in the cart
  let cartProducts = JSON.parse(localStorage.getItem('cartProducts')) || [];
  let foundIndex = cartProducts.findIndex(element => element.id == productToPurchase.id && element.color == productToPurchase.color);
  // Case 1: the product is not present in the cart, then it must be added
  if (foundIndex == '-1') {
    cartProducts.push(productToPurchase);
    notifyProductAdded();
    resetUserValues();
    localStorage.setItem('cartProducts', JSON.stringify(cartProducts));
  } else {
    let currentQuantity = cartProducts[foundIndex]['quantity'];
    // Case 2: there are 100 units of the product in the cart, then the user cannot proceed and must be warned
    if (currentQuantity == 100) {
      alert("Votre panier a atteint la quantité maximale pour ce produit : 100 unités.");
    }
    // Case 3: the sum of the input plus the number of units in the cart exceeds 100 units, then the user cannot proceed and must be warned
    else if (currentQuantity+parseInt(productQuantity.value)>100) {
      alert(`Vous ne pouvez pas dépasser 100 unités. Vous avez déjà ${currentQuantity} produits dans votre panier. Vous ne pouvez en ajouter que ${100-currentQuantity}.`);
    }
    // Case 4: the product is present in the cart, the sum mentioned above is less than 100 so the quantity must be increased in the cart
    else {
      cartProducts[foundIndex]['quantity'] += parseInt(productQuantity.value);
      notifyProductAdded();
      resetUserValues();
      localStorage.setItem('cartProducts', JSON.stringify(cartProducts));
    }
  }
}

// Notification that the product has been added
const notificationBox = document.createElement("div");
boxButton.appendChild(notificationBox);
notificationBox.textContent = "AJOUTÉ !";
notificationBox.style.position = "absolute";
notificationBox.style.visibility = "hidden";
notificationBox.style.color = "#fff";
notificationBox.style.fontSize = "36px";
notificationBox.style.fontWeight = "bold";

/**
 * Making visible the confirmation message for having added the product to the cart
 */
function notifyProductAdded() {
  addToCartButton.style.visibility = "hidden";
  notificationBox.style.visibility = "visible";
  setTimeout(function() {
    addToCartButton.style.visibility = "visible";
    notificationBox.style.visibility = "hidden";
  }, 2000);
}

/**
 * Resetting the values after adding the product to the cart
 */
function resetUserValues() {
  productQuantity.value = "0";
  productColors.selectedIndex = 0;
}