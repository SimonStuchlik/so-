import { auth, database, set, ref, update, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "./firebase.js";



// Sign in
const loginForm = document.getElementById('loginForm');
loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      document.cookie = "user=" + user.uid;
      window.location.replace("./admin.html");
      // ...
      var lgDate = new Date();

      update(ref(database, 'users/' + user.uid), {
        last_login: lgDate,
      }).then(() => {
        // Data saved successfully!
          window.location.replace("./admin.html");
          console.log("Data saved successfully!");
        // window.location.replace("./index.html");
        

      })
        .catch((error) => {
          // The write failed...
          console.log(error);
        });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      console.log(errorCode);
    });
})