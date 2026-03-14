"use client";

import React, { useEffect } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  IconButton,
  InputAdornment,
  Tab,
  Tabs,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CampaignIcon from "@mui/icons-material/Campaign";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, usePathname } from "next/navigation";
import { useLogin } from "../queries/auth";
import {
  useRequestOtp,
  useVerifyOtp,
  useResendOtp,
  useCompleteRegistration,
} from "../queries/register";
import { useAuth } from "../hooks/useAuth";
import { useAuthModal, type RegisterType } from "../providers/AuthModalProvider";
import { createUnauthApiClient } from "../lib/apiClient";

const LoginSchema = z.object({
  email: z.string().email("Valid email required"),
  password: z.string().min(6, "Min 6 characters"),
});

const CreatorEmailSchema = z.object({
  email: z.string().email("Enter a valid email"),
});

const CreatorOtpSchema = z.object({
  otp: z.string().length(6, "Enter the 6-digit code"),
});

const CreatorCompleteSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  display_name: z.string().min(2, "Display name must be at least 2 characters"),
}).refine((d) => d.password === d.confirmPassword, { message: "Passwords don't match", path: ["confirmPassword"] });

const BrandRegisterSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  company_name: z.string().min(2, "Company name must be at least 2 characters"),
  industry: z.string().optional(),
  website: z.string().url("Enter a valid URL").optional().or(z.literal("")),
});

type LoginFormValues = z.infer<typeof LoginSchema>;
type CreatorEmailValues = z.infer<typeof CreatorEmailSchema>;
type CreatorOtpValues = z.infer<typeof CreatorOtpSchema>;
type CreatorCompleteValues = z.infer<typeof CreatorCompleteSchema>;
type BrandRegisterValues = z.infer<typeof BrandRegisterSchema>;

type CreatorRegisterStep = "email" | "otp" | "complete";

export function AuthModal() {
  const { open, tab, registerType, close, setTab, setRegisterType, openLogin } = useAuthModal();
  const router = useRouter();
  const pathname = usePathname();
  const { setTokens } = useAuth();

  const handleClose = () => {
    if (redirectingAfterLogin) return;
    close();
    if (pathname === "/login" || pathname?.startsWith("/register")) router.push("/");
  };
  const [showPassword, setShowPassword] = React.useState(false);
  const [registerError, setRegisterError] = React.useState<string | null>(null);
  const [redirectingAfterLogin, setRedirectingAfterLogin] = React.useState(false);
  const [creatorStep, setCreatorStep] = React.useState<CreatorRegisterStep>("email");
  const [registrationEmail, setRegistrationEmail] = React.useState("");
  const [registrationToken, setRegistrationToken] = React.useState<string | null>(null);
  const [otpExpiresAt, setOtpExpiresAt] = React.useState<number | null>(null);
  const [otpCountdown, setOtpCountdown] = React.useState<number | null>(null);

  useEffect(() => {
    if (pathname === "/dashboard" && redirectingAfterLogin) {
      close();
      setRedirectingAfterLogin(false);
    }
  }, [pathname, redirectingAfterLogin, close]);

  const loginMutation = useLogin();

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: "", password: "" },
  });

  const requestOtpMutation = useRequestOtp();
  const verifyOtpMutation = useVerifyOtp();
  const resendOtpMutation = useResendOtp();
  const completeRegistrationMutation = useCompleteRegistration(registrationToken);

  const creatorEmailForm = useForm<CreatorEmailValues>({
    resolver: zodResolver(CreatorEmailSchema),
    defaultValues: { email: "" },
  });
  const creatorOtpForm = useForm<CreatorOtpValues>({
    resolver: zodResolver(CreatorOtpSchema),
    defaultValues: { otp: "" },
  });
  const creatorCompleteForm = useForm<CreatorCompleteValues>({
    resolver: zodResolver(CreatorCompleteSchema),
    defaultValues: { password: "", confirmPassword: "", display_name: "" },
  });

  useEffect(() => {
    if (otpExpiresAt == null) return;
    const tick = () => {
      const left = Math.max(0, Math.ceil((otpExpiresAt - Date.now()) / 1000));
      setOtpCountdown(left);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [otpExpiresAt]);

  const brandForm = useForm<BrandRegisterValues>({
    resolver: zodResolver(BrandRegisterSchema),
    defaultValues: { email: "", password: "", company_name: "", industry: "", website: "" },
  });

  const onLogin = (values: LoginFormValues) => {
    loginMutation.mutate(values, {
      onSuccess: (data) => {
        setTokens(data.access_token, data.refresh_token ?? null);
        setRedirectingAfterLogin(true);
        requestAnimationFrame(() => {
          router.push("/dashboard");
        });
      },
    });
  };

  const onCreatorRequestOtp = (values: CreatorEmailValues) => {
    setRegisterError(null);
    requestOtpMutation.mutate(
      { email: values.email },
      {
        onSuccess: (data) => {
          setRegistrationEmail(values.email);
          setOtpExpiresAt(Date.now() + data.expires_in_minutes * 60 * 1000);
          setCreatorStep("otp");
          creatorOtpForm.reset({ otp: "" });
        },
        onError: (err: { response?: { data?: { detail?: string }; status?: number } }) => {
          const msg =
            err.response?.data?.detail ||
            (err.response?.status === 503
              ? "Failed to send OTP email. Check server SMTP configuration."
              : "Email already registered.");
          setRegisterError(typeof msg === "string" ? msg : "Request failed. Try again.");
        },
      }
    );
  };

  const onCreatorVerifyOtp = (values: CreatorOtpValues) => {
    setRegisterError(null);
    verifyOtpMutation.mutate(
      { email: registrationEmail, otp: values.otp },
      {
        onSuccess: (data) => {
          setRegistrationToken(data.registration_token);
          setCreatorStep("complete");
          creatorCompleteForm.reset({ password: "", confirmPassword: "", display_name: "" });
        },
        onError: (err: { response?: { data?: { detail?: string } } }) => {
          const msg = err.response?.data?.detail ?? "Invalid OTP. Please try again.";
          setRegisterError(typeof msg === "string" ? msg : "Verification failed.");
        },
      }
    );
  };

  const onResendOtp = () => {
    setRegisterError(null);
    resendOtpMutation.mutate(
      { email: registrationEmail },
      {
        onSuccess: (data) => {
          setOtpExpiresAt(Date.now() + data.expires_in_minutes * 60 * 1000);
          creatorOtpForm.reset({ otp: "" });
        },
        onError: (err: { response?: { data?: { detail?: string }; status?: number } }) => {
          const msg =
            err.response?.data?.detail ||
            (err.response?.status === 503
              ? "Failed to send OTP email. Check server SMTP configuration."
              : "Email already registered.");
          setRegisterError(typeof msg === "string" ? msg : "Resend failed.");
        },
      }
    );
  };

  const onCreatorComplete = (values: CreatorCompleteValues) => {
    setRegisterError(null);
    completeRegistrationMutation.mutate(
      { password: values.password, display_name: values.display_name },
      {
        onSuccess: () => {
          close();
          router.push("/");
          setTimeout(() => openLogin(), 200);
        },
        onError: (err: { response?: { data?: { detail?: string }; status?: number } }) => {
          const msg =
            err.response?.data?.detail ??
            (err.response?.status === 401
              ? "Invalid or expired registration token. Verify OTP again."
              : "Registration failed. Try again.");
          setRegisterError(typeof msg === "string" ? msg : "Complete failed.");
        },
      }
    );
  };

  const onBrandRegister = async (values: BrandRegisterValues) => {
    setRegisterError(null);
    try {
      const client = createUnauthApiClient();
      await client.post("/auth/register-brand", {
        ...values,
        website: values.website || undefined,
      });
      close();
      router.push("/");
      setTimeout(() => openLogin(), 200);
    } catch {
      setRegisterError("Failed to register. Please try again.");
    }
  };

  useEffect(() => {
    if (!open) {
      setRegisterError(null);
      loginForm.reset();
      creatorEmailForm.reset();
      creatorOtpForm.reset();
      creatorCompleteForm.reset();
      brandForm.reset();
      setCreatorStep("email");
      setRegistrationEmail("");
      setRegistrationToken(null);
      setOtpExpiresAt(null);
      setOtpCountdown(null);
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: "hidden",
          maxHeight: "90vh",
          bgcolor: "#1a1a1a",
          border: "1px solid rgba(255,255,255,0.08)",
        },
      }}
      slotProps={{ backdrop: { sx: { bgcolor: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)" } } }}
    >
      <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, minHeight: 480 }}>
        {/* Left column - image / visual */}
        <Box
          sx={{
            width: { md: "42%" },
            minHeight: { xs: 200, md: "auto" },
            background: "linear-gradient(135deg, #2d5a3d 0%, #3d7a4d 40%, #6EEB83 100%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            p: 3,
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0.15,
              background: "radial-gradient(circle at 30% 50%, #fff 0%, transparent 50%)",
            }}
          />
          <Box
            sx={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              bgcolor: "rgba(0,0,0,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              zIndex: 1,
            }}
          >
            <CampaignIcon sx={{ fontSize: 64, color: "#fff" }} />
          </Box>
          <Typography variant="h6" sx={{ color: "#fff", fontWeight: 700, mt: 2, position: "relative", zIndex: 1 }}>
            Clipify
          </Typography>
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.9)", textAlign: "center", mt: 0.5, position: "relative", zIndex: 1 }}>
            Turn views into revenue
          </Typography>
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              py: 1.5,
              px: 2,
              bgcolor: "rgba(0,0,0,0.4)",
              textAlign: "center",
            }}
          >
            <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.9)", fontSize: "0.7rem" }}>
              By continuing, you agree to the Terms of Service and Privacy Policy.
            </Typography>
          </Box>
        </Box>

        {/* Right column - form */}
        <Box
          sx={{
            flex: 1,
            p: 3,
            display: "flex",
            flexDirection: "column",
            bgcolor: "#141414",
            position: "relative",
          }}
        >
          <IconButton
            onClick={handleClose}
            sx={{ position: "absolute", top: 8, right: 8, color: "text.secondary" }}
            size="small"
          >
            <CloseIcon />
          </IconButton>

          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v as "login" | "register")}
            sx={{
              mb: 2,
              minHeight: 40,
              "& .MuiTab-root": { textTransform: "none", fontWeight: 600, fontSize: "0.95rem" },
              "& .Mui-selected": { color: "primary.main" },
              "& .MuiTabs-indicator": { bgcolor: "primary.main", height: 3, borderRadius: "3px 3px 0 0" },
            }}
          >
            <Tab value="login" label="Login" />
            <Tab value="register" label="Register" />
          </Tabs>

          {tab === "login" && (loginMutation.isPending || redirectingAfterLogin) && (
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", py: 6, px: 2 }}>
              <CircularProgress size={48} sx={{ color: "primary.main", mb: 2 }} />
              <Typography variant="h6" fontWeight={600} sx={{ mb: 0.5 }}>
                {redirectingAfterLogin ? "Redirecting to dashboard…" : "Signing in…"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {redirectingAfterLogin ? "Taking you there." : "Please wait."}
              </Typography>
            </Box>
          )}
          {tab === "login" && !loginMutation.isPending && !redirectingAfterLogin && (
            <>
              <Typography variant="h5" fontWeight={700} sx={{ mb: 0.5 }}>
                Login to{" "}
                <Box component="span" sx={{ color: "primary.main" }}>
                  your account
                </Box>
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Enter your details to login.
              </Typography>
              {loginMutation.isError && (
                <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                  Invalid credentials.
                </Alert>
              )}
              <Box component="form" onSubmit={loginForm.handleSubmit(onLogin)} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                  label="Email or Username"
                  required
                  fullWidth
                  size="small"
                  placeholder="Enter your email or username"
                  {...loginForm.register("email")}
                  error={!!loginForm.formState.errors.email}
                  helperText={loginForm.formState.errors.email?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": { borderRadius: 2 },
                  }}
                />
                <TextField
                  label="Password"
                  required
                  fullWidth
                  size="small"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  {...loginForm.register("password")}
                  error={!!loginForm.formState.errors.password}
                  helperText={loginForm.formState.errors.password?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                />
                <Box sx={{ textAlign: "right" }}>
                  <Typography
                    component="button"
                    type="button"
                    variant="body2"
                    sx={{ color: "primary.main", cursor: "pointer", border: "none", background: "none", fontWeight: 600 }}
                    onClick={() => {}}
                  >
                    Forgot password?
                  </Typography>
                </Box>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loginMutation.isPending}
                  sx={{ py: 1.25, borderRadius: 2, fontWeight: 600, textTransform: "none" }}
                >
                  {loginMutation.isPending ? "Signing in…" : "Login"}
                </Button>
              </Box>
            </>
          )}

          {tab === "register" && (
            <>
              <Typography variant="h5" fontWeight={700} sx={{ mb: 0.5 }}>
                Create{" "}
                <Box component="span" sx={{ color: "primary.main" }}>
                  your account
                </Box>
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Join as {registerType === "creator" ? "Creator" : "Brand"} to get started.
              </Typography>
              <Tabs
                value={registerType}
                onChange={(_, v) => setRegisterType(v as RegisterType)}
                sx={{
                  mb: 2,
                  minHeight: 36,
                  "& .MuiTab-root": { textTransform: "none", fontWeight: 600, fontSize: "0.85rem", minHeight: 36 },
                  "& .MuiTabs-indicator": { bgcolor: "primary.main" },
                }}
              >
                <Tab value="creator" label="Creator" />
                <Tab value="brand" label="Brand" />
              </Tabs>
              {registerError && (
                <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                  {registerError}
                </Alert>
              )}

              {registerType === "creator" && (
                <>
                  {creatorStep === "email" && (
                    <Box component="form" onSubmit={creatorEmailForm.handleSubmit(onCreatorRequestOtp)} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <TextField label="Email" type="email" fullWidth size="small" {...creatorEmailForm.register("email")} error={!!creatorEmailForm.formState.errors.email} helperText={creatorEmailForm.formState.errors.email?.message} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
                      <Button type="submit" variant="contained" fullWidth disabled={requestOtpMutation.isPending} sx={{ py: 1.25, borderRadius: 2, fontWeight: 600, textTransform: "none" }}>
                        {requestOtpMutation.isPending ? "Sending…" : "Send verification code"}
                      </Button>
                    </Box>
                  )}
                  {creatorStep === "otp" && (
                    <Box component="form" onSubmit={creatorOtpForm.handleSubmit(onCreatorVerifyOtp)} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        We sent a 6-digit code to {registrationEmail}
                      </Typography>
                      <TextField label="Verification code" fullWidth size="small" placeholder="000000" inputProps={{ maxLength: 6 }} {...creatorOtpForm.register("otp")} error={!!creatorOtpForm.formState.errors.otp} helperText={creatorOtpForm.formState.errors.otp?.message} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
                      {otpCountdown != null && otpCountdown > 0 && (
                        <Typography variant="caption" color="text.secondary">
                          Code expires in {Math.floor(otpCountdown / 60)}:{String(otpCountdown % 60).padStart(2, "0")}
                        </Typography>
                      )}
                      <Button type="button" variant="text" size="small" disabled={resendOtpMutation.isPending || (otpCountdown != null && otpCountdown > 0)} onClick={onResendOtp} sx={{ alignSelf: "flex-start", textTransform: "none" }}>
                        {resendOtpMutation.isPending ? "Sending…" : "Resend OTP"}
                      </Button>
                      <Button type="submit" variant="contained" fullWidth disabled={verifyOtpMutation.isPending} sx={{ py: 1.25, borderRadius: 2, fontWeight: 600, textTransform: "none" }}>
                        {verifyOtpMutation.isPending ? "Verifying…" : "Verify"}
                      </Button>
                    </Box>
                  )}
                  {creatorStep === "complete" && (
                    <Box component="form" onSubmit={creatorCompleteForm.handleSubmit(onCreatorComplete)} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <TextField label="Display name" fullWidth size="small" placeholder="Username" {...creatorCompleteForm.register("display_name")} error={!!creatorCompleteForm.formState.errors.display_name} helperText={creatorCompleteForm.formState.errors.display_name?.message} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
                      <TextField label="Password" type="password" fullWidth size="small" {...creatorCompleteForm.register("password")} error={!!creatorCompleteForm.formState.errors.password} helperText={creatorCompleteForm.formState.errors.password?.message} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
                      <TextField label="Confirm password" type="password" fullWidth size="small" {...creatorCompleteForm.register("confirmPassword")} error={!!creatorCompleteForm.formState.errors.confirmPassword} helperText={creatorCompleteForm.formState.errors.confirmPassword?.message} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
                      <Button type="submit" variant="contained" fullWidth disabled={completeRegistrationMutation.isPending} sx={{ py: 1.25, borderRadius: 2, fontWeight: 600, textTransform: "none" }}>
                        {completeRegistrationMutation.isPending ? "Creating…" : "Create account"}
                      </Button>
                    </Box>
                  )}
                </>
              )}

              {registerType === "brand" && (
                <Box component="form" onSubmit={brandForm.handleSubmit(onBrandRegister)} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <TextField label="Email" type="email" fullWidth size="small" {...brandForm.register("email")} error={!!brandForm.formState.errors.email} helperText={brandForm.formState.errors.email?.message} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
                  <TextField label="Password" type="password" fullWidth size="small" {...brandForm.register("password")} error={!!brandForm.formState.errors.password} helperText={brandForm.formState.errors.password?.message} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
                  <TextField label="Company name" fullWidth size="small" {...brandForm.register("company_name")} error={!!brandForm.formState.errors.company_name} helperText={brandForm.formState.errors.company_name?.message} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
                  <TextField label="Industry" fullWidth size="small" {...brandForm.register("industry")} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
                  <TextField label="Website" fullWidth size="small" {...brandForm.register("website")} error={!!brandForm.formState.errors.website} helperText={brandForm.formState.errors.website?.message} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
                  <Button type="submit" variant="contained" fullWidth disabled={brandForm.formState.isSubmitting} sx={{ py: 1.25, borderRadius: 2, fontWeight: 600, textTransform: "none" }}>
                    {brandForm.formState.isSubmitting ? "Creating…" : "Create account"}
                  </Button>
                </Box>
              )}
            </>
          )}
        </Box>
      </Box>
    </Dialog>
  );
}
