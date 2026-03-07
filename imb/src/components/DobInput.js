const DobInput = ({ value, onChange }) => {
  return (
    <>
      <h6>Date of birth</h6>
      <input
        type="date"
        className="form-control"
        style={{ width: "300px", backgroundColor: "#F5F5F5" }}
        value={value}
        onChange={(e) => onChange(e.target.value)} // ✅ IMPORTANT
      />
    </>
  );
};

export default DobInput;
