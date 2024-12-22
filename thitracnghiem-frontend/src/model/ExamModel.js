class ExamModel {
    constructor({examId, examName, description, startDate, endDate, status}) {
        this.examId = examId;
        this.examName = examName;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
    }

    // Phương thức kiểm tra thời gian
    isOngoing() {
        const now = new Date();
        return new Date(this.startDate) <= now && now <= new Date(this.endDate);
    }

    // Static method để map dữ liệu từ backend thành model
    static fromApiResponse(data) {
        return new ExamModel({
            examId: data.examId,
            examName: data.examName,
            description: data.description,
            startDate: data.startDate,
            endDate: data.endDate,
            status: data.status,
        });
    }
}

export default ExamModel;
