import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";


@Injectable()
export class HAService {
    constructor(
        private readonly httpService: HttpService
    ) { }

    getCamPicture(camEntity: string) {
        return this.httpService.get("/states/" + camEntity, {
            baseURL: process.env.HA_API_URL,
            headers: { "Content-Type": "application/json", "Authorization": "Bearer " + process.env.HA_TOKEN }
        })
    }

}
