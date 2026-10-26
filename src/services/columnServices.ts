import { api } from "../api/axios";
import type {Column} from "../types/kanbas"

export async function createColumnApi(data:{title:string; boardId:string}):Promise<Column>{
    try {
        const response = await api.post("/columns/create",data)
        return response.data.data || response.data
    } catch (err:any) {
        throw err.response?.data || err.message || {message:"Failed to create column"}
    }
}


export async function getColumnsByBoardApi(boardId:string):Promise<Column[]>{
    try {
        const response = await api.get(`/columns/board/${boardId}`)
        return response.data.data || response.data
    } catch (err:any) {
        throw err.response?.data || err.message || {message:"Failed to fetch columns."}
    }
}


export async function updateColumnApi(columnId:string, data:{title:string}):Promise<Column>{
    try {
        const response = await api.put(`columns/update/${columnId}`,data)
        return response.data.data || response.data
    } catch (err:any) {
        throw err.response?.data || {message:"Failed to update column"}
    }
}


export async function deleteColumnApi(columnId:string):Promise<any>{
    try {
        const response = await api.delete(`columns/delete/${columnId}`)
        return response.data
    } catch (err:any) {
        throw err.response?.data || {message:"Failed to delete column"}
    }
}