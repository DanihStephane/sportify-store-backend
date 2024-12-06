import { faker } from '@faker-js/faker';
import { CategorySchema, ProductImagesSchema, ProductsSchema } from "../schema";
import { slug } from "../../app/helpers/global.helper";
import { CrudService } from "../../app/services";
import { exit } from 'process';

// Sport-specific categories
const sportCategories = [
    'Football Equipment',
    'Basketball Gear',
    'Tennis Accessories',
    'Running Shoes',
    'Cycling Apparel',
    'Swimming Gear',
    'Fitness Accessories',
    'Outdoor Sports Equipment',
    'Martial Arts Gear',
    'Training Wear'
];

// Function to generate categories
function generateCategories() {
    return sportCategories.map(name => ({
        name: name,
        slug: slug(name),
        description: faker.lorem.paragraph(),
        createdAt: new Date(),
        updatedAt: new Date()
    }));
}

// Function to generate products
function generateProducts(categories) {
    const products = [];
    const slugSet = new Set(); // Set to track unique slugs
    
    for (let i = 0; i <= 5000; i++) {
        let productSlug;
        let name;
        
        do {
            name = generateProductName();
            productSlug = slug(name);
        } while (slugSet.has(productSlug)); // Ensure slug is unique
        
        slugSet.add(productSlug);
        
        const category = faker.helpers.arrayElement(categories.map(category => category.id));
        
        products.push({
            name: name.charAt(0).toUpperCase() + name.slice(1),
            slug: productSlug,
            description: faker.lorem.paragraph(),
            price: parseFloat(faker.commerce.price({ min: 10, max: 500 })),
            categoryId: category,
            active: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        });
    }
    
    return products;
}

// Function to generate product images
function generateProductImages(products: any[]) {
    const productImages = [];
    
    products.forEach(product => {
        const imageCount = faker.number.int({ min: 1, max: 5 });
        
        for (let i = 0; i < imageCount; i++) {
            productImages.push({
                productId: product.id,
                imageUrl: faker.image.urlLoremFlickr({ 
                    category: 'sports', 
                    width: 640, 
                    height: 480 
                }),
                isMain: i === 0, // First image is main
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }
    });
    
    return productImages;
}

// Generate specific product names based on categories
function generateProductName(): string {
    const productTypes = {
        'Football Equipment': () => `${faker.word.adjective()} Football ${faker.helpers.arrayElement(['Jersey', 'Cleats', 'Gloves', 'Ball', 'Shin Guards'])}`,
        'Basketball Gear': () => `${faker.word.adjective()} Basketball ${faker.helpers.arrayElement(['Shorts', 'Jersey', 'Shoes', 'Hoop', 'Training Gear'])}`,
        'Tennis Accessories': () => `${faker.word.adjective()} Tennis ${faker.helpers.arrayElement(['Racket', 'Balls', 'Shoes', 'Grip', 'Bag'])}`,
        'Running Shoes': () => `${faker.word.adjective()} Running ${faker.helpers.arrayElement(['Shoes', 'Socks', 'Shorts', 'Shirt', 'Headband'])}`,
        'Cycling Apparel': () => `${faker.word.adjective()} Cycling ${faker.helpers.arrayElement(['Jersey', 'Shorts', 'Helmet', 'Gloves', 'Shoes'])}`,
        'Swimming Gear': () => `${faker.word.adjective()} Swimming ${faker.helpers.arrayElement(['Goggles', 'Swimsuit', 'Cap', 'Fins', 'Towel'])}`,
        'Fitness Accessories': () => `${faker.word.adjective()} Fitness ${faker.helpers.arrayElement(['Resistance Bands', 'Weights', 'Mat', 'Tracker', 'Bottle'])}`,
        'Outdoor Sports Equipment': () => `${faker.word.adjective()} Outdoor ${faker.helpers.arrayElement(['Backpack', 'Water Bottle', 'Camping Gear', 'Hiking Boots', 'Navigation Tool'])}`,
        'Martial Arts Gear': () => `${faker.word.adjective()} Martial Arts ${faker.helpers.arrayElement(['Gi', 'Gloves', 'Protective Gear', 'Belt', 'Bag'])}`,
        'Training Wear': () => `${faker.word.adjective()} Training ${faker.helpers.arrayElement(['Compression Shirt', 'Shorts', 'Leggings', 'Jacket', 'Tank Top'])}`
    };

    const category = faker.helpers.arrayElement(Object.keys(productTypes));
    return productTypes[category]();
}

// Main generation function
export async function ProductSeed() {
    const category = new CrudService(CategorySchema);
    const product = new CrudService(ProductsSchema);
    const image = new CrudService(ProductImagesSchema);
    
    // Generate categories first
    const categories = generateCategories();
    
    // Insert categories (you'd use your ORM method here)
    const cat = await category.create(categories);
    
    // Generate products with category references
    const products = generateProducts(cat);
    
    // Insert products
    const insertedProducts = await product.create(products);
    
    // Generate product images
    const productImages = generateProductImages(insertedProducts);
    
    // Insert product images
    await image.create(productImages);
    
    console.log('Sport product data generation complete!');
    
    exit(0);
}