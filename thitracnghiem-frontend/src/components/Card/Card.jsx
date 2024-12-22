import PropTypes from "prop-types";
import styles from "./Card.module.css";

export default function Card({title, description, imageUrl, children, buttonText, onButtonClick, width, height}) {
    return (
        <div className={styles.card} style={{width, height}}>
            {imageUrl && <img src={imageUrl} alt={title} className={styles.image}/>}
            <div className={styles.content}>
                <h3 className={styles.title}>{title}</h3>
                <p className={styles.description}>{description}</p>
                {children} {/* Hiển thị nội dung từ bên ngoài */}
                {buttonText && (
                    <button className={styles.button} onClick={onButtonClick}>
                        {buttonText}
                    </button>
                )}
            </div>
        </div>
    );
}

// Xác định kiểu dữ liệu cho các props
Card.propTypes = {
    title: PropTypes.string.isRequired, // Tiêu đề của card, bắt buộc
    description: PropTypes.string.isRequired, // Mô tả của card, bắt buộc
    imageUrl: PropTypes.string, // URL của hình ảnh, không bắt buộc
    buttonText: PropTypes.string, // Nội dung nút, không bắt buộc
    onButtonClick: PropTypes.func, // Hàm xử lý khi bấm nút, không bắt buộc
    width: PropTypes.string, // Độ rộng của card (ví dụ: '300px' hoặc '100%')
    height: PropTypes.string, // Chiều cao của card (ví dụ: '400px' hoặc 'auto')
    children: PropTypes.node, // Các phần tử con (ví dụ: <p>, <div>...) không bắt buộc
};

// Giá trị mặc định cho width và height
Card.defaultProps = {
    width: "300px", // Mặc định độ rộng 300px
    height: "auto", // Mặc định chiều cao tự động
};
