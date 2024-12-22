class LocationModel {
    constructor({locationId, locationName, address, capacity, description}) {
        this.locationId = locationId;
        this.locationName = locationName;
        this.address = address;
        this.capacity = capacity;
        this.description = description;
    }

    // Phương thức tiện ích: ví dụ kiểm tra sức chứa
    isOverCapacity(maxCapacity) {
        return this.capacity > maxCapacity;
    }

    // Static method để map dữ liệu từ backend thành model
    static fromApiResponse(data) {
        return new LocationModel({
            locationId: data.locationId,
            locationName: data.locationName,
            address: data.address,
            capacity: data.capacity,
            description: data.description,
        });
    }
}

export default LocationModel;
