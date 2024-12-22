import React, {useState} from 'react';
import {Modal, Input, Button, message} from 'antd';
import axios from 'axios';

const ExportQuestionModal = ({
                                 visible,
                                 onCancel
                             }) => {
    const [questionIds, setQuestionIds] = useState('');

    const handleExportQuestions = async () => {
        // Chuyển đổi chuỗi thành mảng số nguyên
        const ids = questionIds.split(',')
            .map(id => id.trim())
            .filter(id => id !== '')
            .map(Number);

        if (ids.length === 0) {
            message.warning("Vui lòng nhập ID câu hỏi");
            return;
        }

        const token = localStorage.getItem("token");

        try {
            const response = await axios.post(
                `http://localhost:8080/api/v1/admin/questions/excels/export`,
                ids,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    responseType: 'blob'
                }
            );


            const blob = new Blob([response.data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'questions_export.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();

            onCancel();
        } catch (error) {
            message.error(
                error.response?.data ||
                "Không thể xuất câu hỏi. Vui lòng thử lại."
            );
        }
    };

    return (
        <Modal
            title="Xuất câu hỏi ra Excel"
            visible={visible}
            onCancel={onCancel}
            onOk={handleExportQuestions}
            okText="Xuất"
        >
            <Input
                placeholder="Nhập ID câu hỏi, ngăn cách bằng dấu phẩy (VD: 1, 2, 3, 4)"
                value={questionIds}
                onChange={(e) => setQuestionIds(e.target.value)}
            />
            <div style={{marginTop: 10, color: 'gray'}}>
                Ví dụ: 1, 2, 3, 4
            </div>
        </Modal>
    );
};

export default ExportQuestionModal;