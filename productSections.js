import { db, collection, getDocs, addDoc, onSnapshot, deleteDoc, doc } from './firebase.js';


//collection reference
const productSectionsRef = collection(db, 'productSections');

//get all productSections
let productSections = [];
onSnapshot(productSectionsRef, (querySnapshot) => {
    let products = document.getElementById('product-sections');
    querySnapshot.forEach((doc) => {
        productSections.push(doc.data());
    })
    console.log(productSections);
    products.innerHTML = productSections.map((productSection) => `
        <div class="card">
            <h3 class="card-title">${productSection.name}</h3>
            <img src="${productSection.img}" alt="${productSection.name}">
        </div>` 
    ).join('');
});
