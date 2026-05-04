"use client";

import { useState } from "react";
import { X, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "signin" | "signup";
}

export default function AuthModal({
  isOpen,
  onClose,
  defaultTab = "signin",
}: AuthModalProps) {
  const { signIn, signUp } = useAuth();
  const [tab, setTab] = useState<"signin" | "signup">(defaultTab);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (tab === "signin") {
      const { error } = await signIn(email, password);
      if (error) {
        toast.error(error);
      } else {
        toast.success("Welcome back!");
        onClose();
      }
    } else {
      if (password.length < 8) {
        toast.error("Password must be at least 8 characters");
        setLoading(false);
        return;
      }
      const { error } = await signUp(email, password, fullName, phone);
      if (error) {
        toast.error(error);
      } else {
        toast.success("Account created! Check your email to verify.");
        onClose();
      }
    }
    setLoading(false);
  };

  return (
    // MODAL OVERLAY
    // `fixed inset-0` = covers the full screen
    // `z-50` = sits above everything
    // Clicking the overlay (not the modal itself) closes it
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      {/* MODAL PANEL */}
      {/* `onClick e.stopPropagation()` prevents clicks INSIDE from closing it */}
      <div
        className="bg-brand-dark border border-brand-mid rounded-sm w-full max-w-md shadow-2xl animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-brand-mid">
          <div>
            <h2 className="font-display text-xl font-bold text-brand-white">
              {tab === "signin" ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-xs text-brand-muted mt-1">
              {tab === "signin"
                ? "Sign in to your Men's World account"
                : "Join Men's World Kenya today"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="btn-ghost p-1.5 rounded-sm"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-brand-mid">
          {(["signin", "signup"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "flex-1 py-3 text-sm font-medium tracking-wider uppercase transition-colors",
                tab === t
                  ? "text-brand-gold border-b-2 border-brand-gold"
                  : "text-brand-muted hover:text-brand-light"
              )}
            >
              {t === "signin" ? "Sign In" : "Register"}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {tab === "signup" && (
            <>
              <div>
                <label className="label">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Kamau"
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="label">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0712 345 678"
                  className="input"
                  required
                />
              </div>
            </>
          )}

          <div>
            <label className="label">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="input"
              required
            />
          </div>

          <div>
            <label className="label">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={tab === "signup" ? "Min. 8 characters" : "••••••••"}
                className="input pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-light"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {tab === "signin" && (
            <div className="text-right">
              <button type="button" className="text-xs text-brand-gold hover:underline">
                Forgot password?
              </button>
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
            {loading ? (
              <><Loader2 size={16} className="animate-spin" /> Please wait...</>
            ) : tab === "signin" ? (
              "Sign In"
            ) : (
              "Create Account"
            )}
          </button>

          <p className="text-center text-xs text-brand-muted">
            {tab === "signin" ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => setTab(tab === "signin" ? "signup" : "signin")}
              className="text-brand-gold hover:underline"
            >
              {tab === "signin" ? "Register" : "Sign In"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
