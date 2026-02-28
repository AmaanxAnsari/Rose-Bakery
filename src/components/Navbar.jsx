
import { Link, useNavigate } from "react-router-dom";
import Button from "./common/Button";
import { useSelector, useDispatch } from "react-redux";
import { logout } from '../api/authSlice';


export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, roles } = useSelector((s) => s.auth);

  const isAdmin = roles?.includes("admin");
  const isUser = roles?.includes("user");

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/70 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          {/* Logo circle */}
          <div className="h-9 w-9 rounded-full bg-white flex items-center justify-center overflow-hidden">
            <img
              src="https://i.ibb.co/bjQv0s3C/rose-1.png"
              alt="Rose Bakery"
              className="h-10 w-10 object-contain"
            />
          </div>

          {/* Text */}
          <div>
            <p className="text-sm font-semibold text-white">Rose Bakery</p>
            <p className="text-[11px] text-white/50 -mt-0.5">Credit Ledger</p>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              {isUser ? (
                <Button
                  variant="ghost"
                  onClick={() => navigate("/customer/dashboard")}
                >
                  Dashboard
                </Button>
              ) : null}

              {isAdmin ? (
                <Button
                  variant="ghost"
                  onClick={() => navigate("/admin/dashboard")}
                >
                  Admin
                </Button>
              ) : null}

              <Button
                variant="primary"
                onClick={() => {
                  dispatch(logout());
                  navigate("/");
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <Button variant="ghost" onClick={() => navigate("/login")}>
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
