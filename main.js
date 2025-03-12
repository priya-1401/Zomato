// Fetch restaurants and display on the list page
async function fetchRestaurants() {
    try {
      const response = await fetch('http://localhost:3000/api/restaurants?page=1&limit=10');
      const data = await response.json();
      const listContainer = document.getElementById('restaurant-list');
      if (listContainer) {
        listContainer.innerHTML = data.data.map(restaurant => `
          <div class="restaurant-item">
            <h2>${restaurant.name}</h2>
            <p>${restaurant.cuisine} | ${restaurant.address}</p>
            <button onclick="viewDetails('${restaurant._id}')">View Details</button>
          </div>
        `).join('');
      }
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    }
  }
  
  // Fetch restaurant details and display on the details page
  async function fetchRestaurantDetails() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    try {
      const response = await fetch(`http://localhost:3000/api/restaurants/${id}`);
      const restaurant = await response.json();
      const detailsContainer = document.getElementById('restaurant-details');
      if (detailsContainer) {
        detailsContainer.innerHTML = `
          <h2>${restaurant.name}</h2>
          <p><strong>Address:</strong> ${restaurant.address}</p>
          <p><strong>Cuisine:</strong> ${restaurant.cuisine}</p>
          <p><strong>Rating:</strong> ${restaurant.rating}/5</p>
          <p><strong>Price Range:</strong> ${restaurant.price_range}</p>
        `;
      }
    } catch (error) {
      console.error('Error fetching restaurant details:', error);
    }
  }
  
  // Navigate to details page
  function viewDetails(id) {
    window.location.href = `details.html?id=${id}`;
  }
  
  // Go back to the list page
  function goBack() {
    window.location.href = 'index.html';
  }
  
  // Load content based on the current page
  if (document.getElementById('restaurant-list')) {
    fetchRestaurants();
  } else if (document.getElementById('restaurant-details')) {
    fetchRestaurantDetails();
  }
  