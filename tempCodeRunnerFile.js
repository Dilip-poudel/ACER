// test-api.js
// Run this to test if your API works

async function testCokeAPI() {
    const api = new CokeAPI();
    
    console.log('🧪 Testing Coca-Cola API Module...\n');
    
    // Test 1: Weather
    console.log('📡 Testing Weather API...');
    const weather = await api.getWeather(33.749, -84.388, 'Atlanta');
    console.log('✅ Weather:', weather);
    
    // Test 2: Product Info
    console.log('\n📡 Testing Product API...');
    const product = await api.getProductInfo('Coca-Cola');
    console.log('✅ Product:', product);
    
    // Test 3: Country Info
    console.log('\n📡 Testing Country API...');
    const country = await api.getCountryInfo('United States');
    console.log('✅ Country:', country);
    
    // Test 4: Live Counter
    console.log('\n📡 Testing Live Counter...');
    const counter = api.getLiveCounter();
    console.log('✅ Live Counter:', counter);
    
    // Test 5: Random Fact
    console.log('\n📡 Testing Random Fact...');
    const fact = api.getRandomFact();
    console.log('✅ Fact:', fact);
    
    console.log('\n✨ All tests complete!');
}

// Run the test
testCokeAPI();