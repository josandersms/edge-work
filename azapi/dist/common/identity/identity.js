"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaticTokenCredential = void 0;
class StaticTokenCredential {
    accessToken;
    constructor(accessToken) {
        this.accessToken = accessToken;
    }
    async getToken() {
        return this.accessToken;
    }
}
exports.StaticTokenCredential = StaticTokenCredential;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWRlbnRpdHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tbW9uL2lkZW50aXR5L2lkZW50aXR5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLE1BQWEscUJBQXFCO0lBQ1Y7SUFBcEIsWUFBb0IsV0FBd0I7UUFBeEIsZ0JBQVcsR0FBWCxXQUFXLENBQWE7SUFBSSxDQUFDO0lBRTFDLEtBQUssQ0FBQyxRQUFRO1FBQ2pCLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQztJQUM1QixDQUFDO0NBQ0o7QUFORCxzREFNQyJ9