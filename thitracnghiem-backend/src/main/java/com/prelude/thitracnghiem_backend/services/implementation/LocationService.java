package com.prelude.thitracnghiem_backend.services.implementation;

import com.prelude.thitracnghiem_backend.dtos.req.LocationRequest;
import com.prelude.thitracnghiem_backend.dtos.res.LocationResponse;
import com.prelude.thitracnghiem_backend.dtos.res.ResponseApi;
import com.prelude.thitracnghiem_backend.exceptions.CustomError.LocationNotFoundException;
import com.prelude.thitracnghiem_backend.models.Location;
import com.prelude.thitracnghiem_backend.repositories.LocationRepository;
import com.prelude.thitracnghiem_backend.services.interfaces.ILocationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LocationService implements ILocationService {
    private final LocationRepository locationRepository;

    @Override
    public ResponseApi<LocationResponse> getLocation(int locationId) {
        Location location = locationRepository.findById(locationId).orElseThrow(() -> new LocationNotFoundException("Location not found", locationId));
        LocationResponse response = new LocationResponse();
        response.setLocationId(location.getLocationId());
        response.setLocationName(location.getLocationName());
        response.setAddress(location.getAddress());
        response.setCapacity(location.getCapacity());
        response.setDescription(location.getDescription());
        return new ResponseApi<>(HttpStatus.OK, "Location retrieved successfully", response, true);
    }

    @Override
    public ResponseApi<List<LocationResponse>> getAllLocations() {
        List<LocationResponse> LocationResponseponses = locationRepository.findAll().stream().map(location -> {
            LocationResponse response = new LocationResponse();
            response.setLocationId(location.getLocationId());
            response.setLocationName(location.getLocationName());
            response.setAddress(location.getAddress());
            response.setCapacity(location.getCapacity());
            response.setDescription(location.getDescription());
            return response;
        }).collect(Collectors.toList());
        return new ResponseApi<>(HttpStatus.OK, "Locations fetched successfully", LocationResponseponses, true);
    }

    @Override
    public ResponseApi<Location> createLocation(LocationRequest request) {
        Location location = new Location();
        location.setLocationName(request.getLocationName());
        location.setAddress(request.getAddress());
        location.setDescription(request.getDescription());
        location.setCapacity(request.getCapacity());
        Location savedLocation = locationRepository.save(location);
        return new ResponseApi<>(HttpStatus.CREATED, "Location created successfully", savedLocation, true);
    }

    @Override
    public ResponseApi<LocationResponse> updateLocation(int locationId, LocationRequest request) {
        Location location = locationRepository.findById(locationId).orElseThrow(() -> new LocationNotFoundException("Location not found", locationId));
        location.setLocationName(request.getLocationName());
        location.setAddress(request.getAddress());
        location.setCapacity(request.getCapacity());
        location.setDescription(request.getDescription());
        Location updatedLocation = locationRepository.save(location);
        LocationResponse response = new LocationResponse();
        response.setLocationId(updatedLocation.getLocationId());
        response.setLocationName(updatedLocation.getLocationName());
        response.setAddress(updatedLocation.getAddress());
        response.setDescription(updatedLocation.getDescription());
        response.setCapacity(updatedLocation.getCapacity());
        return new ResponseApi<>(HttpStatus.OK, "Location updated successfully", response, true);
    }

    @Override
    public ResponseApi<Void> deleteLocation(int locationId) {
        locationRepository.findById(locationId).orElseThrow(() -> new LocationNotFoundException("Location not found",locationId));
        locationRepository.deleteById(locationId);
        return new ResponseApi<>(HttpStatus.OK, "Location deleted successfully", null, true);
    }
}
