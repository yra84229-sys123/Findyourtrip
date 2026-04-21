// DOM Elements
const provincesGrid = document.getElementById('provinces-grid');
const placesGrid = document.getElementById('places-grid');
const detailHeader = document.getElementById('detail-header');
const detailProvinceName = document.getElementById('detail-province-name');
const searchInput = document.getElementById('search-input');

// Initialize Application based on current page
function init() {
    const path = window.location.pathname;
    
    if (path.includes('place.html')) {
        initPlacePage();
    } else if (path.includes('province.html')) {
        initProvincePage();
    } else {
        initHomePage();
    }
}

// ==========================================
// Home Page Logic
// ==========================================
function initHomePage() {
    if (!provincesGrid) return; // safety check
    
    // Initial render of all provinces
    renderProvinces(provincesData);
    
    // Setup search functionality
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            const filteredProvinces = provincesData.filter(province => 
                province.name.toLowerCase().includes(searchTerm) || 
                province.khmerName.includes(searchTerm) ||
                (province.tagline && province.tagline.toLowerCase().includes(searchTerm))
            );
            renderProvinces(filteredProvinces);
        });
    }
}

// Helper function to render the grid
function renderProvinces(provinces) {
    provincesGrid.innerHTML = '';
    
    if (provinces.length === 0) {
        provincesGrid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; color: var(--text-khmer); font-size: 1.2rem; padding: 40px;">No provinces found matching your search.</div>';
        return;
    }
    
    provinces.forEach(province => {
        const card = document.createElement('div');
        card.className = 'province-card';
        
        card.innerHTML = `
            <div class="card-img-container">
                <img src="${province.coverImg}" alt="${province.name}" class="card-img" loading="lazy">
                <div class="card-overlay">
                    <div class="card-pin">
                        <i class="fa-solid fa-location-dot"></i>
                        <span>Cambodia</span>
                    </div>
                    <h3 class="card-title">${province.name}</h3>
                    <h4 class="card-khmer-title">${province.khmerName}</h4>
                    <p class="card-subtitle">${province.tagline}</p>
                </div>
            </div>
            <div class="card-footer">
                5 Famous Places
            </div>
        `;
        
        // Link to province page with URL parameter
        card.addEventListener('click', () => {
            window.location.href = `province.html?id=${province.id}`;
        });
        
        provincesGrid.appendChild(card);
    });
}

// ==========================================
// Province Details Page Logic
// ==========================================
function initProvincePage() {
    if (!placesGrid || !detailHeader || !detailProvinceName) return; // safety check
    
    // Get Province ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const provinceId = urlParams.get('id');
    
    // Find province data
    const province = provincesData.find(p => p.id === provinceId);
    
    if (province) {
        renderProvinceDetails(province);
    } else {
        // Handle invalid ID (redirect home or show error)
        detailProvinceName.textContent = "Province Not Found";
        detailHeader.style.backgroundImage = `url('https://images.unsplash.com/photo-1600208152220-33af9ba1a0c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')`;
    }
}

function renderProvinceDetails(province) {
    // Set Document Title
    document.title = `${province.name} - Find Your Trip`;
    
    // Set Header Info
    detailHeader.style.backgroundImage = `url('${province.detailImg}')`;
    
    // Create dual language title
    detailProvinceName.innerHTML = `${province.name} <br><span style="font-size: 0.6em; font-weight: normal; font-family: 'Kantumruy Pro', sans-serif;">${province.khmerName}</span>`;
    
    // Render Map
    const mapContainer = document.getElementById('province-map-container');
    if (mapContainer) {
        const encodedName = encodeURIComponent(`${province.name} Province Cambodia`);
        mapContainer.innerHTML = `<iframe 
            width="100%" 
            height="400" 
            style="border:0; border-radius: 20px; box-shadow: var(--shadow-sm);" 
            loading="lazy" 
            allowfullscreen 
            src="https://maps.google.com/maps?q=${encodedName}&t=&z=9&ie=UTF8&iwloc=&output=embed">
        </iframe>`;
    }
    
    // Render Places
    placesGrid.innerHTML = '';
    
    province.places.forEach((place, index) => {
        const card = document.createElement('div');
        card.className = 'place-card';
        card.style.cursor = 'pointer'; // Make it look clickable
        
        card.innerHTML = `
            <div class="place-img-wrapper">
                <span class="place-number">${index + 1}</span>
                <img src="${place.img}" alt="${place.name}" class="place-img" loading="lazy">
            </div>
            <div class="place-info">
                <h3 class="place-title">${place.name}</h3>
                <p class="place-desc">${place.desc}</p>
            </div>
        `;
        
        // Link to single place detail page
        card.addEventListener('click', () => {
            window.location.href = `place.html?pid=${province.id}&id=${place.id}`;
        });
        
        placesGrid.appendChild(card);
    });
}

// ==========================================
// Single Place Details Page Logic
// ==========================================
function initPlacePage() {
    // Get IDs from URL
    const urlParams = new URLSearchParams(window.location.search);
    const provinceId = urlParams.get('pid');
    const placeId = urlParams.get('id');
    
    // Find data
    const province = provincesData.find(p => p.id === provinceId);
    if (!province) return;
    
    const place = province.places.find(p => p.id === placeId);
    if (!place) return;
    
    renderPlaceDetails(province, place);
}

function renderPlaceDetails(province, place) {
    // Set Document Title
    document.title = `${place.name} - Find Your Trip`;
    
    // DOM Elements specific to place.html
    document.getElementById('place-hero').querySelector('.place-hero-bg').style.backgroundImage = `url('${place.img}')`;
    
    // Breadcrumb / Back button
    const backBtn = document.getElementById('back-to-province');
    backBtn.href = `province.html?id=${province.id}`;
    document.getElementById('back-province-name').textContent = province.name;
    
    // Labels & Titles
    document.getElementById('place-province-label').textContent = `${province.name} • ${province.khmerName}`;
    document.getElementById('place-name').textContent = place.name;
    document.getElementById('place-khmer-name').textContent = place.khmerName;
    document.getElementById('place-short-desc').textContent = place.desc;
    
    // Long Description / History
    document.getElementById('place-history').textContent = place.history;
}

// Run app when DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);
