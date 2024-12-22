import styles from "../../Admin/Dashboard/Dashboard.module.css";
import Header from "../../../components/Header/Header.jsx";
import Sidebar from "../../../components/Sidebar/Sidebar.jsx";
import {Outlet} from "react-router-dom";
import {
    GlobalOutlined,
    ScheduleOutlined,
    BookOutlined,
    CalendarOutlined,
    ProfileOutlined,
    EditOutlined,
    FileTextOutlined,
} from "@ant-design/icons";

export default function ExamCommitteeDashboard() {
    const menuItems = [
        {
            title: "Quản lý địa điểm thi",
            path: "/committee/dashboard/locations",
            icon: <GlobalOutlined/>,
        },
        {
            title: "Quản lý ca thi",
            path: "/committee/dashboard/sessions",
            icon: <ScheduleOutlined/>,
        },
        {
            title: "Quản lý môn thi",
            path: "/committee/dashboard/subjects",
            icon: <BookOutlined/>,
        },
        {
            title: "Quản lý kì thi",
            path: "/committee/dashboard/exam",
            icon: <CalendarOutlined/>,
        },
        {
            title: "Quản lý đề thi",
            path: "/committee/dashboard/exam-paper",
            icon: <FileTextOutlined/>,
        },
        {
            title: "Thêm và xoá câu hỏi của đề thi",
            path: "/committee/dashboard/questions",
            icon: <EditOutlined/>,
        },
        {
            title: "Lập lịch thi",
            path: "/committee/dashboard/exam-schedule",
            icon: <CalendarOutlined/>,
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
    );
}