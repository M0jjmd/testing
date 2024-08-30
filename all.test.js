const booking = require('./booking')
const Room = require('./room')

const room1 = { name: 'Room One', rate: 15000, discount: 10 }
const room2 = { name: 'Room Two', rate: 13000, discount: 50 }
const room3 = { name: 'Room Three', rate: 9000, discount: 5 }

const booking1 = { name: 'Booking One', email: 'booking1@booking.com', checkin: new Date('2024-08-01'), checkout: new Date('2024-09-01') }
const booking2 = { name: 'Booking Two', email: 'booking2@booking.com', checkin: new Date('2024-08-10'), checkout: new Date('2024-08-25') }
const booking3 = { name: 'Booking Three', email: 'booking3@booking.com', checkin: new Date('2024-08-10'), checkout: new Date('2024-09-05') }

describe('Room Class', () => {
    test('validateRoomProperties throws error if a room is missing required properties', () => {
        const rooms = [{ name: 'Room One', rate: 15000 }]
        const bookings = []
        const roomInstance = new Room(rooms, bookings)

        expect(() => roomInstance.validateRoomProperties(rooms[0])).toThrow('La habitación Room One no tiene la propiedad discount')
    })

    test('validateRoomProperties does not throw error if all required properties are present', () => {
        const roomInstance = new Room([room1], [])
        expect(() => roomInstance.validateRoomProperties(room1)).not.toThrow()
    })

    test('validateRoomRates throws error if room rate or discount is not a valid integer', () => {
        const room2InvalidRate = { name: 'Room Two', rate: 'test', discount: 50 }
        const room2InvalidDiscount = { name: 'Room Two', rate: 13000, discount: 'test' }

        const RoomInvalidRate = new Room([room1, room2InvalidRate, room3], [])
        expect(() => RoomInvalidRate.validateRoomRates()).toThrowError('La habitación Room Two tiene una tarifa no válida: test. Debe ser un número entero.')

        const RoomInvalidDiscount = new Room([room1, room2InvalidDiscount, room3], [])
        expect(() => RoomInvalidDiscount.validateRoomRates()).toThrowError('La habitación Room Two tiene un descuento no válido: test. Debe ser un número entero.')
    })

    test('validateRoomRates does not throw error if room rate and discount are valid integers', () => {
        const roomInstance = new Room([room1, room2, room3], [])
        expect(() => roomInstance.validateRoomRates()).not.toThrow()
    })

    test('hasBookedRooms returns true if there are bookings', () => {
        const roomInstance = new Room([room1, room2, room3], [booking1, booking2, booking3])
        expect(roomInstance.hasBookedRooms()).toBe(true)
    })

    test('hasBookedRooms returns false if there are no bookings', () => {
        const roomInstance = new Room([room1, room2, room3], [])
        expect(roomInstance.hasBookedRooms()).toBe(false)
    })

    test('isOccupied returns true if the room is occupied on the given date', () => {
        const roomInstance = new Room([room1, room2, room3], [booking1, booking2, booking3])

        expect(roomInstance.isOccupied(new Date('2024-08-15'))).toBe(true)
        expect(roomInstance.isOccupied(new Date('2024-09-02'))).toBe(true)
    })

    test('isOccupied returns false if the room is not occupied on the given date', () => {
        const roomInstance = new Room([room1, room2, room3], [booking1, booking2, booking3])

        expect(roomInstance.isOccupied(new Date('2024-07-31'))).toBe(false)
        expect(roomInstance.isOccupied(new Date('2024-09-06'))).toBe(false)
    })

    test('occupancyPercentage returns correct occupancy percentage for the given date range', () => {
        const room = new Room([room1, room2, room3], [booking1, booking2, booking3])

        const startDate = '2024-08-01'
        const endDate = '2024-08-31'

        const percentage = room.occupancyPercentage(startDate, endDate)

        const totalDays = (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24) + 1
        const occupiedDays = [...Array.from({ length: totalDays }, (_, i) => new Date(startDate).setDate(new Date(startDate).getDate() + i))]
            .filter(date => room.isOccupied(new Date(date))).length

        const expectedPercentage = (occupiedDays / totalDays) * 100

        expect(percentage).toBeCloseTo(expectedPercentage, 1)
    })

    test('occupancyPercentage returns 0 if no days are within the booking range', () => {
        const roomInstance = new Room([room1, room2, room3], [booking1, booking2, booking3])

        const occupancy = roomInstance.occupancyPercentage(new Date('2024-12-01'), new Date('2024-12-31'))

        expect(occupancy).toBe(0)
    })

    test('occupancyPercentage handles edge case where startDate equals endDate', () => {
        const roomInstance = new Room([room1, room2, room3], [booking1, booking2, booking3])

        const occupancy = roomInstance.occupancyPercentage(new Date('2024-08-10'), new Date('2024-08-10'))

        expect(occupancy).toBe(100)
    })

    test('occupancyPercentage handles edge case of an empty booking list', () => {
        const roomInstance = new Room([room1, room2, room3], [])

        const occupancy = roomInstance.occupancyPercentage(new Date('2024-08-01'), new Date('2024-08-31'))

        expect(occupancy).toBe(0)
    })

    test('availableRooms returns an array of rooms not occupied for the entire duration', () => {
        const room1 = { name: 'Room One', rate: 15000, discount: 10 }
        const room2 = { name: 'Room Two', rate: 13000, discount: 50 }
        const room3 = { name: 'Room Three', rate: 9000, discount: 0 }

        const booking1 = { name: 'Booking One', email: 'booking1@booking.com', checkin: new Date('2024-08-01'), checkout: new Date('2024-09-01'), roomName: 'Room One' }
        const booking2 = { name: 'Booking Two', email: 'booking2@booking.com', checkin: new Date('2024-08-10'), checkout: new Date('2024-08-25'), roomName: 'Room Two' }
        const booking3 = { name: 'Booking Three', email: 'booking3@booking.com', checkin: new Date('2024-09-01'), checkout: new Date('2024-09-30'), roomName: 'Room Three' }

        const rooms = [room1, room2, room3]
        const bookings = [booking1, booking2, booking3]
        const startDate = '2024-08-05'
        const endDate = '2024-08-20'

        const available = Room.availableRooms(rooms, bookings, startDate, endDate)

        expect(available).toEqual([room3])
    })

    test('should calculate total occupancy percentage correctly', () => {
        const startDate = "2024-08-01"
        const endDate = "2024-08-31"

        const result = Room.totalOccupancyPercentage([room1, room2, room3], [booking1, booking2, booking3], startDate, endDate)

        expect(result).toBeCloseTo(74.19, 2)
    })
})

const bookingInstance = new booking([room1, room2, room3], [booking1, booking2, booking3])

describe("Tests de funciones del archivo bookings.js", () => {
    test("priceValidation el precio debe ser un número positivo", () => {
        expect(() => bookingInstance.priceValidation('Room One')).not.toThrow()

        room1.rate = -15000
        expect(() => bookingInstance.priceValidation('Room One')).toThrow('El precio de la habitación debe ser un número positivo.')
        room1.rate = 15000
    })

    test("discountValidations descuento entre 0 y 100", () => {
        expect(() => bookingInstance.discountValidations('Room One')).not.toThrow()

        room1.discount = -10
        expect(() => bookingInstance.discountValidations('Room One')).toThrow('El descuento de la habitación debe ser un porcentaje entre 0 y 100.')
        room1.discount = 10

        room1.discount = 110
        expect(() => bookingInstance.discountValidations('Room One')).toThrow('El descuento de la habitación debe ser un porcentaje entre 0 y 100.')
        room1.discount = 10
    })

    test("calculateFinalPrice calcula el descuento final de la habitación", () => {
        const finalFee = bookingInstance.calculateFinalPrice('Room Two')

        const room = room2

        const discountedRoomRate = room.rate - (room.rate * room.discount / 100)
        const finalFeeInEuros = discountedRoomRate / 100

        expect(finalFee).toBeCloseTo(finalFeeInEuros, 2)
    })
})