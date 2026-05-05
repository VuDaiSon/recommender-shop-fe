import { useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import authApi from "../../api/authApi";
import "./ResetPassword.scss";

function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  // 🔥 thêm
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const hasShown = useRef(false);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  const handleSubmit = async () => {
    if (loading) return; // 🔥 chống spam

    if (!password || !confirm) {
      return showToast("Vui lòng nhập đầy đủ", "error");
    }

    if (password !== confirm) {
      return showToast("Mật khẩu không khớp", "error");
    }

    try {
      setLoading(true);

      await authApi.resetPassword(token, password);

      showToast("🎉 Đổi mật khẩu thành công!");

      setTimeout(() => {
        navigate("/login", {
          state: { message: "Bạn đã đổi mật khẩu thành công" },
        });
      }, 1000);
    } catch (err) {
      const msg =
        err.response?.data?.message || "Token không hợp lệ hoặc đã hết hạn";

      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-page">
      {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}

      <div className="reset-box">
        <h2>RESET PASSWORD</h2>

        <input
          type="password"
          placeholder="NEW PASSWORD"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="CONFIRM PASSWORD"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={loading ? "loading" : ""}
        >
          {loading && <span className="spinner"></span>}
          RESET
        </button>
      </div>
    </div>
  );
}

export default ResetPassword;
