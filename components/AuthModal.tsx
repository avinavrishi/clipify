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
import { useAuth } from "../hooks/useAuth";
import { useAuthModal, type RegisterType } from "../providers/AuthModalProvider";
import { createUnauthApiClient } from "../lib/apiClient";

const LoginSchema = z.object({
  email: z.string().email("Valid email required"),
  password: z.string().min(6, "Min 6 characters"),
});

const CreatorRegisterSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const BrandRegisterSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  company_name: z.string().min(2, "Company name must be at least 2 characters"),
  industry: z.string().optional(),
  website: z.string().url("Enter a valid URL").optional().or(z.literal("")),
});

type LoginFormValues = z.infer<typeof LoginSchema>;
type CreatorRegisterValues = z.infer<typeof CreatorRegisterSchema>;
type BrandRegisterValues = z.infer<typeof BrandRegisterSchema>;

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

  const creatorForm = useForm<CreatorRegisterValues>({
    resolver: zodResolver(CreatorRegisterSchema),
    defaultValues: { email: "", password: "" },
  });

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

  const onCreatorRegister = async (values: CreatorRegisterValues) => {
    setRegisterError(null);
    try {
      const client = createUnauthApiClient();
      await client.post("/auth/register", { email: values.email, password: values.password });
      close();
      router.push("/");
      setTimeout(() => openLogin(), 200);
    } catch {
      setRegisterError("Failed to register. Please try again.");
    }
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
      creatorForm.reset();
      brandForm.reset();
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
                <Box component="form" onSubmit={creatorForm.handleSubmit(onCreatorRegister)} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <TextField label="Email" type="email" fullWidth size="small" {...creatorForm.register("email")} error={!!creatorForm.formState.errors.email} helperText={creatorForm.formState.errors.email?.message} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
                  <TextField label="Password" type="password" fullWidth size="small" {...creatorForm.register("password")} error={!!creatorForm.formState.errors.password} helperText={creatorForm.formState.errors.password?.message} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
                  <Button type="submit" variant="contained" fullWidth disabled={creatorForm.formState.isSubmitting} sx={{ py: 1.25, borderRadius: 2, fontWeight: 600, textTransform: "none" }}>
                    {creatorForm.formState.isSubmitting ? "Creating…" : "Create account"}
                  </Button>
                </Box>
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
