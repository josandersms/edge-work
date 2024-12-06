"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rootRouter = void 0;
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
exports.rootRouter = express_1.default.Router();
exports.rootRouter.get('/', async (request, response) => {
    if (request.headers.authorization) {
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm9vdC5yb3V0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tb24vcm91dGVzL3Jvb3Qucm91dGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUNBLDhEQUFxRDtBQUt4QyxRQUFBLFVBQVUsR0FBRyxpQkFBTyxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBRTNDLGtCQUFVLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsT0FBZ0IsRUFBRSxRQUFrQixFQUFFLEVBQUU7SUFFL0QsSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRSxDQUFDO0lBNkJwQyxDQUFDO0FBTUwsQ0FBQyxDQUFDLENBQUMifQ==