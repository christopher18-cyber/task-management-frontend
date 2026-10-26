import { api } from "../api/axios";
import type { Card, Board } from "../types/kanbas";

export async function getBoardsApi():Promise<Board[]>{
    try {
        const response = await api.get("/boards/all")
        return response.data.data || response.data
    } catch (err:any) {
        throw err.response?.data || err.message || {message:"Failed to fetch boards"} 
    }
}


export async function createBoardApi(data:{title:String; description?:string}):Promise<Board>{
    try{
        const response = await api.post("/boards/create", data)
        return response.data || response.data.data
    }catch(err:any){
        throw err.message || err.response?.data || { message: "Failed to create board." };
    }
}


export async function getBoardsByIdApi(boardId: string):Promise<Board>{
    try{
        const response = await api.get(`/boards/${boardId}`)
        return response.data || response.data.data
    }catch(err:any){
        throw err.message || err.response?.data || {message:"Failed to fetch board details"}
    }
}


export async function addMemberToBoardApi(boardId: string, email: string) {
    try {
        const response = await api.post(`/boards/${boardId}/members`, {
            email: email,
            memberEmail: email,
            userEmail: email,
        });
        return response.data;
    } catch (err: any) {
        throw err.response?.data || { message: "Failed to invite member." };
    }
}


export async function deleteBoardApi(boardId: string) {
    try {
        const response = await api.delete(`/boards/${boardId}`);
        return response.data;
    } catch (err: any) {
        throw err.response?.data || err.message || { message: "Failed to delete board." };
    }
}