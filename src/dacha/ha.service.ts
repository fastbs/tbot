import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";


@Injectable()
export class HAService {
    constructor(
        private readonly httpService: HttpService
    ) { }

    getEntityState(entityId: string) {
        return this.httpService.get("/states/" + entityId,
            {
                baseURL: process.env.HA_API_URL,
                headers: { "Content-Type": "application/json", "Authorization": "Bearer " + process.env.HA_TOKEN }
            })
    }

    callService(domain: string, service: string, entityId: string) {
        return this.httpService.post(`/services/${domain}/${service}`,
            { "entity_id": entityId, },
            {
                baseURL: process.env.HA_API_URL,
                headers: { "Content-Type": "application/json", "Authorization": "Bearer " + process.env.HA_TOKEN }
            });
    }

}
