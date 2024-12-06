import express, { Request, Response } from 'express';
import { execSync } from 'child_process';
import { getSecret } from '../../feature/keyvault/keyvault';

export const arcResponseRouter = express.Router();

arcResponseRouter.get('/arc-connect', async (request: Request, response: Response) => {
    console.log(`Received request to connect this device to Arc`);
    if (request.headers.authorization) {
        const token = request.headers.authorization.substring(7, request.headers.authorization.length);
        const serviceAccount: string = (await getSecret('arc-connect-sa-account', token)).value;
        const serviceAccountSecret: string = (await getSecret('arc-connect-sa-secret', token)).value;
        try {
            const output = execSync(`sudo azcmagent connect --resource-group rg-poc-ecl-devex --tenant-id d2e5ac16-7068-4b2d-995b-3924af59cc7a --location ${request.query['location']} --subscription-id 57b15bf0-e8dd-458a-9156-0694edd7ad4e --cloud AzureCloud --service-principal-id ${serviceAccount} --service-principal-secret ${serviceAccountSecret} --resource-name ecl-${request.query['company']}-${request.query['locationName']} --verbose`).toString();
            console.log(`Successfully Arc Connected this device as: ecl-${request.query['company']}-${request.query['locationName']}`);
        } catch (error) {
            console.log(error);
        }
        response.send(JSON.stringify({status: 'ok'}));
    } else {
        response.sendStatus(401);
    }
});

arcResponseRouter.get('/arc-k8s-connect', async (request: Request, response: Response) => {
    console.log(`Received request to connect this device's Kubernetes instance to Arc`);
    if (request.headers.authorization) {
        const token = request.headers.authorization.substring(7, request.headers.authorization.length);
        const serviceAccount: string = (await getSecret('arc-connect-sa-account', token)).value;
        const serviceAccountSecret: string = (await getSecret('arc-connect-sa-secret', token)).value;
        try {
            const azLoginOutput = execSync(`az login --service-principal --username ${serviceAccount} --password ${serviceAccountSecret} --tenant d2e5ac16-7068-4b2d-995b-3924af59cc7a`).toString();
            const azExtensionOutput = execSync(`az config set extension.use_dynamic_install=yes_without_prompt && az extension add --upgrade --name k8s-configuration && az extension add --upgrade --name k8s-extension && az extension add --upgrade --name azure-iot-ops`).toString();
            const azK8sOutput = execSync(`az connectedk8s connect --kube-config "/home/msft/.kube/config" --name ${request.query['deviceName']} -l ${request.query['location']} --resource-group rg-poc-ecl-devex --subscription 57b15bf0-e8dd-458a-9156-0694edd7ad4e --enable-oidc-issuer --enable-workload-identity`).toString();
            console.log(`Successfully Arc Connected this device's Kubernetes instance as: ${request.query['deviceName']} `);
        } catch (error) {
            console.log(error);
        }
        response.send(JSON.stringify({status: 'ok'}));
    } else {
        response.sendStatus(401);
    }
});

arcResponseRouter.get('/arc-k8s-pre', async (request: Request, response: Response) => {
    console.log(`Received request to perform pre-requisite setup for Azure IoT Operations on this device`);
    if (request.headers.authorization) {
        const token = request.headers.authorization.substring(7, request.headers.authorization.length);
        const serviceAccount: string = (await getSecret('arc-connect-sa-account', token)).value;
        const serviceAccountSecret: string = (await getSecret('arc-connect-sa-secret', token)).value;
        try {
            const azLoginOutput = execSync(`az login --service-principal --username ${serviceAccount} --password ${serviceAccountSecret} --tenant d2e5ac16-7068-4b2d-995b-3924af59cc7a`).toString();
            const azK8sIssuer = execSync(`az connectedK8s show --resource-group rg-poc-ecl-devex --name ${request.query['deviceName']} --query oidcIssuerProfile.issuerUrl --output tsv`).toString().trim();
            const k8sConfig = execSync(`sudo echo 'kube-apiserver-arg:\n - service-account-issuer=${azK8sIssuer}\n - service-account-max-token-expiration=24h\n' > /etc/rancher/k3s/config.yaml`).toString();
            const arcEntraId = execSync('az ad sp show --id bc313c14-388c-4e7d-a58e-70017303ee3b --query id -o tsv').toString().trim();
            const azCustomLocation = execSync(`az connectedk8s enable-features --kube-config "/home/msft/.kube/config" -n ${request.query['deviceName']} -g rg-poc-ecl-devex --custom-locations-oid ${arcEntraId} --features cluster-connect custom-locations`).toString();
            const restartK8s = execSync(`systemctl restart k3s`).toString();
            console.log(`Successfully did some pre-work`);
        } catch (error) {
            console.log(error);
        }
        response.send(JSON.stringify({status: 'ok'}));
    } else {
        response.sendStatus(401);
    }
});

arcResponseRouter.get('/arc-k8s-aio', async (request: Request, response: Response) => {
    console.log('Received request to install Azure IoT Operations on this device');
    if (request.headers.authorization) {
        const token = request.headers.authorization.substring(7, request.headers.authorization.length);
        const serviceAccount: string = (await getSecret('arc-connect-sa-account', token)).value;
        const serviceAccountSecret: string = (await getSecret('arc-connect-sa-secret', token)).value;
        try {
            const azLoginOutput = execSync(`az login --service-principal --username ${serviceAccount} --password ${serviceAccountSecret} --tenant d2e5ac16-7068-4b2d-995b-3924af59cc7a`).toString();
            const aio = execSync(`az iot ops init --subscription 57b15bf0-e8dd-458a-9156-0694edd7ad4e -g rg-poc-ecl-devex --cluster ${request.query['deviceName']}`).toString();
            const aioInstall = execSync(`az iot ops create --subscription 57b15bf0-e8dd-458a-9156-0694edd7ad4e -g rg-poc-ecl-devex --cluster ${request.query['deviceName']} --custom-location cl-${request.query['companyName']}-${request.query['locationName']} -n aio-${request.query['companyName']}-${request.query['locationName']} --sr-resource-id /subscriptions/57b15bf0-e8dd-458a-9156-0694edd7ad4e/resourceGroups/rg-poc-ecl-devex/providers/Microsoft.DeviceRegistry/schemaRegistries/aiosr-aio-main --broker-frontend-replicas 1 --broker-frontend-workers 1 --broker-backend-part 1 --broker-backend-workers 1 --broker-backend-rf 2 --broker-mem-profile Low`).toString();
            console.log(`Successfully Installed Azure IoT Operations`);
        } catch (error) {
            console.log(error);
        }
        response.send(JSON.stringify({status: 'ok'}));
    } else {
        response.sendStatus(401);
    }
});

arcResponseRouter.delete('/arc', async (request: Request, response: Response) => {
    console.log('Received request to disconnect this device from Arc');
    if (request.headers.authorization) {
        const token = request.headers.authorization.substring(7, request.headers.authorization.length);
        const serviceAccount: string = (await getSecret('arc-connect-sa-account', token)).value;
        const serviceAccountSecret: string = (await getSecret('arc-connect-sa-secret', token)).value;
        try {
            const output = execSync(`sudo azcmagent disconnect --service-principal-id ${serviceAccount} --service-principal-secret ${serviceAccountSecret} --verbose`).toString();
            console.log(`Successfully disconnected this device from Arc`);
        } catch (error) {
            console.log(error);
        }
        response.send(JSON.stringify({status: 'ok'}));
    } else {
        response.sendStatus(401);
    }
});

arcResponseRouter.delete('/arc-k8s', async(request: Request, response: Response) => {
    console.log(`Received request to disconnect this device's Kubernetes instance from Arc`);
    if (request.headers.authorization) {
        const token = request.headers.authorization.substring(7, request.headers.authorization.length);
        const serviceAccount: string = (await getSecret('arc-connect-sa-account', token)).value;
        const serviceAccountSecret: string = (await getSecret('arc-connect-sa-secret', token)).value;
        try {
            const azLoginOutput = execSync(`az login --service-principal --username ${serviceAccount} --password ${serviceAccountSecret} --tenant d2e5ac16-7068-4b2d-995b-3924af59cc7a`).toString();
            const azK8sOutput = execSync(`az connectedk8s delete --kube-config "/home/msft/.kube/config" --name ${request.query['deviceName']} --resource-group rg-poc-ecl-devex --subscription 57b15bf0-e8dd-458a-9156-0694edd7ad4e --yes`).toString();
            console.log(`Successfully Arc disconnected this device's Kubernetes instance: ${request.query['deviceName']}`);
        } catch (error) {
            console.log(error);
        }
        response.send(JSON.stringify({status: 'ok'}));
    } else {
        response.sendStatus(401);
    }
});