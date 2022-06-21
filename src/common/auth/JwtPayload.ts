export interface JwtPayload {
    id: number, 
    pseudo: string, 
    email: string, 
    role: { 
        id: number,
        name: string, 
        description: string
    },
    date_manager: {
        id: number,
        d_creation: Date, 
        d_activations: Date[], 
        d_connections_succeeded: Date[], 
        d_connections_failed: Date[], 
        d_profile_updated: Date[], 
    }
};


