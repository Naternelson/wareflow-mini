export type SanitizedAddress = Partial<{
    id: number 
    street: string
    street2: string
    city: string
    state: string
    zip: string
    createdAt: Date
    updatedAt: Date
}>