export interface Room {
    name: string
    rate: number
    discount: number
}

export interface Booking {
    name: string
    email: string
    checkin: Date
    checkout: Date
    roomName?: string
}