import express from 'express';
import cors from 'cors';

import { ResourceManagementClient } from '@azure/arm-resources';
import { AccessToken, TokenCredential } from '@azure/identity';
import * as msalNode from '@azure/msal-node';
import { SecretClient } from '@azure/keyvault-secrets';
import { environment } from './environment/environment';
import { rootRouter } from './common/routes/root.route';
import { arcResponseRouter } from './common/routes/arc-connect.route';

const main = async (): Promise<undefined> => {
    return new Promise(async (resolve, reject) => {
        try {
            const server = express();
            server.use(cors());
            server.use(rootRouter);
            server.use(arcResponseRouter);
            server.listen(environment.api.port, () => {
                console.log('Server listening on port %s', environment.api.port);
            });
            resolve(undefined);
        } catch (error) {
            reject(error as Error);
        }
    });
};

main();

// class StaticTokenCredential implements TokenCredential {
//     constructor(private accessToken: AccessToken) { }

//     public async getToken(): Promise<AccessToken> {
//         return this.accessToken;
//     }
// }

// class ConfidentialClientCredential implements TokenCredential {
//     constructor(private confidentialApp: msalNode.ConfidentialClientApplication) {}
//     const something: TokenCredential = new Credential
//     public async getToken(scopes: string | string[]): Promise<AccessToken> {
//         const result = await this.confidentialApp.acquireTokenByClientCredential
//     }
// }

// const main = async(): Promise<void> {
//     const accessToken = getTokenForScope('https://vault.azure.net/.default');
//     const credential = new StaticTokenCredential(accessToken);
//     const client = new SecretClient(environment.identity.keyvaultUri, credential);
// }

