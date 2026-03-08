// Centralized API URL for backend calls. Can be overridden with
// REACT_APP_API_URL environment variable.
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default API_URL;
