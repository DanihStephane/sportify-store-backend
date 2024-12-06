import { ProductController } from '../app/controllers';
import ResponseHelper from '../app/helpers/response.helper';

export const RouteProduct = (app, rateLimit) => {
	const prod = new ProductController();

	app.register((route) => {
		route.get(
			'/findAll',
			{
				onRequest: app.csrf,
				...rateLimit
			},
			async (request, reply) => {
				const { data, message, status } = await prod.findAll(request);
				return ResponseHelper.sendResponseController(reply, { status, message, data });
			}
		);
		
		route.get(
			'/:id',
			{
				onRequest: app.csrf,
				...rateLimit
			},
			async (request, reply) => {
				const { data, message, status } = await prod.findById(request);
				return ResponseHelper.sendResponseController(reply, { status, message, data });
			}
		);		
		
		route.get(
			'/search',
			{
				onRequest: app.csrf,
				...rateLimit
			},
			async (request, reply) => {
				const { data, message, status } = await prod.search(request);
				return ResponseHelper.sendResponseController(reply, { status, message, data });
			}
		);
	}, { prefix: 'product/' });
}