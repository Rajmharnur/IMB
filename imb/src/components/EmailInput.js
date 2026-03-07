const EmailInput = ({ value, onChange }) => (
  <>
    <h6>Email Address (optional)</h6>
    <input
      type="text"
      className="form-control"
      rows="1"
      placeholder="Lorem ipsum"
      style={{
        resize: "none",
        width: "300px",
        backgroundColor: "#F5F5F5",
        color: "#04040480",
      }}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </>
);

export default EmailInput;
