import { db, collection, getDoc, addDoc, onSnapshot, deleteDoc, doc } from './firebase.js';
// Load cart items from local storage
const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

// Update cart count in header
const cartCountEl = document.querySelector('.cart-count');
cartCountEl.innerText = cartItems.length;

// Create table rows for cart items
const cartItemsEl = document.querySelector('#cart-items');
let totalCost = 0;
cartItems.forEach(item => {
  const row = document.createElement('tr');

  const nameCell = document.createElement('td');
  nameCell.innerText = item.name;
  row.appendChild(nameCell);

  const priceCell = document.createElement('td');
  priceCell.innerText = `${item.price} €`;
  row.appendChild(priceCell);

  const quantityCell = document.createElement('td');
  quantityCell.innerText = item.quantity;
  row.appendChild(quantityCell);

  const totalCell = document.createElement('td');
  const itemTotal = item.price * item.quantity;
  totalCell.innerText = `${itemTotal} €`;
  row.appendChild(totalCell);

  totalCost += itemTotal;

  cartItemsEl.appendChild(row);
});

// Add total cost row to table
const totalRow = document.createElement('tr');
totalRow.innerHTML = `
  <td colspan="3">Celková cena:</td>
  <td>${totalCost} €</td>
`;
cartItemsEl.appendChild(totalRow);

// Handle order form submission
const ordersCollection = collection(db, 'orders');
const orderForm = document.querySelector('#order-form');
orderForm.addEventListener('submit', event => {
  event.preventDefault();

  // Get form data
  const formData = new FormData(orderForm);
  const name = formData.get('name');
  const address = formData.get('address');
  const phone = formData.get('phone');

  // Create order object
  const order = {
    name,
    address,
    phone,
    items: cartItems,
    total: totalCost
  };

  // Send order to Firebase
  addDoc(ordersCollection, order)
    .then(() => {
      // Clear cart and redirect to thank you page
      localStorage.removeItem('cart');
      window.location.href = './thankyou.html';
    })
    .catch(error => {
      console.error(error);
      alert('Chyba pri odosielaní objednávky.');
    });
});
