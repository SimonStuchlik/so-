import { db, collection, getDocs, addDoc, onSnapshot, deleteDoc, doc } from './firebase.js';
import { getStorage, ref as sRef, uploadBytesResumable, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.6.9/firebase-storage.js';

//cloud storage
const storage = getStorage();

//html elements
const productsS = document.getElementById('product-section');
const name = document.getElementById('product-name');
const img = document.getElementById('product-img-upload');
const price = document.getElementById('product-price');
const description = document.getElementById('product-description');
const loader = document.getElementById('submit-loader');

//pages in admin panel
const dashboardPage = document.getElementById('dashboard-page');
const productsPage = document.getElementById('products-page');
const ordersPage = document.getElementById('orders-page');
//collection reference
const productSectionsRef = collection(db, 'productSections');

//upload photo
function handleWelcomeUpload(uploadTask, data, docMethod, loader, ref) {
    uploadTask.on('state_changed', function (snapshot) {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(progress, " percent");
        switch (snapshot.state) {
            case 'paused':
                console.log('paused');
                break;
            case 'running':
                console.log('Upload is running');
                break;
        }
    }, function (error) {
        console.log(error);
    }, function () {
        getDownloadURL(uploadTask.snapshot.ref).then(function (downloadURL) {
            data.img = downloadURL;
            docMethod(ref, data)
                .then(() => {
                    loader.style.display = "none";
                }).catch((error) => {
                    loader.style.display = "none";
                    console.log(error);
                });
        });
    });
}

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
    //load products same way as in cart
    const productsList = document.getElementById('products-list');
    productSectionIds.forEach((category) => {
        const productsRef = collection(db, 'productSections', category, '1');
        let products = [];
        onSnapshot(productsRef, (querySnapshot) => {
            querySnapshot.forEach((doc) => {    
                products.push({id: doc.id, ...doc.data()});
            })
            productsList.innerHTML += products.map((product) => `
                <div class="cart-item">
                    <img class="cart-item-image" src="${product.img}" width="100" height="100">
                    
                    <span class="cart-item-title">${product.name}</span>
                    <span class="cart-item-price" id="section__id--${category}">${product.price}</span>
                    <button class="btn btn-danger" type="button" id="delete__button--${product.id}">REMOVE</button>

                </div>
                `).join('');
        })
        //remove product 
        productsList.addEventListener('click', (e) => {
            e.stopImmediatePropagation();
            if (e.target.classList.contains('btn-danger')) {
                const productId = e.target.id.split('--')[1];
                //get product section id from price span
                const productSectionId = e.target.previousElementSibling.id.split('--')[1];
                const productRef = doc(db, 'productSections', productSectionId, '1', productId);
                deleteDoc(productRef).catch((error) => {
                    console.log(error);
                });
            }
        });
    })
});


    //submit form
    const form = document.getElementById('form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        loader.style.display = "block";
        const id = productSectionIds[productSections.indexOf(productsS.value)];
        const productImg = document.getElementById('product-image-upload');
        var file = productImg.files[0]
        const productsRef = collection(db, '/productSections/', id + '/1');
        var storageRef = sRef(storage, 'product-images/' + file.name);
        var uploadTask = uploadBytesResumable(storageRef, file);
        const data = {
            name: name.value,
            img: "",
            price: price.value,
            text: description.value
        }
        handleWelcomeUpload(uploadTask, data, addDoc, loader, productsRef)
        // form.reset();
    });


    //show elements
    function showElement(elementId) {
        const elementIds = ['dashboard', 'products-list', 'orders-list'];
        elementIds.forEach(id => {
            if (id === elementId && id == ! 'products-list') {
                document.getElementById(id).style.display = 'block';
            }
            else if (id === 'products-list') {
                document.getElementById(id).style.display = 'flex';
            }
            else {
                document.getElementById(id).style.display = 'none';
            }
        });
    }

    dashboardPage.addEventListener('click', (e) => showElement('dashboard'));
    productsPage.addEventListener('click', (e) => showElement('products-list'));
    ordersPage.addEventListener('click', (e) => showElement('orders-list'));


    ;
