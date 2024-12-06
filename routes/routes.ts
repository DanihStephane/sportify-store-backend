import routes from ".";

const rateLimit = {
	config: {
		rateLimit: {
			max: 1000,
			timeWindow: 1000 * 60,
		},
	},
}

export default class Routes {	
	defineRoutes = async (app) => {
		// route welcome
		app.get('/', async (request, reply) => {
			await reply.generateCsrf();
			reply.send({ welcome: 'Welcome Battle IA' });
		});
		
		routes.RouteAuth(app, rateLimit);
		routes.RouteUser(app, rateLimit);
		routes.RouteCategory(app, rateLimit);
		routes.RouteProduct(app, rateLimit);
	}
}