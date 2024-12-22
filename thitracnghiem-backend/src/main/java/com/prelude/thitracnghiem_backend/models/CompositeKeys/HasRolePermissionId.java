package com.prelude.thitracnghiem_backend.models.CompositeKeys;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Objects;

@Data
@NoArgsConstructor
public class HasRolePermissionId implements Serializable {
    private int roleId; // roleId
    private int permissionId; // permissionId
    private int userId; // userId

    // Constructor
    public HasRolePermissionId(int roleId, int permissionId, int userId) {
        this.roleId = roleId;
        this.permissionId = permissionId;
        this.userId = userId;
    }

    // Equals method
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof HasRolePermissionId)) return false;
        HasRolePermissionId that = (HasRolePermissionId) o;
        return roleId == that.roleId &&
                permissionId == that.permissionId &&
                userId == that.userId;
    }

    // HashCode method
    @Override
    public int hashCode() {
        return Objects.hash(roleId, permissionId, userId);
    }
}