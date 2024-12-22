import LocationModel from "../model/LocationModel.js";
import locationRepo from "../api/locationRepo.js";


const locationService = {
    getAllLocations: async () => {
        const data = await locationRepo.getAll();
        return data.map((item) => LocationModel.fromApiResponse(item)); // Map thành model
    },
    addLocation: async (locationData) => {
        const newLocation = await locationRepo.add(locationData);
        return LocationModel.fromApiResponse(newLocation);
    },
    updateLocation: async (id, locationData) => {
        const updatedLocation = await locationRepo.update(id, locationData);
        return LocationModel.fromApiResponse(updatedLocation);
    },
    deleteLocation: async (id) => {
        return await locationRepo.delete(id);
    },
};

export default locationService;
