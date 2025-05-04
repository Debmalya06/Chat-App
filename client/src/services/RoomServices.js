import { httpClient } from "../config/AxiosHelper"

export const createRoom= async (roomDetail) =>{
    const Response = await httpClient.post(`api/v1/rooms`, roomDetail, {
        headers: {
            "Content-Type": "text/plain",
        },
    });
    return Response.data;
}