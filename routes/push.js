const controller = require('../controllers/push');
const auth = require('../middlewares/auth');

module.exports.registerRoutes = (router) => {

	router.put('/d/push/message/global', auth.requirePermission('messaging.global'), controller.routeGlobalMessage);

};