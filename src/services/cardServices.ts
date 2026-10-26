import { api } from "../api/axios";
import type{Card} from "../types/kanbas"

export async function createCardApi(data:{
    title:string;
    description?:string;
    columnId:string;
    boardId:string;
    priority?: "low" | "medium" | "high";    
}):Promise<Card>{
    try {
        const response = await api.post("cards",data)
        return response.data.data || response.data
    } catch (err:any) {
        throw err.response?.data || err.message || {message:"Failed to create task card."}
    }
}


export async function getCardsByBoardApi(boardId: string):Promise<Card[]>{
    try {
        const response = await api.get(`/cards/board/${boardId}`)
        return response.data.data || response.data
    } catch (err:any) {
        throw err.response?.data || err.message || {message:"Failed to fetch card"}
    }
}


export async function updateCardApi(cardId:string, data: Partial<Card>):Promise<Card>{
    try {
        const response = await api.put(`cards/${cardId}`,data)
        return response.data.data || response.data
    } catch (err:any) {
        return err.response?.data || err.message || {message:"Failed to update card."}
    }
}


export async function reorderCardsApi(data:{cardIds:string[]; columnId:string}):Promise<any>{
    try{
        const response = await api.put("/cards/reorder",data)
        return response.data
    }catch(err:any){
        return err.response?.data || err.message || {message:"Failed to reorder cards."}
    }
}

export async function deleteCardApi(cardId:string):Promise<any>{
    try {
        const response = await api.delete(`/cards/${cardId}`)
        return response.data
    } catch (err:any) {
        throw err.response?.data || err.message || {message:"Failed to delete cards"}
    }
}