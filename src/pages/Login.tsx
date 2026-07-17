import { Button } from "antd";
import { FieldValues, useForm } from "react-hook-form";
import { useLoginMutation } from "../redux/features/auth/authApi";
import { useAppDispatch } from "../redux/features/hook";
import { setUser } from "../redux/features/auth/authSlice";
import { verifyToken } from "../utils/verifyToken";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { register, handleSubmit } = useForm({
    defaultValues: {
      email: "admin@gmail.com",
      pass: "admin12$2025",
    },
  });

  const [login, { error }] = useLoginMutation();
  console.log(error);

  const onSubmit = async (data: FieldValues) => {
    try {
      const res = await login({
        email: data.email,
        pass: data.pass,
      }).unwrap();

      const user = verifyToken(res?.token);
      toast.success("Login successful");
      if (user) {
        dispatch(setUser({ user: { user }, token: res?.token }));
        navigate(`/${user.role}/dashboard`);
      }
    } catch (err) {
      console.error("Login failed:", err);
      // toast.error("Something went wrong");

      // Type-safe error handling
      let errorMessage = "Login failed";
      if (typeof err === "object" && err !== null && "data" in err) {
        const errorData = (err as any).data;
        if (
          typeof errorData === "object" &&
          errorData !== null &&
          "message" in errorData
        ) {
          errorMessage = String(errorData.message);
        }
      }

      toast.error(errorMessage);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f0f2f5",
      }}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{
          width: 350,
          padding: 32,
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: 24 }}>Login</h2>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="email" style={{ display: "block", marginBottom: 8 }}>
            Email:
          </label>
          <input
            type="text"
            id="email"
            {...register("email")}
            style={{
              width: "100%",
              padding: "8px 12px",
              border: "1px solid #d9d9d9",
              borderRadius: 4,
            }}
          />
        </div>
        <div style={{ marginBottom: 24 }}>
          <label htmlFor="pass" style={{ display: "block", marginBottom: 8 }}>
            Password:
          </label>
          <input
            type="password"
            id="pass"
            {...register("pass")}
            style={{
              width: "100%",
              padding: "8px 12px",
              border: "1px solid #d9d9d9",
              borderRadius: 4,
            }}
          />
        </div>
        <Button
          htmlType="submit"
          type="primary"
          block
          style={{ height: 40, fontWeight: 500 }}
        >
          Login
        </Button>
      </form>
    </div>
  );
}
