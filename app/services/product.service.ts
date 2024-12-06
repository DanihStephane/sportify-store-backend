import { CategoryEntity, ProductsEntity } from "../../database/schema";
import { GenericCodes } from "../enum";
import { parseQuery } from "../helpers/pagination.helper";
import ResponseHelper from "../helpers/response.helper";
import { ResponseData } from "../interfaces/response.interface";
import ProductRepository from "../repository/product.repository";

export default class ProductService {
    private prodRep: ProductRepository;

    constructor() {
        this.prodRep = new ProductRepository();
    }

    async findAll(req): Promise<any> {
        const options = await parseQuery(req.query);
        
        try {
            const { data: product } = await this.prodRep.findAll(options);

            return ResponseHelper.sendResponse(
                product,
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
    
    async findById(req): Promise<ResponseData<ProductsEntity>> {
        const id = req.params.id as number;
        
        try {
            const { data: product } = await this.prodRep.findById(id);

            return ResponseHelper.sendResponse(
                product,
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
    
    async search(req): Promise<ResponseData<ProductsEntity[]>> {
        const options = await parseQuery(req.query);
        
        try {
            const { data: product } = await this.prodRep.findAll(options);

            return ResponseHelper.sendResponse(
                product,
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