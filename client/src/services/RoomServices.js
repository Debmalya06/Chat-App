import { httpClient } from "../config/AxiosHelper"

export const createRoom= async (roomDetail) =>{
    const Response = await httpClient.post(`api/v1/rooms`, roomDetail, {
        headers: {
            "Content-Type": "text/plain",
        },
    });
    return Response.data;
}
export const joinChatApi = async (roomId) => {
    const Response = await httpClient.get(`api/v1/rooms/${roomId}`);
    return Response.data;
}
export const getMessages = async (roomId, size=50, page=0) => {
    const Response = await httpClient.get(`api/v1/rooms/${roomId}/messages?${size}&page=${page}`);
    return Response.data;
}
