import { UserService } from "../services";

export default class UserController {
    private user: UserService;
    
    constructor() {
		this.user = new UserService();
	}
    
    async findById(request) {
        return this.user.findById(request);
    }
    
    async updateInformation(request) {
        return this.user.updateInformation(request);
    }
    
    async orderByUserId(request) {
        return this.user.orderByUserId(request);
    }
}