class ExamPaperModel {
    constructor({
                    examPaperId,
                    title,
                    description,
                    duration,
                    maxScore,
                    passingScore,
                    canAwardCertificate,
                    examPaperQuestions,
                }) {
        this.examPaperId = examPaperId;
        this.title = title;
        this.description = description;
        this.duration = duration;
        this.maxScore = maxScore;
        this.passingScore = passingScore;
        this.canAwardCertificate = canAwardCertificate;
        // Đảm bảo examPaperQuestions luôn là một mảng (tránh lỗi khi là null hoặc undefined)
        this.examPaperQuestions = examPaperQuestions || [];
    }

    // Phương thức giúp khởi tạo từ phản hồi API
    static fromApiResponse(data) {
        return new ExamPaperModel({
            examPaperId: data.examPaperId,
            title: data.title,
            description: data.description,
            duration: data.duration,
            maxScore: data.maxScore,
            passingScore: data.passingScore,
            canAwardCertificate: data.canAwardCertificate,
            examPaperQuestions: data.examPaperQuestions || [], // Đảm bảo examPaperQuestions luôn là mảng
        });
    }
}

export default ExamPaperModel;
