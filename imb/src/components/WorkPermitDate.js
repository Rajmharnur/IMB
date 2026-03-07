import React, { useState } from "react";

const WorkPermitDate = ({ value, onChange }) => {
  const [internal, setInternal] = useState("");
  const isControlled = value !== undefined && onChange != null;
  const current = isControlled ? value : internal;
  const handleChange = (e) => {
    const v = e.target.value;
    if (isControlled) onChange(v);
    else setInternal(v);
  };

  return (
    <div className="mb-0">
      <h6>Work Permit Issue Date</h6>
      <input
        type="date"
        id="work-permit-issue"
        className="form-control"
        value={current}
        onChange={handleChange}
        style={{ width: "300px", backgroundColor: "#F5F5F5" }}
      />
    </div>
  );
};

export default WorkPermitDate;