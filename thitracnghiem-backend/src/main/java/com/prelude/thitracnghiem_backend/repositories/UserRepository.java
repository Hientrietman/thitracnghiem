package com.prelude.thitracnghiem_backend.repositories;

import com.prelude.thitracnghiem_backend.models.ApplicationUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface UserRepository extends JpaRepository<ApplicationUser, Integer> {
    boolean existsByEmail(String email);
    Optional<ApplicationUser> findByEmail(String email);

    Optional<ApplicationUser> findByUserId(int userId);
}
