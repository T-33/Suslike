export type User = {
    full_name?: string;
    username: string;
    email?: string;
    description?: string;
    date_of_birth?: string;
    registration_date?: string;
    password: string;
    profile_picture_url?: string;
    background_picture_url?: string;
    zodiac_sing? : string;
    relationship_status?: string;
    followers?: number;
    following?: number;
    user_id: number;
};