
import { like, or } from "drizzle-orm";
import ResponseHelper from '../helpers/response.helper';
import { GenericCodes } from '../enum';
import { ProductsEntity, ProductsSchema } from '../../database/schema';
import { CrudService } from '../services';
import { ResponseData } from '../interfaces/response.interface';

export default class ProductRepository {
	private readonly prodRep: CrudService;

	constructor() {
		this.prodRep = new CrudService(ProductsSchema);
	}

	// find all product
	async findAll(options: any): Promise<ResponseData<ProductsEntity>> {
		try {
			const filter = options.terms
			? or(
				like(ProductsSchema.name, `%${options.terms}%`),
				like(ProductsSchema.description, `%${options.terms}%`)
			) : null;
			const { data, totalDocs, totalPages, hasPrevPage, hasNextPage, page, limit } =   await this.prodRep.findAll(
											options,
											filter
										);
			
			return ResponseHelper.sendResponse(
				{
					pagination: {
						totalDocs,
						totalPages,
						hasPrevPage,
						hasNextPage,
						page,
						limit
					},
					data
				},
				'',
				GenericCodes.SUCCESS
			);
		} catch (error) {
			return ResponseHelper.sendError(
				"Une erreur est survenue: " + error,
				GenericCodes.INTERNAL_SERVER_ERROR
			);
		}
	}
	
	async findById(id: number): Promise<ResponseData<ProductsEntity>> {
		
		try {
			const product = await this.prodRep.findById(id);
			
			return ResponseHelper.sendResponse(
				product,
				'',
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