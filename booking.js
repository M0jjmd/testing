class booking {
    constructor(rooms, bookings) {
        this.rooms = rooms
        this.bookings = bookings
    }

    priceValidation(roomName) {
        const room = this.rooms.find(room => room.name === roomName)
        if (!room) {
            throw new Error('La habitación no existe.')
        }
        const roomRate = room.rate
        if (typeof roomRate !== 'number' || roomRate < 0) {
            throw new Error('El precio de la habitación debe ser un número positivo.')
        }
    }

    discountValidations(roomName) {
        const room = this.rooms.find(room => room.name === roomName)
        if (!room) {
            throw new Error('La habitación no existe.')
        }
        const roomDiscount = room.discount

        if (typeof roomDiscount !== 'number' || roomDiscount < 0 || roomDiscount > 100) {
            throw new Error('El descuento de la habitación debe ser un porcentaje entre 0 y 100.')
        }
    }

    calculateFinalPrice(roomName) {
        const room = this.rooms.find(room => room.name === roomName)
        if (!room) {
            throw new Error('La habitación no existe.')
        }
        const roomRate = room.rate
        const roomDiscount = room.discount

        const discountedRoomRate = roomRate - (roomRate * roomDiscount / 100)
        const finalFeeInCents = discountedRoomRate

        const finalFeeInEuros = finalFeeInCents / 100
        return finalFeeInEuros
    }
}

module.exports = booking