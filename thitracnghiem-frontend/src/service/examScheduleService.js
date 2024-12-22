import ExamScheduleModel from "../model/ExamScheduleModel";
import examScheduleRepo from "../api/examScheduleRepo";
import ExamScheduleAddModel from "../model/ExamScheduleAddModel.js";

const examScheduleService = {
    getAllExamSchedules: async (page = 0, size = 10) => {
        try {
            const data = await examScheduleRepo.getAll(page, size);
            return {
                totalPages: data.totalPages,
                currentPage: data.number,
                examSchedules: data.content.map((item) => ExamScheduleModel.fromApiResponse(item)),
            };
        } catch (error) {
            throw {
                status: error.response?.status || 'ERROR',
                message: error.response?.data?.message || 'Đã xảy ra lỗi',
                details: error.response?.data
            };
        }
    },
    searchExamSchedules: async (searchParams) => {
        try {
            const {
                page = 0,
                size = 10,
                subjectName,
                locationName,
                sessionName,
                examPaperTitle,
                ...otherParams
            } = searchParams;

            const queryParams = new URLSearchParams({
                page,
                size,
                ...(subjectName && {subjectName}),
                ...(locationName && {locationName}),
                ...(sessionName && {sessionName}),
                ...(examPaperTitle && {examPaperTitle}),
                ...otherParams
            });

            const data = await examScheduleRepo.search(`?${queryParams}`);
            return {
                totalPages: data.totalPages,
                totalElements: data.totalElements,
                currentPage: data.number,
                examSchedules: data.content.map((item) => ExamScheduleModel.fromApiResponse(item)),
            };
        } catch (error) {
            throw {
                status: error.response?.status || 'ERROR',
                message: error.response?.data?.message || 'Đã xảy ra lỗi',
                details: error.response?.data
            };
        }
    },

    getExamScheduleById: async (examScheduleData) => {
        try {
            const examSchedule = await examScheduleRepo.getById(examScheduleData);
            return ExamScheduleModel.fromApiResponse(examSchedule);
        } catch (error) {
            throw new Error(error.message || "Failed to fetch exam schedule");
        }
    },

    addExamSchedule: async (examScheduleData) => {
        try {
            const responseData = await examScheduleRepo.add(examScheduleData);
            return ExamScheduleAddModel.fromApiResponse(responseData); // Ánh xạ sang model
        } catch (error) {
            throw {
                status: error.response?.status || 'ERROR',
                message: error.response?.data?.message || 'Failed to add exam schedule',
                details: error.response?.data,
            };
        }
    },

    getUsersByExamScheduleId: async (examScheduleId) => {
        try {
            const response = await examScheduleRepo.getUsersByExamScheduleId(examScheduleId);
            return {data: response}; // Wrap the response to match frontend expectations
        } catch (error) {
            throw new Error(error.message || "Failed to fetch exam schedule users");
        }
    },

    getSupervisoryByExamScheduleId: async (examScheduleId) => {
        try {
            const response = await examScheduleRepo.getSupervisoryByExamScheduleId(examScheduleId);
            return {data: response}; // Wrap the response to match frontend expectations
        } catch (error) {
            throw new Error(error.message || "Failed to fetch exam schedule supervisory");
        }
    },
    addParticipants: async (examScheduleId, userIds) => {
        try {
            const responseData = await examScheduleRepo.addParticipants(examScheduleId, userIds);
            return responseData; // Trả về dữ liệu cần thiết cho frontend
        } catch (error) {
            throw {
                status: error.response?.status || 'ERROR',
                message: error.response?.data?.message || 'Failed to add participants',
                details: error.response?.data,
            };
        }
    },

    deleteExamSchedule: async (examScheduleData) => {
        try {
            return await examScheduleRepo.delete(examScheduleData);
        } catch (error) {
            throw new Error(error.message || "Failed to delete exam schedule");
        }
    },
};

export default examScheduleService;