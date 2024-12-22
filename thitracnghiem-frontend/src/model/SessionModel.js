class SessionModel {
    constructor({sessionId, sessionName, startTime}) {
        this.sessionId = sessionId;
        this.sessionName = sessionName;
        this.startTime = new Date(startTime);
    }

    // Static method để map dữ liệu từ backend thành model
    static fromApiResponse(data) {
        return new SessionModel({
            sessionId: data.sessionId,
            sessionName: data.sessionName,
            startTime: data.startTime,
        });
    }

    // Phương thức tiện ích: ví dụ format thời gian
    get formattedStartTime() {
        return this.startTime.toLocaleString();
    }
}

export default SessionModel;
