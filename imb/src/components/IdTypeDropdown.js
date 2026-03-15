const IdTypeDropdown = ({ value, onChange }) => {
  return (
    <div className="mb-2">
      <h6>ID Type</h6>
      <select
        className="form-control"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: "300px", backgroundColor: "#F5F5F5" }}
      >
        <option value="">Select ID Type</option>
        <option value="passport">Passport</option>
        <option value="driverLicense">Driver's License</option>
        <option value="nationalId">National ID</option>
        <option value="other">Other</option>
      </select>
    </div>
  );
};

export default IdTypeDropdown;