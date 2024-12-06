"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.arcResponseRouter = void 0;
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const child_process_1 = require("child_process");
const keyvault_1 = require("../../feature/keyvault/keyvault");
exports.arcResponseRouter = express_1.default.Router();
exports.arcResponseRouter.get('/arc-connect', async (request, response) => {
    console.log(`Received request to connect this device to Arc`);
    if (request.headers.authorization) {
        const token = request.headers.authorization.substring(7, request.headers.authorization.length);
        const serviceAccount = (await (0, keyvault_1.getSecret)('arc-connect-sa-account', token)).value;
        const serviceAccountSecret = (await (0, keyvault_1.getSecret)('arc-connect-sa-secret', token)).value;
        try {
            const output = (0, child_process_1.execSync)(`sudo azcmagent connect --resource-group rg-poc-ecl-devex --tenant-id d2e5ac16-7068-4b2d-995b-3924af59cc7a --location ${request.query['location']} --subscription-id 57b15bf0-e8dd-458a-9156-0694edd7ad4e --cloud AzureCloud --service-principal-id ${serviceAccount} --service-principal-secret ${serviceAccountSecret} --resource-name ecl-${request.query['company']}-${request.query['locationName']} --verbose`).toString();
            console.log(`Successfully Arc Connected this device as: ecl-${request.query['company']}-${request.query['locationName']}`);
        }
        catch (error) {
            console.log(error);
        }
        response.send(JSON.stringify({ status: 'ok' }));
    }
    else {
        response.sendStatus(401);
    }
});
exports.arcResponseRouter.get('/arc-k8s-connect', async (request, response) => {
    console.log(`Received request to connect this device's Kubernetes instance to Arc`);
    if (request.headers.authorization) {
        const token = request.headers.authorization.substring(7, request.headers.authorization.length);
        const serviceAccount = (await (0, keyvault_1.getSecret)('arc-connect-sa-account', token)).value;
        const serviceAccountSecret = (await (0, keyvault_1.getSecret)('arc-connect-sa-secret', token)).value;
        try {
            const azLoginOutput = (0, child_process_1.execSync)(`az login --service-principal --username ${serviceAccount} --password ${serviceAccountSecret} --tenant d2e5ac16-7068-4b2d-995b-3924af59cc7a`).toString();
            const azExtensionOutput = (0, child_process_1.execSync)(`az config set extension.use_dynamic_install=yes_without_prompt && az extension add --upgrade --name k8s-configuration && az extension add --upgrade --name k8s-extension && az extension add --upgrade --name azure-iot-ops`).toString();
            const azK8sOutput = (0, child_process_1.execSync)(`az connectedk8s connect --kube-config "/home/msft/.kube/config" --name ${request.query['deviceName']} -l ${request.query['location']} --resource-group rg-poc-ecl-devex --subscription 57b15bf0-e8dd-458a-9156-0694edd7ad4e --enable-oidc-issuer --enable-workload-identity`).toString();
            console.log(`Successfully Arc Connected this device's Kubernetes instance as: ${request.query['deviceName']} `);
        }
        catch (error) {
            console.log(error);
        }
        response.send(JSON.stringify({ status: 'ok' }));
    }
    else {
        response.sendStatus(401);
    }
});
exports.arcResponseRouter.get('/arc-k8s-pre', async (request, response) => {
    console.log(`Received request to perform pre-requisite setup for Azure IoT Operations on this device`);
    if (request.headers.authorization) {
        const token = request.headers.authorization.substring(7, request.headers.authorization.length);
        const serviceAccount = (await (0, keyvault_1.getSecret)('arc-connect-sa-account', token)).value;
        const serviceAccountSecret = (await (0, keyvault_1.getSecret)('arc-connect-sa-secret', token)).value;
        try {
            const azLoginOutput = (0, child_process_1.execSync)(`az login --service-principal --username ${serviceAccount} --password ${serviceAccountSecret} --tenant d2e5ac16-7068-4b2d-995b-3924af59cc7a`).toString();
            const azK8sIssuer = (0, child_process_1.execSync)(`az connectedK8s show --resource-group rg-poc-ecl-devex --name ${request.query['deviceName']} --query oidcIssuerProfile.issuerUrl --output tsv`).toString().trim();
            const k8sConfig = (0, child_process_1.execSync)(`sudo echo 'kube-apiserver-arg:\n - service-account-issuer=${azK8sIssuer}\n - service-account-max-token-expiration=24h\n' > /etc/rancher/k3s/config.yaml`).toString();
            const arcEntraId = (0, child_process_1.execSync)('az ad sp show --id bc313c14-388c-4e7d-a58e-70017303ee3b --query id -o tsv').toString().trim();
            const azCustomLocation = (0, child_process_1.execSync)(`az connectedk8s enable-features --kube-config "/home/msft/.kube/config" -n ${request.query['deviceName']} -g rg-poc-ecl-devex --custom-locations-oid ${arcEntraId} --features cluster-connect custom-locations`).toString();
            const restartK8s = (0, child_process_1.execSync)(`systemctl restart k3s`).toString();
            console.log(`Successfully did some pre-work`);
        }
        catch (error) {
            console.log(error);
        }
        response.send(JSON.stringify({ status: 'ok' }));
    }
    else {
        response.sendStatus(401);
    }
});
exports.arcResponseRouter.get('/arc-k8s-aio', async (request, response) => {
    console.log('Received request to install Azure IoT Operations on this device');
    if (request.headers.authorization) {
        const token = request.headers.authorization.substring(7, request.headers.authorization.length);
        const serviceAccount = (await (0, keyvault_1.getSecret)('arc-connect-sa-account', token)).value;
        const serviceAccountSecret = (await (0, keyvault_1.getSecret)('arc-connect-sa-secret', token)).value;
        try {
            const azLoginOutput = (0, child_process_1.execSync)(`az login --service-principal --username ${serviceAccount} --password ${serviceAccountSecret} --tenant d2e5ac16-7068-4b2d-995b-3924af59cc7a`).toString();
            const aio = (0, child_process_1.execSync)(`az iot ops init --subscription 57b15bf0-e8dd-458a-9156-0694edd7ad4e -g rg-poc-ecl-devex --cluster ${request.query['deviceName']}`).toString();
            const aioInstall = (0, child_process_1.execSync)(`az iot ops create --subscription 57b15bf0-e8dd-458a-9156-0694edd7ad4e -g rg-poc-ecl-devex --cluster ${request.query['deviceName']} --custom-location cl-${request.query['companyName']}-${request.query['locationName']} -n aio-${request.query['companyName']}-${request.query['locationName']} --sr-resource-id /subscriptions/57b15bf0-e8dd-458a-9156-0694edd7ad4e/resourceGroups/rg-poc-ecl-devex/providers/Microsoft.DeviceRegistry/schemaRegistries/aiosr-aio-main --broker-frontend-replicas 1 --broker-frontend-workers 1 --broker-backend-part 1 --broker-backend-workers 1 --broker-backend-rf 2 --broker-mem-profile Low`).toString();
            console.log(`Successfully Installed Azure IoT Operations`);
        }
        catch (error) {
            console.log(error);
        }
        response.send(JSON.stringify({ status: 'ok' }));
    }
    else {
        response.sendStatus(401);
    }
});
exports.arcResponseRouter.delete('/arc', async (request, response) => {
    console.log('Received request to disconnect this device from Arc');
    if (request.headers.authorization) {
        const token = request.headers.authorization.substring(7, request.headers.authorization.length);
        const serviceAccount = (await (0, keyvault_1.getSecret)('arc-connect-sa-account', token)).value;
        const serviceAccountSecret = (await (0, keyvault_1.getSecret)('arc-connect-sa-secret', token)).value;
        try {
            const output = (0, child_process_1.execSync)(`sudo azcmagent disconnect --service-principal-id ${serviceAccount} --service-principal-secret ${serviceAccountSecret} --verbose`).toString();
            console.log(`Successfully disconnected this device from Arc`);
        }
        catch (error) {
            console.log(error);
        }
        response.send(JSON.stringify({ status: 'ok' }));
    }
    else {
        response.sendStatus(401);
    }
});
exports.arcResponseRouter.delete('/arc-k8s', async (request, response) => {
    console.log(`Received request to disconnect this device's Kubernetes instance from Arc`);
    if (request.headers.authorization) {
        const token = request.headers.authorization.substring(7, request.headers.authorization.length);
        const serviceAccount = (await (0, keyvault_1.getSecret)('arc-connect-sa-account', token)).value;
        const serviceAccountSecret = (await (0, keyvault_1.getSecret)('arc-connect-sa-secret', token)).value;
        try {
            const azLoginOutput = (0, child_process_1.execSync)(`az login --service-principal --username ${serviceAccount} --password ${serviceAccountSecret} --tenant d2e5ac16-7068-4b2d-995b-3924af59cc7a`).toString();
            const azK8sOutput = (0, child_process_1.execSync)(`az connectedk8s delete --kube-config "/home/msft/.kube/config" --name ${request.query['deviceName']} --resource-group rg-poc-ecl-devex --subscription 57b15bf0-e8dd-458a-9156-0694edd7ad4e --yes`).toString();
            console.log(`Successfully Arc disconnected this device's Kubernetes instance: ${request.query['deviceName']}`);
        }
        catch (error) {
            console.log(error);
        }
        response.send(JSON.stringify({ status: 'ok' }));
    }
    else {
        response.sendStatus(401);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJjLWNvbm5lY3Qucm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tbW9uL3JvdXRlcy9hcmMtY29ubmVjdC5yb3V0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsOERBQXFEO0FBQ3JELGlEQUF5QztBQUN6Qyw4REFBNEQ7QUFFL0MsUUFBQSxpQkFBaUIsR0FBRyxpQkFBTyxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBRWxELHlCQUFpQixDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUUsS0FBSyxFQUFFLE9BQWdCLEVBQUUsUUFBa0IsRUFBRSxFQUFFO0lBQ2pGLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0RBQWdELENBQUMsQ0FBQztJQUM5RCxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDaEMsTUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMvRixNQUFNLGNBQWMsR0FBVyxDQUFDLE1BQU0sSUFBQSxvQkFBUyxFQUFDLHdCQUF3QixFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1FBQ3hGLE1BQU0sb0JBQW9CLEdBQVcsQ0FBQyxNQUFNLElBQUEsb0JBQVMsRUFBQyx1QkFBdUIsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUM3RixJQUFJLENBQUM7WUFDRCxNQUFNLE1BQU0sR0FBRyxJQUFBLHdCQUFRLEVBQUMsd0hBQXdILE9BQU8sQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLHFHQUFxRyxjQUFjLCtCQUErQixvQkFBb0Isd0JBQXdCLE9BQU8sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksT0FBTyxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDLENBQUMsUUFB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