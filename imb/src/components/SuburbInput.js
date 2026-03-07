const SuburbInput = ({ value, onChange }) => (
  <>
    <h6>Suburb</h6>
    <input
      type="text"
      className="form-control"
      placeholder="Lorem ipsum"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{ width: "300px", backgroundColor: "#F5F5F5" }}
    />
  </>
);
export default SuburbInput;