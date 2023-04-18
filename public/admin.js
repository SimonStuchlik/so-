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
//collection reference
const productSectionsRef = collection(db, 'productSections');

//upload photo
function handleWelcomeUpload(uploadTask, data, docMethod, loader, ref) {
    uploadTask.on('state_changed', function(snapshot){
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
    }, function(error) {
        console.log(error);
    }, function() {
        getDownloadURL(uploadTask.snapshot.ref).then(function(downloadURL) {
            data.img= downloadURL;
            docMethod(ref, data)
                .then(() => {
                    loader.style.display = "none";
                }).catch((error) => {
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
});

//submit form
const form = document.getElementById('form');
form.addEventListener('submit', async (e) => {
    e.preventDefault();
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