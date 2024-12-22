class ExamScheduleAddModel {
    constructor({
                    id,
                    subjectId,
                    subjectName,
                    sessionId,
                    sessionStartTime,
                    locationId,
                    locationName,
                    examPaperId,
                    examPaperTitle,
                    examPaperQuestions,
                }) {
        this.id = id || null;
        this.subjectId = subjectId;
        this.subjectName = subjectName || null;
        this.sessionId = sessionId;
        this.sessionStartTime = sessionStartTime || null;
        this.locationId = locationId;
        this.locationName = locationName || null;
        this.examPaperId = examPaperId;
        this.examPaperTitle = examPaperTitle || null;
        this.examPaperQuestions = examPaperQuestions || [];
    }

    // Từ dữ liệu API trả về -> Model
    static fromApiResponse(data) {
        return new ExamScheduleAddModel({
            id: data.id,
            subjectId: data.subject.subjectId,
            subjectName: data.subject.subjectName,
            sessionId: data.session.sessionId,
            sessionStartTime: data.session.startTime,
            locationId: data.location.locationId,
            locationName: data.location.locationName,
            examPaperId: data.examPaper.examPaperId,
            examPaperTitle: data.examPaper.title,
            examPaperQuestions: data.examPaper.examPaperQuestions.map((q) => ({
                questionId: q.questionId,
                pointValue: q.pointValue,
                questionText: q.question.questionText,
                correctAnswers: q.question.questionAnswers.filter((a) => a.answer.correct).map((a) => a.answer.answerText),
            })),
        });
    }

    // Từ Model -> Dữ liệu gửi API
    static toRequestPayload(model) {
        return {
            subjectId: model.subjectId,
            sessionId: model.sessionId,
            locationId: model.locationId,
            examPaperId: model.examPaperId,
        };
    }
}

export default ExamScheduleAddModel;
