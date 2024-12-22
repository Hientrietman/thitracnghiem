import React from "react";
import {useNavigate} from "react-router-dom";
import PropTypes from "prop-types";
import styles from "./Sidebar.module.css"; // Giả sử bạn đã tạo sẵn style cho sidebar

function Sidebar({menuItems}) {
    const navigate = useNavigate(); // Khởi tạo hook useNavigate

    // Hàm điều hướng khi người dùng nhấp vào một mục menu
    const handleMenuClick = (path) => {
        navigate(path); // Điều hướng đến đường dẫn tuyệt đối
    };

    return (
        <div className={styles.sidebar}>
            <div className={styles.menu}>

                {menuItems.map((item, index) => (
                    <li
                        key={index}
                        onClick={() => handleMenuClick(item.path)}
                        className={styles.menuItem}
                    >
                        {item.icon} {item.title}
                    </li>
                ))}

            </div>
        </div>
    );
}

// Định nghĩa kiểu dữ liệu cho các props
Sidebar.propTypes = {
    menuItems: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string.isRequired,
            path: PropTypes.string.isRequired,
            icon: PropTypes.element.isRequired,
        })
    ).isRequired,
};

export default Sidebar;
