//================================================================================================
//  Retrieving the order ID in the URL to make it viewable in the appropriate section of the page
//================================================================================================

// Getting the order id
const orderURL = new URLSearchParams(window.location.search);
const orderId = orderURL.get("orderId");

initConfirmationPage();

/**
 * Function that displays a message of order success and the order ID to the user
 */
function initConfirmationPage() {

  // Message de confirmation remerciant l'utilisateur pour sa commande
  alert("Merci pour votre commande ! Vous recevrez un e-mail de confirmation de votre commande dans quelques instants.");

  // Making visualizable the order id on the page
  const orderIdBox = document.querySelector("#orderId");
  orderIdBox.textContent = `${orderId}`;
}