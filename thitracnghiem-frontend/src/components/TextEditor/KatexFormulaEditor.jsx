import React, {useState} from 'react';
import {Modal, Button, Input, Tabs} from 'antd';
import {EditOutlined} from '@ant-design/icons';
import katex from 'katex';
import 'katex/dist/katex.min.css';

const KatexFormulaEditor = ({
                                value,
                                onChange,
                                placeholder = "Nhập câu hỏi bạn muốn"
                            }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [localValue, setLocalValue] = useState(value || '');
    const [previewValue, setPreviewValue] = useState(value || '');

    const showModal = () => {
        setIsModalVisible(true);
        setLocalValue(value || '');
        setPreviewValue(value || '');
    };

    const handleOk = () => {
        if (onChange) {
            onChange(localValue);
        }
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setLocalValue(value || '');
        setPreviewValue(value || '');
    };

    const renderKatex = (latex) => {
        try {
            return katex.renderToString(latex, {
                throwOnError: false,
                displayMode: false
            });
        } catch (err) {
            return '<span style="color: red;">Công thức không hợp lệ</span>';
        }
    };

    const formulaCategories = [
        {
            key: 'basic',
            label: 'Toán Cơ Bản',
            buttons: [
                {label: 'Căn', value: '\\sqrt{x}'},
                {label: 'Luỹ Thừa', value: 'x^{2}'},
                {label: 'Chỉ Số', value: 'x_{0}'},
                {label: 'Phân Số', value: '\\frac{a}{b}'}
            ]
        },
        {
            key: 'trigonometry',
            label: 'Lượng Giác',
            buttons: [
                {label: 'sin', value: '\\sin(x)'},
                {label: 'cos', value: '\\cos(x)'},
                {label: 'tan', value: '\\tan(x)'},
                {label: 'cot', value: '\\cot(x)'}
            ]
        },
        {
            key: 'greek',
            label: 'Ký Hiệu',
            buttons: [
                {label: 'π', value: '\\pi'},
                {label: 'Δ', value: '\\Delta'},
                {label: '∞', value: '\\infty'},
                {label: '±', value: '\\pm'}
            ]
        },
        {
            key: 'calculus',
            label: 'Vi Tích Phân',
            buttons: [
                {label: 'Tích Phân', value: '\\int_{a}^{b} f(x) dx'},
                {label: 'Tổng', value: '\\sum_{i=1}^{n} x_i'},
                {label: 'Giới Hạn', value: '\\lim_{x \\to 0} f(x)'}
            ]
        }
    ];

    const insertSymbol = (symbol) => {
        const newValue = localValue + symbol;
        setLocalValue(newValue);
        setPreviewValue(newValue);
    };

    return (
        <div>
            <Input
                value={value}
                onClick={showModal}
                placeholder={placeholder}
                readOnly
                suffix={<EditOutlined onClick={showModal}/>}
            />

            <Modal
                title="Nhập chữ, LATEX hoặc chọn ký hiệu"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                width={700}
            >
                <Tabs defaultActiveKey="basic">
                    {formulaCategories.map(category => (
                        <Tabs.TabPane key={category.key} tab={category.label}>
                            <div className="grid grid-cols-4 gap-2">
                                {category.buttons.map(item => (
                                    <Button
                                        key={item.label}
                                        onClick={() => insertSymbol(item.value)}
                                        className="w-full"
                                    >
                                        {item.label}
                                    </Button>
                                ))}
                            </div>
                        </Tabs.TabPane>
                    ))}
                </Tabs>

                <Input.TextArea
                    rows={4}
                    value={localValue}
                    onChange={(e) => {
                        setLocalValue(e.target.value);
                        setPreviewValue(e.target.value);
                    }}
                    placeholder="Nhập công thức LaTeX tại đây"
                    className="mt-4"
                />

                <div className="mt-4">
                    <strong>Xem trước:</strong>
                    <div
                        dangerouslySetInnerHTML={{
                            __html: renderKatex(previewValue)
                        }}
                        className="p-2 border rounded"
                    />
                </div>

                <div className="mt-2 text-sm text-gray-600">
                    <strong>Gợi ý:</strong> Sử dụng cú pháp LaTeX để nhập công thức
                </div>
            </Modal>
        </div>
    );
};

export default KatexFormulaEditor;