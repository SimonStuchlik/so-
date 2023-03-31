import { db, collection, getDocs, addDoc, onSnapshot, deleteDoc, doc } from './firebase.js';

//html elements
const productsS = document.getElementById('product-section');
const name = document.getElementById('product-name');
const img = document.getElementById('product-img-upload');
const price = document.getElementById('product-price');
const description = document.getElementById('product-description');

//collection reference
const productSectionsRef = collection(db, 'productSections');

//get all productSections
let productSections = [];
let productSectionIds = [];
onSnapshot(productSectionsRef, (querySnapshot) => {
    querySnapshot.forEach((doc) => {
        productSections.push(doc.data().name);
        productSectionIds.push(doc.id);
    })
    productsS.innerHTML = productSections.map((productSection) => `
        <option value="${productSection}">${productSection}</option>`
    ).join('');
});

//submit form
const form = document.getElementById('form');
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = productSectionIds[productSections.indexOf(productsS.value)];
    const productsRef = collection(db, '/productSections/', id + '/1');
    await addDoc(productsRef, {
        name: name.value,
        // img: img.value,
        price: price.value,
        text: description.value
    });
    form.reset();
});