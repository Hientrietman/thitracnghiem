package com.prelude.thitracnghiem_backend.repositories;

import com.prelude.thitracnghiem_backend.models.Session;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SessionRepository extends JpaRepository<Session, Integer> {
    // Custom query methods can be defined here
}
