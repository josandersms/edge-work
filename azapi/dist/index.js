"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const cors_1 = tslib_1.__importDefault(require("cors"));
const environment_1 = require("./environment/environment");
const root_route_1 = require("./common/routes/root.route");
const arc_connect_route_1 = require("./common/routes/arc-connect.route");
const main = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const server = (0, express_1.default)();
            server.use((0, cors_1.default)());
            server.use(root_route_1.rootRouter);
            server.use(arc_connect_route_1.arcResponseRouter);
            server.listen(environment_1.environment.api.port, () => {
                console.log('Server listening on port %s', environment_1.environment.api.port);
            });
            resolve(undefined);
        }
        catch (error) {
            reject(error);
        }
    });
};
main();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsOERBQThCO0FBQzlCLHdEQUF3QjtBQU14QiwyREFBd0Q7QUFDeEQsMkRBQXdEO0FBQ3hELHlFQUFzRTtBQUV0RSxNQUFNLElBQUksR0FBRyxLQUFLLElBQXdCLEVBQUU7SUFDeEMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1FBQ3pDLElBQUksQ0FBQztZQUNELE1BQU0sTUFBTSxHQUFHLElBQUEsaUJBQU8sR0FBRSxDQUFDO1lBQ3pCLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBQSxjQUFJLEdBQUUsQ0FBQyxDQUFDO1lBQ25CLE1BQU0sQ0FBQyxHQUFHLENBQUMsdUJBQVUsQ0FBQyxDQUFDO1lBQ3ZCLE1BQU0sQ0FBQyxHQUFHLENBQUMscUNBQWlCLENBQUMsQ0FBQztZQUM5QixNQUFNLENBQUMsTUFBTSxDQUFDLHlCQUFXLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUU7Z0JBQ3JDLE9BQU8sQ0FBQyxHQUFHLENBQUMsNkJBQTZCLEVBQUUseUJBQVcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDckUsQ0FBQyxDQUFDLENBQUM7WUFDSCxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDdkIsQ0FBQztRQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7WUFDYixNQUFNLENBQUMsS0FBYyxDQUFDLENBQUM7UUFDM0IsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFDO0FBRUYsSUFBSSxFQUFFLENBQUMifQ==