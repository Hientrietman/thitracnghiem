import React from 'react';
import {Modal, Upload, Button, message} from 'antd';
import {UploadOutlined} from '@ant-design/icons';
import axios from 'axios';

const ImportQuestionModal = ({
                                 visible,
                                 onCancel,
                                 questionPoolId,
                                 onImportSuccess
                             }) => {
    const [importFile, setImportFile] = React.useState(null);

    const handleImportFileChange = (info) => {
        const fileList = [...info.fileList];
        const latestFile = fileList[fileList.length - 1];
        setImportFile(latestFile);
    };

    const handleImportQuestions = async () => {
        if (!importFile) {
            message.error("Vui lòng chọn file Excel");
            return;
        }

        const token = localStorage.getItem("token");
        const formData = new FormData();
        formData.append("file", importFile.originFileObj);
        formData.append("poolId", questionPoolId);

        try {
            const response = await axios.post(
                `http://localhost:8080/api/v1/admin/questions/excels/import`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            message.success(response.data);
            onImportSuccess();
            onCancel();
        } catch (error) {
            message.error(
                error.response?.data ||
                "Không thể import câu hỏi. Vui lòng thử lại."
            );
        }
    };

    return (
        <Modal
            title="Import câu hỏi từ Excel"
            visible={visible}
            onCancel={onCancel}
            onOk={handleImportQuestions}
        >
            <Upload
                accept=".xlsx,.xls"
                beforeUpload={() => false}
                onChange={handleImportFileChange}
                maxCount={1}
            >
                <Button icon={<UploadOutlined/>}>
                    Chọn file Excel
                </Button>
            </Upload>
        </Modal>
    );
};

export default ImportQuestionModal;