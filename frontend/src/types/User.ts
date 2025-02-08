export type User = {
    full_name?: string;
    username: string;
    email?: string;
    description?: string;
    date_of_birth?: string;
    password: string;
    profile_picture_url?: string;
    background_picture_url?: string;
    zodiacSing? : string;
    includeZodiacSignFlag?: boolean;
    relationship_status?: string;
    followers?: number;
    following?: number;
    user_id: number;
};