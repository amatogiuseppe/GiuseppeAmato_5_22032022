/*
  ========================================
  Inserting product information
  ========================================
*/

// Product data table
const imageBox = document.querySelector(".item__img");
const productTitle = document.querySelector("#title");
const productPrice = document.querySelector("#price");
const productDescription = document.querySelector("#description");
const productColors = document.querySelector("#colors");

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