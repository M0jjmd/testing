const roomsData = require('./ApiData.json')

const calculateFinalPrice = (roomId) => {
    const room = roomsData.rooms.find(room => room.RoomID === roomId)
    const roomRate = room.Rate
    const roomDiscount = room.discount
    const bookingDiscount = room.bookingDiscount

    if (typeof roomRate !== 'number' || roomRate < 0) {
        throw new Error('El precio de la habitación debe ser un número positivo.')
    }
    if (typeof roomDiscount !== 'number' || roomDiscount < 0 || roomDiscount > 100) {
        throw new Error('El descuento de la habitación debe ser un porcentaje entre 0 y 100.')
    }
    if (typeof bookingDiscount !== 'number' || bookingDiscount < 0 || bookingDiscount > 100) {
        throw new Error('El descuento de la reserva debe ser un porcentaje entre 0 y 100.')
    }

    const discountedRoomRate = roomRate - (roomRate * roomDiscount / 100)

    const finalFeeInCents = discountedRoomRate - (discountedRoomRate * bookingDiscount / 100)

    const finalFeeInEuros = finalFeeInCents / 100
    return finalFeeInEuros
}

module.exports = { calculateFinalPrice }