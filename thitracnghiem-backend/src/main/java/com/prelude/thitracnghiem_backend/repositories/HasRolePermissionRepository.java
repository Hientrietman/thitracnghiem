package com.prelude.thitracnghiem_backend.repositories;

import com.prelude.thitracnghiem_backend.models.HasRolePermission; // Import the entity class
import com.prelude.thitracnghiem_backend.models.CompositeKeys.HasRolePermissionId;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HasRolePermissionRepository extends JpaRepository<HasRolePermission, HasRolePermissionId> {

    @Query("SELECT r.roleName FROM HasRolePermission hrp JOIN Roles r ON hrp.roleId = r.roleId WHERE hrp.userId = :userId")
    List<String> findRolesByUserId(@Param("userId") int userId);

    Optional<HasRolePermission> findByUserId(int userId);
    @Modifying
    @Transactional
    @Query("UPDATE HasRolePermission hrp SET hrp.roleId = ?2 WHERE hrp.userId = ?1")
    void updateRoleByUserId(int userId, int roleId);
}
