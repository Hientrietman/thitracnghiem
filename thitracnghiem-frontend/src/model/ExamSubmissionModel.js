class ExamSubmissionModel {
    constructor({
                    examPaperId,
                    userId,
                    answers,
                    results,
                    totalPoints
                }) {
        this.examPaperId = examPaperId;
        this.userId = userId;
        this.answers = answers;
        this.results = results;
        this.totalPoints = totalPoints;
    }

    static fromUserSubmission(examPaper, user, userAnswers) {
        // Generate results based on user's answers
        const results = examPaper.examPaperQuestions.map((examQuestion) => {
            const correctAnswers = examQuestion.question.questionAnswers
                .filter(answer => answer.answer.correct)
                .map(answer => answer.answerId);

            const userAnswer = userAnswers[examQuestion.question.questionId] || [];

            const correct = correctAnswers.every((answerId) =>
                userAnswer.includes(answerId)
            ) && correctAnswers.length === userAnswer.length;

            return {
                questionId: examQuestion.question.questionId,
                correct,
                pointValue: correct ? examQuestion.pointValue : 0
            };
        });

        const totalPoints = results.reduce((sum, res) => sum + res.pointValue, 0);

        return new ExamSubmissionModel({
            examPaperId: examPaper.examPaperId,
            userId: user.userId,
            answers: userAnswers,
            results,
            totalPoints
        });
    }
}

export default ExamSubmissionModel;