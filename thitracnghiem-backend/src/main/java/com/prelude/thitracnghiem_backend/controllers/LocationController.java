package com.prelude.thitracnghiem_backend.controllers;

import com.prelude.thitracnghiem_backend.dtos.req.LocationRequest;
import com.prelude.thitracnghiem_backend.dtos.res.LocationResponse;
import com.prelude.thitracnghiem_backend.dtos.res.ResponseApi;
import com.prelude.thitracnghiem_backend.models.Location;
import com.prelude.thitracnghiem_backend.services.implementation.LocationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/locations")
@RequiredArgsConstructor
public class LocationController {
    private final LocationService locationService;

    @GetMapping("/{locationId}")
    public ResponseEntity<ResponseApi<LocationResponse>> getLocation(@PathVariable int locationId) {
        ResponseApi<LocationResponse> response = locationService.getLocation(locationId);
        return new ResponseEntity<>(response, response.getStatus());
    }

    @GetMapping("/all")
    public ResponseEntity<ResponseApi<List<LocationResponse>>> getAllLocations() {
        ResponseApi<List<LocationResponse>> response = locationService.getAllLocations();
        return new ResponseEntity<>(response, response.getStatus());
    }

    @PostMapping("/")
    public ResponseEntity<ResponseApi<Location>> createLocation(@RequestBody LocationRequest request) {
        ResponseApi<Location> response = locationService.createLocation(request);
        return new ResponseEntity<>(response, response.getStatus());
    }

    @PutMapping("/{locationId}")
    public ResponseEntity<ResponseApi<LocationResponse>> updateLocation(@PathVariable int locationId, @RequestBody LocationRequest request) {
        ResponseApi<LocationResponse> response = locationService.updateLocation(locationId, request);
        return new ResponseEntity<>(response, response.getStatus());
    }

    @DeleteMapping("/{locationId}")
    public ResponseEntity<ResponseApi<Void>> deleteLocation(@PathVariable int locationId) {
        ResponseApi<Void> response = locationService.deleteLocation(locationId);
        return new ResponseEntity<>(response, response.getStatus());
    }
}
