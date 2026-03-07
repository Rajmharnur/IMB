const GenderDropdown = ({ value, onChange }) => {
  return (
    <>
      <h6>Gender</h6>
      <select
        className="form-control"
        style={{ width: "300px", backgroundColor: "#F5F5F5" }}
        value={value}
        onChange={(e) => onChange(e.target.value)} // ✅
      >
        <option value="">Select gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>
    </>
  );
};

export default GenderDropdown;
