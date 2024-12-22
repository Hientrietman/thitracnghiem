import {useState} from "react";
import styles from "./DropdownMenu.module.css";

// eslint-disable-next-line react/prop-types
export default function DropdownMenu({items, userName}) {
    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = () => setIsOpen(!isOpen);

    return (
        <div className={styles.dropdownContainer}>
            {/* Button để mở dropdown */}
            <button
                className={styles.profileButton}
                onClick={handleToggle}
            >
                <span className={styles.icon}>👤</span>
            </button>

            {/* Menu Dropdown */}
            <div
                className={`${styles.dropdown} ${
                    isOpen ? styles.dropdownOpen : styles.dropdownClose
                }`}
            >
                <div className={styles.userInfo}>{userName || "User"}</div>
                <hr/>
                {items.map((item, index) => (
                    item.divider ? (
                        <hr key={index}/>
                    ) : (
                        <button
                            key={index}
                            onClick={item.action}
                            className={`${styles.dropdownItem} ${
                                item.danger ? styles.danger : ""
                            }`}
                        >
                            {item.label}
                        </button>
                    )
                ))}
            </div>
        </div>
    );
}
