const IdInput = ({ value, onChange }) => (
  <>
    <h6>ID / Passport / Document number</h6>
    <input
      type="text"
      className="form-control"
      row="1"
      maxLength="13"

      placeholder="Lorem ipsum"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{ width: "300px", backgroundColor: "#F5F5F5" }}
    />
  </>
);
export default IdInput;