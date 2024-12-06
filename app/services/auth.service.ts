import { hashPassword } from "../../config/encryption";
import { UsersEntity } from "../../database/schema";
import { LoginDto, RegisterDto } from "../dto/auth.dto";
import { GenericCodes, Role } from "../enum";
import { hashGenerator } from "../helpers/global.helper";
import ResponseHelper from "../helpers/response.helper";
import { ResponseData } from "../interfaces/response.interface";
import { UserRepository } from "../repository";
import InformationRepository from "../repository/information.repository";

export default class AuthService {
    private userRep: UserRepository;
    private infoRep: InformationRepository;
	private token: string;

	constructor() {
		this.userRep = new UserRepository();
		this.infoRep = new InformationRepository();
		this.token = hashGenerator();
	}
    
    async doLogin(req): Promise<ResponseData<{ token: string }>> {
		const dataDTO: LoginDto = req.body as LoginDto;
		// Get user by email
		const { data: user } = await this.userRep.getByEmail(dataDTO.email);

		// User not found
		if (!user) {
			return ResponseHelper.sendError(
				"Compte non trouvé",
				GenericCodes.NOT_FOUND
			);
		}

		try {
			if (user.active && user.verified) {
				// User is active
				const userLogin = await this.userRep.verifyCredentials(
					dataDTO.email,
					dataDTO.password
				);
	
				if (userLogin) {
					// User credentials are correct
					const dataToken = {
						id: user.id,
						email: user.email
					}
	
					const token = await this.userRep.createToken(dataToken);
					const response = { token: token };
	
					return ResponseHelper.sendResponse(
						response,
						"Connexion reussie",
						GenericCodes.SUCCESS
					);
				} else {
					// User credentials are incorrect
					return ResponseHelper.sendError(
						"Identifiant ou mot de passe incorrect",
						GenericCodes.INVALID_CREDENTIALS
					);
				}
			} else {
				// User is not active
				return ResponseHelper.sendError(
					"Compte non actif",
					GenericCodes.INACTIVE
				);
			}
		} catch (error) {
			// Error in login process
			return ResponseHelper.sendError(
				"Une erreur est survenue: " + error,
				GenericCodes.INTERNAL_SERVER_ERROR
			);
		}
	}
	
	async doRegister(req): Promise<any> {
		const dataDTO: RegisterDto = req.body as RegisterDto;
		const { status, message } = await this.registerUser(dataDTO);
		return ResponseHelper.sendResponse<null>(null, message, status);
	}
	
	async registerUser(dataDTO: RegisterDto): Promise<ResponseData<UsersEntity>> {
		const { data: user } = await this.userRep.getByEmail(dataDTO.email);
		
		if (user) {
			// User already exists
			return ResponseHelper.sendError(
				"Compte déjà existant",
				GenericCodes.CONFLICT
			);
		}

		const role = dataDTO.role;
		const token = this.token;
		const password = await hashPassword(dataDTO.password);

		// Data to create user
		const data = {
			email: dataDTO.email.toLowerCase(),
			role: role,
			password,
			token
		}

		try {
			// Create user
			const { data: user } = await this.userRep.create(data);
			const userId = user.id;
			
			// Switch user role
			switch (role) {
				// client
				case Role.ADMIN:
					// Create user information + address
					await this.infoRep.create({
						userId,
					});
				break;
				
				case Role.USER:
					// Create user information + address
					await this.infoRep.create({
						userId,
					});
				break;
			}
			
			return ResponseHelper.sendResponse(
				user,
				"Inscription reussie",
				GenericCodes.SUCCESS
			);
		} catch (error) {
			return ResponseHelper.sendError(
				"Une erreur est survenue: " + error,
				GenericCodes.INTERNAL_SERVER_ERROR
			);
		}
	}

}