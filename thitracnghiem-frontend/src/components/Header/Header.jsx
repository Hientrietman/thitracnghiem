import styles from "./Header.module.css";
import {useDispatch, useSelector} from "react-redux";
import {logout} from "../../features/Admin/auth/loginSlice.js";
import Logo from "/src/assets/logo.png";
import {useNavigate} from "react-router-dom";
import DropdownMenu from "../Dropdown/DropdownMenu.jsx";
import Button from "../Button/Button.jsx";

export default function Header() {
    const navigate = useNavigate();
    const {realName} = useSelector((state) => state.login.user) || {};
    const dispatch = useDispatch();

    // Dropdown items
    const dropdownItems = [
        {label: "Thông tin cá nhân", action: () => navigate("/admin/dashboard/info")},
        {label: "Cài đặt", action: () => navigate("/admin/settings")},
        {divider: true},
        {label: "Logout", action: () => dispatch(logout()), danger: true},
    ];

    return (
        <div className={styles.container}>
            {/* Logo */}

            <img
                src={Logo}
                alt="Logo"
                className={styles.logo}
                onClick={() => navigate("/admin/dashboard/")}
            />

            {/* Dropdown Menu */}
            <DropdownMenu items={dropdownItems} userName={realName}/>
        </div>
    );
}
