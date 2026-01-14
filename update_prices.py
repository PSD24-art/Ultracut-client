import json

# Load the products JSON
with open('src/data/products.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

# Pricing strategy based on product category and specifications
def calculate_realistic_price(product):
    category = product.get('category', '')
    capacity = product.get('capacity', [])
    brand = product.get('brand', '').lower()
    diameter = product.get('specs', {}).get('diameter', 0)
    
    price = 1200  # Base price
    mrp = 1800    # Base MRP
    
    # Protective Lens Pricing
    if category == 'protective-lens':
        # Base price for protective lens
        price = 800
        mrp = 1200
        
        # Adjust based on diameter and specifications
        if isinstance(diameter, (int, float)):
            diameter_val = float(diameter)
            if diameter_val <= 21.5:
                price = 850
                mrp = 1300
            elif diameter_val <= 30:
                price = 950
                mrp = 1450
            elif diameter_val <= 37:
                price = 1100
                mrp = 1650
            elif diameter_val <= 40:
                price = 1250
                mrp = 1850
            else:
                price = 1400
                mrp = 2100
        
        # Brand adjustments
        if brand == 'raytool':
            price += 150
            mrp += 200
        elif brand == 'ospri':
            price += 100
            mrp += 150
        elif brand == 'wsx':
            price += 120
            mrp += 180
        elif brand == 'boci':
            price += 80
            mrp += 120
        
        # High power capacity adjustment
        if '20kW' in capacity or '15kW' in capacity:
            price += 200
            mrp += 300
    
    # Cutting Nozzle Pricing
    elif category == 'cutting-nozzle':
        price = 450
        mrp = 700
        
        if isinstance(diameter, (int, float)):
            diameter_val = float(diameter)
            if diameter_val <= 17:
                price = 400
                mrp = 600
            elif diameter_val <= 20:
                price = 450
                mrp = 700
            elif diameter_val <= 28:
                price = 500
                mrp = 750
            else:
                price = 600
                mrp = 900
        
        # Brand and type adjustments
        if brand == 'raytool':
            price += 80
            mrp += 120
        elif brand == 'dne':
            price += 50
            mrp += 75
        
        if 'bullet' in product.get('title', '').lower():
            price += 100
            mrp += 150
    
    # Ceramic Ring Pricing
    elif category == 'ceramic-ring':
        price = 600
        mrp = 950
        
        if isinstance(diameter, (int, float)):
            diameter_val = float(diameter)
            if diameter_val <= 25:
                price = 550
                mrp = 850
            elif diameter_val <= 37:
                price = 700
                mrp = 1050
            else:
                price = 850
                mrp = 1300
        
        # Brand adjustments
        if brand == 'raytool':
            price += 120
            mrp += 180
        elif brand == 'boci':
            price += 80
            mrp += 120
        elif brand == 'precitec':
            price += 150
            mrp += 220
    
    # Focus and Collimation Lens Pricing
    elif category == 'focus-and-collimation-lens':
        price = 1800
        mrp = 2700
        
        # Brand and type adjustments
        if brand == 'raytool':
            price += 300
            mrp += 450
        elif brand == 'wsx':
            price += 200
            mrp += 300
        elif brand == 'ospri':
            price += 150
            mrp += 225
        elif brand == 'boci':
            price += 100
            mrp += 150
        
        # Higher focal lengths cost more
        size = product.get('size', [])
        if size and any('200' in str(s) for s in size):
            price += 400
            mrp += 600
    
    # DNE Consumables Pricing
    elif category == 'dne-consumables':
        price = 350
        mrp = 550
        
        if 'air outlet' in product.get('title', '').lower():
            price = 400
            mrp = 600
        elif 'insulation' in product.get('title', '').lower():
            price = 300
            mrp = 450
        elif 'ceramic' in product.get('title', '').lower():
            price = 500
            mrp = 750
        elif 'copper' in product.get('title', '').lower():
            price = 250
            mrp = 400
    
    # QBH Protection Cap Pricing
    elif category == 'qbh-protection-cap':
        price = 800
        mrp = 1200
        
        # Higher power versions cost more
        power = product.get('specs', {}).get('power', '')
        if '4' in str(power):
            price = 900
            mrp = 1350
        elif '3.3' in str(power):
            price = 850
            mrp = 1280
    
    # RF Cable Pricing
    elif category == 'r-f-cable':
        if 'connector' in product.get('title', '').lower():
            price = 200
            mrp = 300
        else:
            price = 400
            mrp = 600
        
        if brand == 'raytool':
            price += 50
            mrp += 75
    
    # Remote Controller Pricing
    elif category == 'remote':
        price = 2500
        mrp = 3750
        
        if brand == 'weihong':
            price = 2800
            mrp = 4200
        elif brand == 'bodor':
            price = 2400
            mrp = 3600
        elif brand == 'raytool':
            price = 3000
            mrp = 4500
        elif brand == 'cypcut':
            price = 2200
            mrp = 3300
    
    # Laser Cutting Head Pricing
    elif category == 'raytools-laser-cutting-head' or category == 'wsx-laser-cutting-head':
        price = 8500
        mrp = 12750
        
        if 'bm110' in product.get('slug', '').lower():
            price = 7500
            mrp = 11250
        elif 'bm111' in product.get('slug', '').lower():
            price = 7800
            mrp = 11700
        elif 'bm06k' in product.get('slug', '').lower():
            price = 9500
            mrp = 14250
        elif 'nc30' in product.get('slug', '').lower():
            price = 8200
            mrp = 12300
        elif 'nc63' in product.get('slug', '').lower():
            price = 9200
            mrp = 13800
    
    return int(price), int(mrp)

# Update all products with realistic prices
for product in products:
    price, mrp = calculate_realistic_price(product)
    product['price'] = price
    product['mrp'] = mrp

# Save the updated products
with open('src/data/products.json', 'w', encoding='utf-8') as f:
    json.dump(products, f, indent=2, ensure_ascii=False)

print(f"✅ Updated {len(products)} products with realistic prices!")
print(f"Price range: ₹{min(p['price'] for p in products)} - ₹{max(p['price'] for p in products)}")
