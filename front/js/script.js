/*
  ========================================
  Inserting the product catalogue
  ========================================
*/

// Fetching the product catalogue from the API
fetch("http://localhost:3000/api/products")
  .then(function(res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function(productCatalogue) {
    const productsSection = document.querySelector("#items");
    for (i = 0; i < productCatalogue.length; i++) {
      // Creating and setting up the selection of each product
      const productAnchor= document.createElement("a");
      productsSection.appendChild(productAnchor);
      productAnchor.setAttribute('href', `./product.html?id=${productCatalogue[i]._id}`);
      const productArticle = document.createElement("article");
      productAnchor.appendChild(productArticle);
      // Creating and setting up the image of each product
      const productImage = document.createElement("img");
      productArticle.appendChild(productImage);
      productImage.setAttribute('src', `${productCatalogue[i].imageUrl}`);
      productImage.setAttribute('alt', `${productCatalogue[i].altTxt}`);
      // Creating and setting up the name of each product
      const productName = document.createElement("h3");
      productArticle.appendChild(productName);
      productName.classList.add('productName');
      productName.textContent = `${productCatalogue[i].name}`;
      // Creating and setting up the description of each product
      const productDescription = document.createElement("p");
      productArticle.appendChild(productDescription);
      productDescription.classList.add('productDescription');
      productDescription.textContent = `${productCatalogue[i].description}`;
    }
  })
  .catch(function(err) {
    console.log("Oh no! Fetch error: ", err);
    alert("Oups ! Un problème est survenu. Veuillez revenir plus tard. Toutes nos excuses pour ce désagrément.");
    const mainTitle = document.querySelector(".titles h1");
    mainTitle.textContent = "Oups !";
    const minorTitle = document.querySelector(".titles h2");
    minorTitle.textContent = "Notre site connaît actuellement un problème de serveur. Tous les produits sont actuellement indisponibles, nous nous excusons pour ce désagrément. Nous nous efforçons de résoudre ce problème dans les meilleurs délais.";
  });