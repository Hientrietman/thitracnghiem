import {useSelector} from "react-redux";
import styles from "./DashboardOverview.module.css";
import art from "../../../assets/art.jpg";
import Button from "../../../components/Button/Button.jsx";
import {useNavigate} from "react-router-dom";
import Card from "../../../components/Card/Card.jsx";
import User from "../../../features/Admin/users/User.jsx";
// eslint-disable-next-line react/prop-types
export default function DashboardOverview() {
    const navigate = useNavigate();
    const {realName} = useSelector((state) => state.login.user) || {};
    return (
        <div className={styles.container}>
            <div className={styles.helloSection}>
                <div>
                    <p className={styles.title}>Hello, {realName}</p>
                    <div className={styles.time}>Hôm nay là 11/22/2024</div>
                </div>

                <div>
                    <Button
                        type="primary"
                        onClick={() => navigate("/admin/dashboard/questionpools")}
                        text="Ngân Hàng"
                    ></Button>
                    <Button
                        onClick={() => navigate("/admin/dashboard/users")}
                        text="Người dùng"
                    ></Button>
                    <Button
                        onClick={() => navigate("/admin/dashboard/info")}
                        text="Thông tin cá nhân"
                    ></Button>
                </div>
            </div>
            <div className={styles.contentContainer}>
                <div className={styles.leftSection}>
                    <Card
                        width={610}
                        height={380}
                        imageUrl={art}
                        title="Đây là trang mà bạn có thể quản lý các chức năng của mình"
                        description="Sử dụng side bar hoặc các nút ở đây để di chuyển"
                    ></Card>
                    <div style={{display: "flex", flexDirection: "row"}}>
                        <Card
                            width={610}
                            height={380}
                            imageUrl={art}
                            title="Đây là trang mà bạn có thể quản lý các chức năng của mình"
                            description="Sử dụng side bar hoặc các nút ở đây để di chuyển"
                        ></Card>
                    </div>
                </div>

                <div className={styles.rightSection}>
                    <User></User>
                </div>
            </div>
        </div>
    );
}
