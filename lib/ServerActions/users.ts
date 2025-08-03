
import { User } from "@/interfaces";

const API_URL = "http://192.168.0.196:3000/api"; // Adjust if your web app runs on a different port

export const getUser = async (userId: string): Promise<User | null> => {
    const response = await fetch(`${API_URL}/users?_id=${userId}`);
    if (!response.ok) {
        throw new Error("Failed to fetch user");
    }
    const { result } = await response.json();
    return result;
};

export const uploadUser = async (user: User): Promise<void> => {
    console.log("Uploading user:", user);
    // In a real app, you would send this to your backend
};
