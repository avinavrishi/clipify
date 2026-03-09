"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";
import { useAuth } from "../hooks/useAuth";
import { useSetUsername } from "../queries/profile";

const UsernameSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters"),
});

type UsernameFormValues = z.infer<typeof UsernameSchema>;

export function SetUsernameStep() {
  const { accessToken } = useAuth();
  const setUsernameMutation = useSetUsername(accessToken);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UsernameFormValues>({
    resolver: zodResolver(UsernameSchema),
    defaultValues: { username: "" },
  });

  const onSubmit = (values: UsernameFormValues) => {
    setUsernameMutation.mutate(
      { username: values.username.trim() },
      {
        onSuccess: () => {
          // Tokens unchanged; auth/me will be refetched and show username
        },
      }
    );
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 420,
          width: "100%",
          borderRadius: 3,
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h5" fontWeight={700} sx={{ mb: 0.5 }}>
            Choose your username
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            This will be your public handle on Clipify. You can’t change it later.
          </Typography>
          {setUsernameMutation.isError && (
            <Alert
              severity="error"
              sx={{ mb: 2, borderRadius: 2 }}
            >
              {(setUsernameMutation.error as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
                "Failed to set username. It may already be taken."}
            </Alert>
          )}
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              label="Username"
              fullWidth
              size="medium"
              placeholder="e.g. mycreator"
              autoFocus
              {...register("username")}
              error={!!errors.username}
              helperText={errors.username?.message}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={setUsernameMutation.isPending}
              sx={{ py: 1.25, borderRadius: 2, fontWeight: 600, textTransform: "none" }}
            >
              {setUsernameMutation.isPending ? "Saving…" : "Continue"}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
