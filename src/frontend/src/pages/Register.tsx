import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  CheckCircle,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  User,
  UserPlus,
} from "lucide-react";
import { useState } from "react";
import { apiRegister } from "../lib/authApi";

const FEATURES = [
  "Real-time bidding on exclusive items worldwide",
  "Instant notifications when you're outbid",
  "Post your own auction listings easily",
  "Secure, encrypted transactions guaranteed",
];

function getPasswordStrength(password: string) {
  if (password.length === 0)
    return { label: "", color: "", width: "0%", score: 0 };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 2)
    return { label: "Weak", color: "bg-red-500", width: "33%", score };
  if (score <= 3)
    return { label: "Fair", color: "bg-yellow-500", width: "66%", score };
  return { label: "Strong", color: "bg-green-500", width: "100%", score };
}

interface FieldErrors {
  fullName?: string;
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export default function Register() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const strength = getPasswordStrength(password);

  const errors: FieldErrors = {};
  if (touched.fullName && fullName.trim().length < 2)
    errors.fullName = "Full name must be at least 2 characters.";
  if (touched.username && username.trim().length < 3)
    errors.username = "Username must be at least 3 characters.";
  if (touched.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.email = "Please enter a valid email address.";
  if (touched.password && password.length < 8)
    errors.password = "Password must be at least 8 characters.";
  if (touched.confirmPassword && confirmPassword !== password)
    errors.confirmPassword = "Passwords do not match.";

  function blur(field: string) {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({
      fullName: true,
      username: true,
      email: true,
      password: true,
      confirmPassword: true,
    });
    if (
      fullName.trim().length < 2 ||
      username.trim().length < 3 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      password.length < 8 ||
      confirmPassword !== password
    )
      return;

    setApiError(null);
    setIsLoading(true);
    try {
      const { token, user } = await apiRegister(
        username.trim(),
        email.trim(),
        password,
      );
      localStorage.setItem("auth_token", token);
      localStorage.setItem("auth_user", JSON.stringify(user));
      navigate({ to: "/userhome" });
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : "Registration failed.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg animate-fade-in">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <img
              src="/assets/generated/bidnova-logo-futuristic.dim_400x120.png"
              alt="BidNova"
              className="h-14 w-auto"
              style={{
                borderRadius: "20px",
                filter:
                  "drop-shadow(0 0 8px rgba(212, 175, 55, 1)) drop-shadow(0 0 18px rgba(212, 175, 55, 0.9)) drop-shadow(0 0 40px rgba(212, 175, 55, 0.6)) drop-shadow(0 0 70px rgba(212, 175, 55, 0.35))",
              }}
            />
          </div>
          <h1 className="text-xl font-semibold text-white mt-3 mb-1">
            Create your account
          </h1>
          <p className="text-gray-400 text-sm">
            Join thousands of bidders worldwide
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-6">
          {FEATURES.map((f) => (
            <div
              key={f}
              className="flex items-start gap-2 bg-navy-card border border-navy-surface rounded-xl p-3"
            >
              <CheckCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
              <span className="text-gray-300 text-xs leading-snug">{f}</span>
            </div>
          ))}
        </div>

        <div className="bg-navy-card border border-navy-surface rounded-2xl p-8 shadow-xl">
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
            data-ocid="register.form"
          >
            <div className="space-y-1.5">
              <Label
                htmlFor="fullName"
                className="text-gray-300 text-sm font-medium"
              >
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Jane Smith"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  onBlur={() => blur("fullName")}
                  data-ocid="register.input"
                  className={`pl-10 bg-navy-surface border-navy-light text-white placeholder:text-gray-600 focus-visible:ring-gold ${errors.fullName ? "border-red-500" : ""}`}
                />
              </div>
              {errors.fullName && (
                <p
                  data-ocid="register.error_state"
                  className="text-red-400 text-xs"
                >
                  {errors.fullName}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="username"
                className="text-gray-300 text-sm font-medium"
              >
                Username
              </Label>
              <div className="relative">
                <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                <Input
                  id="username"
                  type="text"
                  placeholder="janebidder"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onBlur={() => blur("username")}
                  data-ocid="register.input"
                  className={`pl-10 bg-navy-surface border-navy-light text-white placeholder:text-gray-600 focus-visible:ring-gold ${errors.username ? "border-red-500" : ""}`}
                />
              </div>
              {errors.username && (
                <p
                  data-ocid="register.error_state"
                  className="text-red-400 text-xs"
                >
                  {errors.username}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="email"
                className="text-gray-300 text-sm font-medium"
              >
                Email address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                <Input
                  id="email"
                  type="email"
                  placeholder="jane@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => blur("email")}
                  data-ocid="register.input"
                  className={`pl-10 bg-navy-surface border-navy-light text-white placeholder:text-gray-600 focus-visible:ring-gold ${errors.email ? "border-red-500" : ""}`}
                />
              </div>
              {errors.email && (
                <p
                  data-ocid="register.error_state"
                  className="text-red-400 text-xs"
                >
                  {errors.email}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="password"
                className="text-gray-300 text-sm font-medium"
              >
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => blur("password")}
                  data-ocid="register.input"
                  className={`pl-10 pr-10 bg-navy-surface border-navy-light text-white placeholder:text-gray-600 focus-visible:ring-gold ${errors.password ? "border-red-500" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  data-ocid="register.toggle"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {password.length > 0 && (
                <div className="mt-2 space-y-1">
                  <div className="h-1.5 bg-navy-surface rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${strength.color}`}
                      style={{ width: strength.width }}
                    />
                  </div>
                  <p
                    className={`text-xs ${strength.score <= 2 ? "text-red-400" : strength.score <= 3 ? "text-yellow-400" : "text-green-400"}`}
                  >
                    Password strength: {strength.label}
                  </p>
                </div>
              )}
              {errors.password && (
                <p
                  data-ocid="register.error_state"
                  className="text-red-400 text-xs"
                >
                  {errors.password}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="confirmPassword"
                className="text-gray-300 text-sm font-medium"
              >
                Confirm Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                <Input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Repeat your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onBlur={() => blur("confirmPassword")}
                  data-ocid="register.input"
                  className={`pl-10 pr-10 bg-navy-surface border-navy-light text-white placeholder:text-gray-600 focus-visible:ring-gold ${errors.confirmPassword ? "border-red-500" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((p) => !p)}
                  data-ocid="register.toggle"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showConfirm ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p
                  data-ocid="register.error_state"
                  className="text-red-400 text-xs"
                >
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {apiError && (
              <div
                data-ocid="register.error_state"
                className="bg-red-900/40 border border-red-500/50 rounded-lg px-4 py-3 text-red-400 text-sm"
              >
                {apiError}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              data-ocid="register.submit_button"
              className="w-full bg-gold hover:bg-gold-dark text-navy font-bold py-3 text-base rounded-xl h-12"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-5 w-5" />
                  Create Account
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-gray-500 text-sm">
              Already have an account?{" "}
            </span>
            <Link
              to="/login"
              data-ocid="register.link"
              className="text-gold hover:text-gold-light font-medium text-sm transition-colors"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
