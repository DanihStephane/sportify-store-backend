
import ResponseHelper from '../helpers/response.helper';
import { generateToken } from '../services/jwt.service';
import { eq } from 'drizzle-orm';
import { GenericCodes } from '../enum';
import { OrdersSchema, ProductsSchema, UsersEntity, UsersProfilesSchema, UsersSchema } from '../../database/schema';
import { CrudService } from '../services';
import { ResponseData } from '../interfaces/response.interface';
import { verifyPassword } from '../../config/encryption';
import { UserDTO } from '../dto/user.dto';

export default class UserRepository {
	private readonly userRep: CrudService;

	constructor() {
		this.userRep = new CrudService(UsersSchema);
	}

	// find by id
	async findById(id: number): Promise<ResponseData<UsersEntity>> {
		try {
			const user =    await (await this.userRep.db()).select({
								id: UsersSchema.id,
								email: UsersSchema.email,
								firstName: UsersProfilesSchema.firstName,
								lastName: UsersProfilesSchema.lastName,
								phone: UsersProfilesSchema.phone,
								address: UsersProfilesSchema.address,
								city: UsersProfilesSchema.city,
								postCode: UsersProfilesSchema.postCode,
								country: UsersProfilesSchema.country
							})
							.from(UsersSchema)
							.leftJoin(UsersProfilesSchema, eq(UsersSchema.id, UsersProfilesSchema.userId))
							.where(eq(UsersSchema.id, id));
			
			return ResponseHelper.sendResponse<UsersEntity>(
				user[0],
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
	
	async orderByUserId(id: number): Promise<any> {
		try {
			const user =    await (await this.userRep.db()).select({
								product: {
									id: ProductsSchema.id,
									name: ProductsSchema.name,
									description: ProductsSchema.description
								},
								order: {
									id: OrdersSchema.id,
									quantity: OrdersSchema.quantity,
									status: OrdersSchema.status,
									totalAmount: OrdersSchema.totalAmount,
									createdAt: OrdersSchema.createdAt
								}
							})
							.from(UsersSchema)
							.leftJoin(OrdersSchema, eq(UsersSchema.id, OrdersSchema.userId))
							.leftJoin(ProductsSchema, eq(OrdersSchema.productId, ProductsSchema.id))
							.where(eq(UsersSchema.id, id));
			
			return ResponseHelper.sendResponse(
				user,
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

	/**
	 * Verify user's credential
	 * @param email User's email
	 * @param pwd User's password
	 * @returns {Promise<boolean | string>} Response with user's info or error
	 */
	async verifyCredentials(
		email: string,
		pwd: string
	): Promise<boolean> {
		try {
			const user = await this.userRep.find<UserDTO>(eq(UsersSchema.email, email));
			
			// Verify if the user exists and the password is correct
			if (await verifyPassword(pwd, user[0].password)) {
				return true;
			} else {
				return false;
			}
		} catch (error) {
			return ResponseHelper.sendError(
				"Une erreur est survenue: " + error,
				GenericCodes.INTERNAL_SERVER_ERROR
			);
		}
	}

	/**
	 * Create token user
	 * @param data token data
	 * @returns {Promise<any>} Response with created token
	 */
	async createToken(data: any): Promise<any> {
		const gToken = { data, ...data?.companyId };
		try {
			const token = await generateToken(gToken);
			return token;
		} catch (error) {
			return ResponseHelper.sendError(
				"Une erreur est survenue: " + error,
				GenericCodes.INTERNAL_SERVER_ERROR
			);
		}
	}

	/**
	 * Get user by email
	 * @param email User's email
	 * @returns {Promise<Response<UsersEntity>>} Response with user's info or error
	 */
	async getByEmail(email: string): Promise<ResponseData<UsersEntity | null>> {
		try {
			const user = await this.userRep.find<UsersEntity>(eq(UsersSchema.email, email));
			const { password, token, ...rest } = user[0];
			
			if (user.length) {
				return ResponseHelper.sendResponse<UsersEntity>(
					rest,
					'',
					GenericCodes.SUCCESS
				);
			} else {
				return ResponseHelper.sendResponse<UsersEntity>(
					null,
					'',
					GenericCodes.NOT_FOUND
				);
			}
		} catch (error) {
			return ResponseHelper.sendError(
				"Une erreur est survenue: " + error,
				GenericCodes.INTERNAL_SERVER_ERROR
			);
		}
	}

	// create user
	async create(data: UsersEntity): Promise<ResponseData<UsersEntity>> {
		try {
			const user = await this.userRep.create<UsersEntity>(data);
			const { password, token, ...rest } = user[0];
			
			return ResponseHelper.sendResponse<UsersEntity>(
				rest,
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

	// update user
	async update(userId: number, data: UsersEntity): Promise<ResponseData<UsersEntity>> {
		try {
			const user = await this.userRep.update<UsersEntity>(userId, data);
			const { password, ...rest } = user[0];
			
			return ResponseHelper.sendResponse<UsersEntity>(
				rest,
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

	// find user token
	async findUserToken(data: UsersEntity): Promise<ResponseData<UsersEntity>> {
		try {
			const user = await this.userRep.find<UsersEntity>(
				eq(UsersSchema.email, data.email)
			);
			const { email, password, ...rest } = user[0];
			
			return ResponseHelper.sendResponse<UsersEntity>(
				rest,
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