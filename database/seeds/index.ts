import { ProductSeed } from "./product.seed";

// Call both seed functions concurrently
async function executeSeeds() {
    await ProductSeed();
}

// Call the function to execute both seeds sequentially
executeSeeds();