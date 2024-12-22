class ExamScheduleModel {
    constructor({
                    id,
                    examPaperId,
                    subjectName,
                    sessionStartTime,
                    locationName
                }) {
        this.id = id;
        this.examPaperId = examPaperId;
        this.subjectName = subjectName;
        this.sessionStartTime = sessionStartTime;
        this.locationName = locationName;
    }

    static fromApiResponse(data) {
        return new ExamScheduleModel(data);
    }
}

export default ExamScheduleModel;