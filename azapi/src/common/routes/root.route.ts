import { AccessToken } from '@azure/identity';
import express, { Request, Response } from 'express';
import { exec, execSync } from 'child_process';
import { getSecret } from '../../feature/keyvault/keyvault';


export const rootRouter = express.Router();

rootRouter.get('/', async (request: Request, response: Response) => {
    //console.log('headers are:\n', request.headers);
    if (request.headers.authorization) {
        // const token = request.headers.authorization.substring(7, request.headers.authorization.length);
        // try {
        //     const output = execSync(`azcmagent connect --resource-group rg-poc-ecl-devex --tenant-id d2e5ac16-7068-4b2d-995b-3924af59cc7a --location westUS --subscription-id 57b15bf0-e8dd-458a-9156-0694edd7ad4e --cloud AzureCloud --access-token ${token}`).toString();
        //     console.log('output is', output);
        // } catch (error) {
        //     console.log(error);
        // }
        // console.log('getting the keyvault secrets');
        // const serviceAccount: string = (await getSecret('arc-connect-sa-account', token)).value;
        // const serviceAccountSecret: string = (await getSecret('arc-connect-sa-secret', token)).value;
        // response.send(JSON.stringify({
        //     account: serviceAccount,
        //     secret: serviceAccountSecret
        // }));
        //console.log(await getSecret('arc-connect-sa-account', token));
        // {token: token, expiresOnTimestamp: new Date(request.headers.expires!).getTime()}));

        //console.log('beginning arc connection');
        // exec(`sudo azcmagent connect --resource-group rg-poc-ecl-devex --tenant-id d2e5ac16-7068-4b2d-995b-3924af59cc7a --location westUS --subscription-id 57b15bf0-e8dd-458a-9156-0694edd7ad4e --cloud AzureCloud --access-token ${token}`, (error, stdout, stderr) => {
        //     if (error) {
        //         console.error(`exec error: ${error}`);
        //         response.status(500).send(JSON.stringify({error: error}));
        //         return;
        //       }
        //       console.log(`stdout: ${stdout}`);
        //       response.status(200).send(JSON.stringify({status: 'ok', response: stdout}));
        //       console.error(`stderr: ${stderr}`);
        // });
    }
    //console.log(request);
    // const fResponse: any = {
    //     response: 'ok'
    // }
    // response.send(JSON.stringify(fResponse));
});