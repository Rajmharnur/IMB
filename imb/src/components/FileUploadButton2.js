import React, { useState } from "react";

const FileUploadButton2 = () => {
  const [fileName, setFileName] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
    }
  };

  return (
    <div className="mb-3">
      {/* Hidden native input */}
      <input
        type="file"
        id="fileUpload2"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      {/* Label styled as button */}
      <label
        htmlFor="fileUpload2"
        className="btn fw-bold px-4 py-2 mb-4"
        style={{
          borderRadius: "50px",
          border: "2px solid #000000",
          fontSize: "1rem",
          cursor: "pointer",
        }}
      >
        {fileName ? "File Uploaded" : "Select File"}
        {!fileName && <i className="bi bi-arrow-down-circle ms-2"></i>}
        {fileName && <i className="bi bi-check-circle ms-2"></i>}
      </label>
    </div>
  );
};

export default FileUploadButton2;
