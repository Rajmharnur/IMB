const PostalInput = ({ value, onChange }) => (
  <>
    <h6>Postal Code</h6>
    <input
      type="text"
      className="form-control"
      maxlength="4"
      rows="1"
      placeholder="0000"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        resize: "none",
        width: "300px",
        backgroundColor: "#F5F5F5",
        color: "#04040480",
      }}
    />
  </>
);
export default PostalInput;