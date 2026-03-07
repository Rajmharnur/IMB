const CityInput = ({ value, onChange }) => (
  <>
    <h6>City</h6>
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
export default CityInput;