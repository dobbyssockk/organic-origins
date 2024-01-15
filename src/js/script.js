'use strict';

document.addEventListener('DOMContentLoaded', () => {
    // Prevent default behavior <a> tags
    const links = document.querySelectorAll('a');
    links.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
        })
    })

    // Header menu background
    const menu = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 10 && screen.width > 576) {
            menu.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
            menu.style.boxShadow = '0px 0px 35px -15px rgba(0,0,0,0.75)';
        } else {
            menu.style.backgroundColor = 'transparent';
            menu.style.boxShadow = 'none';
        }
    });

    //Hamburger
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('.header__nav');
    // const navItem = document.querySelector('.header__list');
    hamburger.addEventListener('click', () => {
        if (nav.classList.contains('active')) {
            nav.classList.remove('active');
        } else {
            nav.classList.add('active');
        }
    })

    // Scroll to basket
    const basketButton = document.getElementById('basket-button');
    basketButton.addEventListener('click', () => {
        const basket = document.getElementById('basket');
        basket.scrollIntoView({
            behavior: "smooth"
        });
    });

    // Scroll to shop
    const shopButton = document.getElementById('shop-button');
    shopButton.addEventListener('click', () => {
        const shop = document.getElementById('produce');
        shop.scrollIntoView({
            behavior: "smooth"
        });
    });

    // Array with products
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

    // Adding products to basket
    const basket = [];
    function addToBasket(product) {
        const existingItem = basket.find(item => {
            return item.id === product.id;
        });

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            basket.push({...product, quantity: 1});
        }
        renderBasket();
    }

    // Rendering products in section produce
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

    renderProducts();

    // Rendering orders in basket
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
            `
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
                                    <div class="basket__order-change plus" data-id="${item.id}"><img src="icons/plus.svg" alt="plus_icon"></div>
                                    <div class="basket__order-change minus" data-id="${item.id}"><img src="icons/minus.svg" alt="minus_icon"></div>
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
                    renderBasket();
                });

                document.querySelector(`.minus[data-id="${item.id}"]`).addEventListener('click', () => {
                    if (item.quantity === 1) {
                        item.quantity = 0;
                        const index = basket.findIndex(el => {
                            return el.id === item.id;
                        })
                        basket.splice(index, 1);
                        renderBasket();
                    } else {
                        item.quantity -= 1;
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

    renderBasket();

    // Show form window
    const formButton = document.getElementById('form-button');
    const overlay = document.querySelector('.overlay');
    const loginForm = document.getElementById('login');
    const registerForm = document.getElementById('register');
    const paymentButton = document.getElementById('payment');
    formButton.addEventListener('click', () => {
       overlay.style.display = 'block';
       loginForm.style.display = 'block';
    });

    paymentButton.addEventListener('click', () => {
        overlay.style.display = 'block';
        loginForm.style.display = 'block';
    });

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.style.display = 'none';
            loginForm.style.display = 'none';
            registerForm.style.display = 'none';
        }
    })

    const loginLink = document.getElementById("login-link");
    loginLink.addEventListener("click", function (e) {
        e.preventDefault();

        registerForm.style.display = "none";
        loginForm.style.display = "block";
    });

    const signUpLink = document.getElementById("signup-link");
    signUpLink.addEventListener("click", function (e) {
        e.preventDefault();

        loginForm.style.display = "none";
        registerForm.style.display = "block";
    });

    // For animate.css
    new WOW().init();
});