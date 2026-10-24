import { api } from "../api/axios"

export async function registerUserApi(data:any){
    try {
        const response = await api.post("/user/register",data)
        return response.data;
    } catch (err:any) {
        throw err.response?.data || {message:"An error occured."}
    }
}


export async function loginUserApi(data:any){
    try {
        const response = await api.post("/user/login",data)
        return response.data;
    } catch (err:any) {
        throw err.response?.data || {message : "An error occured."}
    }
}