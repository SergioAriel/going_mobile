import { User } from "@/interfaces";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const getUser = async (userId: string, token?: string): Promise<User | null> => {
    const response = await fetch(`${API_URL}/users/${userId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error("Failed to fetch user");
    }
    return response.json();
};

export const uploadUser = async (user: Partial<User> & { _id: string }, token?: string): Promise<User> => {
    const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(user),
    });
    if (!response.ok) {
        throw new Error("Failed to upload user");
    }
    return response.json();
};

export const updateUser = async (user: Partial<User> & { _id: string }, token?: string): Promise<User> => {
    const response = await fetch(`${API_URL}/users/${user._id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(user),
    });
    if (!response.ok) {
        throw new Error("Failed to update user");
    }
    return response.json();
};

export const deleteUser = async (userId: string, token?: string): Promise<void> => {
    const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) {
        throw new Error("Failed to delete user");
    }
};