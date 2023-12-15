import items from "./items";

let cartItems = [];

function checkForMealItem(id) {
    for (let items of cartItems) {
        if (items.id === id) {
            return true;
        } else if (items.category === "meal") {
            return true;
        }
    }
    return false;
}

function addCountToMeal(id, count) {
    for (let items of cartItems) {
        if (items.id === id) {
            items.itemCount = count;
            localStorage.setItem("cartItem", JSON.stringify(cartItems));
        }
    }
    return;
}

function existInCart(id, count) {
    for (let items of cartItems) {
        if (items.id === id) {
            items.itemCount += count;
            return true;
        }
    }
    return false;
}

function optimizeBill(prodArr) {
    let m = Number.MAX_VALUE;
    console.log(m);
    for (let items of cartItems) {
        for (let i of prodArr) {
            if (items.id === i) {
                m = Math.min(m, items.itemCount);
            }
        }
    }
    for (let i of prodArr) {
        subCount(i, m);
    }
    return m;
}

function checkForMeal(items, meals) {
    for (let items of meals) {
        const prodArr = items.products;
        let isPresent = false;
        for (let i of prodArr) {
            isPresent = checkForMealItem(i);
            if (!isPresent)
                break;
        }
        if (isPresent) {
            const mealCount = optimizeBill(prodArr);
            const checkExist = existInCart(items.id, mealCount);
            if (!checkExist) {
                cartItems.push(items);
                addCountToMeal(items.id, mealCount);
            }
        }
    }
    // Assuming displayCart is a function to update the cart display
    displayCart();
}

export { checkForMeal };

