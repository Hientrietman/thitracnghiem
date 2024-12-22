import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import {Outlet} from "react-router-dom";
import styles from "./Student.module.css"
import {
    BookOutlined,
    CalendarOutlined,
    EditOutlined,
    FileTextOutlined,
    GlobalOutlined, ProfileOutlined,
    ScheduleOutlined
} from "@ant-design/icons";
import Header from "../../components/Header/Header.jsx";

function Student() {
    const menuItems = [
        {
            title: "Đề thi của bạn",
            path: "/student/dashboard/assigned-exam-paper",
            icon: <GlobalOutlined/>,
        },
        {
            title: "Lịch sử thi của bạn",
            path: "/student/dashboard/exam-paper",
            icon: <GlobalOutlined/>,
        },
        {
            title: "Xem chứng chỉ",
            path: "/student/dashboard/exam-paper",
            icon: <GlobalOutlined/>,
        },
        {
            title: "Thông tin cá nhân",
            path: "/committee/dashboard/info",
            icon: <ProfileOutlined/>,
        },
    ];
    return (
        <div className={styles.siteLayout}>
            <Header/>
            <div className={styles.siteLayoutContent}>
                <Sidebar className={styles.sidebar} menuItems={menuItems}/> {/* Sử dụng Sidebar mới */}

                <div className={styles.contentContainer}>
                    <Outlet/>
                </div>
            </div>
        </div>
    )
}

export default Student;