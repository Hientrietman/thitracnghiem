class AnswerModel {
    constructor({
                    answerId,
                    answerText,
                    correct,
                    questionAnswers,
                }) {
        this.answerId = answerId;
        this.answerText = answerText;
        this.correct = correct;
        this.questionAnswers = questionAnswers || [];
    }

    static fromApiResponse(data) {
        return new AnswerModel({
            answerId: data.answerId,
            answerText: data.answerText,
            correct: data.correct,
            questionAnswers: data.questionAnswers.map((qa) => ({
                questionId: qa.question.questionId,
                questionText: qa.question.questionText,
                pool: qa.question.pool,
                questionType: qa.question.questionType,
                difficulty: qa.question.difficulty,
                mediaFiles: qa.question.mediaFiles,
            })),
        });
    }
}

export default AnswerModel;
