import React, { useState } from "react";
import { useAuth } from './contexts/AuthContext';

const fellowshipOptions = [
    "SAA",
    "AA", 
    "NA",
    "CA",
    "OA",
    "GA",
    "DA",
    "MA",
    "SA",
    "EA",
];

const CardCreatorDialog = ({ open, onClose, onSave }) => {
    const [fellowship, setFellowship] = useState("");
    const [circleText, setCircleText] = useState("");
    const [tags, setTags] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });
    const { getToken } = useAuth();

    const resetForm = () => {
        setFellowship("");
        setCircleText("");
        setTags("");
    };

    const showMessage = (text, type) => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: "", type: "" }), 5000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!fellowship || !circleText || !tags) {
            showMessage("Please fill in all fields", "error");
            return;
        }
        setLoading(true);
        showMessage("Creating your card...", "loading");
        
        try {
            const token = await getToken();
            const response = await fetch("http://localhost:5656/new_card", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ fellowship, circleText, tags }),
            });
            
            if (response.ok) {
                showMessage("Card created successfully!", "success");
                
                // Create the new card object
                const newCard = {
                    id: Date.now(),
                    name: circleText,
                    fellowship,
                    tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag)
                };
                
                // Call onSave callback to add card to deck
                if (onSave) {
                    onSave(newCard);
                }
                
                resetForm();
                
                // Close dialog after a short delay
                setTimeout(() => {
                    onClose();
                }, 1500);
            } else {
                const errorData = await response.json().catch(() => ({}));
                showMessage(
                    errorData.message ||
                        `Error: ${response.status} ${response.statusText}`,
                    "error"
                );
            }
        } catch (error) {
            if (error.name === "TypeError" && error.message.includes("fetch")) {
                showMessage(
                    "Cannot connect to server. Please make sure the API is running on localhost:5656",
                    "error"
                );
            } else {
                showMessage("An unexpected error occurred. Please try again.", "error");
            }
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div
            style={{
                position: "fixed",
                zIndex: 1000,
                left: 0,
                top: 0,
                width: "100vw",
                height: "100vh",
                background: "rgba(0,0,0,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
            onClick={onClose}
        >
            <div
                className="container"
                style={{ minWidth: 320, maxWidth: 600 }}
                onClick={(e) => e.stopPropagation()}
            >
                <h1>Fellowship Card Creator</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="fellowship">Fellowship</label>
                        <select
                            id="fellowship"
                            value={fellowship}
                            onChange={(e) => setFellowship(e.target.value)}
                            required
                        >
                            <option value="">Select a Fellowship</option>
                            {fellowshipOptions.map((opt) => (
                                <option key={opt} value={opt}>
                                    {opt}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="circleText">Circle Text</label>
                        <textarea
                            id="circleText"
                            value={circleText}
                            onChange={(e) => setCircleText(e.target.value)}
                            placeholder="Enter the text that will appear in the circle..."
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="tags">Tags</label>
                        <textarea
                            id="tags"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            placeholder="Enter tags separated by commas (e.g., magic, adventure, quest)"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="submit-btn"
                        disabled={loading}
                        style={{ marginBottom: 10 }}
                    >
                        {loading ? "Creating Card..." : "Create Card"}
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        style={{
                            width: "100%",
                            padding: 12,
                            borderRadius: 12,
                            border: "none",
                            background: "#eee",
                            color: "#333",
                            fontWeight: 600,
                            cursor: "pointer",
                        }}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                </form>
                {message.text && (
                    <div
                        className={`message show ${message.type}`}
                        style={{
                            marginTop: 20,
                            padding: 15,
                            borderRadius: 8,
                            fontWeight: 500,
                            textAlign: "center",
                            background:
                                message.type === "success"
                                    ? "#d4edda"
                                    : message.type === "error"
                                    ? "#f8d7da"
                                    : "#d1ecf1",
                            color:
                                message.type === "success"
                                    ? "#155724"
                                    : message.type === "error"
                                    ? "#721c24"
                                    : "#0c5460",
                            border:
                                message.type === "success"
                                    ? "1px solid #c3e6cb"
                                    : message.type === "error"
                                    ? "1px solid #f5c6cb"
                                    : "1px solid #bee5eb",
                            opacity: 1,
                            transform: "translateY(0)",
                            transition: "all 0.3s ease",
                        }}
                    >
                        {message.text}
                    </div>
                )}
            </div>
            <style>{`
                .container {
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(10px);
                    border-radius: 20px;
                    padding: 40px;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
                    width: 100%;
                    max-width: 600px;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }
                h1 {
                    text-align: center;
                    color: #333;
                    margin-bottom: 30px;
                    font-size: 2.5rem;
                    font-weight: 700;
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
                .form-group {
                    margin-bottom: 25px;
                }
                label {
                    display: block;
                    margin-bottom: 8px;
                    font-weight: 600;
                    color: #555;
                    font-size: 1.1rem;
                }
                select, textarea {
                    width: 100%;
                    padding: 15px;
                    border: 2px solid #e1e5e9;
                    border-radius: 12px;
                    font-size: 16px;
                    font-family: inherit;
                    transition: all 0.3s ease;
                    background: rgba(255, 255, 255, 0.9);
                }
                select:focus, textarea:focus {
                    outline: none;
                    border-color: #667eea;
                    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
                    transform: translateY(-2px);
                }
                select {
                    cursor: pointer;
                    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
                    background-position: right 12px center;
                    background-repeat: no-repeat;
                    background-size: 16px;
                    appearance: none;
                }
                textarea {
                    resize: vertical;
                    min-height: 100px;
                    line-height: 1.6;
                }
                .submit-btn {
                    width: 100%;
                    padding: 18px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    border-radius: 12px;
                    font-size: 18px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
                }
                .submit-btn:hover:enabled {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6);
                }
                .submit-btn:active {
                    transform: translateY(0);
                }
                .submit-btn:disabled {
                    background: #ccc;
                    cursor: not-allowed;
                    transform: none;
                    box-shadow: none;
                }
                @media (max-width: 768px) {
                    .container {
                        padding: 25px;
                        margin: 10px;
                    }
                    h1 {
                        font-size: 2rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default CardCreatorDialog;