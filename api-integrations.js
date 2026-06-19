// api-integrations.js
// ============================================
// COCA-COLA API INTEGRATION MODULE
// ============================================

class CokeAPI {
    constructor() {
        this.baseURL = 'https://api.open-meteo.com/v1';
        this.nominatimURL = 'https://nominatim.openstreetmap.org';
        this.foodURL = 'https://world.openfoodfacts.org/api/v0';
    }

    // ==========================================
    // 1. WEATHER API
    // ==========================================
    async getWeather(lat, lon, city = '') {
        try {
            const response = await fetch(
                `${this.baseURL}/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
            );
            
            if (!response.ok) throw new Error('Weather API error');
            
            const data = await response.json();
            return {
                temperature: data.current_weather.temperature,
                windspeed: data.current_weather.windspeed,
                city: city,
                timestamp: new Date().toLocaleString()
            };
        } catch (error) {
            console.error('❌ Weather fetch failed:', error.message);
            return null;
        }
    }

    // ==========================================
    // 2. STORE LOCATOR API (OpenStreetMap)
    // ==========================================
    async findNearbyStores(lat, lon) {
        try {
            // First get location name
            const locationResponse = await fetch(
                `${this.nominatimURL}/reverse?lat=${lat}&lon=${lon}&format=json`
            );
            const locationData = await locationResponse.json();
            
            // Then find nearby places (simulated store search)
            const searchResponse = await fetch(
                `${this.nominatimURL}/search?q=Coca-Cola+store&format=json&limit=5`
            );
            const stores = await searchResponse.json();
            
            return {
                location: locationData.display_name || 'Unknown location',
                stores: stores.map(store => ({
                    name: store.display_name,
                    lat: store.lat,
                    lon: store.lon,
                    distance: 'Nearby' // You'd calculate actual distance
                }))
            };
        } catch (error) {
            console.error('❌ Store locator failed:', error.message);
            return null;
        }
    }

    // ==========================================
    // 3. PRODUCT INFORMATION API
    // ==========================================
    async getProductInfo(productName) {
        try {
            const encodedName = encodeURIComponent(productName);
            const response = await fetch(
                `${this.foodURL}/product/${encodedName}.json`
            );
            
            if (!response.ok) throw new Error('Product not found');
            
            const data = await response.json();
            
            if (data.status === 0) {
                return { error: 'Product not found in database' };
            }
            
            const product = data.product;
            return {
                name: product.product_name || productName,
                brand: product.brands || 'Coca-Cola',
                ingredients: product.ingredients_text || 'Not available',
                nutrition: {
                    calories: product.nutriments?.energy_100g || 'N/A',
                    sugar: product.nutriments?.sugars_100g || 'N/A',
                    fat: product.nutriments?.fat_100g || 'N/A',
                    protein: product.nutriments?.proteins_100g || 'N/A'
                },
                image: product.image_url || null,
                packaging: product.packaging || 'Not specified'
            };
        } catch (error) {
            console.error('❌ Product API failed:', error.message);
            return null;
        }
    }

    // ==========================================
    // 4. COUNTRY DATA API
    // ==========================================
    async getCountryInfo(countryName) {
        try {
            const response = await fetch(
                `https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}`
            );
            
            if (!response.ok) throw new Error('Country not found');
            
            const data = await response.json();
            const country = data[0];
            
            return {
                name: country.name.common,
                capital: country.capital?.[0] || 'Unknown',
                population: country.population.toLocaleString(),
                region: country.region,
                flag: country.flags.svg,
                currency: Object.values(country.currencies || {})[0]?.name || 'Unknown'
            };
        } catch (error) {
            console.error('❌ Country API failed:', error.message);
            return null;
        }
    }

    // ==========================================
    // 5. LIVE COUNTER (Simulated real-time data)
    // ==========================================
    getLiveCounter() {
        const now = new Date();
        const seconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
        const baseRate = 21990; // Coca-Cola servings per second
        
        return {
            perSecond: baseRate,
            perMinute: baseRate * 60,
            perHour: baseRate * 3600,
            todayTotal: (seconds * baseRate).toLocaleString(),
            timestamp: now.toLocaleTimeString()
        };
    }

    // ==========================================
    // 6. RANDOM COCA-COLA FACT
    // ==========================================
    getRandomFact() {
        const facts = [
            'Coca-Cola was invented in 1886 by Dr. John Pemberton.',
            'The Coca-Cola recipe is kept in a vault in Atlanta, Georgia.',
            'Coca-Cola is sold in over 200 countries worldwide.',
            'The original Coca-Cola was sold for 5 cents a glass.',
            'Coca-Cola uses over 900 bottling plants globally.',
            'The Coca-Cola logo is recognized by 94% of the world\'s population.',
            'Coca-Cola was the first soft drink in space (1985).',
            'The average person consumes about 1 Coca-Cola per week.'
        ];
        return facts[Math.floor(Math.random() * facts.length)];
    }
}

// ==========================================
// EXPORT THE MODULE
// ==========================================
// For use in browser with <script> tag
if (typeof window !== 'undefined') {
    window.CokeAPI = CokeAPI;
}

// For use with ES6 modules
export default CokeAPI;