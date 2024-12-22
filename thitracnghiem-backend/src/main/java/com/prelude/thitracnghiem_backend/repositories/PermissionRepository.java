package com.prelude.thitracnghiem_backend.repositories;

import com.prelude.thitracnghiem_backend.models.Permission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PermissionRepository extends JpaRepository<Permission, Integer> {
    Optional<Permission> findByPermissionName(String name);
}
