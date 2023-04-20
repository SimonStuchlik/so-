import { db, collection, getDoc, addDoc, onSnapshot, deleteDoc, doc, updateDoc } from './firebase.js';
import { getStorage, ref as sRef, uploadBytesResumable, getDownloadURL, deleteObject } from 'https://www.gstatic.com/firebasejs/9.6.9/firebase-storage.js';

//get product info from local storage
let product = localStorage.getItem("productEdit");
let productId = localStorage.getItem("productIdEdit");
let sectionIdEdit = localStorage.getItem("productSectionIdEdit");
product = JSON.parse(product);

//set product info to html
const img = document.getElementById("product-image-preview");
const name = document.getElementById("product-name");
const description = document.getElementById("product-description");
const price = document.getElementById("product-price");
const loader = document.getElementById('submit-loader');

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

    //set new img to img preview
    const imageUpload = document.getElementById("product-image-upload");
    imageUpload.addEventListener("change", function () {
      const file = this.files[0];
      if (file) {
        const reader = new FileReader();
        reader.addEventListener("load", function () {
          img.setAttribute("src", this.result);
        });
        reader.readAsDataURL(file);
      }
    });

//update product to firebase
const form = document.getElementById("form");
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    var ref = doc(db, 'productSections', sectionIdEdit, '1', productId);
    loader.style.display = "block";
    if (imageUpload.files[0] === undefined) {
        const data = {
            name: name.value,
            text: description.value,
            price: price.value,
            img: product.img,
        };
        updateDoc(ref, data)
            .then(() => {
                loader.style.display = "none";
                window.location.href = "admin.html";
            }).catch((error) => {
                loader.style.display = "none";
                console.log(error);
            });
        return;
    }
    else {
    const file = imageUpload.files[0];
    const storage = getStorage();
    const storageRef = sRef(storage, 'product-images/' + file.name);
    const uploadTask = uploadBytesResumable(storageRef, file);

    const data = {
        name: name.value,
        text: description.value,
        price: price.value,
        img: product.img,
    };
    handleWelcomeUpload(uploadTask, data, updateDoc, loader, ref);
    }

})
