document.addEventListener("DOMContentLoaded", () => {
  initCarousel();
  initCart();
  initModals();
  initTestimonialSlider();
  initMobileMenu();

  if (document.querySelector(".products-area")) {
    initProductsPage();
  }

  if (document.querySelector(".product-detail")) {
    initProductDetailPage();
  }

  if (document.querySelector(".cart-section")) {
    updateCartDisplay();
  }

  if (document.querySelector(".checkout-section")) {
    initCheckoutPage();
  }

  initNewsletterForm();
});

function initCarousel() {
  const slides = document.querySelectorAll(".carousel-slide");
  const dots = document.querySelectorAll(".carousel-dots .dot");
  const prevBtn = document.querySelector(".carousel-arrow.prev");
  const nextBtn = document.querySelector(".carousel-arrow.next");

  if (!slides.length) return;

  let currentSlide = 0;
  let slideInterval = setInterval(nextSlide, 5000);

  function showSlide(index) {
    slides.forEach((slide) => slide.classList.remove("active"));

    dots.forEach((dot) => dot.classList.remove("active"));

    slides[index].classList.add("active");

    dots[index].classList.add("active");

    currentSlide = index;
  }

  function nextSlide() {
    let next = currentSlide + 1;
    if (next >= slides.length) next = 0;
    showSlide(next);
  }

  function prevSlide() {
    let prev = currentSlide - 1;
    if (prev < 0) prev = slides.length - 1;
    showSlide(prev);
  }
  if (prevBtn)
    prevBtn.addEventListener("click", () => {
      clearInterval(slideInterval);
      prevSlide();
      slideInterval = setInterval(nextSlide, 5000);
    });

  if (nextBtn)
    nextBtn.addEventListener("click", () => {
      clearInterval(slideInterval);
      nextSlide();
      slideInterval = setInterval(nextSlide, 5000);
    });

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      clearInterval(slideInterval);
      showSlide(index);
      slideInterval = setInterval(nextSlide, 5000);
    });
  });

  const carousel = document.querySelector(".carousel");
  if (carousel) {
    carousel.addEventListener("mouseenter", () => {
      clearInterval(slideInterval);
    });

    carousel.addEventListener("mouseleave", () => {
      slideInterval = setInterval(nextSlide, 5000);
    });
  }
}

// ==================== SHOPPING CART ====================

function initCart() {
  const addToCartButtons = document.querySelectorAll(".add-to-cart");
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", addToCart);
  });

  const detailAddToCartButton = document.getElementById("add-to-cart-detail");
  if (detailAddToCartButton) {
    detailAddToCartButton.addEventListener("click", addToCartFromDetail);
  }

  updateCartCount();
}

function addToCart(event) {
  const button = event.target;
  const id = button.getAttribute("data-id");
  const name = button.getAttribute("data-name");
  const price = Number.parseFloat(button.getAttribute("data-price"));
  const image = button.getAttribute("data-image");

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existingProductIndex = cart.findIndex((item) => item.id === id);

  if (existingProductIndex !== -1) {
    cart[existingProductIndex].quantity += 1;
  } else {
    cart.push({
      id: id,
      name: name,
      price: price,
      image: image,
      quantity: 1
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  updateCartCount();

  showToast(`${name} added to cart!`, "success");
}

function addToCartFromDetail() {
  const id = this.getAttribute("data-id");
  const name = this.getAttribute("data-name");
  const price = Number.parseFloat(this.getAttribute("data-price"));
  const image = this.getAttribute("data-image");
  const quantity = Number.parseInt(
    document.getElementById("product-quantity").value
  );

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existingProductIndex = cart.findIndex((item) => item.id === id);

  if (existingProductIndex !== -1) {
    cart[existingProductIndex].quantity += quantity;
  } else {
    cart.push({
      id: id,
      name: name,
      price: price,
      image: image,
      quantity: quantity
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  updateCartCount();

  showToast(`${name} added to cart!`, "success");
}

function updateCartCount() {
  const cartCountElements = document.querySelectorAll("#cart-count");
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);

  cartCountElements.forEach((element) => {
    element.textContent = totalQuantity;
  });
}

function updateCartDisplay() {
  const cartItemsContainer = document.getElementById("cart-items");
  const cartEmptyElement = document.getElementById("cart-empty");
  const cartContentElement = document.getElementById("cart-content");
  const cartSubtotalElement = document.getElementById("cart-subtotal");
  const cartDiscountElement = document.getElementById("cart-discount");
  const cartTotalElement = document.getElementById("cart-total");

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    cartEmptyElement.style.display = "block";
    cartContentElement.style.display = "none";
    return;
  } else {
    cartEmptyElement.style.display = "none";
    cartContentElement.style.display = "block";
  }

  cartItemsContainer.innerHTML = "";

  let subtotal = 0;

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    const cartItemHTML = `
            <tr>
                <td>
                    <div class="cart-product">
                        <div class="cart-product-image">
                            <img src="${item.image}" alt="${item.name}">
                        </div>
                        <div class="cart-product-info">
                            <h3>${item.name}</h3>
                            <p>${item.price} / Sản phẩm</p>
                        </div>
                    </div>
                </td>
                <td>${item.price}</td>
                <td>
                    <div class="cart-quantity">
                        <button class="cart-quantity-btn minus" data-id="${item.id}">-</button>
                        <input type="number" value="${item.quantity}" min="1" data-id="${item.id}" class="cart-quantity-input">
                        <button class="cart-quantity-btn plus" data-id="${item.id}">+</button>
                    </div>
                </td>
                <td>${itemTotal}</td>
                <td>
                    <span class="cart-remove" data-id="${item.id}"><i class="fas fa-trash-alt"></i></span>
                </td>
            </tr>
        `;

    cartItemsContainer.innerHTML += cartItemHTML;
  });

  const discount = 0;
  const total = subtotal - discount;

  cartSubtotalElement.textContent = `${subtotal}`;
  cartDiscountElement.textContent = `${discount}`;
  cartTotalElement.textContent = `${total}`;

  const minusButtons = document.querySelectorAll(".cart-quantity-btn.minus");
  const plusButtons = document.querySelectorAll(".cart-quantity-btn.plus");
  const quantityInputs = document.querySelectorAll(".cart-quantity-input");
  const removeButtons = document.querySelectorAll(".cart-remove");

  minusButtons.forEach((button) => {
    button.addEventListener("click", decreaseQuantity);
  });

  plusButtons.forEach((button) => {
    button.addEventListener("click", increaseQuantity);
  });

  quantityInputs.forEach((input) => {
    input.addEventListener("change", updateQuantity);
  });

  removeButtons.forEach((button) => {
    button.addEventListener("click", removeFromCart);
  });

  const updateCartButton = document.getElementById("update-cart");
  if (updateCartButton) {
    updateCartButton.addEventListener("click", updateCartDisplay);
  }

  const applyCouponButton = document.getElementById("apply-coupon");
  if (applyCouponButton) {
    applyCouponButton.addEventListener("click", applyCoupon);
  }

  const shippingOptions = document.querySelectorAll('input[name="shipping"]');
  shippingOptions.forEach((option) => {
    option.addEventListener("change", updateCartDisplay);
  });
}

function decreaseQuantity() {
  const id = this.getAttribute("data-id");
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const productIndex = cart.findIndex((item) => item.id === id);

  if (productIndex !== -1) {
    if (cart[productIndex].quantity > 1) {
      cart[productIndex].quantity -= 1;
    } else {
      cart.splice(productIndex, 1);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    updateCartDisplay();
  }
}

function increaseQuantity() {
  const id = this.getAttribute("data-id");
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const productIndex = cart.findIndex((item) => item.id === id);

  if (productIndex !== -1) {
    cart[productIndex].quantity += 1;

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    updateCartDisplay();
  }
}

function updateQuantity() {
  const id = this.getAttribute("data-id");
  const quantity = Number.parseInt(this.value);

  if (quantity < 1) {
    this.value = 1;
    return;
  }

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const productIndex = cart.findIndex((item) => item.id === id);

  if (productIndex !== -1) {
    cart[productIndex].quantity = quantity;

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    updateCartDisplay();
  }
}

function removeFromCart() {
  const id = this.getAttribute("data-id");
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const productIndex = cart.findIndex((item) => item.id === id);

  if (productIndex !== -1) {
    const productName = cart[productIndex].name;
    cart.splice(productIndex, 1);

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    updateCartDisplay();

    showToast(`${productName} removed from cart!`, "info");
  }
}

function applyCoupon() {
  const couponInput = document.getElementById("coupon-code");
  const couponCode = couponInput.value.trim();

  if (couponCode === "") {
    showToast("Please enter a coupon code!", "error");
    return;
  }

  showToast("Coupon applied successfully!", "success");

  updateCartDisplay();
}

// ==================== PRODUCT PAGE ====================

function initProductsPage() {
  loadProducts();

  const categoryFilters = document.querySelectorAll(".category-filter");
  categoryFilters.forEach((filter) => {
    filter.addEventListener("click", function (e) {
      e.preventDefault();

      categoryFilters.forEach((f) => f.classList.remove("active"));

      this.classList.add("active");

      const category = this.getAttribute("data-category");
      filterProductsByCategory(category);
    });
  });

  const priceRangeSlider = document.getElementById("priceRange");
  const priceValueDisplay = document.getElementById("price-value");

  if (priceRangeSlider && priceValueDisplay) {
    priceRangeSlider.addEventListener("input", function () {
      priceValueDisplay.textContent = `${this.value}`;
    });

    const filterPriceButton = document.getElementById("filter-price-btn");
    if (filterPriceButton) {
      filterPriceButton.addEventListener("click", () => {
        filterProductsByPrice(priceRangeSlider.value);
      });
    }
  }

  const tagFilters = document.querySelectorAll(".tag-filter");
  tagFilters.forEach((filter) => {
    filter.addEventListener("click", function (e) {
      e.preventDefault();

      this.classList.toggle("active");

      filterProductsByTags();
    });
  });

  const sortSelect = document.getElementById("sort-by");
  if (sortSelect) {
    sortSelect.addEventListener("change", function () {
      sortProducts(this.value);
    });
  }

  const gridViewButton = document.getElementById("grid-view-btn");
  const listViewButton = document.getElementById("list-view-btn");
  const productContainer = document.getElementById("product-container");

  if (gridViewButton && listViewButton && productContainer) {
    gridViewButton.addEventListener("click", () => {
      gridViewButton.classList.add("active");
      listViewButton.classList.remove("active");
      productContainer.classList.remove("list-view");
      productContainer.classList.add("grid-view");
    });

    listViewButton.addEventListener("click", () => {
      listViewButton.classList.add("active");
      gridViewButton.classList.remove("active");
      productContainer.classList.remove("grid-view");
      productContainer.classList.add("list-view");
    });
  }

  const paginationLinks = document.querySelectorAll(".pagination a");
  paginationLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      paginationLinks.forEach((l) => l.classList.remove("active"));

      this.classList.add("active");

      const page = this.getAttribute("data-page");

      loadPage(page);
    });
  });
}

function loadProducts() {
  const productContainer = document.getElementById("product-container");

  if (!productContainer) return;

  const usdToVnd = 23500;
  const products = [
    {
      id: "1",
      name: "Táo sạch",
      price: 4.99 * usdToVnd,
      image: "images/products/apple.jpg",
      category: "fruits",
      tags: ["organic", "fresh", "fruit"],
      rating: 4.5,
      sale: true,
      originalPrice: 6.99 * usdToVnd
    },
    {
      id: "2",
      name: "Bông cải xanh hưu cơ",
      price: 3.49 * usdToVnd,
      image: "images/products/broccoli.jpg",
      category: "vegetables",
      tags: ["organic", "fresh", "vegetable"],
      rating: 5.0,
      organic: true
    },
    {
      id: "3",
      name: "Dâu tây tươi",
      price: 5.99 * usdToVnd,
      image: "images/products/strawberry.jpg",
      category: "fruits",
      tags: ["fresh", "fruit", "seasonal"],
      rating: 4.0
    },
    {
      id: "4",
      name: "Cà rốt hữu cơ",
      price: 2.99 * usdToVnd,
      image: "images/products/carrot.jpg",
      category: "vegetables",
      tags: ["organic", "fresh", "vegetable"],
      rating: 4.7,
      organic: true
    },
    {
      id: "5",
      name: "Chuối chín",
      price: 1.99 * usdToVnd,
      image: "images/products/banana.jpg",
      category: "fruits",
      tags: ["fresh", "fruit"],
      rating: 4.0
    },
    {
      id: "6",
      name: "Rau chân vịt hữu cơ",
      price: 3.29 * usdToVnd,
      image: "images/products/spinach.jpg",
      category: "vegetables",
      tags: ["organic", "fresh", "vegetable", "leafy"],
      rating: 5.0,
      organic: true
    },
    {
      id: "7",
      name: "Cam mọng nước",
      price: 4.49 * usdToVnd,
      image: "images/products/orange.jpg",
      category: "fruits",
      tags: ["fresh", "fruit", "citrus"],
      rating: 4.5
    },
    {
      id: "8",
      name: "Cà chua hữu cơ",
      price: 3.99 * usdToVnd,
      image: "images/products/tomato.jpg",
      category: "vegetables",
      tags: ["organic", "fresh", "vegetable"],
      rating: 4.0,
      organic: true
    },
    {
      id: "9",
      name: "Bơ chín",
      price: 6.99 * usdToVnd,
      image: "images/products/avocado.jpg",
      category: "fruits",
      tags: ["fresh", "fruit", "healthy"],
      rating: 5.0
    },
    {
      id: "10",
      name: "Ớt chuông hữu cơ",
      price: 4.29 * usdToVnd,
      image: "images/products/bell-pepper.jpg",
      category: "vegetables",
      tags: ["organic", "fresh", "vegetable"],
      rating: 4.6,
      organic: true
    },
    {
      id: "11",
      name: "Nho ngọt",
      price: 5.49 * usdToVnd,
      image: "images/products/grape.jpg",
      category: "fruits",
      tags: ["fresh", "fruit", "seasonal"],
      rating: 4.0
    },
    {
      id: "12",
      name: "Dưa chuột hữu cơ",
      price: 2.79 * usdToVnd,
      image: "images/products/cucumber.jpg",
      category: "vegetables",
      tags: ["organic", "fresh", "vegetable"],
      rating: 4.0,
      organic: true
    }
  ];
  localStorage.setItem("products", JSON.stringify(products));

  displayProducts(products);
}

function displayProducts(products) {
  const productContainer = document.getElementById("product-container");
  const productCountElement = document.getElementById("product-count");

  productContainer.innerHTML = "";

  if (productCountElement) {
    productCountElement.textContent = products.length;
  }

  products.forEach((product) => {
    const productHTML = `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}">
                ${product.sale ? '<div class="product-badge">Sale</div>' : ""}
                ${
                  product.organic
                    ? '<div class="product-badge organic">Organic</div>'
                    : ""
                }
                <div class="product-content">
                    <h3>${product.name}</h3>
                    <div class="rating">
                        ${getRatingStars(product.rating)}
                        <span>(${product.rating.toFixed(1)})</span>
                    </div>
                    <div class="price">
                        <span class="current">${product.price}</span>
                        ${
                          product.originalPrice
                            ? `<span class="original">${product.originalPrice}</span>`
                            : ""
                        }
                        <span class="unit">/ Sản phẩm</span>
                    </div>
                    <div class="product-buttons">
                        <button class="add-to-cart" data-id="${
                          product.id
                        }" data-name="${product.name}" data-price="${
      product.price
    }" data-image="${product.image}">Thêm vào giỏ hàng</button>
                        <a href="product-detail.html?id=${
                          product.id
                        }" class="view-details">Xem chi tiết</a>
                    </div>
                </div>
            </div>
        `;

    productContainer.innerHTML += productHTML;
  });

  // Add event listeners to the "Add to Cart" buttons
  const addToCartButtons = productContainer.querySelectorAll(".add-to-cart");
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", addToCart);
  });
}

function getRatingStars(rating) {
  let starsHTML = "";

  for (let i = 1; i <= Math.floor(rating); i++) {
    starsHTML += '<i class="fas fa-star"></i>';
  }

  if (rating % 1 >= 0.5) {
    starsHTML += '<i class="fas fa-star-half-alt"></i>';
  }

  for (let i = Math.ceil(rating); i < 5; i++) {
    starsHTML += '<i class="far fa-star"></i>';
  }

  return starsHTML;
}

function filterProductsByCategory(category) {
  const products = JSON.parse(localStorage.getItem("products")) || [];

  let filteredProducts;

  if (category === "all") {
    filteredProducts = products;
  } else {
    filteredProducts = products.filter(
      (product) => product.category === category
    );
  }

  displayProducts(filteredProducts);
}

function filterProductsByPrice(maxPrice) {
  const products = JSON.parse(localStorage.getItem("products")) || [];

  const filteredProducts = products.filter(
    (product) => product.price <= maxPrice
  );

  displayProducts(filteredProducts);
}

function filterProductsByTags() {
  const products = JSON.parse(localStorage.getItem("products")) || [];
  const activeTags = Array.from(
    document.querySelectorAll(".tag-filter.active")
  ).map((tag) => tag.getAttribute("data-tag"));

  if (activeTags.length === 0) {
    displayProducts(products);
    return;
  }

  const filteredProducts = products.filter((product) => {
    return activeTags.some((tag) => product.tags.includes(tag));
  });

  displayProducts(filteredProducts);
}

function sortProducts(sortBy) {
  const products = JSON.parse(localStorage.getItem("products")) || [];

  const sortedProducts = [...products];

  switch (sortBy) {
    case "price-low":
      sortedProducts.sort((a, b) => a.price - b.price);
      break;
    case "price-high":
      sortedProducts.sort((a, b) => b.price - a.price);
      break;
    case "name-asc":
      sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "name-desc":
      sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
      break;
    default:
      sortedProducts.sort((a, b) => a.id - b.id);
  }

  displayProducts(sortedProducts);
}

function loadPage(page) {
  showToast(`Loading page ${page}...`, "info");
}

// ==================== PRODUCT DETAIL ====================

function initProductDetailPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  if (productId && document.querySelector(".product-detail")) {
    loadProductDetails(productId);
  }

  const minusButton = document.getElementById("quantity-minus");
  const plusButton = document.getElementById("quantity-plus");
  const quantityInput = document.getElementById("product-quantity");

  if (minusButton && plusButton && quantityInput) {
    minusButton.addEventListener("click", () => {
      const quantity = Number.parseInt(quantityInput.value);
      if (quantity > 1) {
        quantityInput.value = quantity - 1;
      }
    });

    plusButton.addEventListener("click", () => {
      const quantity = Number.parseInt(quantityInput.value);
      quantityInput.value = quantity + 1;
    });

    quantityInput.addEventListener("change", function () {
      if (this.value < 1) {
        this.value = 1;
      }
    });
  }

  const thumbnails = document.querySelectorAll(".thumbnail");
  const mainImage = document.getElementById("main-product-image");

  if (thumbnails.length > 0 && mainImage) {
    thumbnails.forEach((thumbnail) => {
      thumbnail.addEventListener("click", function () {
        thumbnails.forEach((t) => t.classList.remove("active"));

        this.classList.add("active");

        const imageSrc = this.getAttribute("data-image");
        mainImage.src = imageSrc;
      });
    });
  }

  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabPanes = document.querySelectorAll(".tab-pane");

  if (tabButtons.length > 0 && tabPanes.length > 0) {
    tabButtons.forEach((button) => {
      button.addEventListener("click", function () {
        tabButtons.forEach((b) => b.classList.remove("active"));
        tabPanes.forEach((p) => p.classList.remove("active"));

        this.classList.add("active");

        const tabId = this.getAttribute("data-tab");
        document.getElementById(tabId).classList.add("active");
      });
    });
  }

  const ratingStars = document.querySelectorAll(".rating-select i");

  if (ratingStars.length > 0) {
    ratingStars.forEach((star) => {
      star.addEventListener("click", function () {
        const rating = Number.parseInt(this.getAttribute("data-rating"));

        ratingStars.forEach((s, index) => {
          if (index < rating) {
            s.className = "fas fa-star active";
          } else {
            s.className = "far fa-star";
          }
        });
      });

      star.addEventListener("mouseover", function () {
        const rating = Number.parseInt(this.getAttribute("data-rating"));

        ratingStars.forEach((s, index) => {
          if (index < rating) {
            s.className = "fas fa-star";
          } else {
            s.className = "far fa-star";
          }
        });
      });

      star.addEventListener("mouseout", () => {
        const selectedRating = document.querySelector(
          ".rating-select i.active"
        );
        const rating = selectedRating
          ? Number.parseInt(selectedRating.getAttribute("data-rating"))
          : 0;

        ratingStars.forEach((s, index) => {
          if (index < rating) {
            s.className = "fas fa-star active";
          } else {
            s.className = "far fa-star";
          }
        });
      });
    });
  }

  const reviewForm = document.getElementById("review-form");

  if (reviewForm) {
    reviewForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("review-name").value;
      const email = document.getElementById("review-email").value;
      const content = document.getElementById("review-content").value;
      const selectedRating = document.querySelector(".rating-select i.active");
      const rating = selectedRating
        ? Number.parseInt(selectedRating.getAttribute("data-rating"))
        : 0;

      if (rating === 0) {
        showToast("Please select a rating!", "error");
        return;
      }

      showToast("Thank you for your review!", "success");

      reviewForm.reset();
      ratingStars.forEach((s) => (s.className = "far fa-star"));
    });
  }
}

function loadProductDetails(productId) {
  const usdToVnd = 23500;
  const products = [
    {
      id: "1",
      name: "Táo sạch",
      price: 4.99 * usdToVnd,
      image: "images/products/apple.jpg",
      category: "fruits",
      tags: ["organic", "fresh", "fruit"],
      rating: 4.5,
      sale: true,
      originalPrice: 6.99 * usdToVnd
    },
    {
      id: "2",
      name: "Bông cải xanh hưu cơ",
      price: 3.49 * usdToVnd,
      image: "images/products/broccoli.jpg",
      category: "vegetables",
      tags: ["organic", "fresh", "vegetable"],
      rating: 5.0,
      organic: true
    },
    {
      id: "3",
      name: "Dâu tây tươi",
      price: 5.99 * usdToVnd,
      image: "images/products/strawberry.jpg",
      category: "fruits",
      tags: ["fresh", "fruit", "seasonal"],
      rating: 4.0
    },
    {
      id: "4",
      name: "Cà rốt hữu cơ",
      price: 2.99 * usdToVnd,
      image: "images/products/carrot.jpg",
      category: "vegetables",
      tags: ["organic", "fresh", "vegetable"],
      rating: 4.7,
      organic: true
    },
    {
      id: "5",
      name: "Chuối chín",
      price: 1.99 * usdToVnd,
      image: "images/products/banana.jpg",
      category: "fruits",
      tags: ["fresh", "fruit"],
      rating: 4.0
    },
    {
      id: "6",
      name: "Rau chân vịt hữu cơ",
      price: 3.29 * usdToVnd,
      image: "images/products/spinach.jpg",
      category: "vegetables",
      tags: ["organic", "fresh", "vegetable", "leafy"],
      rating: 5.0,
      organic: true
    },
    {
      id: "7",
      name: "Cam mọng nước",
      price: 4.49 * usdToVnd,
      image: "images/products/orange.jpg",
      category: "fruits",
      tags: ["fresh", "fruit", "citrus"],
      rating: 4.5
    },
    {
      id: "8",
      name: "Cà chua hữu cơ",
      price: 3.99 * usdToVnd,
      image: "images/products/tomato.jpg",
      category: "vegetables",
      tags: ["organic", "fresh", "vegetable"],
      rating: 4.0,
      organic: true
    },
    {
      id: "9",
      name: "Bơ chín",
      price: 6.99 * usdToVnd,
      image: "images/products/avocado.jpg",
      category: "fruits",
      tags: ["fresh", "fruit", "healthy"],
      rating: 5.0
    },
    {
      id: "10",
      name: "Ớt chuông hữu cơ",
      price: 4.29 * usdToVnd,
      image: "images/products/bell-pepper.jpg",
      category: "vegetables",
      tags: ["organic", "fresh", "vegetable"],
      rating: 4.6,
      organic: true
    },
    {
      id: "11",
      name: "Nho ngọt",
      price: 5.49 * usdToVnd,
      image: "images/products/grape.jpg",
      category: "fruits",
      tags: ["fresh", "fruit", "seasonal"],
      rating: 4.0
    },
    {
      id: "12",
      name: "Dưa chuột hữu cơ",
      price: 2.79 * usdToVnd,
      image: "images/products/cucumber.jpg",
      category: "vegetables",
      tags: ["organic", "fresh", "vegetable"],
      rating: 4.0,
      organic: true
    }
  ];

  const product = products.find((p) => p.id === productId);

  if (!product) {
    showToast("Product not found!", "error");
    return;
  }

  const productTitle = document.querySelector(".product-detail h1");
  const productPrice = document.querySelector(".product-price .current-price");
  const productDescription = document.querySelector(".product-description");
  const mainImage = document.getElementById("main-product-image");
  const addToCartButton = document.getElementById("add-to-cart-detail");
  const breadcrumbProductName = document.querySelector(".breadcrumb span");

  if (productTitle) productTitle.textContent = product.name;
  if (productPrice) productPrice.textContent = `${product.price.toFixed(2)}`;
  if (productDescription && product.description) {
    productDescription.innerHTML = `<p>${product.description}</p>`;
  }
  if (mainImage) mainImage.src = product.image;
  if (breadcrumbProductName) breadcrumbProductName.textContent = product.name;

  if (addToCartButton) {
    addToCartButton.setAttribute("data-id", product.id);
    addToCartButton.setAttribute("data-name", product.name);
    addToCartButton.setAttribute("data-price", product.price);
    addToCartButton.setAttribute("data-image", product.image.split("/").pop());
  }

  document.title = `${product.name} - Green Garden`;
}

// ==================== CHECKOUT PAGE ====================

function initCheckoutPage() {
  displayCheckoutItems();

  const checkoutCouponBtn = document.getElementById("checkout-coupon-btn");
  const couponFormContainer = document.getElementById("coupon-form-container");

  if (checkoutCouponBtn && couponFormContainer) {
    checkoutCouponBtn.addEventListener("click", (e) => {
      e.preventDefault();
      couponFormContainer.style.display =
        couponFormContainer.style.display === "block" ? "none" : "block";
    });
  }

  const checkoutApplyCoupon = document.getElementById("checkout-apply-coupon");

  if (checkoutApplyCoupon) {
    checkoutApplyCoupon.addEventListener("click", () => {
      const couponCode = document
        .getElementById("checkout-coupon-code")
        .value.trim();

      if (couponCode === "") {
        showToast("Please enter a coupon code!", "error");
        return;
      }

      showToast("Coupon applied successfully!", "success");

      displayCheckoutItems();
    });
  }

  const createAccountCheckbox = document.getElementById("create-account");
  const accountFields = document.getElementById("account-fields");

  if (createAccountCheckbox && accountFields) {
    createAccountCheckbox.addEventListener("change", function () {
      accountFields.style.display = this.checked ? "block" : "none";
    });
  }

  const shipDifferentCheckbox = document.getElementById(
    "ship-different-address"
  );
  const shippingFields = document.getElementById("shipping-fields");

  if (shipDifferentCheckbox && shippingFields) {
    shipDifferentCheckbox.addEventListener("change", function () {
      shippingFields.style.display = this.checked ? "block" : "none";
    });
  }

  const paymentMethods = document.querySelectorAll(
    'input[name="payment-method"]'
  );
  const cardFields = document.querySelector(".card-fields");

  if (paymentMethods.length > 0 && cardFields) {
    paymentMethods.forEach((method) => {
      method.addEventListener("change", function () {
        if (this.value === "card") {
          cardFields.style.display = "block";
        } else {
          cardFields.style.display = "none";
        }
      });
    });
  }

  const placeOrderButton = document.getElementById("place-order");
  const checkoutForm = document.getElementById("checkout-form");
  const orderComplete = document.getElementById("order-complete");
  const checkoutSection = document.querySelector(".checkout-section");

  if (placeOrderButton && checkoutForm && orderComplete && checkoutSection) {
    placeOrderButton.addEventListener("click", (e) => {
      e.preventDefault();

      if (!validateCheckoutForm()) {
        return;
      }

      checkoutSection.style.display = "none";
      orderComplete.style.display = "block";

      const orderNumber = Math.floor(Math.random() * 10000) + 10000;
      document.getElementById("order-number").textContent = orderNumber;

      const today = new Date();
      const options = { year: "numeric", month: "long", day: "numeric" };
      document.getElementById("order-date").textContent =
        today.toLocaleDateString("en-US", options);

      const total = document.getElementById("checkout-total").textContent;
      document.getElementById("order-total-display").textContent = total;

      const paymentMethod = document.querySelector(
        'input[name="payment-method"]:checked'
      ).value;
      let paymentMethodText = "";

      switch (paymentMethod) {
        case "bank":
          paymentMethodText = "Direct Bank Transfer";
          break;
        case "check":
          paymentMethodText = "Check Payments";
          break;
        case "cash":
          paymentMethodText = "Cash on Delivery";
          break;
        case "card":
          paymentMethodText = "Credit Card / Debit Card";
          break;
      }

      document.getElementById("order-payment-method").textContent =
        paymentMethodText;

      localStorage.removeItem("cart");
      updateCartCount();
    });
  }
}

function displayCheckoutItems() {
  const checkoutItemsContainer = document.getElementById("checkout-items");
  const checkoutSubtotalElement = document.getElementById("checkout-subtotal");
  const checkoutShippingElement = document.getElementById("checkout-shipping");
  const checkoutDiscountElement = document.getElementById("checkout-discount");
  const checkoutTotalElement = document.getElementById("checkout-total");

  if (!checkoutItemsContainer) return;

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  checkoutItemsContainer.innerHTML = "";

  let subtotal = 0;

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    const checkoutItemHTML = `
            <tr>
                <td>${item.name} <strong>× ${item.quantity}</strong></td>
                <td>${itemTotal}</td>
            </tr>
        `;

    checkoutItemsContainer.innerHTML += checkoutItemHTML;
  });

  const discount = 0;

  const shippingMethod = document.querySelector(
    'input[name="shipping"]:checked'
  );
  const shipping = shippingMethod ? Number.parseFloat(shippingMethod.value) : 0;

  const total = subtotal + shipping - discount;

  checkoutSubtotalElement.textContent = `${subtotal}`;
  checkoutShippingElement.textContent = `${shipping}`;
  checkoutDiscountElement.textContent = `${discount}`;
  checkoutTotalElement.textContent = `${total}`;
}

function validateCheckoutForm() {
  const requiredFields = document.querySelectorAll(
    "#checkout-form input[required], #checkout-form select[required]"
  );
  let isValid = true;

  requiredFields.forEach((field) => {
    if (field.value.trim() === "") {
      field.classList.add("error");
      isValid = false;
    } else {
      field.classList.remove("error");
    }
  });

  const termsCheckbox = document.getElementById("terms-agree");

  if (termsCheckbox && !termsCheckbox.checked) {
    termsCheckbox.classList.add("error");
    isValid = false;
  } else if (termsCheckbox) {
    termsCheckbox.classList.remove("error");
  }

  const createAccountCheckbox = document.getElementById("create-account");
  const accountPassword = document.getElementById("account-password");

  if (
    createAccountCheckbox &&
    createAccountCheckbox.checked &&
    accountPassword &&
    accountPassword.value.trim() === ""
  ) {
    accountPassword.classList.add("error");
    isValid = false;
  } else if (accountPassword) {
    accountPassword.classList.remove("error");
  }

  const shipDifferentCheckbox = document.getElementById(
    "ship-different-address"
  );

  if (shipDifferentCheckbox && shipDifferentCheckbox.checked) {
    const shippingRequiredFields = document.querySelectorAll(
      "#shipping-fields input[required], #shipping-fields select[required]"
    );

    shippingRequiredFields.forEach((field) => {
      if (field.value.trim() === "") {
        field.classList.add("error");
        isValid = false;
      } else {
        field.classList.remove("error");
      }
    });
  }

  const cardPaymentRadio = document.getElementById("payment-card");

  if (cardPaymentRadio && cardPaymentRadio.checked) {
    const cardNumber = document.getElementById("card-number");
    const cardExpiry = document.getElementById("card-expiry");
    const cardCVC = document.getElementById("card-cvc");

    if (cardNumber && cardNumber.value.trim() === "") {
      cardNumber.classList.add("error");
      isValid = false;
    } else if (cardNumber) {
      cardNumber.classList.remove("error");
    }

    if (cardExpiry && cardExpiry.value.trim() === "") {
      cardExpiry.classList.add("error");
      isValid = false;
    } else if (cardExpiry) {
      cardExpiry.classList.remove("error");
    }

    if (cardCVC && cardCVC.value.trim() === "") {
      cardCVC.classList.add("error");
      isValid = false;
    } else if (cardCVC) {
      cardCVC.classList.remove("error");
    }
  }

  if (!isValid) {
    showToast("Please fill in all required fields!", "error");
  }

  return isValid;
}

// ==================== MODAL FUNCTIONS ====================

function initModals() {
  const loginModal = document.getElementById("login-modal");
  const registerModal = document.getElementById("register-modal");

  const loginBtn = document.getElementById("login-btn");
  const registerBtn = document.getElementById("register-btn");
  const checkoutLoginBtn = document.getElementById("checkout-login-btn");

  const closeButtons = document.querySelectorAll(".close-modal");

  const showRegisterLink = document.getElementById("show-register");
  const showLoginLink = document.getElementById("show-login");

  if (loginBtn && loginModal) {
    loginBtn.addEventListener("click", (e) => {
      e.preventDefault();
      loginModal.style.display = "flex";
    });
  }

  if (registerBtn && registerModal) {
    registerBtn.addEventListener("click", (e) => {
      e.preventDefault();
      registerModal.style.display = "flex";
    });
  }

  if (checkoutLoginBtn && loginModal) {
    checkoutLoginBtn.addEventListener("click", (e) => {
      e.preventDefault();
      loginModal.style.display = "flex";
    });
  }

  closeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (loginModal) loginModal.style.display = "none";
      if (registerModal) registerModal.style.display = "none";
    });
  });

  window.addEventListener("click", (event) => {
    if (event.target === loginModal) {
      loginModal.style.display = "none";
    }

    if (event.target === registerModal) {
      registerModal.style.display = "none";
    }
  });

  if (showRegisterLink && registerModal && loginModal) {
    showRegisterLink.addEventListener("click", (e) => {
      e.preventDefault();
      loginModal.style.display = "none";
      registerModal.style.display = "flex";
    });
  }

  if (showLoginLink && loginModal && registerModal) {
    showLoginLink.addEventListener("click", (e) => {
      e.preventDefault();
      registerModal.style.display = "none";
      loginModal.style.display = "flex";
    });
  }

  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = document.getElementById("login-email").value;
      const password = document.getElementById("login-password").value;

      showToast("Login successful!", "success");

      if (loginModal) loginModal.style.display = "none";
    });
  }

  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("register-name").value;
      const email = document.getElementById("register-email").value;
      const password = document.getElementById("register-password").value;
      const confirmPassword = document.getElementById(
        "register-confirm-password"
      ).value;

      if (password !== confirmPassword) {
        showToast("Passwords do not match!", "error");
        return;
      }

      showToast("Registration successful!", "success");

      if (registerModal) registerModal.style.display = "none";
    });
  }
}

// ==================== TESTIMONIAL SLIDER ====================

function initTestimonialSlider() {
  const testimonialCards = document.querySelectorAll(".testimonial-card");
  const dots = document.querySelectorAll(".testimonial-dots .dot");

  if (testimonialCards.length === 0 || dots.length === 0) return;

  dots.forEach((dot, index) => {
    dot.addEventListener("click", function () {
      testimonialCards.forEach((card) => {
        card.classList.remove("active");
      });

      dots.forEach((d) => {
        d.classList.remove("active");
      });

      testimonialCards[index].classList.add("active");

      this.classList.add("active");
    });
  });

  let currentIndex = 0;

  function rotateTestimonials() {
    testimonialCards.forEach((card) => {
      card.classList.remove("active");
    });

    dots.forEach((d) => {
      d.classList.remove("active");
    });

    currentIndex = (currentIndex + 1) % testimonialCards.length;

    testimonialCards[currentIndex].classList.add("active");

    dots[currentIndex].classList.add("active");
  }

  setInterval(rotateTestimonials, 5000);
}

// ==================== MOBILE MENU ====================

function initMobileMenu() {
  const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
  const mainMenu = document.querySelector(".main-menu");

  if (!mobileMenuToggle || !mainMenu) return;

  mobileMenuToggle.addEventListener("click", () => {
    mainMenu.classList.toggle("active");
  });

  document.addEventListener("click", (event) => {
    if (
      !event.target.closest(".main-header") &&
      mainMenu.classList.contains("active")
    ) {
      mainMenu.classList.remove("active");
    }
  });

  const dropdowns = document.querySelectorAll(".dropdown");

  dropdowns.forEach((dropdown) => {
    const link = dropdown.querySelector("a");

    link.addEventListener("click", (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        dropdown.classList.toggle("active");
      }
    });
  });
}

// ==================== NEWSLETTER FORM ====================

function initNewsletterForm() {
  const newsletterForm = document.getElementById("newsletter-form");
  const newsletterMessage = document.getElementById("newsletter-message");

  if (!newsletterForm || !newsletterMessage) return;

  newsletterForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("newsletter-email").value;

    newsletterMessage.innerHTML =
      "Thank you for subscribing to our newsletter!";
    newsletterMessage.style.color = "white";

    newsletterForm.reset();
  });
}

// ==================== UTILITY FUNCTIONS ====================

function showToast(message, type = "info") {
  let toast = document.getElementById("toast");

  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    document.body.appendChild(toast);

    toast.style.position = "fixed";
    toast.style.bottom = "20px";
    toast.style.right = "20px";
    toast.style.padding = "10px 20px";
    toast.style.borderRadius = "4px";
    toast.style.color = "white";
    toast.style.zIndex = "9999";
    toast.style.transition = "opacity 0.3s ease";
  }

  switch (type) {
    case "success":
      toast.style.backgroundColor = "#4CAF50";
      break;
    case "error":
      toast.style.backgroundColor = "#F44336";
      break;
    case "warning":
      toast.style.backgroundColor = "#FFC107";
      toast.style.color = "#333";
      break;
    default:
      toast.style.backgroundColor = "#2196F3";
  }

  toast.textContent = message;

  toast.style.opacity = "1";

  setTimeout(() => {
    toast.style.opacity = "0";
  }, 3000);
}
