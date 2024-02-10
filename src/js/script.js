'use strict';

document.addEventListener('DOMContentLoaded', () => {
    // DOM events
    const links = document.querySelectorAll('a'),
          menu = document.querySelector('.header'),
          hamburger = document.querySelector('.hamburger'),
          nav = document.querySelector('.header__nav'),
          basketButton = document.getElementById('basket-button'),
          basketEl = document.getElementById('basket'),
          shopButton = document.getElementById('shop-button'),
          shopEl = document.getElementById('produce'),
          formButton = document.getElementById('form-button'),
          overlay = document.querySelector('.overlay'),
          loginForm = document.getElementById('login'),
          registerForm = document.getElementById('register'),
          paymentButton = document.getElementById('payment'),
          loginLink = document.getElementById("login-link"),
          signUpLink = document.getElementById("signup-link");

    // Local storage handling for basket and products data
    const savedBasketString = localStorage.getItem('basket');
    let basket = savedBasketString ? JSON.parse(savedBasketString) : [];
    const produceItems = [
        {
            id: 1,
            name: 'Crunchy Cucumber',
            img: 'src/img/cucumber-min.png',
            price: 1.99
        },
        {
            id: 2,
            name: 'Heirloom tomato',
            img: 'src/img/tomato-min.png',
            price: 5.99
        },
        {
            id: 3,
            name: 'Juicy Peach',
            img: 'src/img/peach-min.png',
            price: 3.99
        },
        {
            id: 4,
            name: 'Organic ginger',
            img: 'src/img/ginger-min.png',
            price: 12.99
        },
        {
            id: 5,
            name: 'Tropical Pineapple',
            img: 'src/img/pineapple-min.png',
            price: 2.49
        },
        {
            id: 6,
            name: 'Sweet onion',
            img: 'src/img/onion-min.png',
            price: 2.99
        }
    ];

    // Functions
    // Save basket array in local storage
    function saveBasket() {
        localStorage.setItem('basket', JSON.stringify(basket));
    }
    // Prevent default link behavior
    function preventDefaultForLinks() {
        links.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
            });
        });
    }

    // Adding products to basket
    function addToBasket(product) {
        const existingItem = basket.find(item => {
            return item.id === product.id;
        });

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            basket.push({...product, quantity: 1});
        }

        saveBasket();
        renderBasket();
    }

    // Rendering products on the page
    function renderProducts() {
        const container = document.querySelector('.produce__wrapper');

        produceItems.forEach(item => {
            const product = document.createElement('div');
            product.classList.add('produce__item');
            product.classList.add('animate__animated');
            product.classList.add('animate__fadeInRight');
            product.classList.add('wow');

            product.addEventListener('click', () => {
                addToBasket(item);
            });

            product.innerHTML = `
                <div class="produce__image"><img src="${item.img}" alt="big tomato"></div>
                <div class="produce__info">
                    <div class="title__product">${item.name}</div>
                    <div class="subtitle__product">$${item.price} / lb</div>
                    <p class="produce__descr">Grown in San Juan Capistrano, CA</p>
                </div>
            `;

            container.append(product);
        });
    }

    // Rendering basket and handling quantity changes
    function renderBasket() {
        // Rendering the cart subtitle
        const subtitle = document.getElementById('basket__subtitle');
        subtitle.textContent = `${basket.length} items`

        // Rendering the cart button
        basketButton.textContent = `Basket (${basket.length})`

        // Rendering the cart
        const container = document.querySelector('.basket__orders');

        if (basket.length === 0) {
            container.innerHTML = `
                <p class="basket__empty">There are no items yet...</p>
            `;
        } else {
            container.innerHTML = '';
            basket.forEach(item => {
                const order = document.createElement('div');
                order.classList.add('basket__order');

                const orderTotalEl = item.quantity * item.price;

                order.innerHTML = `
                    <div class="basket__order-image"><img src="${item.img}" alt="tomato"></div>
                    <div class="basket__order-wrapper">
                        <div class="basket__order-info">
                            <div class="title__product">${item.name}</div>
                            <div class="subtitle__product">$${item.price} / lb</div>
                            <div class="basket__order-weight">
                                <div class="basket__order-lb">${item.quantity} lb</div>
                                <div class="basket__order-icons">
                                    <div class="basket__order-change plus" data-id="${item.id}"><img src="src/icons/plus.svg" alt="plus_icon"></div>
                                    <div class="basket__order-change minus" data-id="${item.id}"><img src="src/icons/minus.svg" alt="minus_icon"></div>
                                </div>
                            </div>
                        </div>
            
                        <div class="basket__order-total">$${orderTotalEl.toFixed(2)}</div>
                    </div>
                `;
                container.append(order);

                // Changing the quantity
                document.querySelector(`.plus[data-id="${item.id}"]`).addEventListener('click', () => {
                    item.quantity += 1;
                    saveBasket();
                    renderBasket();
                });

                document.querySelector(`.minus[data-id="${item.id}"]`).addEventListener('click', () => {
                    if (item.quantity === 1) {
                        item.quantity = 0;
                        const index = basket.findIndex(el => {
                            return el.id === item.id;
                        })
                        basket.splice(index, 1)
                        saveBasket();
                        renderBasket();
                    } else {
                        item.quantity -= 1;
                        saveBasket();
                        renderBasket();
                    }
                });

            });
        }

        // Calculating the total sum
        const subtotalEl = document.getElementById('subtotal-price'),
              shippingEl = document.getElementById('shipping-price'),
              taxEl = document.getElementById('tax-price'),
              totalEl = document.getElementById('total-price');

        const SHIPPING = 5;
        const TAX = 0.1;
        const subtotal = basket.reduce((acc, {price, quantity}) => {
            return acc + price * quantity;
        }, 0);
        const tax = subtotal * TAX;
        const total = subtotal + SHIPPING + tax;

        subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
        taxEl.textContent = `$${tax.toFixed(2)}`;
        totalEl.textContent = `$${total.toFixed(2)}`;
        if (basket.length === 0) {
            shippingEl.textContent = '0';
            totalEl.textContent = '0';
        } else {
            shippingEl.textContent = `$${SHIPPING.toFixed(2)}`;
        }
    }

    // Dynamic header background change on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 10 && screen.width > 576) {
            menu.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
            menu.style.boxShadow = '0px 0px 35px -15px rgba(0,0,0,0.75)';
        } else {
            menu.style.backgroundColor = 'transparent';
            menu.style.boxShadow = 'none';
        }
    });

    // Event listeners
    // Hamburger menu toggle
    hamburger.addEventListener('click', () => {
        nav.classList.toggle('active');
    });

    // Smooth scrolling to sections
    basketButton.addEventListener('click', () => {
        basketEl.scrollIntoView({
            behavior: "smooth"
        });
    });
    shopButton.addEventListener('click', () => {
        shopEl.scrollIntoView({
            behavior: "smooth"
        });
    });

    // Form display controls
    // Function to control the visibility of forms and overlay
    function toggleForms({ showOverlay = false, showLogin = false, showRegister = false }) {
        overlay.style.display = showOverlay ? 'block' : 'none'; // Show or hide the overlay
        loginForm.style.display = showLogin ? 'block' : 'none'; // Show or hide the login form
        registerForm.style.display = showRegister ? 'block' : 'none'; // Show or hide the register form
    }

    // Event listener for button clicks that should show the login form
    formButton.addEventListener('click', () =>
        toggleForms({ showOverlay: true, showLogin: true }));
    paymentButton.addEventListener('click', () =>
        toggleForms({ showOverlay: true, showLogin: true }));

    // Event listener for clicking on the overlay and hiding all
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) toggleForms({});
    });

    // Event listeners for the login and sign-up links
    loginLink.addEventListener("click", () =>
        toggleForms({ showOverlay: true, showLogin: true }));
    signUpLink.addEventListener("click", () =>
        toggleForms({ showOverlay: true, showRegister: true }));

    // Initialization
    preventDefaultForLinks();
    renderProducts();
    renderBasket();
    new WOW().init(); // for animate.css library
});