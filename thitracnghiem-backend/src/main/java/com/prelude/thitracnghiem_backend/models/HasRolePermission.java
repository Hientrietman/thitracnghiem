package com.prelude.thitracnghiem_backend.models;

import com.prelude.thitracnghiem_backend.models.CompositeKeys.HasRolePermissionId;
import com.prelude.thitracnghiem_backend.repositories.HasRolePermissionRepository;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@Table(name = "has_role_permission")
@IdClass(HasRolePermissionId.class)
public class HasRolePermission {

    @Id
    @Column(name = "role_id")
    private int roleId; // ID vai trò

    @Id
    @Column(name = "permission_id")
    private int permissionId; // ID quyền

    @Id
    @Column(name = "user_id")
    private int userId; // ID người dùng

    @ManyToOne
    @JoinColumn(name = "role_id", insertable = false, updatable = false)
    private Roles role; // Đối tượng vai trò

    @ManyToOne
    @JoinColumn(name = "permission_id", insertable = false, updatable = false)
    private Permission permission; // Đối tượng quyền

    @ManyToOne
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private ApplicationUser user; // Đối tượng người dùng

    public HasRolePermission(int userId, int roleId) {
        this.userId = userId;
        this.roleId = roleId;
    }

    // Other methods if needed...
}