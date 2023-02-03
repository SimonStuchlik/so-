const hamburger = document.querySelector(".hamburger-menu");
            const navbar = document.querySelector(".navbar");
            hamburger.addEventListener("click", function() {
            hamburger.classList.toggle("change");
            navbar.classList.toggle("show");
            });

//display number of items in cart on window load
window.onload = function() {
    const updateCartCount = () => {
        let cart = localStorage.getItem('cart');
        if (cart === null) {
          cart = [];
        } else {
          cart = JSON.parse(cart);
        }
        const cartCountElement = document.querySelector('.cart-count');
        cartCountElement.textContent = cart.length;
      };
    
      updateCartCount();
}