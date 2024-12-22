import "katex/dist/katex.min.css"; // Import CSS của KaTeX
import {InlineMath} from "react-katex";

export default function QuestionText({text}) {
    const mathSymbols = ['\\', '^', '_', '{', '}', '[', ']', '∫', '∑', '∏'];
    const isMathText = mathSymbols.some(symbol => text.includes(symbol));

    return isMathText ? (
        <InlineMath>{text}</InlineMath>
    ) : (
        <>{text}</>
    );
};

