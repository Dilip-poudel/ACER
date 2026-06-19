// js/app.js - UPDATED VERSION
import CokeAPI from './api-integrations.js';

class CocaColaApp {
    constructor() {
        this.api = new CokeAPI();
        this.init();
    }
    
    async init() {
        console.log('🥤 Coca-Cola App Initialized');
        
        // Add weather to all global location cards
        await this.addWeatherToLocations();
        
        // Add the global weather section
        await this.addGlobalWeatherSection();
        
        // Setup live counter
        this.setupLiveCounter();
    }
    
    // ==========================================
    // ADD WEATHER TO YOUR EXISTING CARDS
    // ==========================================
    async addWeatherToLocations() {
        // These coordinates match your location cards
        const locations = [
            { region: 'North America', city: 'Atlanta, Georgia', lat: 33.749, lon: -84.388, cardIndex: 0 },
            { region: 'Europe', city: 'Madrid, Spain', lat: 40.4168, lon: -3.7038, cardIndex: 1 },
            { region: 'Asia Pacific', city: 'Shanghai, China', lat: 31.2304, lon: 121.4737, cardIndex: 2 },
            { region: 'Latin America', city: 'Mexico City, Mexico', lat: 19.4326, lon: -99.1332, cardIndex: 3 },
            { region: 'Africa', city: 'Johannesburg, South Africa', lat: -26.2041, lon: 28.0473, cardIndex: 4 },
            { region: 'Oceania', city: 'Sydney, Australia', lat: -33.8688, lon: 151.2093, cardIndex: 5 }
        ];
        
        // Find all stat cards in your HTML
        const cards = document.querySelectorAll('.stat-card');
        
        // For each location, get weather and update the card
        for (let loc of locations) {
            const weather = await this.api.getWeather(loc.lat, loc.lon);
            const card = cards[loc.cardIndex];
            
            if (card && weather) {
                // Create weather badge
                const weatherBadge = document.createElement('div');
                weatherBadge.className = 'mt-2 inline-flex items-center gap-2 bg-coke-red/10 px-3 py-1 rounded-full';
                
                // Get emoji based on temperature
                const emoji = weather.temperature < 10 ? '❄️' : 
                             weather.temperature < 20 ? '⛅' : 
                             weather.temperature < 30 ? '🌤️' : '☀️';
                
                weatherBadge.innerHTML = `
                    <span class="text-xs font-semibold text-coke-red">
                        ${emoji} ${weather.temperature}°C
                    </span>
                    <span class="text-[10px] text-coke-dark/40">| 💨 ${weather.windspeed} km/h</span>
                `;
                
                // Find where to insert it (after the employee stats)
                const employeeDiv = card.querySelector('.mt-3');
                if (employeeDiv) {
                    employeeDiv.after(weatherBadge);
                }
            }
        }
    }
    
    // ==========================================
    // ADD A NEW WEATHER SECTION
    // ==========================================
    async addGlobalWeatherSection() {
        const locations = [
            { name: '🏛️ Atlanta', lat: 33.749, lon: -84.388 },
            { name: '🇪🇸 Madrid', lat: 40.4168, lon: -3.7038 },
            { name: '🇨🇳 Shanghai', lat: 31.2304, lon: 121.4737 },
            { name: '🇲🇽 Mexico City', lat: 19.4326, lon: -99.1332 },
            { name: '🇿🇦 Johannesburg', lat: -26.2041, lon: 28.0473 },
            { name: '🇦🇺 Sydney', lat: -33.8688, lon: 151.2093 }
        ];
        
        // Create a new section (this gets added to your page automatically)
        const section = document.createElement('section');
        section.className = 'py-12 bg-gradient-to-b from-coke-cream to-white';
        section.innerHTML = `
            <div class="max-w-7xl mx-auto px-6">
                <div class="text-center mb-8">
                    <span class="text-xs font-semibold tracking-[0.3em] text-coke-red uppercase">Live Weather</span>
                    <h3 class="font-inter font-black text-3xl mt-2">🌍 Global Weather <span class="text-coke-red">Now</span></h3>
                </div>
                <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4" id="globalWeatherGrid">
                    ${locations.map(loc => `
                        <div class="bg-white rounded-2xl p-4 shadow-sm text-center border border-coke-red/5 hover:shadow-md transition-shadow" data-city="${loc.name}">
                            <div class="text-2xl mb-1">${loc.name.split(' ')[0]}</div>
                            <div class="text-xs text-coke-dark/50">${loc.name.split(' ').slice(1).join(' ')}</div>
                            <div class="mt-2 font-bold text-coke-red loading-weather">⏳ Loading...</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        // Insert the new section after your global section
        const globalSection = document.querySelector('#global');
        if (globalSection) {
            globalSection.parentNode.insertBefore(section, globalSection.nextSibling);
        }
        
        // Fill in the weather data
        const weatherCards = document.querySelectorAll('[data-city]');
        for (let i = 0; i < locations.length; i++) {
            const weather = await this.api.getWeather(locations[i].lat, locations[i].lon);
            const card = weatherCards[i];
            if (card && weather) {
                const tempDisplay = card.querySelector('.loading-weather');
                const emoji = weather.temperature < 10 ? '❄️' : 
                             weather.temperature < 20 ? '⛅' : 
                             weather.temperature < 30 ? '🌤️' : '☀️';
                if (tempDisplay) {
                    tempDisplay.textContent = `${emoji} ${weather.temperature}°C`;
                    tempDisplay.className = 'mt-2 font-bold text-coke-red';
                }
            }
        }
    }
    
    // ==========================================
    // LIVE COUNTER
    // ==========================================
    setupLiveCounter() {
        setInterval(() => {
            const counter = this.api.getLiveCounter();
            const liveElement = document.getElementById('liveCounter');
            if (liveElement) {
                liveElement.textContent = `${counter.todayTotal} servings today`;
            }
        }, 1000);
    }
}

// Start everything when page loads
document.addEventListener('DOMContentLoaded', () => {
    new CocaColaApp();
});
// Add this to your app.js
async function createWeatherDashboard() {
    const api = new CokeAPI();
    
    const cities = [
        { name: '🏛️ Washington DC', lat: 38.9072, lon: -77.0369 },
        { name: '🗽 New York', lat: 40.7128, lon: -74.0060 },
        { name: '🇬🇧 London', lat: 51.5074, lon: -0.1278 },
        { name: '🇫🇷 Paris', lat: 48.8566, lon: 2.3522 },
        { name: '🇯🇵 Tokyo', lat: 35.6762, lon: 139.6503 },
        { name: '🇦🇪 Dubai', lat: 25.2048, lon: 55.2708 },
        { name: '🇧🇷 Rio', lat: -22.9068, lon: -43.1729 },
        { name: '🇿🇦 Cape Town', lat: -33.9249, lon: 18.4241 }
    ];
    
    // Create a new section after your stats
    const section = document.createElement('section');
    section.className = 'py-16 bg-coke-cream';
    section.innerHTML = `
        <div class="max-w-7xl mx-auto px-6">
            <h2 class="font-inter font-black text-4xl text-center mb-12">
                🌍 World Weather <span class="text-coke-red">Now</span>
            </h2>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4" id="weatherGrid">
                ${cities.map(city => `
                    <div class="bg-white rounded-2xl p-4 shadow-sm text-center" data-city="${city.name}">
                        <div class="text-2xl mb-1">${city.name.split(' ')[0]}</div>
                        <div class="text-sm text-coke-dark/60">${city.name.split(' ').slice(1).join(' ')}</div>
                        <div class="mt-2 font-bold text-coke-red loading-weather">Loading...</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    // Insert after stats section
    const statsSection = document.querySelector('#stats');
    statsSection.parentNode.insertBefore(section, statsSection.nextSibling);
    
    // Get weather for each city
    for (let city of cities) {
        const weather = await api.getWeather(city.lat, city.lon);
        const card = document.querySelector(`[data-city="${city.name}"] .loading-weather`);
        if (card && weather) {
            card.textContent = `🌤️ ${weather.temperature}°C`;
        }
    }
}

// Call this when page loads
document.addEventListener('DOMContentLoaded', createWeatherDashboard);
// Add to js/app.js - This replaces your map code

async function initMapWithWeather() {
    const api = new CokeAPI();
    
    const locations = [
        { name: 'Atlanta, USA - World HQ', coords: [33.749, -84.388] },
        { name: 'Madrid, Spain - Europe', coords: [40.4168, -3.7038] },
        { name: 'Shanghai, China - Asia Pacific', coords: [31.2304, 121.4737] },
        { name: 'Mexico City - Latin America', coords: [19.4326, -99.1332] },
        { name: 'Johannesburg, South Africa - Africa', coords: [-26.2041, 28.0473] },
        { name: 'Sydney, Australia - Oceania', coords: [-33.8688, 151.2093] }
    ];
    
    // Get weather for all locations
    for (let loc of locations) {
        loc.weather = await api.getWeather(loc.coords[0], loc.coords[1]);
    }
    
    // Initialize map
    if (document.getElementById('globalMap') && window.L) {
        const globalMap = L.map('globalMap', {
            center: [18, 12],
            zoom: 2,
            minZoom: 2,
            maxZoom: 5,
            scrollWheelZoom: false,
            worldCopyJump: true
        });
        
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OpenStreetMap &copy; CARTO',
            subdomains: 'abcd',
            maxZoom: 20
        }).addTo(globalMap);
        
        // Store map globally for later use
        window.globalMap = globalMap;
        
        // Add markers with weather
        locations.forEach(loc => {
            const markerIcon = L.divIcon({
                className: '',
                html: '<div class="global-map-marker"></div>',
                iconSize: [16, 16],
                iconAnchor: [8, 8]
            });
            
            const marker = L.marker(loc.coords, { icon: markerIcon })
                .addTo(globalMap);
            
            // Build popup with weather
            let popupHtml = `<b>${loc.name}</b>`;
            if (loc.weather) {
                const emoji = loc.weather.temperature < 10 ? '❄️' : 
                             loc.weather.temperature < 20 ? '⛅' : 
                             loc.weather.temperature < 30 ? '🌤️' : '☀️';
                popupHtml += `<br>${emoji} ${loc.weather.temperature}°C`;
                popupHtml += `<br>💨 ${loc.weather.windspeed} km/h`;
            } else {
                popupHtml += `<br>🌡️ Weather unavailable`;
            }
            
            marker.bindPopup(popupHtml, {
                className: 'global-map-tooltip',
                direction: 'top',
                offset: [0, -12]
            });
        });
        
        console.log('🗺️ Map with weather loaded!');
    }
}