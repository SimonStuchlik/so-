import { db, collection, getDocs, addDoc, onSnapshot, deleteDoc, doc } from './firebase.js';

//html elements
const productsS = document.getElementById('product-sections');

//collection reference
const productSectionsRef = collection(db, 'productSections');
const productsRef = collection(db, '/productSections/7B1iAyJVnBe25eqTHog1/1');

//get all productSections
let productSections = [];
let productSectionIds = [];
onSnapshot(productSectionsRef, (querySnapshot) => {
    querySnapshot.forEach((doc) => {
        productSections.push(doc.data());
        productSectionIds.push(doc.id);
    })
    // get list of products in a productSection
    productSectionIds.forEach((productSectionId, index) => {
    const productsRef = collection(db, 'productSections', productSectionId, '1');
    const products = [];
  
    onSnapshot(productsRef, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        products.push({ id: doc.id, ...doc.data() });
      });
  
      console.log(`Products in ${productSections[index].name}: `, products);
    });
  });
    console.log(productSectionIds);
    productsS.innerHTML = productSections.map((productSection) => `
        <div class="card">
            <h3 class="card-title">${productSection.name}</h3>
            <img class= "sell_img"src="${productSection.img}" alt="${productSection.name}">
            <button class="wiew_button" id="section__button--${productSectionIds[productSections.indexOf(productSection)]}">View Products</button>
        </div>` 
    ).join('');
});

//delete productSection
productsS.addEventListener('click', (e) => {
    if(e.target.classList.contains('wiew_button')){
        let id = e.target.id.split('--')[1];
        var ref = collection(db, "/productSections/", id + '/1');
        let test = [];
        onSnapshot(ref, (querySnapshot) => {
            querySnapshot.forEach((doc) => {
                test.push(doc.data());
            })
            localStorage.setItem('products', JSON.stringify(test));
            console.log(test);
            window.location.href = 'eshop.html';
        });
    }
})




