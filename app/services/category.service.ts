import { CategoryEntity } from "../../database/schema";
import { GenericCodes } from "../enum";
import ResponseHelper from "../helpers/response.helper";
import { ResponseData } from "../interfaces/response.interface";
import { CategoryRepository } from "../repository";

export default class CategoryService {
    private catRep: CategoryRepository;

    constructor() {
        this.catRep = new CategoryRepository();
    }

    async getAll(): Promise<ResponseData<CategoryEntity[]>> {
        try {
            const { data: category } = await this.catRep.getAll();

            return ResponseHelper.sendResponse(
                category,
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