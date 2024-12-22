package com.prelude.thitracnghiem_backend.services.interfaces;

import com.prelude.thitracnghiem_backend.dtos.req.LocationRequest;
import com.prelude.thitracnghiem_backend.dtos.res.LocationResponse;
import com.prelude.thitracnghiem_backend.dtos.res.ResponseApi;
import com.prelude.thitracnghiem_backend.models.Location;

import java.util.List;

public interface ILocationService {

    ResponseApi<LocationResponse> getLocation(int locationId);

    ResponseApi<List<LocationResponse>> getAllLocations();

    ResponseApi<Location> createLocation(LocationRequest request);

    ResponseApi<LocationResponse> updateLocation(int locationId, LocationRequest request);

    ResponseApi<Void> deleteLocation(int locationId);
}
