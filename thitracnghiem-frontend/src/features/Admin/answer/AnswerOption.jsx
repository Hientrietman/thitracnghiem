const AnswerOption = ({
                          answer,
                          questionType,
                          selectedAnswers,
                          onAnswerSelect
                      }) => {
    const isMultiSelect = questionType === 'MULTIPLE_CHOICE';
    const isSelected = selectedAnswers.includes(answer.answerId);

    const handleSelect = () => {
        onAnswerSelect(answer.answerId);
    };

    return (
        <div
            onClick={handleSelect}
            className={`
                p-2 border rounded cursor-pointer transition-colors 
                ${isSelected
                ? 'bg-blue-100 border-blue-500'
                : 'hover:bg-gray-100'
            }
            `}
        >
            {isMultiSelect ? (
                <input
                    type="checkbox"
                    checked={isSelected}
                    readOnly
                    className="mr-2"
                />
            ) : (
                <input
                    type="radio"
                    checked={isSelected}
                    readOnly
                    className="mr-2"
                />
            )}
            {answer.answer.answerText}
        </div>
    );
};
export default AnswerOption;