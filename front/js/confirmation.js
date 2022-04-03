// Retrieving the order ID in the URL to make it viewable in the appropriate section of the page
const orderURL = new URLSearchParams(window.location.search);
const orderId = orderURL.get("orderId");

const orderIdBox = document.querySelector("#orderId");
orderIdBox.textContent = `${orderId}`;
alert("Merci pour votre commande ! Vous recevrez un e-mail de confirmation de votre commande dans quelques instants.");