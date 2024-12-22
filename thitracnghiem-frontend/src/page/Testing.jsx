import React, {useRef, useEffect, useState} from "react";
import axios from "axios";

const Testing = () => {
    const mediaRef = useRef(null);
    const [mediaUrl, setMediaUrl] = useState(null);
    const [fileName, setFileName] = useState("");
    const [loading, setLoading] = useState(false);
    const [mediaType, setMediaType] = useState("video"); // Default to video
    const [questionIds, setQuestionIds] = useState(""); // Input for question IDs

    const token = "Bearer " + localStorage.getItem("token");

    const getMediaType = (filename) => {
        const extension = filename.split('.').pop().toLowerCase();
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
        const audioExtensions = ['mp3', 'wav', 'ogg', 'flac', 'm4a'];
        const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'mkv'];

        if (imageExtensions.includes(extension)) return "image";
        if (audioExtensions.includes(extension)) return "audio";
        if (videoExtensions.includes(extension)) return "video";
        return "video"; // Default fallback
    };

    useEffect(() => {
        if (fileName) {
            setLoading(true);
            const mediaApiUrl = `http://localhost:8080/api/files/download/${fileName}`;

            const fetchMedia = async () => {
                try {
                    const response = await axios.get(mediaApiUrl, {
                        headers: {
                            Authorization: token,
                        },
                        responseType: "blob",
                    });

                    const mediaBlob = response.data;
                    const mediaBlobUrl = URL.createObjectURL(mediaBlob);

                    const detectedMediaType = getMediaType(fileName);
                    setMediaType(detectedMediaType);

                    setMediaUrl(mediaBlobUrl);
                } catch (error) {
                    console.error("Error fetching media:", error);
                } finally {
                    setLoading(false);
                }
            };

            fetchMedia();

            return () => {
                if (mediaUrl) {
                    URL.revokeObjectURL(mediaUrl);
                }
            };
        }
    }, [fileName, token]);

    const renderMediaElement = () => {
        if (!mediaUrl) return null;

        switch (mediaType) {
            case "image":
                return (
                    <img
                        src={mediaUrl}
                        alt="Uploaded media"
                        style={{maxWidth: "600px", maxHeight: "400px"}}
                        ref={mediaRef}
                    />
                );
            case "audio":
                return (
                    <audio controls style={{width: "600px"}} ref={mediaRef}>
                        <source src={mediaUrl} type={`audio/${fileName.split('.').pop()}`}/>
                        Your browser does not support the audio element.
                    </audio>
                );
            case "video":
            default:
                return (
                    <video controls width="600" ref={mediaRef}>
                        <source src={mediaUrl} type={`video/${fileName.split('.').pop()}`}/>
                        Your browser does not support the video tag.
                    </video>
                );
        }
    };

    const handleExportQuestions = async () => {
        try {
            setLoading(true);

            const response = await axios.post(
                "http://localhost:8080/api/v1/admin/questions/export/excel",
                questionIds.split(",").map(id => parseInt(id.trim())),
                {
                    headers: {
                        Authorization: token,
                        "Content-Type": "application/json",
                    },
                    responseType: "blob",
                }
            );

            // Create a download link for the file
            const blob = new Blob([response.data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "questions_export.xlsx");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Error exporting questions:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Media Player & Question Export</h2>

            <div style={{marginBottom: "15px"}}>
                <input
                    type="text"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    placeholder="Enter media file name (e.g., video.mp4, song.mp3, image.jpg)"
                    style={{width: "300px", marginRight: "10px"}}
                />
            </div>

            <div style={{marginBottom: "15px"}}>
                <input
                    type="text"
                    value={questionIds}
                    onChange={(e) => setQuestionIds(e.target.value)}
                    placeholder="Enter question IDs (comma-separated, e.g., 1,2,3)"
                    style={{width: "300px", marginRight: "10px"}}
                />
                <button onClick={handleExportQuestions} disabled={loading}>
                    {loading ? "Exporting..." : "Export Questions"}
                </button>
            </div>

            {loading ? <p>Loading...</p> : renderMediaElement()}
        </div>
    );
};

export default Testing;
