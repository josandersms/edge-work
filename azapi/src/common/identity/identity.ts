import { TokenCredential, AccessToken} from '@azure/identity';

export class StaticTokenCredential implements TokenCredential {
    constructor(private accessToken: AccessToken) { }

    public async getToken(): Promise<AccessToken> {
        return this.accessToken;
    }
}


