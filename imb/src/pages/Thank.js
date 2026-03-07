const Thank = () => {
  return (
    <main className="py-5">
      <div className="centered-content">
        <div className="text-center mb-4">
          <h1 style={{ color: "#2B26ED" }}>Self Sign-up</h1>
          <br />

          {/* Circle with centered check icon */}
          <div
            style={{
              backgroundColor: "#CBE537",
              color: "#2a2ac4",
              borderRadius: "50%",
              border: "2px solid #211aee",
              width: "60px",
              height: "60px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto",
            }}
          >
            <i
              className="bi bi-check2"
              style={{
                fontSize: "3rem", // fits nicely inside the circle
              }}
            ></i>
          </div>

          {/* Confirmation message */}
          <p className="mt-3" style={{ fontSize: "1.1rem", maxWidth: "300px", margin: "0 auto" }}>
            Thank you for your application
          </p>
        </div>
      </div>
    </main>
  );
};

export default Thank;