const hamburger = document.querySelector(".hamburger-menu");
            const navbar = document.querySelector(".navbar");
            hamburger.addEventListener("click", function() {
            hamburger.classList.toggle("change");
            navbar.classList.toggle("show");
            });