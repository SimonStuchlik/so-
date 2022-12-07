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
    console.log(productSectionIds);
    productsS.innerHTML = productSections.map((productSection) => `
        <div class="card">
            <h3 class="card-title">${productSection.name}</h3>
            <img src="${productSection.img}" alt="${productSection.name}">
            <button class="btn btn-primary" id="section__button--${productSectionIds[productSections.indexOf(productSection)]}">View Products</button>
        </div>` 
    ).join('');
});

//delete productSection
productsS.addEventListener('click', (e) => {
    if(e.target.classList.contains('btn-primary')){
        let id = e.target.id.split('--')[1];
        var ref = collection(db, "/productSections/", id + '/1');
        let test = [];
        onSnapshot(ref, (querySnapshot) => {
            querySnapshot.forEach((doc) => {
                test.push(doc.data());
            })
            console.log(test);
        });
    }
})


// //get list of products in a productSection
// let productsSec = [];
// onSnapshot(productsRef, (querySnapshot) => {
//     let productsList = document.getElementById('products');
//     querySnapshot.forEach((doc) => {
//         productsSec.push(doc.data());
//     })
//     console.log(products);
//     productsList.innerHTML = products.map((product) => `
//         <div class="card">
//             <h3 class="card-title
//             ">${productsSec.name}</h3>
//             <img src="${productsSec.img}" alt="${productsSec.name}">
//         </div>`
//     ).join('');
// });