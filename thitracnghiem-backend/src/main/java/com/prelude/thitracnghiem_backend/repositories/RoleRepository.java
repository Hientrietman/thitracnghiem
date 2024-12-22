package com.prelude.thitracnghiem_backend.repositories;

import com.prelude.thitracnghiem_backend.models.Roles;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Roles, Integer> {
    Optional<Roles>  findByRoleName(String name);
}
