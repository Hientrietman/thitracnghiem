class SubjectModel {
    constructor({subjectId, subjectName, description}) {
        this.subjectId = subjectId;
        this.subjectName = subjectName;
        this.description = description;
    }

    // Static method để map dữ liệu từ backend thành model
    static fromApiResponse(data) {
        return new SubjectModel({
            subjectId: data.subjectId,
            subjectName: data.subjectName,
            description: data.description,
        });
    }
}

export default SubjectModel;
