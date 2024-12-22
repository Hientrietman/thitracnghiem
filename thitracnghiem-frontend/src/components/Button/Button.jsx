import PropTypes from "prop-types";
import styles from "./Button.module.css";

export default function Button({text, onClick, type = "default", disabled = false}) {
    return (
        <button
            className={`${styles.button} ${styles[type]}`}
            onClick={onClick}
            disabled={disabled}
        >
            {text}
        </button>
    );
}

// Xác định các props cho Button
Button.propTypes = {
    text: PropTypes.string.isRequired, // Nút cần có nội dung
    onClick: PropTypes.func, // Hàm xử lý khi click vào nút
    type: PropTypes.oneOf(["default", "primary", "danger"]), // Kiểu nút (style)
    disabled: PropTypes.bool, // Có cho phép bấm hay không
};
