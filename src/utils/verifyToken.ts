// import { jwtDecode } from "jwt-decode";

// export const verifyToken = (token: string) => {
//   return jwtDecode(token);
// };
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  email: string;
  role: string;
  // Add other fields from your token as needed
}

export const verifyToken = (token: string): JwtPayload | null => {
  try {
    return jwtDecode<JwtPayload>(token);
  } catch (err) {
    console.error("Invalid token:", err);
    return null;
  }
};

