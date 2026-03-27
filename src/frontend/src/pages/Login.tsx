import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { apiLogin } from "../lib/authApi";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const { token, user } = await apiLogin(email, password);
      localStorage.setItem("auth_token", token);
      localStorage.setItem("auth_user", JSON.stringify(user));
      if (rememberMe) localStorage.setItem("remember_me", "true");
      navigate({ to: "/userhome" });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-fade-in">
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
            Welcome back
          </h1>
          <p className="text-gray-400 text-sm">Sign in to continue bidding</p>
        </div>

        <div className="bg-navy-card border border-navy-surface rounded-2xl p-8 shadow-xl">
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
            data-ocid="login.form"
          >
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
                  autoComplete="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  data-ocid="login.input"
                  className="pl-10 bg-navy-surface border-navy-light text-white placeholder:text-gray-600 focus-visible:ring-gold focus-visible:ring-2"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-gray-300 text-sm font-medium"
                >
                  Password
                </Label>
                <button
                  type="button"
                  className="text-gold hover:text-gold-light text-xs transition-colors bg-transparent border-none cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  data-ocid="login.input"
                  className="pl-10 pr-10 bg-navy-surface border-navy-light text-white placeholder:text-gray-600 focus-visible:ring-gold focus-visible:ring-2"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  data-ocid="login.toggle"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(v) => setRememberMe(v === true)}
                data-ocid="login.checkbox"
                className="border-navy-light data-[state=checked]:bg-gold data-[state=checked]:border-gold"
              />
              <Label
                htmlFor="remember"
                className="text-gray-400 text-sm cursor-pointer"
              >
                Remember me for 30 days
              </Label>
            </div>

            {error && (
              <div
                data-ocid="login.error_state"
                className="bg-red-900/40 border border-red-500/50 rounded-lg px-4 py-3 text-red-400 text-sm"
              >
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              data-ocid="login.submit_button"
              className="w-full bg-gold hover:bg-gold-dark text-navy font-bold py-3 text-base rounded-xl h-12"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-gray-500 text-sm">
              Don't have an account?{" "}
            </span>
            <Link
              to="/register"
              data-ocid="login.link"
              className="text-gold hover:text-gold-light font-medium text-sm transition-colors"
            >
              Create one free
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
