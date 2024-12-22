class UserModel {
    constructor({userId, userName, email, realName, phoneNumber, registrationDate, active, role}) {
        this.userId = userId;
        this.userName = userName;
        this.email = email;
        this.realName = realName;
        this.phoneNumber = phoneNumber;
        this.registrationDate = registrationDate;
        this.active = active;
        this.role = role; // Vai trò của user
    }

    static fromApiResponse(data) {
        return new UserModel({
            userId: data.user.userId,
            userName: data.user.userName || data.user.username,
            email: data.user.email,
            realName: data.user.realName,
            phoneNumber: data.user.phoneNumber,
            registrationDate: data.user.registrationDate,
            active: data.user.active,
            role: data.role, // Role lấy từ cấp trên của object
        });
    }
}

export default UserModel;
