import { execSync } from 'child_process';

export class AzureArc {
    protected isServicePrincipal: boolean;
    protected secret: string;
    protected username: string;
    
    constructor(username: string, secret: string, isServicePrincipal: boolean = true) {
        this.isServicePrincipal = isServicePrincipal;
        this.secret = secret;
        this.username = username;
    }

    public async connectToArc(location: string, resourceGroup: string, subscription: string, tenant: string, deviceName?: string, cloud: 'AzureCloud' | 'AzureUSGovernment' | 'AzureChinaCloud' = 'AzureCloud'): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                const command = `sudo azcmagent connect --resource-group ${resourceGroup} --tenant-id ${tenant} --subscription-id ${subscription} --location ${location} --cloud ${cloud} --service-principal-id ${this.username} --service-principal-secret ${this.secret}` + deviceName ? ` --resource-name ${deviceName}` : `` + ` --verbose`;
                const result = execSync(command).toString();
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

    public async connectToArcK8s(location: string, resourceGroup: string, subscription: string, tenant: string, deviceName?: string, cloud: 'AzureCloud' | 'AzureUSGovernment' | 'AzureChinaCloud' = 'AzureCloud'): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                const command = `sudo azcmagent connect --resource-group ${resourceGroup} --tenant-id ${tenant} --subscription-id ${subscription} --location ${location} --cloud ${cloud} --service-principal-id ${this.username} --service-principal-secret ${this.secret}` + deviceName ? ` --resource-name ${deviceName}` : `` + ` --verbose`;
                const result = execSync(command).toString();
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }
}