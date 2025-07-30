
import { User } from "@/interfaces";

export const getUser = async (userId: string): Promise<User | null> => {
    console.log("Getting user:", userId);
    // In a real app, you would fetch this from your backend
    return null;
};

export const uploadUser = async (user: User): Promise<void> => {
    console.log("Uploading user:", user);
    // In a real app, you would send this to your backend
};
