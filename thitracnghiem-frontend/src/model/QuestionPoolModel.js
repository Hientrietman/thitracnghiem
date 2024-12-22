class QuestionPoolModel {
    constructor({questionPoolId, poolName, description, questions}) {
        this.questionPoolId = questionPoolId;
        this.poolName = poolName;
        this.description = description;
        this.questions = questions;
    }

    // Static method để map dữ liệu từ backend thành model
    static fromApiResponse(data) {
        return new QuestionPoolModel({
            questionPoolId: data.questionPoolId,
            poolName: data.poolName,
            description: data.description,
            questions: data.questions,
        });
    }
}

export default QuestionPoolModel;
