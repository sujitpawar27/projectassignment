document.addEventListener('DOMContentLoaded', function () {
    // Retrieve user details from local storage
    const userDetails = JSON.parse(localStorage.getItem('userDetails')) || {};
      // Display user details
      const userDetailsElement = document.getElementById('userDetails');
      userDetailsElement.textContent = `Name: ${userDetails.name}, Email: ${userDetails.email}`;
      // Retrieve cart information from local storage
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      // Display each item in the order summary
      const orderItemsContainer = document.getElementById('orderItems');
      let totalPrice = 0;
      cart.forEach(item => {
          const itemElement = document.createElement('div');
          itemElement.textContent = `${item.name} - Rs.${item.price} x ${item.quantity}`;
          orderItemsContainer.appendChild(itemElement);
          // Calculate total price
          totalPrice += item.price * item.quantity;
      });


      // Display total price
      const totalPriceElement = document.getElementById('totalPrice');
      totalPriceElement.textContent = `Total Price: Rs.${totalPrice.toFixed(2)}`;
      // optimized total price and meals
      const { optimizedTotalPrice, optimizedMeals, individualItemsTotalPrice, finalTotalPrice } = calculateFinalBill(cart);
      // Display optimized total price
      const optimizedTotalPriceElement = document.getElementById('optimizedTotalPrice');
      optimizedTotalPriceElement.textContent = `Optimized Total Price: Rs.${optimizedTotalPrice.toFixed(2)}`;
      // Display optimized meals
      const optimizedMealsElement = document.getElementById('optimizedMeals');
      optimizedMealsElement.textContent = `Optimized Meals: ${optimizedMeals}`;
      // Display individual items total price
      const individualItemsTotalPriceElement = document.getElementById('individualItemsTotalPrice');
      individualItemsTotalPriceElement.textContent = `Individual Items Total Price: Rs.${individualItemsTotalPrice.toFixed(2)}`;
      // Display final total price
      const finalTotalPriceElement = document.getElementById('finalTotalPrice');
      finalTotalPriceElement.textContent = `Payable Bill: Rs.${finalTotalPrice.toFixed(2)}`;
  });


  
  function calculateFinalBill(cart) {
      // Retrieve meals information from session storage
      const meals = JSON.parse(sessionStorage.getItem('meals')) || [];
      // Create a map to store the count of each product in the cart
      const productCountMap = new Map();
      // Iterate through the items in the cart
      cart.forEach(item => {
          const count = productCountMap.get(item.id) || 0;
          productCountMap.set(item.id, count + item.quantity);
      });
      // Calculate the total price for optimized meals
      let optimizedTotalPrice = 0;
      // Find the optimized meals based on the product count
      const optimizedMeals = [];
      meals.forEach(meal => {
          // Find the minimum quantity available for each product required in the meal
          const minAvailableQuantity = Math.min(
              ...meal.products.map(productId => productCountMap.get(productId) || 0)
          );
          // Check if there is enough quantity to form the meal
          const canFormMeal = minAvailableQuantity >= 1;
          if (canFormMeal) {
              // Calculate the total price for the meal
              const mealTotalPrice = meal.price * minAvailableQuantity;
              // Increment the optimized total price
              optimizedTotalPrice += mealTotalPrice;
              // Update the count of products used in the meal
              meal.products.forEach(productId => {
                  const count = productCountMap.get(productId) || 0;
                  productCountMap.set(productId, count - minAvailableQuantity);
              });
              // Record information about the optimized meal
              optimizedMeals.push(`${meal.name} - Qty: ${minAvailableQuantity}`);
          }
      });
      // Calculate the total price for individual products not part of any meal
      let individualItemsTotalPrice = 0;
      cart.forEach(item => {
          const meal = meals.find(meal => meal.products.includes(item.id));
          if (!meal) {
              individualItemsTotalPrice += item.price * item.quantity;
          }
      });

      // Calculate the final total price
      const finalTotalPrice = optimizedTotalPrice + individualItemsTotalPrice;
      return {
          optimizedTotalPrice,
          optimizedMeals: optimizedMeals.join(', '),
          individualItemsTotalPrice,
          finalTotalPrice
      };
  }