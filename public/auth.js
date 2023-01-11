import { auth, database, set, ref, update, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "./firebase.js";


function emailValidation(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(String(email).toLowerCase())) {
      return true;
    }
    else{
    return false;
    }
  }
  
  function passwordValidation(password) {
    const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    if (re.test(String(password))) {
      return true;
    }
    else{
    return false;
    }
  }
  
  
//  sign up

  const signupForm = document.getElementById('signUpForm');

  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log("test");
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (emailValidation(email) && passwordValidation(password)) {
        createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      

        set(ref(database, 'users/' + user.uid), {
          email: email,
          last_login: Date.now(),
        }).then(() => {
            console.log("Data saved successfully!");
          // Data saved successfully!
        //   document.getElementsByClassName("loader")[0].style.display = "none";
        //   window.location.replace("./signIn.html");
        })
          .catch((error) => {
            // The write failed...
            // document.getElementsByClassName("loader")[0].style.display = "none";
            console.log(error);
          });

    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    //   document.getElementsByClassName("loader")[0].style.display = "none";
      // ..
    });
}
  });

  