/**
 * Mock Verification Service
 * Simulates OTP generation and validation for Aadhaar/Voter ID.
 */

const mockOTPs = new Map(); // In-memory store: { identifier: otp }

/**
 * Generates and stores a mock OTP for a given identifier (phone/email).
 * @param {string} identifier - The unique identifier for the user.
 * @returns {string} - The generated OTP (for demo/mock purposes).
 */
const generateOTP = (identifier) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    mockOTPs.set(identifier, otp);
    
    // Auto-expire OTP after 5 minutes
    setTimeout(() => {
        if (mockOTPs.get(identifier) === otp) {
            mockOTPs.delete(identifier);
            console.log(`🕒 OTP expired for ${identifier}`);
        }
    }, 5 * 60 * 1000);

    console.log(`🔑 Generated OTP for ${identifier}: ${otp}`);
    return otp;
};

/**
 * Validates the provided OTP for a given identifier.
 * @param {string} identifier - The unique identifier.
 * @param {string} otp - The OTP to validate.
 * @returns {boolean} - True if valid, false otherwise.
 */
const validateOTP = (identifier, otp) => {
    const storedOTP = mockOTPs.get(identifier);
    if (storedOTP && storedOTP === otp) {
        mockOTPs.delete(identifier); // One-time use
        return true;
    }
    return false;
};

module.exports = {
    generateOTP,
    validateOTP
};
