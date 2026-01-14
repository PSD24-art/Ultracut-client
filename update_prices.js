import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the products JSON
const filePath = path.join(__dirname, 'src/data/products.json');
const products = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

// Pricing strategy based on product category and specifications
function calculateRealisticPrice(product) {
    const category = product.category || '';
    const capacity = product.capacity || [];
    const brand = (product.brand || '').toLowerCase();
    const diameter = parseFloat(product.specs?.diameter || 0);
    const title = (product.title || '').toLowerCase();
    
    let price = 1200;  // Base price
    let mrp = 1800;    // Base MRP
    
    // Protective Lens Pricing
    if (category === 'protective-lens') {
        price = 800;
        mrp = 1200;
        
        // Adjust based on diameter
        if (diameter <= 21.5) {
            price = 850;
            mrp = 1300;
        } else if (diameter <= 30) {
            price = 950;
            mrp = 1450;
        } else if (diameter <= 37) {
            price = 1100;
            mrp = 1650;
        } else if (diameter <= 40) {
            price = 1250;
            mrp = 1850;
        } else {
            price = 1400;
            mrp = 2100;
        }
        
        // Brand adjustments
        if (brand === 'raytool') {
            price += 150;
            mrp += 200;
        } else if (brand === 'ospri') {
            price += 100;
            mrp += 150;
        } else if (brand === 'wsx') {
            price += 120;
            mrp += 180;
        } else if (brand === 'boci') {
            price += 80;
            mrp += 120;
        }
        
        // High power capacity adjustment
        if (capacity.includes('20kW') || capacity.includes('15kW')) {
            price += 200;
            mrp += 300;
        }
    }
    
    // Cutting Nozzle Pricing
    else if (category === 'cutting-nozzle') {
        price = 450;
        mrp = 700;
        
        if (diameter <= 17) {
            price = 400;
            mrp = 600;
        } else if (diameter <= 20) {
            price = 450;
            mrp = 700;
        } else if (diameter <= 28) {
            price = 500;
            mrp = 750;
        } else {
            price = 600;
            mrp = 900;
        }
        
        if (brand === 'raytool') {
            price += 80;
            mrp += 120;
        } else if (brand === 'dne') {
            price += 50;
            mrp += 75;
        }
        
        if (title.includes('bullet')) {
            price += 100;
            mrp += 150;
        }
    }
    
    // Ceramic Ring Pricing
    else if (category === 'ceramic-ring') {
        price = 600;
        mrp = 950;
        
        if (diameter <= 25) {
            price = 550;
            mrp = 850;
        } else if (diameter <= 37) {
            price = 700;
            mrp = 1050;
        } else {
            price = 850;
            mrp = 1300;
        }
        
        if (brand === 'raytool') {
            price += 120;
            mrp += 180;
        } else if (brand === 'boci') {
            price += 80;
            mrp += 120;
        } else if (brand === 'precitec') {
            price += 150;
            mrp += 220;
        }
    }
    
    // Focus and Collimation Lens Pricing
    else if (category === 'focus-and-collimation-lens') {
        price = 1800;
        mrp = 2700;
        
        if (brand === 'raytool') {
            price += 300;
            mrp += 450;
        } else if (brand === 'wsx') {
            price += 200;
            mrp += 300;
        } else if (brand === 'ospri') {
            price += 150;
            mrp += 225;
        } else if (brand === 'boci') {
            price += 100;
            mrp += 150;
        }
        
        if (product.size && product.size.some(s => String(s).includes('200'))) {
            price += 400;
            mrp += 600;
        }
    }
    
    // DNE Consumables Pricing
    else if (category === 'dne-consumables') {
        price = 350;
        mrp = 550;
        
        if (title.includes('air outlet')) {
            price = 400;
            mrp = 600;
        } else if (title.includes('insulation')) {
            price = 300;
            mrp = 450;
        } else if (title.includes('ceramic')) {
            price = 500;
            mrp = 750;
        } else if (title.includes('copper')) {
            price = 250;
            mrp = 400;
        }
    }
    
    // QBH Protection Cap Pricing
    else if (category === 'qbh-protection-cap') {
        price = 800;
        mrp = 1200;
        
        const power = product.specs?.power || '';
        if (String(power).includes('4')) {
            price = 900;
            mrp = 1350;
        } else if (String(power).includes('3.3')) {
            price = 850;
            mrp = 1280;
        }
    }
    
    // RF Cable Pricing
    else if (category === 'r-f-cable') {
        if (title.includes('connector')) {
            price = 200;
            mrp = 300;
        } else {
            price = 400;
            mrp = 600;
        }
        
        if (brand === 'raytool') {
            price += 50;
            mrp += 75;
        }
    }
    
    // Remote Controller Pricing
    else if (category === 'remote') {
        price = 2500;
        mrp = 3750;
        
        if (brand === 'weihong') {
            price = 2800;
            mrp = 4200;
        } else if (brand === 'bodor') {
            price = 2400;
            mrp = 3600;
        } else if (brand === 'raytool') {
            price = 3000;
            mrp = 4500;
        } else if (brand === 'cypcut') {
            price = 2200;
            mrp = 3300;
        }
    }
    
    // Laser Cutting Head Pricing
    else if (category === 'raytools-laser-cutting-head' || category === 'wsx-laser-cutting-head') {
        price = 8500;
        mrp = 12750;
        
        const slug = (product.slug || '').toLowerCase();
        if (slug.includes('bm110')) {
            price = 7500;
            mrp = 11250;
        } else if (slug.includes('bm111')) {
            price = 7800;
            mrp = 11700;
        } else if (slug.includes('bm06k')) {
            price = 9500;
            mrp = 14250;
        } else if (slug.includes('nc30')) {
            price = 8200;
            mrp = 12300;
        } else if (slug.includes('nc63')) {
            price = 9200;
            mrp = 13800;
        }
    }
    
    return { price: Math.round(price), mrp: Math.round(mrp) };
}

// Update all products with realistic prices
products.forEach(product => {
    const { price, mrp } = calculateRealisticPrice(product);
    product.price = price;
    product.mrp = mrp;
});

// Save the updated products
fs.writeFileSync(filePath, JSON.stringify(products, null, 2), 'utf-8');

const prices = products.map(p => p.price);
const minPrice = Math.min(...prices);
const maxPrice = Math.max(...prices);

console.log(`✅ Updated ${products.length} products with realistic prices!`);
console.log(`Price range: ₹${minPrice} - ₹${maxPrice}`);
