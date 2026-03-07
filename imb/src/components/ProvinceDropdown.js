import React from "react";

const ProvinceDropdown = ({ value, onChange }) => {
  return (
    <div className="mb-2">
      <h6>Province</h6>
      <select
        className="form-control"
        style={{ width: "300px", backgroundColor: "#F5F5F5" }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select province</option>
        <option value="Gauteng">Gauteng</option>
        <option value="Western Cape">Western Cape</option>
        <option value="KwaZulu-Natal">KwaZulu-Natal</option>
        <option value="Eastern Cape">Eastern Cape</option>
        <option value="Free State">Free State</option>
        <option value="Limpopo">Limpopo</option>
        <option value="Mpumalanga">Mpumalanga</option>
        <option value="North West">North West</option>
        <option value="Northern Cape">Northern Cape</option>
      </select>
    </div>
  );
};

export default ProvinceDropdown;
