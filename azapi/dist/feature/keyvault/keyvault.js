"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSecret = void 0;
const tslib_1 = require("tslib");
const environment_1 = require("../../environment/environment");
const https = tslib_1.__importStar(require("node:https"));
const http = tslib_1.__importStar(require("node:http"));
const httpClient = async (uri, method, token, secure = true) => {
    return new Promise(async (resolve, reject) => {
        try {
            const resultHandler = async (result) => {
                return new Promise((resolve, reject) => {
                    let data = '';
                    result.on('error', (e) => {
                        console.error(e);
                        reject(e);
                    });
                    result.on('data', (chunk) => {
                        data += chunk;
                    });
                    result.on('end', () => {
                        resolve(data);
                    });
                });
            };
            const headers = {};
            headers.accept = 'application/json, text/plain, */*';
            if (token)
                headers.authorization = `Bearer ${token}`;
            if (secure) {
                const request = https.request(uri, {
                    headers,
                    method
                }, async (result) => {
                    resolve(await resultHandler(result));
                });
                request.on('error', (error) => {
                    console.error(error);
                    reject(error);
                });
                request.end();
            }
            else {
                const request = http.request(uri, {
                    headers,
                    method
                }, async (result) => {
                    resolve(await resultHandler(result));
                });
                request.on('error', (error) => {
                    console.error(error);
                    reject(error);
                });
                request.end();
            }
        }
        catch (error) {
            reject(error);
        }
    });
};
const getSecret = async (secretName, token) => {
    return new Promise(async (resolve, reject) => {
        try {
            resolve(JSON.parse(await httpClient(`${environment_1.environment.identity.keyvaultUri}/secrets/${secretName}/?api-version=7.5`, 'GET', token, true)));
        }
        catch (error) {
            reject(error);
        }
    });
};
exports.getSecret = getSecret;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2V5dmF1bHQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZmVhdHVyZS9rZXl2YXVsdC9rZXl2YXVsdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBSUEsK0RBQTREO0FBQzVELDBEQUFvQztBQUNwQyx3REFBa0M7QUFzRWxDLE1BQU0sVUFBVSxHQUFHLEtBQUssRUFBSyxHQUFXLEVBQUUsTUFBYyxFQUFFLEtBQWMsRUFBRSxTQUFrQixJQUFJLEVBQWMsRUFBRTtJQUM1RyxPQUFPLElBQUksT0FBTyxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7UUFDekMsSUFBSSxDQUFDO1lBRUQsTUFBTSxhQUFhLEdBQUcsS0FBSyxFQUFLLE1BQTRCLEVBQWMsRUFBRTtnQkFDeEUsT0FBTyxJQUFJLE9BQU8sQ0FBSSxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtvQkFDdEMsSUFBSSxJQUFJLEdBQVcsRUFBRSxDQUFDO29CQUN0QixNQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFO3dCQUNyQixPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNqQixNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ2QsQ0FBQyxDQUFDLENBQUM7b0JBQ0gsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxLQUFLLEVBQUUsRUFBRTt3QkFDeEIsSUFBSSxJQUFJLEtBQUssQ0FBQztvQkFDbEIsQ0FBQyxDQUFDLENBQUM7b0JBQ0gsTUFBTSxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFO3dCQUNsQixPQUFPLENBQUMsSUFBUyxDQUFDLENBQUM7b0JBQ3ZCLENBQUMsQ0FBQyxDQUFDO2dCQUNQLENBQUMsQ0FBQyxDQUFDO1lBRVAsQ0FBQyxDQUFDO1lBQ0YsTUFBTSxPQUFPLEdBQTZCLEVBQUUsQ0FBQztZQUM3QyxPQUFPLENBQUMsTUFBTSxHQUFHLG1DQUFtQyxDQUFDO1lBQ3JELElBQUksS0FBSztnQkFBRSxPQUFPLENBQUMsYUFBYSxHQUFHLFVBQVUsS0FBSyxFQUFFLENBQUM7WUFFckQsSUFBSSxNQUFNLEVBQUUsQ0FBQztnQkFDVCxNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRTtvQkFDL0IsT0FBTztvQkFDUCxNQUFNO2lCQUNULEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxFQUFFO29CQUNoQixPQUFPLENBQUMsTUFBTSxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDekMsQ0FBQyxDQUFDLENBQUM7Z0JBQ0gsT0FBTyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxLQUFLLEVBQUUsRUFBRTtvQkFDMUIsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDckIsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNsQixDQUFDLENBQUMsQ0FBQztnQkFDSCxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUM7WUFDbEIsQ0FBQztpQkFBTSxDQUFDO2dCQUNKLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFO29CQUM5QixPQUFPO29CQUNQLE1BQU07aUJBQ1QsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEVBQUU7b0JBQ2hCLE9BQU8sQ0FBQyxNQUFNLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUN6QyxDQUFDLENBQUMsQ0FBQztnQkFDSCxPQUFPLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDLEtBQUssRUFBRSxFQUFFO29CQUMxQixPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUNyQixNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ2xCLENBQUMsQ0FBQyxDQUFDO2dCQUNILE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUNsQixDQUFDO1FBRUwsQ0FBQztRQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7WUFDYixNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDbEIsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFBO0FBRU0sTUFBTSxTQUFTLEdBQUcsS0FBSyxFQUFFLFVBQWtCLEVBQUUsS0FBYSxFQUEyQixFQUFFO0lBQzFGLE9BQU8sSUFBSSxPQUFPLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtRQUN6QyxJQUFJLENBQUM7WUFFRCxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLFVBQVUsQ0FBQyxHQUFHLHlCQUFXLENBQUMsUUFBUSxDQUFDLFdBQVcsWUFBWSxVQUFVLG1CQUFtQixFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBc0I1SSxDQUFDO1FBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztZQUNiLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNsQixDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUE7QUE5QlksUUFBQSxTQUFTLGFBOEJyQiJ9