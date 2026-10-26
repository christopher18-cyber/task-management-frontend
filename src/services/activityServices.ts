import { api } from "../api/axios";

// export async function getBoardActivitiesApi(boardId:string):Promise<ActivityLog>{
//     try{
//         const response = await api.get(`/activity/board/${boardId}`)
//         return response.data.data || response.data
//     }catch(err:any){
//         throw err.response?.data || err.message || {message:"Failed to fetch activity logs"}
//     }
// }

export async function getActivityLogsApi(boardId: string) {
    try {
        const response = await api.get(`/activities/board/${boardId}`);
        return response.data;
    } catch (err: any) {
        throw err.response?.data || err.message || { message: "Failed to fetch activity logs." };
    }
}


export async function getBoardActivitiesApi(boardId: string) {
    try {
        const response = await api.get(`/activities/board/${boardId}`);
        const resData = response.data;
        
        // Handle various response wrappers cleanly
        if (Array.isArray(resData)) return resData;
        return resData.data || resData.logs || resData.activities || [];
    } catch (err: any) {
        throw err.response?.data || { message: "Failed to fetch activity logs." };
    }
}