import items from './items.js';
import meals from './meals.js';

//filter items
document.addEventListener("DOMContentLoaded", function () {
    renderCards(items, meals);


    const filterSelect = document.getElementById("filter");
    filterSelect.addEventListener("change", changeCategory);
});


//cards for items
function createCard(item) {
    const cardContainer = document.getElementById("card-container");

    const card = document.createElement("div");
    const btn = document.createElement ("button");

    btn.innerHTML = "Add to cart";

    const quantitySelect = document.createElement("select"); // dropdown for selecting quantity

    quantitySelect.innerHTML = createQuantity(); // gives quantity options

    btn.addEventListener("click", function () {
        const selectedQuantity = +quantitySelect.value;
        addToCart(item, selectedQuantity);
    });

    card.className = "card";
    card.innerHTML = `
        <img src="${item.imageUrl}" alt="${item.imageUrl}">
        <h2>${item.name}</h2>
        <p>Price: &#x20B9;${item.price}</p>
        <label for="quantity${item.id}">Quantity:</label>

    `;
    card.appendChild(quantitySelect);
    card.appendChild(btn);
    cardContainer.appendChild(card);
}

function createQuantity() {
    let options = '';
    for (let i = 1; i <= 9; i++) {
        options += `<option value="${i}">${i}</option>`;
    }
    return options;
}


//renders the items to cards
function renderCards(items, meals) {
    const cardContainer = document.getElementById("card-container");
    cardContainer.innerHTML = "";

    for (const item of items) {
        createCard(item);
    }

    for (const Meals of meals) {
        createCard(Meals, true); // Pass true to indicate that it's a meal
    }
}

//change category
const filterSelect = document.getElementById("filter");
filterSelect.addEventListener("change", changeCategory);

function changeCategory() {
    const selectedCategory = filterSelect.value;
    const selectedType = filterSelect.value;

    const filteredItems = filterItems(items, selectedCategory, selectedType);
    const filteredMeals = filterItems(meals, selectedCategory, selectedType);

    renderCards(filteredItems, filteredMeals);
}

//filter item on the basis of category and type
function filterItems(items, category, type) {
    if (category === "option1") {
        return items;
    } else if (type === "veg") {
        return items.filter((item) => item.type.toLowerCase() === type.toLowerCase());
    } else if (type === "nonveg") {
        return items.filter((item) => item.type.toLowerCase() === type.toLowerCase());
    } else {
        return items.filter((item) => item.category.toLowerCase() === category.toLowerCase());
    }
}


//items that is selected should be maintained in an array
let cart = []; // Initialize an empty cart
function addToCart(item, quantity) {
    try {
        // const id = parseInt(item.target.parentElement.parentElement.id);
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItemIndex = cart.findIndex(cartItem => cartItem.id === item.id);
        // if (cart === null ) cart=[];
        // for(let item of allitems){
        //     if(item.id === id){
        //         const checkcart = existInCart(cart,id)
        //         if(checkcart)
        //         break;
        //     item.itemCount =itemCount;
        //     cart.push(item);
        //     }
        // }
        if (existingItemIndex !== -1) {
            // If the item exists in the cart, update the quantity by setting it
            cart[existingItemIndex].quantity += parseInt(quantity);
        } else {
            // If the item doesn't exist in the cart, add it with the specified quantity
            const newItem={
                id: item.id,
                name: item.name,
                price: item.price,
                category: item.category,
                quatity:parseInt(quantity)
            };
            cart.push(newItem);
        }

        localStorage.setItem('cart', JSON.stringify(cart))

        displayCartItems();

        console.log(`${quantity} ${item.name} added to cart`);
     } catch (error) {
            console.error('Error in addToCart:', error);
        }

}

document.addEventListener("DOMContentLoaded", function () {


    const goToCartButton = document.getElementById("cart");
    if (goToCartButton) {
        goToCartButton.addEventListener("click", function (event) {
            // event.preventDefault(); // Prevent the default behavior of the anchor tag
            window.location.href = "cart.html";
        });
    }
});


//search logic
document.addEventListener("DOMContentLoaded", function () {
    renderCards(items, meals);

    const searchInput = document.getElementById("search");
    searchInput.addEventListener("input", function () {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredItems = items.filter((item) => item.name.toLowerCase().includes(searchTerm));
        const filteredMeals = meals.filter((meal) => meal.name.toLowerCase().includes(searchTerm));
        renderCards(filteredItems, filteredMeals);
    });
});




