export type UserRole = 'Student' | 'Educator' | 'Content Creator' | 'Administrator'

export interface Site {
    id: string
    name: string
    created_at?: string
}

export interface Profile {
    id: string
    name: string | null
    role: UserRole | null
    site_id: string | null
    academy_id: string | null
    created_at?: string
}

export interface Academy {
    id: string
    name: string
    description: string | null
    icon: string | null
}

export interface Course {
    id: string
    title: string
    description: string | null
    category: string | null
    thumbnail: string | null
    site_id: string | null
    academy_id: string | null
}
