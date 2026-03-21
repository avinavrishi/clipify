"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Fade,
  IconButton,
  InputAdornment,
  Slide,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useTheme,
} from "@mui/material";
import { alpha, keyframes } from "@mui/material/styles";
import CampaignIcon from "@mui/icons-material/Campaign";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AxiosError } from "axios";
import { useLogin } from "../../queries/auth";
import {
  useRequestOtp,
  useVerifyOtp,
  useResendOtp,
  useCompleteRegistration,
} from "../../queries/register";
import { useAuth } from "../../hooks/useAuth";
import { createUnauthApiClient, API_BASE_URL } from "../../lib/apiClient";
import { ThemeSelect } from "../ThemeSelect";

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

const CreatorCompleteSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

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

export type AuthPanel = "login" | "creator" | "brand";

function parseTab(raw: string | null): AuthPanel {
  if (raw === "creator" || raw === "brand") return raw;
  return "login";
}

const blobFloat = keyframes`
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(12px, -18px) scale(1.04); }
  66% { transform: translate(-10px, 8px) scale(0.98); }
`;

const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

export function AuthPageView() {
  const theme = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setTokens, currentUser } = useAuth();

  const tabParam = searchParams.get("tab");
  const panel = useMemo(() => parseTab(tabParam), [tabParam]);

  const setPanel = useCallback(
    (next: AuthPanel) => {
      const q = next === "login" ? "" : `?tab=${next}`;
      router.replace(`/auth${q}`, { scroll: false });
    },
    [router]
  );

  useEffect(() => {
    if (currentUser) {
      router.replace("/dashboard");
    }
  }, [currentUser, router]);

  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [redirectingAfterLogin, setRedirectingAfterLogin] = useState(false);
  const [creatorStep, setCreatorStep] = useState<CreatorRegisterStep>("email");
  const [registrationEmail, setRegistrationEmail] = useState("");
  const [registrationToken, setRegistrationToken] = useState<string | null>(null);
  const [otpExpiresAt, setOtpExpiresAt] = useState<number | null>(null);
  const [otpCountdown, setOtpCountdown] = useState<number | null>(null);

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

  const loginMutation = useLogin();
  const requestOtpMutation = useRequestOtp();
  const verifyOtpMutation = useVerifyOtp();
  const resendOtpMutation = useResendOtp();
  const completeRegistrationMutation = useCompleteRegistration(registrationToken);

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: "", password: "" },
  });

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
    defaultValues: { password: "", confirmPassword: "" },
  });

  const brandForm = useForm<BrandRegisterValues>({
    resolver: zodResolver(BrandRegisterSchema),
    defaultValues: { email: "", password: "", company_name: "", industry: "", website: "" },
  });

  useEffect(() => {
    setLoginError(null);
    setRegisterError(null);
    setCreatorStep("email");
    setRegistrationEmail("");
    setRegistrationToken(null);
    setOtpExpiresAt(null);
    setOtpCountdown(null);
    loginForm.reset();
    creatorEmailForm.reset();
    creatorOtpForm.reset();
    creatorCompleteForm.reset();
    brandForm.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset all forms when auth panel changes
  }, [panel]);

  const onLogin = (values: LoginFormValues) => {
    setLoginError(null);
    loginMutation.mutate(values, {
      onSuccess: (data) => {
        setTokens(data.access_token, data.refresh_token ?? null);
        setRedirectingAfterLogin(true);
        requestAnimationFrame(() => {
          router.push("/dashboard");
        });
      },
      onError: (err) => {
        const e = err as AxiosError<{ detail?: string }>;
        const detail = e.response?.data?.detail;
        const msg =
          e.response?.status === 400 && typeof detail === "string" && detail.includes("Google sign-in")
            ? "This account uses Google sign-in. Please use Login with Google."
            : "Invalid credentials.";
        setLoginError(msg);
      },
    });
  };

  const loginWithGoogle = () => {
    window.location.href = `${API_BASE_URL}/auth/login/google`;
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
        onError: (err) => {
          const e = err as AxiosError<{ detail?: string }>;
          const msg =
            e.response?.data?.detail ||
            (e.response?.status === 503
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
          creatorCompleteForm.reset({ password: "", confirmPassword: "" });
        },
        onError: (err) => {
          const e = err as AxiosError<{ detail?: string }>;
          const msg = e.response?.data?.detail ?? "Invalid OTP. Please try again.";
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
        onError: (err) => {
          const e = err as AxiosError<{ detail?: string }>;
          const msg =
            e.response?.data?.detail ||
            (e.response?.status === 503
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
      { password: values.password },
      {
        onSuccess: () => {
          router.push("/auth?tab=login");
        },
        onError: (err) => {
          const e = err as AxiosError<{ detail?: string }>;
          const msg =
            e.response?.data?.detail ??
            (e.response?.status === 401
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
      router.push("/auth?tab=login");
    } catch {
      setRegisterError("Failed to register. Please try again.");
    }
  };

  /** Rounded fields + soft focus ring (works with global input tokens) */
  const inputSx = useMemo(
    () => ({
      "& .MuiOutlinedInput-root": {
        borderRadius: "14px",
        minHeight: 48,
        transition:
          "border-color 0.22s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.22s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.2s ease",
        "&:hover": {
          boxShadow: `0 1px 3px ${alpha(theme.palette.common.black, theme.palette.mode === "dark" ? 0.2 : 0.06)}`,
        },
        "&.Mui-focused": {
          boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.14)}, 0 2px 8px ${alpha(theme.palette.common.black, theme.palette.mode === "dark" ? 0.25 : 0.08)}`,
        },
      },
      "& .MuiInputLabel-outlined": {
        fontWeight: 500,
        letterSpacing: "0.01em",
      },
      "& .MuiOutlinedInput-input": {
        py: 1.25,
        fontSize: "0.9375rem",
        letterSpacing: "0.01em",
      },
    }),
    [theme]
  );

  const formKey = panel === "creator" ? `creator-${creatorStep}` : panel;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
        color: "text.primary",
      }}
    >
      {/* Top bar */}
      <Box
        component="header"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: { xs: 2, sm: 3 },
          py: 1.5,
          borderBottom: "1px solid",
          borderColor: "divider",
          bgcolor: (t) => alpha(t.palette.background.paper, 0.6),
          backdropFilter: "blur(12px)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            component={Link}
            href="/"
            aria-label="Back to home"
            size="small"
            sx={{
              color: "text.secondary",
              "&:hover": { color: "primary.main", bgcolor: (t) => alpha(t.palette.primary.main, 0.08) },
            }}
          >
            <ArrowBackIcon fontSize="small" />
          </IconButton>
          <IconButton
            component={Link}
            href="/"
            aria-label="Clipify home"
            sx={{
              color: "inherit",
              "&:hover": { bgcolor: (t) => alpha(t.palette.text.primary, 0.06) },
            }}
          >
            <CampaignIcon sx={{ fontSize: 28 }} />
          </IconButton>
          <Typography variant="subtitle1" fontWeight={700} letterSpacing="-0.02em" component={Link} href="/" sx={{ color: "inherit", textDecoration: "none" }}>
            Clipify
          </Typography>
        </Box>
        <ThemeSelect />
      </Box>

      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          minHeight: 0,
        }}
      >
        {/* Visual panel — hidden on xs except slim strip; full on md+ */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            width: { md: "44%", lg: "46%" },
            position: "relative",
            overflow: "hidden",
            alignItems: "center",
            justifyContent: "center",
            p: { md: 4, lg: 6 },
            background: (t) =>
              t.palette.mode === "dark"
                ? `linear-gradient(135deg, ${alpha(t.palette.primary.main, 0.22)} 0%, ${alpha(t.palette.background.default, 1)} 45%, ${alpha(t.palette.primary.dark, 0.35)} 100%)`
                : `linear-gradient(135deg, ${alpha(t.palette.primary.main, 0.12)} 0%, ${alpha(t.palette.background.paper, 1)} 50%, ${alpha(t.palette.primary.light, 0.2)} 100%)`,
            backgroundSize: "200% 200%",
            animation: `${gradientShift} 18s ease infinite`,
            "@media (prefers-reduced-motion: reduce)": {
              animation: "none",
              backgroundSize: "100% 100%",
            },
          }}
        >
          <Box
            sx={{
              position: "absolute",
              width: "min(420px, 80%)",
              height: "min(420px, 80%)",
              borderRadius: "50%",
              background: (t) => alpha(t.palette.primary.main, 0.15),
              filter: "blur(80px)",
              top: "10%",
              left: "5%",
              animation: `${blobFloat} 14s ease-in-out infinite`,
              "@media (prefers-reduced-motion: reduce)": { animation: "none" },
            }}
          />
          <Box
            sx={{
              position: "absolute",
              width: "min(320px, 60%)",
              height: "min(320px, 60%)",
              borderRadius: "50%",
              background: (t) => {
                const p = t.palette.primary;
                const c = typeof p === "object" && p && "light" in p ? (p as { light: string }).light : t.palette.primary.main;
                return alpha(c, 0.14);
              },
              filter: "blur(64px)",
              bottom: "15%",
              right: "8%",
              animation: `${blobFloat} 18s ease-in-out infinite reverse`,
              "@media (prefers-reduced-motion: reduce)": { animation: "none" },
            }}
          />
          <Box sx={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 400 }}>
            <Box
              sx={{
                width: 88,
                height: 88,
                mx: "auto",
                mb: 2,
                borderRadius: "24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: (t) => alpha(t.palette.common.white, t.palette.mode === "dark" ? 0.08 : 0.85),
                boxShadow: (t) =>
                  t.palette.mode === "dark"
                    ? `0 24px 48px ${alpha("#000", 0.35)}`
                    : `0 20px 40px ${alpha(t.palette.primary.main, 0.12)}`,
                border: "1px solid",
                borderColor: (t) => alpha(t.palette.divider, 0.5),
              }}
            >
              <CampaignIcon sx={{ fontSize: 44, color: "primary.main" }} />
            </Box>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                letterSpacing: "-0.04em",
                fontSize: { md: "2rem", lg: "2.35rem" },
                lineHeight: 1.2,
                mb: 1.5,
              }}
            >
              Turn views into{" "}
              <Box component="span" sx={{ color: "primary.main" }}>
                revenue
              </Box>
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary", lineHeight: 1.65, fontSize: "1.05rem" }}>
              Performance-based campaigns for creators and brands — polished, transparent, built to scale.
            </Typography>
          </Box>
        </Box>

        {/* Mobile hero strip */}
        <Box
          sx={{
            display: { xs: "flex", md: "none" },
            alignItems: "center",
            gap: 1.5,
            px: 2,
            py: 2,
            borderBottom: "1px solid",
            borderColor: "divider",
            bgcolor: (t) => alpha(t.palette.primary.main, 0.06),
          }}
        >
          <CampaignIcon sx={{ color: "primary.main", fontSize: 32 }} />
          <Box>
            <Typography variant="subtitle1" fontWeight={700} letterSpacing="-0.02em">
              Welcome to Clipify
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Sign in or create an account
            </Typography>
          </Box>
        </Box>

        {/* Form column */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            py: { xs: 3, sm: 4, md: 6 },
            px: { xs: 2, sm: 4, md: 6 },
            overflowY: "auto",
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: 440,
              py: { xs: 1, sm: 0 },
              px: 0,
              bgcolor: "transparent",
            }}
          >
            <ToggleButtonGroup
              exclusive
              fullWidth
              value={panel}
              onChange={(_, v: AuthPanel | null) => v && setPanel(v)}
              aria-label="Authentication mode"
              sx={{
                mb: 3,
                pb: 0,
                borderRadius: 0,
                boxShadow: "none",
                bgcolor: "transparent",
                gap: 0,
                borderBottom: 1,
                borderColor: "divider",
                "& .MuiToggleButtonGroup-grouped": {
                  margin: 0,
                  border: 0,
                  borderRadius: 0,
                },
                "& .MuiToggleButton-root": {
                  flex: 1,
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  border: "none",
                  borderRadius: 0,
                  py: 1.25,
                  minHeight: 48,
                  color: "text.secondary",
                  mb: "-1px",
                  borderBottom: "2px solid transparent",
                  transition: "color 0.2s ease, border-color 0.2s ease",
                  "&.Mui-selected": {
                    bgcolor: "transparent",
                    color: "primary.main",
                    boxShadow: "none",
                    borderBottomColor: "primary.main",
                  },
                  "&:hover": {
                    bgcolor: "transparent",
                  },
                },
              }}
            >
              <ToggleButton value="login" aria-label="Login">
                Login
              </ToggleButton>
              <ToggleButton value="creator" aria-label="Creator signup">
                Creator
              </ToggleButton>
              <ToggleButton value="brand" aria-label="Brand signup">
                Brand
              </ToggleButton>
            </ToggleButtonGroup>

            <Slide direction="left" in timeout={280} key={formKey}>
              <Box>
                <Fade in timeout={240}>
                  <Box>
                    {panel === "login" && (loginMutation.isPending || redirectingAfterLogin) && (
                      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 6 }}>
                        <CircularProgress size={44} sx={{ color: "primary.main", mb: 2 }} />
                        <Typography variant="h6" fontWeight={600}>
                          {redirectingAfterLogin ? "Redirecting to dashboard…" : "Signing in…"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                          {redirectingAfterLogin ? "Taking you there." : "Please wait."}
                        </Typography>
                      </Box>
                    )}

                    {panel === "login" && !loginMutation.isPending && !redirectingAfterLogin && (
                      <>
                        <Typography variant="h4" fontWeight={700} letterSpacing="-0.03em" sx={{ mb: 0.5 }}>
                          Sign in
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                          Use your email and password, or continue with Google.
                        </Typography>
                        {loginError && (
                          <Alert severity="error" sx={{ mb: 2, borderRadius: 0 }} role="alert">
                            {loginError}
                          </Alert>
                        )}
                        <Box component="form" onSubmit={loginForm.handleSubmit(onLogin)} sx={{ display: "flex", flexDirection: "column", gap: 2.25 }}>
                          <TextField
                            label="Email or Username"
                            required
                            fullWidth
                            size="medium"
                            autoComplete="email"
                            placeholder="you@example.com"
                            {...loginForm.register("email")}
                            error={!!loginForm.formState.errors.email}
                            helperText={loginForm.formState.errors.email?.message}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <EmailIcon sx={{ color: "text.secondary", fontSize: 22 }} aria-hidden />
                                </InputAdornment>
                              ),
                            }}
                            sx={inputSx}
                          />
                          <TextField
                            label="Password"
                            required
                            fullWidth
                            size="medium"
                            autoComplete="current-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            {...loginForm.register("password")}
                            error={!!loginForm.formState.errors.password}
                            helperText={loginForm.formState.errors.password?.message}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <LockIcon sx={{ color: "text.secondary", fontSize: 22 }} aria-hidden />
                                </InputAdornment>
                              ),
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    size="small"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    edge="end"
                                  >
                                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                            sx={inputSx}
                          />
                          <Box sx={{ textAlign: "right" }}>
                            <Typography
                              component="button"
                              type="button"
                              variant="body2"
                              sx={{
                                color: "primary.main",
                                cursor: "pointer",
                                border: "none",
                                background: "none",
                                fontWeight: 600,
                              }}
                              onClick={() => {}}
                            >
                              Forgot password?
                            </Typography>
                          </Box>
                          <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            size="large"
                            disabled={loginMutation.isPending}
                            sx={{
                              py: 1.5,
                              borderRadius: 0,
                              fontWeight: 600,
                              textTransform: "none",
                              fontSize: "1rem",
                            }}
                          >
                            {loginMutation.isPending ? "Signing in…" : "Sign in"}
                          </Button>
                          <Button
                            type="button"
                            variant="outlined"
                            fullWidth
                            size="large"
                            onClick={loginWithGoogle}
                            sx={{ py: 1.5, borderRadius: 0, fontWeight: 600, textTransform: "none" }}
                          >
                            Continue with Google
                          </Button>
                        </Box>
                      </>
                    )}

                    {panel === "creator" && (
                      <>
                        <Typography variant="h4" fontWeight={700} letterSpacing="-0.03em" sx={{ mb: 0.5 }}>
                          Creator account
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                          Verify your email, then set a password.
                        </Typography>
                        {registerError && (
                          <Alert severity="error" sx={{ mb: 2, borderRadius: 0 }} role="alert">
                            {registerError}
                          </Alert>
                        )}
                        {creatorStep === "email" && (
                          <Box
                            component="form"
                            onSubmit={creatorEmailForm.handleSubmit(onCreatorRequestOtp)}
                            sx={{ display: "flex", flexDirection: "column", gap: 2.25 }}
                          >
                            <TextField
                              label="Email"
                              type="email"
                              fullWidth
                              size="medium"
                              autoComplete="email"
                              {...creatorEmailForm.register("email")}
                              error={!!creatorEmailForm.formState.errors.email}
                              helperText={creatorEmailForm.formState.errors.email?.message}
                              sx={inputSx}
                            />
                            <Button
                              type="submit"
                              variant="contained"
                              fullWidth
                              size="large"
                              disabled={requestOtpMutation.isPending}
                              sx={{ py: 1.5, borderRadius: 0, fontWeight: 600, textTransform: "none" }}
                            >
                              {requestOtpMutation.isPending ? "Sending…" : "Send verification code"}
                            </Button>
                          </Box>
                        )}
                        {creatorStep === "otp" && (
                          <Box
                            component="form"
                            onSubmit={creatorOtpForm.handleSubmit(onCreatorVerifyOtp)}
                            sx={{ display: "flex", flexDirection: "column", gap: 2.25 }}
                          >
                            <Typography variant="body2" color="text.secondary">
                              We sent a 6-digit code to <strong>{registrationEmail}</strong>
                            </Typography>
                            <TextField
                              label="Verification code"
                              fullWidth
                              size="medium"
                              placeholder="000000"
                              inputProps={{ maxLength: 6, inputMode: "numeric", "aria-label": "Six digit code" }}
                              {...creatorOtpForm.register("otp")}
                              error={!!creatorOtpForm.formState.errors.otp}
                              helperText={creatorOtpForm.formState.errors.otp?.message}
                              sx={inputSx}
                            />
                            {otpCountdown != null && otpCountdown > 0 && (
                              <Typography variant="caption" color="text.secondary">
                                Code expires in {Math.floor(otpCountdown / 60)}:{String(otpCountdown % 60).padStart(2, "0")}
                              </Typography>
                            )}
                            <Button
                              type="button"
                              variant="text"
                              size="small"
                              disabled={resendOtpMutation.isPending || (otpCountdown != null && otpCountdown > 0)}
                              onClick={onResendOtp}
                              sx={{ alignSelf: "flex-start", textTransform: "none", fontWeight: 600 }}
                            >
                              {resendOtpMutation.isPending ? "Sending…" : "Resend code"}
                            </Button>
                            <Button
                              type="submit"
                              variant="contained"
                              fullWidth
                              size="large"
                              disabled={verifyOtpMutation.isPending}
                              sx={{ py: 1.5, borderRadius: 0, fontWeight: 600, textTransform: "none" }}
                            >
                              {verifyOtpMutation.isPending ? "Verifying…" : "Verify"}
                            </Button>
                          </Box>
                        )}
                        {creatorStep === "complete" && (
                          <Box
                            component="form"
                            onSubmit={creatorCompleteForm.handleSubmit(onCreatorComplete)}
                            sx={{ display: "flex", flexDirection: "column", gap: 2.25 }}
                          >
                            <TextField
                              label="Password"
                              type="password"
                              fullWidth
                              size="medium"
                              autoComplete="new-password"
                              {...creatorCompleteForm.register("password")}
                              error={!!creatorCompleteForm.formState.errors.password}
                              helperText={creatorCompleteForm.formState.errors.password?.message}
                              sx={inputSx}
                            />
                            <TextField
                              label="Confirm password"
                              type="password"
                              fullWidth
                              size="medium"
                              autoComplete="new-password"
                              {...creatorCompleteForm.register("confirmPassword")}
                              error={!!creatorCompleteForm.formState.errors.confirmPassword}
                              helperText={creatorCompleteForm.formState.errors.confirmPassword?.message}
                              sx={inputSx}
                            />
                            <Button
                              type="submit"
                              variant="contained"
                              fullWidth
                              size="large"
                              disabled={completeRegistrationMutation.isPending}
                              sx={{ py: 1.5, borderRadius: 0, fontWeight: 600, textTransform: "none" }}
                            >
                              {completeRegistrationMutation.isPending ? "Creating…" : "Create account"}
                            </Button>
                          </Box>
                        )}
                      </>
                    )}

                    {panel === "brand" && (
                      <>
                        <Typography variant="h4" fontWeight={700} letterSpacing="-0.03em" sx={{ mb: 0.5 }}>
                          Brand account
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                          Register your company to launch campaigns.
                        </Typography>
                        {registerError && (
                          <Alert severity="error" sx={{ mb: 2, borderRadius: 0 }} role="alert">
                            {registerError}
                          </Alert>
                        )}
                        <Box
                          component="form"
                          onSubmit={brandForm.handleSubmit(onBrandRegister)}
                          sx={{ display: "flex", flexDirection: "column", gap: 2.25 }}
                        >
                          <TextField
                            label="Work email"
                            type="email"
                            fullWidth
                            size="medium"
                            autoComplete="email"
                            {...brandForm.register("email")}
                            error={!!brandForm.formState.errors.email}
                            helperText={brandForm.formState.errors.email?.message}
                            sx={inputSx}
                          />
                          <TextField
                            label="Password"
                            type="password"
                            fullWidth
                            size="medium"
                            autoComplete="new-password"
                            {...brandForm.register("password")}
                            error={!!brandForm.formState.errors.password}
                            helperText={brandForm.formState.errors.password?.message}
                            sx={inputSx}
                          />
                          <TextField
                            label="Company name"
                            fullWidth
                            size="medium"
                            {...brandForm.register("company_name")}
                            error={!!brandForm.formState.errors.company_name}
                            helperText={brandForm.formState.errors.company_name?.message}
                            sx={inputSx}
                          />
                          <TextField
                            label="Industry"
                            fullWidth
                            size="medium"
                            {...brandForm.register("industry")}
                            sx={inputSx}
                          />
                          <TextField
                            label="Website"
                            fullWidth
                            size="medium"
                            placeholder="https://"
                            {...brandForm.register("website")}
                            error={!!brandForm.formState.errors.website}
                            helperText={brandForm.formState.errors.website?.message}
                            sx={inputSx}
                          />
                          <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            size="large"
                            disabled={brandForm.formState.isSubmitting}
                            sx={{ py: 1.5, borderRadius: 0, fontWeight: 600, textTransform: "none" }}
                          >
                            {brandForm.formState.isSubmitting ? "Creating…" : "Create account"}
                          </Button>
                        </Box>
                      </>
                    )}
                  </Box>
                </Fade>
              </Box>
            </Slide>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 3, textAlign: "center", lineHeight: 1.5 }}>
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
