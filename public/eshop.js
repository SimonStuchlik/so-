import { db, collection, getDocs, addDoc, onSnapshot, deleteDoc, doc } from './firebase.js';

//html elements
const productsS = document.querySelector('.cards');
const productSec = document.getElementById('product-section');
const sortSelect = document.getElementById('sort-select');

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
  
  let productsList = []; // list of all products
  //get product sections for filter
  
  productSec.innerHTML = `
  <option value="default">Vyberte sekciu produktu</option>
  ${productSections.map((productSection) => `
    <option class="sekcie" id="section__button--${productSectionIds[productSections.indexOf(productSection)]}" value="${productSectionIds[productSections.indexOf(productSection)]}">${productSection.name}</option>
  `).join('')}
`;


  // get list of products in each productSection
  productSectionIds.forEach((productSectionId, index) => {
    const productsRef = collection(db, 'productSections', productSectionId, '1');
    const products = [];

    onSnapshot(productsRef, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        products.push({ id: doc.id, ...doc.data() });
        productsList.push({ id: doc.id, ...doc.data() }); // add to the list of all products
      });

      // build HTML for products
      const productElement = document.createElement('div');
      productElement.classList.add('product');
      productElement.innerHTML = products.map((product) => `
      <div class="frame">
      <img class="sell_img" id="section__button--${product.id}" src="${product.img}" alt="${product.name}">
      <h3 class="card-title" id="section__button--${product.id}">${product.name}</h3>
      <p class="card-text" id="section__button--${product.id}">${product.price}€</p>
      <button class="wiew_button" id="section__button--${product.id}">Pridať do košíka</button>
    </div>
      `).join('');
      productsS.appendChild(productElement);

      // sort products based on price when the "Sort By" select element is changed
      sortSelect.addEventListener('change', () => {
        const sortBy = sortSelect.value;
        if (sortBy === 'low-to-high') {
          productsList.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'high-to-low') {
          productsList.sort((a, b) => b.price - a.price);
        }
        const productElement = document.createElement('div');
        productElement.classList.add('product');
        productElement.innerHTML = productsList.map((product) => `
        <div class="frame">
          <img class="sell_img" id="section__button--${product.id}" src="${product.img}" alt="${product.name}">
          <h3 class="card-title" id="section__button--${product.id}">${product.name}</h3>
          <p class="card-text" id="section__button--${product.id}">${product.price}€</p>
          <button class="wiew_button" id="section__button--${product.id}">Pridať do košíka</button>
        </div>
        `).join('');
        productsS.appendChild(productElement);
      });

      function filterByCategory(category) {
        // filter products by category and update the HTML
        var ref = collection(db, "/productSections/", category + '/1');
        let products = [];
        onSnapshot(ref, (querySnapshot) => {
          querySnapshot.forEach((doc) => {
            products.push({ ...doc.data() });
          })
          //display filtered products
          const productElement = document.createElement('div');
          productElement.classList.add('product');
          productElement.innerHTML = products.map((product) => `
        <div class="frame">
          <img class="sell_img" id="section__button--${product.id}" src="${product.img}" alt="${product.name}">
          <h3 class="card-title" id="section__button--${product.id}">${product.name}</h3>
          <p class="card-text" id="section__button--${product.id}">${product.price}€</p>
          <button class="wiew_button" id="section__button--${product.id}">Pridať do košíka</button>
        </div>
      `).join('');
          productsS.appendChild(productElement);
        })
      }

      //display cart items in header
      const updateCartCount = () => {
        let cart = localStorage.getItem('cart');
        if (cart === null) {
          cart = [];
        } else {
          cart = JSON.parse(cart);
        }
        const cartCountElement = document.querySelector('.cart-count');
        cartCountElement.textContent = cart.length;
      };

      updateCartCount();

      // add to cart
      productElement.addEventListener('click', (e) => {
        if (e.target.classList.contains('wiew_button')) {
          //get product details
          const productId = e.target.id.split('--')[1];
          const product = products.find((product) => product.id === productId);

          const productData = {
            id: product.id,
            name: product.name,
            price: product.price,
            img: product.img,
            quantity: 1
          };
          //add product to cart
          let cart = localStorage.getItem('cart');
          if (cart === null) {
            cart = [];
          }
          else {
            cart = JSON.parse(cart);
          }
          cart.push(productData);
          localStorage.setItem('cart', JSON.stringify(cart));
          updateCartCount();
        }
      });

      //display product detail 
      productElement.addEventListener('click', (e) => {
        if (e.target.classList.contains('sell_img') || e.target.classList.contains('card-title') || e.target.classList.contains('card-text')) {
          //reset product detail
          localStorage.removeItem('product-detail');
          //get product details
          const productId = e.target.id.split('--')[1];
          const product = products.find((product) => product.id === productId);

          const productData = {
            id: product.id,
            name: product.name,
            price: product.price,
            text: product.text,
            img: product.img,
            quantity: 1
          };
          //save product detail to local storage
          localStorage.setItem('product-detail', JSON.stringify(productData));
          //redirect to product detail page
          window.location.href = './produkt.html';
        }
      });


      productSec.addEventListener('change', (e) => {
        //only capture first change
        e.stopImmediatePropagation();
        const category = productSec.value;
        console.log(category, 'change');
        if (category === 'default') {
          // show all products if no category selected
          productsS.innerHTML = productsHTML;
        } else {
          filterByCategory(category);
        }
      });

    });
  });
});

