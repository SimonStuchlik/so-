import { db, collection, getDocs, addDoc, onSnapshot, deleteDoc, doc } from './firebase.js';

//html elements
const productsS = document.querySelector('.cards');
const productSec = document.getElementById('product-section');
const sortSelect = document.getElementById('sort-select');
const productElement = document.createElement('div');

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
      console.log(productsList, 'products');
      productElement.innerHTML = productsList.map((product) => `
      <div class="frame">
        <img class="sell_img" id="section__button--${product.id}" src="${product.img}" alt="${product.name}">
        <h3 class="card-title" id="section__button--${product.id}">${product.name}</h3>
        <p class="product-price" id="section__button--${product.id}">${product.price}€</p>
        <button class="wiew_button" id="section__button--${product.id}">Pridať do košíka</button>
      </div>
      `).join('');
      productsS.innerHTML = productElement.innerHTML;

      // sort products based on price when the "Sort By" select element is changed
      sortSelect.addEventListener('change', () => {
        const sortBy = sortSelect.value;
        if (sortBy === 'low-to-high') {
          productsList.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'high-to-low') {
          productsList.sort((a, b) => b.price - a.price);
        }

        productElement.innerHTML = productsList.map((product) => `
        <div class="frame">
          <img class="sell_img" id="section__button--${product.id}" src="${product.img}" alt="${product.name}">
          <h3 class="card-title" id="section__button--${product.id}">${product.name}</h3>
          <p class="product-price" id="section__button--${product.id}">${product.price}€</p>
          <button class="wiew_button" id="section__button--${product.id}">Pridať do košíka</button>
        </div>
        `).join('');
        productsS.innerHTML = productElement.innerHTML;
      });

      function filterByCategory(category) {
        // filter products by category and update the HTML
        var ref = collection(db, "/productSections/", category + '/1');
        let products = [];
        onSnapshot(ref, (querySnapshot) => {
          querySnapshot.forEach((doc) => {
            products.push({ ...doc.data() });
          })
          console.log(products, 'filtered products');
          //display filtered products
          productElement.innerHTML = products.map((product) => `
        <div class="frame">
          <img class="sell_img" id="section__button--${product.id}" src="${product.img}" alt="${product.name}">
          <h3 class="card-title" id="section__button--${product.id}">${product.name}</h3>
          <p class="product-price" id="section__button--${product.id}">${product.price}€</p>
          <button class="wiew_button" id="section__button--${product.id}">Pridať do košíka</button>
        </div>
      `).join('');
      productsS.innerHTML = productElement.innerHTML;
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
      productsS.addEventListener('click', (e) => {
        if (e.target.classList.contains('wiew_button')) {
          console.log('add to cart');
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
      productsS.addEventListener('click', (e) => {
        //only capture first click
        e.stopImmediatePropagation();
        if (e.target.classList.contains('sell_img') || e.target.classList.contains('product-price') || e.target.classList.contains('card-text')) {
          console.log('show product detail');
          //get product details
          const productId = e.target.id.split('--')[1];
          console.log(productId);
          const product = productsList.find((product) => product.id === productId);
          //reset product detail
          localStorage.removeItem('product-detail');
          const productData = {
            id: productId,
            name: product.name,
            price: product.price,
            text: product.text,
            img: product.img,
            quantity: 1
          };
          //save product detail to local storage
          localStorage.setItem('product-detail', JSON.stringify(productData));
          console.log(productData);
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
          productElement.innerHTML = productsList.map((product) => `
          <div class="frame">
            <img class="sell_img" id="section__button--${product.id}" src="${product.img}" alt="${product.name}">
            <h3 class="card-title" id="section__button--${product.id}">${product.name}</h3>
            <p class="card-text" id="section__button--${product.id}">${product.price}€</p>
            <button class="wiew_button" id="section__button--${product.id}">Pridať do košíka</button>
          </div>
          `).join('');
          productsS.innerHTML = productElement.innerHTML;
          console.log('default');
        } else {
          filterByCategory(category);
          console.log('filter');
        }
      });

    });
  });
});

