import ResponseHelper from '../helpers/response.helper';
import { CrudService } from '../services/crud.service';
import { GenericCodes } from '../enum';
import { ResponseData } from '../interfaces/response.interface';
import { UsersProfilesEntity, UsersProfilesSchema } from '../../database/schema';
import { eq } from 'drizzle-orm';

export default class InformationRepository {
	private readonly infoRep: CrudService;

	constructor() {
		this.infoRep = new CrudService(UsersProfilesSchema);
	}

	async create(data: UsersProfilesEntity): Promise<ResponseData<UsersProfilesEntity>> {
		try {
			const info = await this.infoRep.create<UsersProfilesEntity>(data);
			
			return ResponseHelper.sendResponse<UsersProfilesEntity>(
				info[0],
				'',
				GenericCodes.CREATED
			);
		} catch (error) {
			return ResponseHelper.sendError(
				"Une erreur est survenue: " + error,
				GenericCodes.INTERNAL_SERVER_ERROR
			);
		}
	}

	async update(id: number, data: object): Promise<any> {
		try {
			const info = await this.infoRep.update(id, data);
			
			return info;
		} catch (error) {
			return ResponseHelper.sendError(
				"Une erreur est survenue: " + error,
				GenericCodes.INTERNAL_SERVER_ERROR
			);
		}
	}

	async delete(id: number): Promise<ResponseData<UsersProfilesEntity>> {
		try {
			const info = await this.infoRep.delete<UsersProfilesEntity>(eq(UsersProfilesSchema.userId, id));
			
			return ResponseHelper.sendResponse<UsersProfilesEntity>(
				info[0],
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
