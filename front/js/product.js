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

// Fetching product information from the API
fetch(`http://localhost:3000/api/products/${productId}`)
  .then(function(res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function(productInfo) {
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
      const colorOption = document.createElement("option");
      productColors.appendChild(colorOption);
      colorOption.setAttribute('value', `${productInfo.colors[i]}`);
      colorOption.textContent = `${productInfo.colors[i]}`;
    }
  })
  .catch(function(err) {
    console.log("Oh no! Fetch error: ", err);
    alert("Oups ! Veuillez nous excuser mais ce produit n'est pas disponible actuellement");
    productTitle.textContent = "Produit non disponible";
  });


//================================================================================
//  Adding product to cart using LocalStorage
//================================================================================

addToCartButton.addEventListener('click', function() {
  if (productQuantity.value == '0'){
    alert("Veuillez indiquer le nombre d'articles")
  } else {
    if (productColors.value == ''){
      alert("Veuillez choisir la couleur de l'article")
    }
    else {
      let productToPurchase = {
        id : productId,
        quantity : parseInt(productQuantity.value),
        color : productColors.value
      }
      // Checking if the product is already in the cart:
      // in this case, the quantity of the product in the cart should be increased
      let cartProducts = JSON.parse(localStorage.getItem('cartProducts')) || [];
      for (i = 0; i < cartProducts.length; i++) {
        if(cartProducts[i].id == productToPurchase.id && cartProducts[i].color == productToPurchase.color) {
          productToPurchase.quantity += cartProducts[i].quantity;
          cartProducts.splice(i, 1);
          break;
        }
      }
      cartProducts.push(productToPurchase);
      localStorage.setItem('cartProducts', JSON.stringify(cartProducts));
      // Visible notification that the product has been added
      addToCartButton.textContent = "AJOUTÉ !";
      addToCartButton.style.backgroundColor = "#28a745";
      setTimeout(function() {
        addToCartButton.textContent = "Ajouter au panier";
        addToCartButton.style.backgroundColor = "#2c3e50";
      }, 1000);
    }
  }
});