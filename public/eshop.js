import { db, collection, getDocs, addDoc, onSnapshot, deleteDoc, doc } from './firebase.js';
//html elements
const productsS = document.querySelector('.cards');
const productSec = document.getElementById('product-section');

//collection reference
const productSectionsRef = collection(db, 'productSections');

//get all productSections
let productSections = [];
let productSectionIds = [];
onSnapshot(productSectionsRef, (querySnapshot) => {
    querySnapshot.forEach((doc) => {
        productSections.push(doc.data());
        productSectionIds.push(doc.id);
    });
    let productsHTML = ''; // build a string of HTML
    //get product sections for filter
    productSec.innerHTML = productSections.map((productSection) => `
    
  <option value="${productSection.name}">${productSection.name}</option>`
    ).join('');

    // get list of products in each productSection
    productSectionIds.forEach((productSectionId, index) => {
        const productsRef = collection(db, 'productSections', productSectionId, '1');
        const products = [];

        onSnapshot(productsRef, (querySnapshot) => {
            querySnapshot.forEach((doc) => {
                products.push({ id: doc.id, ...doc.data() });
            });

            // build HTML for products
            const productsHTMLStr = products.map((product) => `
            <div class="card">
              <h3 class="card-title">${product.name}</h3>
              <img class="sell_img" src="${product.img}" alt="${product.name}">
              <p class="card-text">${product.description}</p>
              <p class="card-text">${product.price}</p>
              <button class="view-button" id="section__button--${product.id}">View Product</button>
            </div>
          `).join('');

            productsHTML += productsHTMLStr; // append to the HTML string
            productsS.innerHTML = productsHTML; // set HTML once at the end
        });
    });
});

