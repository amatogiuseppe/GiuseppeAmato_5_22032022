//========================================
//  Inserting the product catalogue
//========================================

initHomePage();

/**
 * Main function: retrieving data from API and displaying product catalogue
 */
function initHomePage() {
  fetch("http://localhost:3000/api/products")
    .then(function(res) {
      if (res.ok) {
        return res.json();
      }
    })
    .then(function(productCatalogue) {
      displayAllProducts(productCatalogue);
    })
    .catch(function(err) {
      console.log("Oh no! Fetch error: ", err);
      alert("Oups ! Un problème est survenu. Veuillez revenir plus tard. Toutes nos excuses pour ce désagrément.");
      const mainTitle = document.querySelector(".titles h1");
      mainTitle.textContent = "Oups !";
      const minorTitle = document.querySelector(".titles h2");
      minorTitle.textContent = "Notre site connaît actuellement un problème de serveur. Tous les produits sont actuellement indisponibles, nous nous excusons pour ce désagrément. Nous nous efforçons de résoudre ce problème dans les meilleurs délais.";
    });
}

/**
 * Making all products of the catalog viewable
 * @param {*} productCatalogue list of all products
 */
function displayAllProducts(productCatalogue) {
  for (i = 0; i < productCatalogue.length; i++) {
    let currentProduct = productCatalogue[i];
    displayProductItem(currentProduct);
  }
}

/**
 * Making a single product viewable
 * @param {*} currentProduct single product
 */
function displayProductItem(currentProduct) {

  const productsSection = document.querySelector("#items");

  // Creating and setting up the selection of each product
  const productAnchor= document.createElement("a");
  productsSection.appendChild(productAnchor);
  productAnchor.setAttribute('href', `./product.html?id=${currentProduct._id}`);
  const productArticle = document.createElement("article");
  productAnchor.appendChild(productArticle);

  // Creating and setting up the image of each product
  const productImage = document.createElement("img");
  productArticle.appendChild(productImage);
  productImage.setAttribute('src', `${currentProduct.imageUrl}`);
  productImage.setAttribute('alt', `${currentProduct.altTxt}`);

  // Creating and setting up the name of each product
  const productName = document.createElement("h3");
  productArticle.appendChild(productName);
  productName.classList.add('productName');
  productName.textContent = `${currentProduct.name}`;

  // Creating and setting up the description of each product
  const productDescription = document.createElement("p");
  productArticle.appendChild(productDescription);
  productDescription.classList.add('productDescription');
  productDescription.textContent = `${currentProduct.description}`;
}