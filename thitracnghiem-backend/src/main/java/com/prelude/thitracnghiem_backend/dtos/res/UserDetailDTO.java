package com.prelude.thitracnghiem_backend.dtos.res;

import com.prelude.thitracnghiem_backend.models.ApplicationUser;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDetailDTO {
    private int userId;
    private String userName;
    private String email;
    private String realName;
    private String phoneNumber;

    // Constructor to convert from ApplicationUser
    public UserDetailDTO(ApplicationUser user) {
        if (user != null) {
            this.userId = user.getUserId();
            this.userName = user.getUserName();
            this.email = user.getEmail();
            this.realName = user.getRealName();
            this.phoneNumber = user.getPhoneNumber();
        }
    }
}