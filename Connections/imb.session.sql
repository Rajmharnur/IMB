-- Main user table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    dob DATE NOT NULL,
    mobile_number VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(150), -- optional
    employer VARCHAR(150) NOT NULL,
    otp VARCHAR(10) -- store temporarily, consider hashing
);

-- Identification details
CREATE TABLE identification (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    id_type VARCHAR(50) NOT NULL, -- e.g., Passport, ID Card
    id_number VARCHAR(50) NOT NULL,
    country_of_issue VARCHAR(100) NOT NULL,
    id_document_path TEXT NOT NULL -- file path or URL
);

-- Address details
CREATE TABLE address (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    street_name_number VARCHAR(150) NOT NULL,
    suburb VARCHAR(100),
    city VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    province VARCHAR(100) NOT NULL,
    proof_of_address_path TEXT NOT NULL -- file path or URL
);

-- Work permit details
CREATE TABLE work_permit (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    permit_document_path TEXT, -- optional
    issue_date DATE NOT NULL,
    expiry_date DATE NOT NULL
);