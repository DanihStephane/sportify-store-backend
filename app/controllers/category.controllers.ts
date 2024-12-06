import { CategoryService } from "../services";

export default class CategoryController {
    private cat: CategoryService;
    
    constructor() {
		this.cat = new CategoryService();
	}
    
    async getAll() {
        return this.cat.getAll();
    }
}