import axios from "axios";
import {useEffect, useState} from "react";
import styles from "./MediaViewer.module.css";

const MediaViewer = ({mediaFile}) => {
    const [mediaUrl, setMediaUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isZoomed, setIsZoomed] = useState(false); // Trạng thái phóng to

    useEffect(() => {
        const fetchMedia = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`http://localhost:8080/api/files/download/${mediaFile.fileName}`, {
                    headers: {Authorization: `Bearer ${token}`},
                    responseType: "blob",
                });

                const mediaBlobUrl = URL.createObjectURL(response.data);
                setMediaUrl(mediaBlobUrl);
            } catch (error) {
                console.error("Error fetching media:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMedia();

        return () => {
            if (mediaUrl) URL.revokeObjectURL(mediaUrl);
        };
    }, [mediaFile]);

    if (loading) return <div>Loading media...</div>;

    const renderMedia = () => {
        switch (mediaFile.fileType.split("/")[0]) {
            case "image":
                return (
                    <div className={styles.mediaRow}>
                        <img
                            src={mediaUrl}
                            alt="Question media"
                            className={styles.image}
                            onClick={() => setIsZoomed(true)} // Mở modal khi click
                        />
                        {isZoomed && (
                            <div className={styles.modal} onClick={() => setIsZoomed(false)}>
                                <img src={mediaUrl} alt="Zoomed media" className={styles.zoomedImage}/>
                            </div>
                        )}
                    </div>
                );
            case "video":
                return (
                    <div className={styles.mediaRow}>
                        <video controls className={styles.videoPlayer}>
                            <source src={mediaUrl} type={mediaFile.fileType}/>
                        </video>
                    </div>
                );
            case "audio":
                return (
                    <div className={styles.audioPlayer}>
                        <audio controls>
                            <source src={mediaUrl} type={mediaFile.fileType}/>
                        </audio>
                    </div>
                );
            default:
                return <div>Unsupported media type</div>;
        }
    };

    return <div className={styles.mediaViewer}>{renderMedia()}</div>;
};

export default MediaViewer;
