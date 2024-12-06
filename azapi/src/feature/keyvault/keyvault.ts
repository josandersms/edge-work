import { AccessToken, InteractiveBrowserCredential, OnBehalfOfCredential } from '@azure/identity';
import { SecretClient } from '@azure/keyvault-secrets';
import * as msal from '@azure/msal-node';
import { StaticTokenCredential } from '../../common/identity/identity';
import { environment } from '../../environment/environment';
import * as https from 'node:https';
import * as http from 'node:http';
//import { createHttpHeaders, HttpClient, HttpHeaders, PipelineRequest, PipelineResponse } from '@azure/core-rest-pipeline';

// class myHttpClient implements HttpClient {
//     constructor(private token: string) {}

//     public sendRequest(request: PipelineRequest): Promise<PipelineResponse> {
//         return new Promise((resolve, reject) => {
//             try {
//                 const formattedResponse: PipelineResponse = {
//                     request: request,
//                     status: 0,
//                     headers: createHttpHeaders(),
//                 };
//                 console.log('in sendRequest with request of', request);

//                 const headers: OutgoingHttpHeaders = {
//                     authorization: `Bearer ${this.token}`
//                 };
//                 for (const h of request.headers) {
//                     headers[h[0]] = h[1];
//                 }
              
//                 const httpRequest = https.request(request.url, {
//                     headers: headers,
//                     method: request.method,
                    
//                 }, (result) => {
//                     console.log('headers were', headers);
//                     let data: string = '';
//                     result.on('error', (e) => {
//                         console.error(e);
//                         throw(e);
//                     });
//                     result.on('data', (chunk) => {
//                         console.log('chunk is', chunk.toString());
//                         data += chunk;
//                     });
//                     result.on('end', () => {
//                         formattedResponse.status = result.statusCode as number;
//                         //formattedResponse.headers = result.rawHeaders as unknown as HttpHeaders;
//                         formattedResponse.bodyAsText = data;
                        
//                         resolve(formattedResponse);
//                     });
//                 });
//                 httpRequest.on('connect', (stream) => {
//                     console.log('CONNECTED!!!!');
//                 });
//                 httpRequest.on('error', (error) => {
//                     console.error('error here', error);
//                     reject(error);
//                 });
//                 httpRequest.end();

      
                
//             } catch (error) {
//                 reject(error);
//             }
//         });
//     }
// }
export type secretResponse = {
    attributes: any;
    id: string;
    tags: any;
    value: string;
}

const httpClient = async <T>(uri: string, method: string, token?: string, secure: boolean = true): Promise<T> => {
    return new Promise(async (resolve, reject) => {
        try {

            const resultHandler = async <T>(result: http.IncomingMessage): Promise<T> => {
                return new Promise<T>((resolve, reject) => {
                    let data: string = '';
                    result.on('error', (e) => {
                        console.error(e);
                        reject(e);
                    });
                    result.on('data', (chunk) => {
                        data += chunk;
                    });
                    result.on('end', () => {
                        resolve(data as T);
                    });
                });
                
            };
            const headers: http.OutgoingHttpHeaders = {};
            headers.accept = 'application/json, text/plain, */*';
            if (token) headers.authorization = `Bearer ${token}`;

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
            } else {
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
            
        } catch (error) {
            reject(error);
        }
    });
}

export const getSecret = async (secretName: string, token: string): Promise<secretResponse> => {
    return new Promise(async (resolve, reject) => {
        try {       

            resolve(JSON.parse(await httpClient(`${environment.identity.keyvaultUri}/secrets/${secretName}/?api-version=7.5`, 'GET', token, true)));
            // const tokenCredential = new InteractiveBrowserCredential({
            //     clientId: 'cfa8b339-82a2-471a-a3c9-0fc0be7a4093'
            // });
            // const httpClient = new myHttpClient(token);
            // const muhjwt = msal.ClientAssertion.fromAssertion(token);
            // console.log('muhjwt is', muhjwt['jwt']);
            // const tokenCredential = new OnBehalfOfCredential({
            //    tenantId: "d2e5ac16-7068-4b2d-995b-3924af59cc7a",
            //    clientId: "cfa8b339-82a2-471a-a3c9-0fc0be7a4093",
            //    getAssertion: () => {
            //      return Promise.resolve(`Bearer ${token}`);
            //    },
            //    userAssertionToken: `${token}`
            // });
            //const tokenCredential = new StaticTokenCredential(token);
            
            // const client = new SecretClient(environment.identity.keyvaultUri, tokenCredential, {
            //     httpClient: httpClient
            // });
            // const result = await client.getSecret(secretName);
            
        } catch (error) {
            reject(error);
        }
    });
}