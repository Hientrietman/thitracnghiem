import Header from "../../../components/Header/Header.jsx";
import Sidebar from "../../../components/Sidebar/Sidebar.jsx"; // Import Sidebar mới
import {Outlet, useLocation} from "react-router-dom";
import styles from "./Dashboard.module.css";
import DashboardOverview from "../DashboardOverview/ĐashboardOverview.jsx";
import {
    DashboardOutlined,
    FileUnknownOutlined,
    FileTextOutlined,
    UserOutlined,
    EnvironmentOutlined,
    AppstoreAddOutlined,
    ReadOutlined,
    IdcardOutlined,
} from "@ant-design/icons"; // Import các icon từ antd

function AdminDasboard() {
    const location = useLocation();
    const username = location.state?.username || "Guest";
    console.log("state" + location.state?.username);
    const isBasePath = location.pathname === "/admin/dashboard/";

    // Danh sách menu items cho Sidebar mới
    const menuItems = [
        {
            title: "Quản lý ngân hàng câu hỏi",
            path: "/admin/dashboard/questionpools",
            icon: <FileTextOutlined/>,
        },
        {
            title: "Quản lý câu hỏi",
            path: "/admin/dashboard/questions",
            icon: <AppstoreAddOutlined/>,
        },
        {
            title: "Quản lý đáp án",
            path: "/admin/dashboard/answers",
            icon: <FileUnknownOutlined/>,
        },
        {
            title: "Quản lý người dùng",
            path: "/admin/dashboard/users",
            icon: <UserOutlined/>,
        },
        {
            title: "Quản lý địa điểm thi",
            path: "/admin/dashboard/locations",
            icon: <EnvironmentOutlined/>,
        },
        {
            title: "Quản lý ca thi",
            path: "/admin/dashboard/sessions",
            icon: <DashboardOutlined/>,
        },
        {
            title: "Quản lý môn thi",
            path: "/admin/dashboard/subjects",
            icon: <ReadOutlined/>,
        },
        {
            title: "Thông tin cá nhân",
            path: "/admin/dashboard/info",
            icon: <IdcardOutlined/>,
        },
    ];

    return (
        <div className={styles.siteLayout}>
            <Header username={username}/>
            <div className={styles.siteLayoutContent}>
                <Sidebar className={styles.sidebar} menuItems={menuItems}/> {/* Sử dụng Sidebar mới */}

                <div className={styles.contentContainer}>
                    {isBasePath ? (
                        <DashboardOverview username={username}/>
                    ) : (
                        <Outlet/>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminDasboard;
