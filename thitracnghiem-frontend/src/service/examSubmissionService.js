import ExamSubmissionModel from "../model/ExamSubmissionModel";
import examSubmissionRepo from "../api/examSubmissionRepo";

const examSubmissionService = {
    submitExam: async (examPaper, user, userAnswers) => {
        // Create submission model
        const submissionModel = ExamSubmissionModel.fromUserSubmission(
            examPaper,
            user,
            userAnswers
        );

        // Submit to repository
        return await examSubmissionRepo.submitExam(submissionModel);
    }
};

export default examSubmissionService;