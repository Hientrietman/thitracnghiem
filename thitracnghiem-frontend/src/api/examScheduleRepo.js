import axiosClient from "./axiosClient";
import ExamScheduleModel from "../model/ExamScheduleModel.js";
import ExamScheduleAddModel from "../model/ExamScheduleAddModel.js";

const examScheduleRepo = {
    getAll: async (page, size) => {
        const response = await axiosClient.get(
            `/api/v1/exam-schedules?page=${page}&size=${size}`
        );
        if (response.data.success) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || "Error fetching exam schedules");
        }
    },

    search: async (queryString) => {
        const response = await axiosClient.get(
            `/api/v1/exam-schedules/search${queryString}`
        );

        if (response.data.success) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || "Error searching exam schedules");
        }
    },

    getById: async (examScheduleData) => {
        const response = await axiosClient.post(
            `/api/v1/exam-schedules/get-by-id`,
            examScheduleData
        );
        if (response.data.success) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || "Error fetching exam schedule");
        }
    },

    add: async (examScheduleData) => {
        const payload = ExamScheduleAddModel.toRequestPayload(examScheduleData);
        const response = await axiosClient.post(`/api/v1/exam-schedules`, payload);
        if (response.data.success) {
            return response.data.data; // Trả về dữ liệu thô từ API
        } else {
            throw new Error(response.data.message || "Error adding exam schedule");
        }
    },
    getUsersByExamScheduleId: async (examScheduleId) => {
        const response = await axiosClient.get(
            `/api/v1/exam-schedules/${examScheduleId}/users`
        );
        if (response.data.success) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || "Error fetching exam schedule users");
        }
    },

    getSupervisoryByExamScheduleId: async (examScheduleId) => {
        const response = await axiosClient.get(
            `/api/v1/exam-schedules/${examScheduleId}/supervisory`
        );
        if (response.data.success) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || "Error fetching exam schedule supervisory");
        }
    },
    addParticipants: async (examScheduleId, userIds) => {
        const response = await axiosClient.post(`/api/v1/exam-schedules/add-user`, {
            examScheduleId,
            userIds,
        });
        if (response.data.success) {
            return response.data.data; // Trả về dữ liệu từ API
        } else {
            throw new Error(response.data.message || "Error adding participants");
        }
    },

    delete: async (examScheduleData) => {
        const response = await axiosClient.delete(
            `/api/v1/exam-schedules/delete`,
            {data: examScheduleData}
        );
        if (response.data.success) {
            return examScheduleData;
        } else {
            throw new Error(response.data.message || "Error deleting exam schedule");
        }
    }
};

export default examScheduleRepo;