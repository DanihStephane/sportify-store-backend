import { CategoryController } from '../app/controllers';
import ResponseHelper from '../app/helpers/response.helper';

export const RouteCategory = (app, rateLimit) => {
	const cat = new CategoryController();

	app.register((route) => {
		route.get(
			'/getAll',
			{
				onRequest: app.csrf,
				...rateLimit
			},
			async (request, reply) => {
				const { data, message, status } = await cat.getAll();
				return ResponseHelper.sendResponseController(reply, { status, message, data });
			}
		);
	}, { prefix: 'category/' });
}