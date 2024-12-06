import { AuthService } from "../services";

export default class AuthController {
    private auth: AuthService;
    
    constructor() {
		this.auth = new AuthService();
	}
    
    async doLogin(request) {
        return this.auth.doLogin(request);
    }
    
    async doRegister(request) {
        return this.auth.doRegister(request);
    }
}