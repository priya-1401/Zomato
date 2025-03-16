const API_BASE_URL = 'https://zomato-kmkrhjjj3-priya-dwaras-projects.vercel.app/api/restaurants';

// Fetch and display the restaurant list
async function loadRestaurants() {
  const listContainer = document.getElementById('restaurant-list');
  if (!listContainer) return;

  try {
    const response = await fetch(`${API_BASE_URL}?limit=20`);
    const restaurants = await response.json();

    listContainer.innerHTML = restaurants.map(restaurant => `
      <div class="restaurant-card">
        <h2>${restaurant['Restaurant Name']}</h2>
        <p><strong>City:</strong> ${restaurant.City}</p>
        <p><strong>Cuisines:</strong> ${restaurant.Cuisines}</p>
        <button onclick="viewDetails(${restaurant['Restaurant ID']})">View Details</button>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading restaurants:', error);
  }
}

// Fetch and display restaurant details
async function loadRestaurantDetails() {
  const detailsContainer = document.getElementById('restaurant-details');
  if (!detailsContainer) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  try {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    const restaurant = await response.json();

    detailsContainer.innerHTML = `
      <h2>${restaurant['Restaurant Name']}</h2>
      <p><strong>City:</strong> ${restaurant.City}</p>
      <p><strong>Address:</strong> ${restaurant.Address}</p>
      <p><strong>Locality:</strong> ${restaurant['Locality Verbose']}</p>
      <p><strong>Cuisines:</strong> ${restaurant.Cuisines}</p>
      <p><strong>Average Cost for Two:</strong> ${restaurant['Average Cost for two']} ${restaurant.Currency}</p>
      <p><strong>Has Table Booking:</strong> ${restaurant['Has Table booking']}</p>
      <p><strong>Has Online Delivery:</strong> ${restaurant['Has Online delivery']}</p>
      <p><strong>Is Delivering Now:</strong> ${restaurant['Is delivering now']}</p>
      <p><strong>Switch to Order Menu:</strong> ${restaurant['Switch to order menu']}</p>
      <p><strong>Price Range:</strong> ${restaurant['Price range']}</p>
      <p><strong>Rating:</strong> ${restaurant['Aggregate rating'] || 'N/A'} 
      (${restaurant['Rating text'] || 'No Reviews'})</p>
      <p><strong>Votes:</strong> ${restaurant.Votes}</p>
      <p><strong>Coordinates:</strong> Latitude ${restaurant.Latitude}, Longitude ${restaurant.Longitude}</p>
    `;
  } catch (error) {
    console.error('Error loading restaurant details:', error);
    detailsContainer.innerHTML = `<p>Error loading restaurant details. Please try again later.</p>`;
  }
}

// Navigate to restaurant detail page
function viewDetails(id) {
  window.location.href = `detail.html?id=${id}`;
}

// Navigate back to the restaurant list page
function goBack() {
  window.location.href = 'index.html';
}

// Load the appropriate content based on the page
if (document.getElementById('restaurant-list')) {
  loadRestaurants();
} else if (document.getElementById('restaurant-details')) {
  loadRestaurantDetails();
}
