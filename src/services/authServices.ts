import { api } from "../api/axios";

export async function registerUserApi(data: any) {
    try {
        const response = await api.post("/user/register", data);
        return response.data;
    } catch (err: any) {
        throw err.response?.data || err.message || { message: "An error occurred." };
    }
}

export async function loginUserApi(data: any) {
    try {
        const response = await api.post("/user/login", data);
        return response.data;
    } catch (err: any) {
        throw err.response?.data || err.message || { message: "An error occurred." };
    }
}

export async function verifyEmailApi(data: { email: string; token: string }) {
    try {
        const response = await api.post("/user/verify-email", {
            email: data.email,
            token: data.token,
            code: data.token,             // Covers req.body.code
            verificationCode: data.token, // Covers req.body.verificationCode
            otp: data.token,              // Covers req.body.otp
        });
        return response.data;
    } catch (err: any) {
        throw err.response?.data || err.message || { message: "An error occurred." };
    }
}

export async function forgotPasswordApi(email: string) {
    try {
        const response = await api.post("/user/forgot-password", { email });
        return response.data;
    } catch (err: any) {
        throw err.response?.data || { message: "An error occurred." };
    }
}

export async function changePasswordApi(data: { oldPassword: string; newPassword: string }) {
    try {
        const response = await api.put("/user/change-password", data);
        return response.data;
    } catch (err: any) {
        throw err.response?.data || { message: "An error occurred." };
    }
}

export async function getMeApi() {
    try {
        const response = await api.get("/user/me");
        return response.data;
    } catch (err: any) {
        throw err.response?.data || { message: "An error occurred." };
    }
}