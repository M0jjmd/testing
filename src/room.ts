import { Room, Booking } from './types'

class room {
    rooms: Room[]
    bookings: Booking[]
    constructor(rooms: Room[], bookings: Booking[]) {
        this.rooms = rooms
        this.bookings = bookings
    }

    hasBookedRooms() {
        return this.bookings.length > 0
    }

    isOccupied(date: Date): boolean {
        return this.bookings.some(booking => {
            const checkInDate = new Date(booking.checkin)
            const checkOutDate = new Date(booking.checkout)

            checkInDate.setHours(0, 0, 0, 0)
            checkOutDate.setHours(0, 0, 0, 0)
            date.setHours(0, 0, 0, 0)

            const isOccupied = checkInDate <= date && date <= checkOutDate

            return isOccupied
        })
    }

    validateRoomRates(): void {
        this.rooms.forEach(room => {
            if (typeof room.rate !== 'number' || !Number.isInteger(room.rate)) {
                throw new Error(`La habitación ${room.name} tiene una tarifa no válida: ${room.rate}. Debe ser un número entero.`)
            }
            if (typeof room.discount !== 'number' || !Number.isInteger(room.discount)) {
                throw new Error(`La habitación ${room.name} tiene un descuento no válido: ${room.discount}. Debe ser un número entero.`)
            }
        })
    }

    occupancyPercentage(startDate: Date, endDate: Date) {
        const start = new Date(startDate)
        const end = new Date(endDate)
        let totalDays = 0
        let occupiedDays = 0

        for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
            const currentDate = new Date(date)

            currentDate.setHours(0, 0, 0, 0)

            totalDays++

            if (this.isOccupied(currentDate)) {
                occupiedDays++
            }
        }
        return totalDays === 0 ? 0 : (occupiedDays / totalDays) * 100
    }

    static totalOccupancyPercentage(rooms: Room[], bookings: Booking[], startDate: Date, endDate: Date) {
        const start = new Date(startDate)
        const end = new Date(endDate)
        const totalDays = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24) + 1

        if (totalDays <= 0) {
            return 0
        }

        rooms.forEach(room => {
            (room as any).bookings = []
        })

        bookings.forEach(booking => {
            const room = rooms.find(room => room.name === booking.name.replace('Booking', 'Room'))
            if (room) {
                (room as any).bookings.push(booking)
            }
        })

        let totalOccupiedDays = 0
        const totalRoomDays = rooms.length * totalDays

        rooms.forEach(room => {
            const roomBookings = (room as any).bookings as Booking[]

            if (roomBookings) {
                roomBookings.forEach(booking => {
                    const bookingStart = booking.checkin > start ? booking.checkin : start
                    const bookingEnd = booking.checkout < end ? booking.checkout : end

                    if (bookingStart <= bookingEnd) {
                        const occupiedDays = (bookingEnd.getTime() - bookingStart.getTime()) / (1000 * 60 * 60 * 24) + 1
                        totalOccupiedDays += occupiedDays
                    }
                })
            }
        })

        // const occupancyPercentage = (totalOccupiedDays / totalRoomDays) * 100
        return (totalOccupiedDays / totalRoomDays) * 100
    }

    static availableRooms(rooms: Room[], bookings: Booking[], startDateStr: Date, endDateStr: Date) {
        const startDate = new Date(startDateStr)
        const endDate = new Date(endDateStr)

        return rooms.filter(room => {
            const roomBookings = bookings.filter(booking => booking.roomName === room.name)

            const isAvailable = !roomBookings.some(booking => {
                const bookingStart = new Date(booking.checkin)
                const bookingEnd = new Date(booking.checkout)

                const overlaps = bookingStart < endDate && bookingEnd > startDate

                return overlaps
            })

            return isAvailable
        })
    }
}

module.exports = room