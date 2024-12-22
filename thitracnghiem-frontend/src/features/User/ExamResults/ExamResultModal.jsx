import React from 'react';
import {Modal, Result, Statistic, Row, Col, Progress, Typography} from 'antd';
import {CheckCircleOutlined, CloseCircleOutlined} from '@ant-design/icons';
import styles from './ExamResultModal.module.css';

const {Text} = Typography;

const ExamResultModal = ({
                             isOpen,
                             onClose,
                             results, // Số điểm từ payload BE
                             maxPoints,
                             passingScore
                         }) => {
    const passPercentage = (results / maxPoints) * 100;
    const isPassed = results >= passingScore;

    return (
        <Modal
            title={isPassed ? "Exam Passed" : "Exam Not Passed"}
            open={isOpen}
            onCancel={onClose}
            footer={[
                <button
                    key="close"
                    onClick={onClose}
                    className={styles.closeButton}
                >
                    Close
                </button>
            ]}
        >
            <Result
                icon={isPassed ?
                    <CheckCircleOutlined className={styles.passIcon}/> :
                    <CloseCircleOutlined className={styles.failIcon}/>
                }
                title={isPassed ? "Congratulations!" : "Better Luck Next Time"}
                subTitle={isPassed ? "You have passed the exam" : "You did not meet the passing score"}
            />

            <Row gutter={16}>
                <Col span={12}>
                    <Statistic
                        title="Points Earned"
                        value={results}
                        suffix={`/ ${maxPoints}`}
                        valueStyle={{color: isPassed ? '#3f8600' : '#cf1322'}}
                    />
                </Col>
            </Row>

            <div className={styles.performanceContainer}>
                <Text strong>Performance</Text>
                <Progress
                    percent={passPercentage}
                    status={isPassed ? "success" : "exception"}
                    strokeColor={isPassed ? '#52c41a' : '#ff4d4f'}
                />
                <div className={styles.performanceDetails}>
                    <Text className={isPassed ? styles.passText : styles.failText}>
                        {passPercentage.toFixed(1)}% - {isPassed ? 'Passed' : 'Below Passing Score'}
                    </Text>
                    {!isPassed && (
                        <Text className={styles.failText}>
                            Need {passingScore} points to pass
                        </Text>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default ExamResultModal;
