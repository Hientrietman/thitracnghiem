import subjectRepo from "../api/subjectRepo";
import SubjectModel from "../model/SubjectModel";

const subjectService = {
    getAllSubjects: async () => {
        const data = await subjectRepo.getAll();
        return data.map((item) => SubjectModel.fromApiResponse(item));
    },
    addSubject: async (subjectData) => {
        const newSubject = await subjectRepo.add(subjectData);
        return SubjectModel.fromApiResponse(newSubject);
    },
    updateSubject: async (id, subjectData) => {
        const updatedSubject = await subjectRepo.update(id, subjectData);
        return SubjectModel.fromApiResponse(updatedSubject);
    },
    deleteSubject: async (id) => {
        return await subjectRepo.delete(id);
    },
};

export default subjectService;
