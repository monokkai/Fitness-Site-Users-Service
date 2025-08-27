export interface UserProfile {
    id: number;
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    avatarUrl?: string;
    createdAt: Date;
}

export interface UpdateProfileData {
    firstName?: string;
    lastName?: string;
    phone?: string;
}

export interface UpdateAvatarData {
    avatarUrl: string;
}

export interface DeleteAccountData {
    password: string;
}

export interface UserResponse {
    message: string;
    user?: UserProfile;
    avatarUrl?: string;
}
