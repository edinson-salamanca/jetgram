export interface JetPost {
    imgs?: string[];
    // id?: string;
    message?: string;
    coords?: string;
    user?: JetUser;
    created_at?: string;
}

export interface JetUser {
    id?: string;
    email?: string;
    name?: string;
    password?: string;
    avatar?: string;
}
