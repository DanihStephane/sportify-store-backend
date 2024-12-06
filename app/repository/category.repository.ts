
import ResponseHelper from '../helpers/response.helper';
import { GenericCodes } from '../enum';
import { CategoryEntity, CategorySchema } from '../../database/schema';
import { CrudService } from '../services';
import { ResponseData } from '../interfaces/response.interface';

export default class CategoryRepository {
	private readonly catRep: CrudService;

	constructor() {
		this.catRep = new CrudService(CategorySchema);
	}

	// find by id
	async getAll(): Promise<ResponseData<CategoryEntity>> {
		try {
			const { data: category } = await this.catRep.findAll();
			
			return ResponseHelper.sendResponse(
				category,
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