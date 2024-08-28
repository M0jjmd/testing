const roomsData = require('./ApiData.json')

class room {
    validateJsonStructure() {
        if (!roomsData || typeof roomsData !== 'object') {
            throw new Error("El JSON no tiene una estructura válida.")
        }
        if (!roomsData.hasOwnProperty('success')) {
            throw new Error("Falta la propiedad 'success' en el JSON.")
        }
        if (!Array.isArray(roomsData.rooms)) {
            throw new Error("La propiedad 'rooms' debe ser un array.")
        }
    }

    validateRoomProperties(room) {
        const requiredProperties = [
            'RoomNumber', 'Status', 'CheckIn', 'CheckOut', 'Rate', 'Facilities', 'id'
        ]

        requiredProperties.forEach(requiredProp => {
            if (!room.hasOwnProperty(requiredProp)) {
                throw new Error(`La habitación ${room.id} no tiene la propiedad ${requiredProp}`)
            }
        })
    }

    hasBookedRooms() {
        return roomsData.rooms.some(room => room.Status === "Booked")
    }

    validateRoomRates() {
        roomsData.rooms.forEach(room => {
            if (typeof room.Rate !== 'number' || !Number.isInteger(room.Rate)) {
                throw new Error(`La habitación ${room.id} tiene una tarifa no válida: ${room.Rate}. Debe ser un número entero.`)
            }
            if (typeof room.discount !== 'number' || !Number.isInteger(room.discount)) {
                throw new Error(`La habitación ${room.id} tiene un descuento no válido: ${room.discount}. Debe ser un número entero.`)
            }
        })
    }

    validateRoomFacilities(room) {
        const expectedFacilities = ['Wi-Fi', 'TV', 'Mini Bar', 'Air Conditioning', "Balcony"]

        const hasExpectedFacility = expectedFacilities.some(facility => room.Facilities.includes(facility))

        if (!hasExpectedFacility) {
            throw new Error(`La habitación ${room.id} no tiene ninguna de las instalaciones esperadas.`)
        }
    }

    validateRoomPhotos() {
        roomsData.rooms.forEach(room => {
            if (!/^https:\/\/example\.com\/images\/.+\.jpg$/.test(room.Photo)) {
                throw new Error(`La habitación ${room.id} tiene una URL de foto no válida.`)
            }
        })
    }

    getAllRooms() {
        return roomsData.rooms
    }

    getRoomById(id) {
        return roomsData.rooms.find(room => room.id === id)
    }

    isRoomBooked(id) {
        const room = this.getRoomById(id)
        console.log(room)
        if (room.Status === "Booked") {
            return true
        } else {
            return false
        }
    }

    getRoomCheckInDate(id) {
        const room = this.getRoomById(id)
        return room ? room.CheckIn : null
    }

    static isOccupied(date) {
        return roomsData.rooms.some(room => {
            if (room.Status !== "Booked") return false
            const checkInDate = new Date(room.CheckIn)
            const checkOutDate = new Date(room.CheckOut)
            return checkInDate <= date && date <= checkOutDate
        })
    }

    static totalOccupancyPercentage() {
        const rooms = roomsData.rooms
        const totalRooms = rooms.length
        const occupiedRooms = rooms.filter(room => room.Status === "Booked").length

        return totalRooms === 0 ? 0 : (occupiedRooms / totalRooms) * 100
    }

    static occupancyPercentage(startDate, endDate) {
        const start = new Date(startDate)
        const end = new Date(endDate)
        let totalDays = 0
        let occupiedDays = 0

        for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
            totalDays++
            if (this.isOccupied(new Date(date))) {
                occupiedDays++
            }
            start.setDate(start.getDate() + 1)
        }

        if (totalDays === 0) return 0

        return totalDays === 0 ? 0 : (occupiedDays / totalDays) * 100
    }
}

module.exports = room