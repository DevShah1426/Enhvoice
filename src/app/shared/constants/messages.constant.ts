export const ERROR_MESSAGES = {
  LOGIN_FAILED: "Login failed. Please check your credentials.",
  NETWORK_ERROR: "Network error occurred. Please try again later.",
  SERVER_ERROR: "Server error occurred. Please try again later.",
  BAD_REQUEST: "Bad request. Please check your input and try again.",
  UNAUTHORIZED: "Unauthorized. Please login first.",
  FORBIDDEN: "You do not have permission to access the requested resource.",
  NOT_FOUND: "Resource not found. Please try again later.",
  METHOD_NOT_ALLOWED:
    "The requested method is not allowed for the specified resource. Please use a different HTTP method.",
  INTERNAL_SERVER_ERROR:
    "An unexpected error occurred on the server while processing your request. Please try again later.",
  BAD_GATEWAY: "An unexpected error occurred on the server while processing your request. Please try again later.",
  SERVICE_UNAVAILABLE:
    "The server is currently unable to handle the request due to temporary overloading or maintenance. Please try again later.",
  GATEWAY_TIMEOUT: "The server took too long to respond. Please try again later.",
  // Add more error messages as needed...
};

export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: "Login successful.",
  // Add more success messages as needed...
};

export const INFO_MESSAGES = {
  USERNAME_REQUIRED: "Username is required.",
  PASSWORD_REQUIRED: "Password is required.",
  USERNAME_PASSWORD_REQUIRED: "Username and password are required.",
  NO_DATA_FOUND: "No data found.",
  // Add more info messages as needed...
};

export const ERROR_CODES = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
  // Add more error codes as needed...
};
