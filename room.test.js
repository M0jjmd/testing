const rooms = require('./room')
const bookings = require('./booking')

describe("Validaciones del JSON y las habitaciones", () => {

    test("Validamos la estructura básica del JSON", () => {
        expect(() => rooms.validateJsonStructure()).not.toThrow()
    })

    test("Validamos que al menos una de las propiedades esperadas tenga contenido en cada habitación", () => {
        const allRooms = rooms.getAllRooms()
        allRooms.forEach(room => {
            expect(() => rooms.validateRoomProperties(room)).not.toThrow()
        })
    })

    test("Validamos que todas las instalaciones de cada habitación estén dentro del conjunto permitido", () => {
        const allRooms = rooms.getAllRooms()
        allRooms.forEach(room => {
            expect(() => rooms.validateRoomFacilities(room)).not.toThrow()
        })
    })

    test("Validamos que haya al menos una habitación reservada", () => {
        expect(rooms.hasBookedRooms()).toBe(true)
    })

    test("validateRoomRates verifica que las tarifas y descuentos sean números enteros", () => {
        expect(() => rooms.validateRoomRates()).not.toThrow()
    })

    test("Validamos que todas las habitaciones tengan URLs de fotos válidas", () => {
        expect(() => rooms.validateRoomPhotos()).not.toThrow()
    })
})

describe("Tests de funciones del archivo rooms.js", () => {

    test("getAllRooms devuelve todas las habitaciones", () => {
        const allRooms = rooms.getAllRooms()
        expect(allRooms.length).toBe(4)
    })

    test("getRoomById devuelve la habitación correcta por su ID", () => {
        const room = rooms.getRoomById('283c')
        expect(room).toHaveProperty('RoomNumber', '101')
    })

    test("isRoomBooked devuelve true si la habitación está ocupada", () => {
        const isBooked = rooms.isRoomBooked('2fd4')
        const isNotBooked = rooms.isRoomBooked('283c')
        expect(isBooked).toBe(true)
        expect(isNotBooked).toBe(false)
    })

    test("getRoomCheckInDate devuelve la fecha de check-in correcta", () => {
        const checkInDate = rooms.getRoomCheckInDate('283c')
        expect(checkInDate).toBe("2023-08-02")
    })

    test("isOccupied devuelve true si hay habitaciones ocupadas en la fecha dada", () => {
        expect(rooms.isOccupied(new Date("2023-08-03"))).toBe(true)
        expect(rooms.isOccupied(new Date("2023-07-01"))).toBe(false)
    })

    test("occupancyPercentage devuelve el porcentaje correcto de días ocupados en el rango de fechas dado", () => {
        expect(rooms.occupancyPercentage("2023-08-01", "2023-08-07")).toBeGreaterThan(0)
        expect(rooms.occupancyPercentage("2023-07-01", "2023-07-15")).toBe(0)
    })

    test("totalOccupancyPercentage calcula el porcentaje total de habitaciones ocupadas", () => {
        const percentage = rooms.totalOccupancyPercentage()

        const expectedPercentage = (2 / 4) * 100

        expect(percentage).toBeCloseTo(expectedPercentage, 2)
    })
})

describe("Tests de funciones del archivo bookings.js", () => {
    test("calculateFinalPrice el precio debe ser un numero positivo, descuento entre 0 y 100, descuento de la reserva entre 0 y 100"), () => {
        expect(() => bookings.calculateFinalPrice("R001")).not.toThrow()
    }

    test("calculateFinalPrice calcula el desciento final de la habitacion y el booking"), () => {
        const finalFee = bookings.calculateFinalPrice("R001")

        const discountedRoomRate = 13000 - (13000 * 20 / 100)
        const finalFeeInCents = discountedRoomRate - (discountedRoomRate * 10 / 100)
        const finalFeeInEuros = finalFeeInCents / 100
        expect(finalFee).toBeCloseTo(finalFeeInEuros)
    }
})