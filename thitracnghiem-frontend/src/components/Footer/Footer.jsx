import styles from "./Footer.module.css"; // Đảm bảo tên tệp là Footer.module.css

export default function Footer() {
  return (
    <footer className={styles.container}>
      <p>&copy; 2024 Prelude. All rights reserved.</p>
    </footer>
  );
}
