import { ProductService } from "../services";

export default class ProductController {
    private prod: ProductService;
    
    constructor() {
		this.prod = new ProductService();
	}
    
    async findAll(request) {
        return this.prod.findAll(request);
    }
    
    async findById(request) {
        return this.prod.findById(request);
    }
    
    async search(request) {
        return this.prod.search(request);
    }
}