import axiosClient from "./axiosClient";

const examSubmissionRepo = {
    submitExam: async (submissionData) => {
        const response = await axiosClient.post('/api/v1/user/evaluate', submissionData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return {
            data: response.data.data,
            message: response.data.message,
            success: response.data.success,
            status: response.data.status,
        }
    }
};

export default examSubmissionRepo;