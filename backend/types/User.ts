export type User = {
    full_name?: string;
    username: string;
    email?: string;
    date_of_birth?: string;
    password: string;
    profile_picture_url?: string;
    background_picture_url?: string;
    includeZodiacSignFlag?: boolean;
    relationship_status?: string;
    followers?: number;
    following?: number;
    user_id: number;
};