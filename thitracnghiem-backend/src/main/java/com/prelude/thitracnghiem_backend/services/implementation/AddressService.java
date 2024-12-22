// AddressService.java
package com.prelude.thitracnghiem_backend.services.implementation;

import com.prelude.thitracnghiem_backend.dtos.req.AddressRequest;
import com.prelude.thitracnghiem_backend.dtos.res.AddressResponse;
import com.prelude.thitracnghiem_backend.models.Address;
import com.prelude.thitracnghiem_backend.models.ApplicationUser;
import com.prelude.thitracnghiem_backend.repositories.AddressRepository;
import com.prelude.thitracnghiem_backend.repositories.UserRepository;
import com.prelude.thitracnghiem_backend.utils.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AddressService {
    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    // Create
    public AddressResponse createAddress(AddressRequest request) {
        ApplicationUser user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Address address = new Address();
        address.setAddressLine_1(request.getAddressLine1());
        address.setAddressLine_2(request.getAddressLine2());
        address.setWard(request.getWard());
        address.setDistrict(request.getDistrict());
        address.setCity(request.getCity());
        address.setUser(user);

        Address savedAddress = addressRepository.save(address);
        return mapToResponse(savedAddress);
    }

    // Read all
    public List<AddressResponse> getAllAddresses() {
        return addressRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Read by ID
    public AddressResponse getAddressById(int addressId) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Address not found"));
        return mapToResponse(address);
    }

    // Update
    public AddressResponse updateAddress(int addressId, AddressRequest request) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        ApplicationUser user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        address.setAddressLine_1(request.getAddressLine1());
        address.setAddressLine_2(request.getAddressLine2());
        address.setWard(request.getWard());
        address.setDistrict(request.getDistrict());
        address.setCity(request.getCity());
        address.setUser(user);

        Address updatedAddress = addressRepository.save(address);
        return mapToResponse(updatedAddress);
    }

    // Delete
    public void deleteAddress(int addressId) {
        if (!addressRepository.existsById(addressId)) {
            throw new RuntimeException("Address not found");
        }
        addressRepository.deleteById(addressId);
    }

    // Map Address entity to AddressResponse DTO
    private AddressResponse mapToResponse(Address address) {
        AddressResponse response = new AddressResponse();
        response.setAddressId(address.getAddressId());
        response.setAddressLine1(address.getAddressLine_1());
        response.setAddressLine2(address.getAddressLine_2());
        response.setWard(address.getWard());
        response.setDistrict(address.getDistrict());
        response.setCity(address.getCity());
        response.setUserId(address.getUser().getUserId());
        response.setUserName(address.getUser().getUsername());
        return response;
    }

}