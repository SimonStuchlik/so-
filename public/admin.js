import { db, collection, getDoc, addDoc, onSnapshot, deleteDoc, doc } from './firebase.js';
import { getStorage, ref as sRef, uploadBytesResumable, getDownloadURL, deleteObject } from 'https://www.gstatic.com/firebasejs/9.6.9/firebase-storage.js';

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
        var progress = (snapshot.byproductListransferred / snapshot.totalBytes) * 100;
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
    const productList = document.getElementById('products-list');
    productSectionIds.forEach((category) => {
        const productsRef = collection(db, 'productSections', category, '1');
        let products = [];
        onSnapshot(productsRef, (querySnapshot) => {
            querySnapshot.forEach((doc) => {    
                products.push({id: doc.id, ...doc.data()});
            })
            productList.innerHTML += products.map((product) => `
                <div class="cart-item">
                    <img class="cart-item-image" src="${product.img}" width="100" height="100">
                    
                    <span class="cart-item-title">${product.name}</span>
                    <span class="cart-item-price" id="section__id--${category}">${product.price}</span>
                    <button class="btn btn-primary" type="button" id="edit__button--${product.id}">EDIT</button>
                    <button class="btn btn-danger" type="button" id="delete__button--${product.id}">REMOVE</button>

                </div>
                `).join('');
        })
        //edit of remove product
        productList.addEventListener('click', (e) => {
            e.stopImmediatePropagation();
            if (e.target.classList.contains('btn-primary')) {
                // edit product
                const productId = e.target.id.split('--')[1];
                //get product section id from price span
                const productSectionId = e.target.previousElementSibling.id.split('--')[1];
                //get product from db and save it to local storage with section id
                const productRef = doc(db, 'productSections', productSectionId, '1', productId);
                //delete old product and section id from local storage
                localStorage.removeItem('productEdit');
                localStorage.removeItem('productSectionIdEdit');
                localStorage.removeItem('productIdEdit');
                getDoc(productRef).then((doc) => {
                    if (doc.exists()) {
                        localStorage.setItem('productEdit', JSON.stringify(doc.data()));
                        localStorage.setItem('productSectionIdEdit', productSectionId);
                        localStorage.setItem('productIdEdit', productId);
                        console.log('document data:', doc.data());
                        window.location.href = 'product-edit.html';
                    } else {
                        console.log('no such document');
                    }
                }).catch((error) => {
                    console.log(error);
                });
            } else if (e.target.classList.contains('btn-danger')) {
                // remove product 
                const productId = e.target.id.split('--')[1];
                //get product section id from price span
                const productSectionId = e.target.previousElementSibling.previousElementSibling.id.split('--')[1];
                //delete product from db and product img from storage
                const productRef = doc(db, 'productSections', productSectionId, '1', productId);
                // get img src
                const imgSrc = e.target.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.src;
                //extract img name from src
                const decodedUrl = decodeURIComponent(imgSrc);
        
                let imageName = decodedUrl.substring(decodedUrl.lastIndexOf('/') + 1);
                imageName = imageName.split('?')[0];
                console.log(imageName);
                const storageRef = sRef(storage, 'product-images/' + imageName);
                deleteDoc(productRef).then(() => {
                    console.log('db deleted', productId, productSectionId);
                    deleteObject(storageRef).then(() => {
                        console.log('storage deleted');
                        window.location.reload();
                    })
                }).catch((error) => {
                    console.log(error);
                });
            }
        });
        

    })
});


// Get orders collection from Firebase
const ordersCollection = collection(db, 'orders');

// Get table body element
const ordersEl = document.querySelector('#orders');

// Listen for changes in orders collection and update table
onSnapshot(ordersCollection, snapshot => {
  ordersEl.innerHTML = '';
  snapshot.forEach(docu => {
    const order = docu.data();
    const row = document.createElement('tr');

    const nameCell = document.createElement('td');
    nameCell.innerText = order.name;
    row.appendChild(nameCell);

    const addressCell = document.createElement('td');
    addressCell.innerText = order.address;
    row.appendChild(addressCell);

    const phoneCell = document.createElement('td');
    phoneCell.innerText = order.phone;
    row.appendChild(phoneCell);

    const itemsCell = document.createElement('td');
    const itemsList = document.createElement('ul');
    order.items.forEach(item => {
      const listItem = document.createElement('li');
      listItem.innerText = `${item.name} (${item.quantity}x)`;
      itemsList.appendChild(listItem);
    });
    itemsCell.appendChild(itemsList);
    row.appendChild(itemsCell);

    const totalCell = document.createElement('td');
    totalCell.innerText = `${order.total} €`;
    row.appendChild(totalCell);

    const actionCell = document.createElement('td');
    const deleteBtn = document.createElement('span');
    deleteBtn.classList.add('action');
    deleteBtn.innerText = 'Vymazať';
    deleteBtn.addEventListener('click', () => {
      deleteDoc(doc(db, 'orders', docu.id));
    });
    actionCell.appendChild(deleteBtn);
    row.appendChild(actionCell);

    ordersEl.appendChild(row);
  });
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
            //if id is equal to products-list then display flex or none and for others display block or none
            if (id === elementId) {
                document.getElementById(id).style.display = id === 'products-list' ? 'flex' : 'block';
            }
            else {
                document.getElementById(id).style.display = 'none';
            }

        });
    }

    dashboardPage.addEventListener('click', (e) => showElement('dashboard'));
    productsPage.addEventListener('click', (e) => showElement('products-list'));
    ordersPage.addEventListener('click', (e) => showElement('orders-list'));

