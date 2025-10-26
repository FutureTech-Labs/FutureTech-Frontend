import api from "@/lib/api";

/**
 * Logs in a user with email and password.
 * Sends a POST request to /auth/login.
 * Returns the server response data, usually containing user info and a token.
 */
export const login = async (email: string, password: string) => {
    const res = await api.post("/auth/login", { email, password });
    return res.data;
};

/**
 * Fetches the currently authenticated user's information.
 * Sends a GET request to /auth/me.
 * Returns the server response data containing user details.
 */
export const getMe = async () => {
    const res = await api.get("/auth/me");
    return res.data;
};

/**
 * Logs out the currently authenticated user.
 * Sends a POST request to /auth/logout.
 * Returns the server response data, usually a success message.
 */
export const logout = async () => {
    const res = await api.post("/auth/logout");
    return res.data;
};

/**
 * Sends a password reset OTP to the user's email.
 * Sends a POST request to /auth/send-reset-otp with the email.
 * Returns the server response data, typically a success message.
 */
export const sendResetOtp = async (email: string) => {
    const res = await api.post("/auth/send-reset-otp", { email });
    return res.data;
};

/**
 * Verifies the OTP entered by the user.
 * Sends a POST request to /auth/verify-otp with email and OTP.
 * Returns the server response data indicating if the OTP is valid.
 */
export const verifyOtp = async (email: string, otp: string) => {
    const res = await api.post("/auth/verify-otp", { email, otp });
    return res.data;
};

/**
 * Resets the user's password using the provided OTP.
 * Sends a POST request to /auth/reset-password with email, OTP, and new password.
 * Returns the server response data, typically a success message if password reset is successful.
 */
export const resetPassword = async (email: string, otp: string, newPassword: string) => {
    const res = await api.post("/auth/reset-password", { email, otp, newPassword });
    return res.data;
};
