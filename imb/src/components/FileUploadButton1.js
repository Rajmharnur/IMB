import React, { useRef, useState } from "react";

const FileUploadButton = () => {
  const inputRef = useRef(null);
  const [fileName, setFileName] = useState("");

  const handleClick = () => {
    inputRef.current.click();
  };

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  return (
    <div className="mb-3">
      <input
        type="file"
        ref={inputRef}
        onChange={handleChange}
        style={{ display: "none" }}
      />

      <button
        type="button"
        onClick={handleClick}
        className="btn fw-bold px-4 py-2 mb-2"
        style={{ borderRadius: "50px", border: "2px solid #000" }}
      >
        {fileName ? "File Uploaded" : "Select File"}
        {!fileName && <i className="bi bi-arrow-down-circle ms-2"></i>}
        {fileName && <i className="bi bi-check-circle ms-2"></i>}
      </button>
    </div>
  );
};

export default FileUploadButton;
