const handleSubmit = async () => {
  if (!form.firstName || !form.lastName) {
    setError("First and Last name are required");
    return;
  }

  if (!form.dob || !form.gender) {
    setError("DOB and Gender are required");
    return;
  }

  setError("");
  setLoading(true);

  try {
    const response = await fetch("http://localhost:5000/api/user/tell", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data?.message || "Submission failed");
    }

    // ✅ navigate ONLY after success
    navigate("/where");
  } catch (err) {
    setError(err.message || "Server error");
  } finally {
    setLoading(false);
  }
};
