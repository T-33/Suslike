export type Post = {
    post_id : number
    creation_date ?: string;
    text ?: string;
    imageUrl ?: string;
    user_id : number;
    likes : number;
    location ?: string
}