import { ReactNode } from "react";
import { useAppSelector } from "../../redux/features/hook";
import { useCurrentToken } from "../../redux/features/auth/authSlice";
import { Navigate } from "react-router";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  //   const { token } = useAppSelector(state => state.auth);
  const token = useAppSelector(useCurrentToken);
  if (!token) {
    return <Navigate to="/login" replace={true} />;
  }

  return children;
}
