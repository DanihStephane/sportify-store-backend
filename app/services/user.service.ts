import { eq } from "drizzle-orm";
import { UsersEntity, UsersSchema } from "../../database/schema";
import { ResponseData } from "../interfaces/response.interface";
import { InformationRepository, UserRepository } from "../repository";
import ResponseHelper from "../helpers/response.helper";
import { GenericCodes } from "../enum";
import { UserDTO } from "../dto/user.dto";

export default class UserService {
    private userRep: UserRepository;
    private infoRep: InformationRepository;
    
    constructor() {
        this.userRep = new UserRepository();
        this.infoRep = new InformationRepository();
    }
    
    /**
     * Retrieve user profile details by user ID.
     * @param id - The ID of the user.
     * @returns A promise that resolves to the user's profile information, excluding sensitive data.
     */
    async findById(req): Promise<ResponseData<UsersEntity>> {
        const id = req.params.userId as number;
        
        try {
            // Fetch the user data by ID from the repository
            const { data: user } = await this.userRep.findById(id);
            
            // Send the response with the filtered user data
            return ResponseHelper.sendResponse(
                user,
                "Données récupérées avec succès",
                GenericCodes.SUCCESS
            );
        } catch (error) {
            // Handle any errors and send an error response
            return ResponseHelper.sendError(
                "Une erreur est survenue: " + error,
                GenericCodes.INTERNAL_SERVER_ERROR
            );
        }
    }
    
    async updateInformation(req): Promise<any> {
        const id = req.params.userId as number;
        const data = req.body as UserDTO;

        try {
            const info = await this.infoRep.update(id, data);

            return ResponseHelper.sendResponse(
                data,
                'Mise à jour réussie',
                GenericCodes.SUCCESS
            );
        } catch (error) {
            return ResponseHelper.sendError(
                "Une erreur est survenue: " + error,
                GenericCodes.INTERNAL_SERVER_ERROR
            );
        }
    }
    
    async orderByUserId(req): Promise<ResponseData<UsersEntity>> {
        const id = req.params.userId as number;

        try {
            const { data: user } = await this.userRep.orderByUserId(id);

            return ResponseHelper.sendResponse(
                user,
                "Données récupérées avec succès",
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