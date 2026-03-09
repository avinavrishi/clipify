"use client";

import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Link as MuiLink,
} from "@mui/material";
import NextLink from "next/link";
import { useAuth } from "../../../../hooks/useAuth";
import { useMySubmissions } from "../../../../queries/submissions";
import type { SubmissionStatus } from "../../../../types/submission";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import CancelIcon from "@mui/icons-material/Cancel";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

export default function MySubmissionsPage() {
  const { accessToken } = useAuth();
  const [statusFilter, setStatusFilter] = useState<SubmissionStatus | "ALL">("ALL");
  const { data: submissions, isLoading } = useMySubmissions(accessToken, {
    statusFilter: statusFilter === "ALL" ? undefined : statusFilter,
    limit: 100,
  });

  return (
    <Box>
      <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Track your content submissions and earnings
        </Typography>
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Status</InputLabel>
          <Select
            label="Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as SubmissionStatus | "ALL")}
          >
            <MenuItem value="ALL">All</MenuItem>
            <MenuItem value="PENDING">Pending</MenuItem>
            <MenuItem value="APPROVED">Approved</MenuItem>
            <MenuItem value="REJECTED">Rejected</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {isLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress sx={{ color: "primary.main" }} />
        </Box>
      )}

      {!isLoading && (!submissions || submissions.length === 0) && (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
            No submissions found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {statusFilter === "ALL"
              ? "You haven't submitted any content yet. Apply to a campaign and submit your content to get started."
              : `No ${statusFilter.toLowerCase()} submissions found.`}
          </Typography>
        </Box>
      )}

      {!isLoading && submissions && submissions.length > 0 && (
        <Grid container spacing={2}>
          {submissions.map((submission) => (
            <Grid item xs={12} sm={6} md={4} key={submission.id}>
              <Card
                sx={{
                  height: "100%",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    borderColor: "primary.main",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                  },
                }}
              >
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 1.5 }}>
                    <Chip
                      label={submission.status}
                      size="small"
                      color={
                        submission.status === "APPROVED"
                          ? "success"
                          : submission.status === "REJECTED"
                          ? "error"
                          : "default"
                      }
                      icon={
                        submission.status === "APPROVED" ? (
                          <CheckCircleIcon />
                        ) : submission.status === "REJECTED" ? (
                          <CancelIcon />
                        ) : (
                          <PendingIcon />
                        )
                      }
                      sx={{ textTransform: "capitalize", fontWeight: 600 }}
                    />
                    {submission.status === "APPROVED" && submission.calculated_earnings > 0 && (
                      <Typography variant="body2" fontWeight={600} color="success.main">
                        ${submission.calculated_earnings.toFixed(2)}
                      </Typography>
                    )}
                  </Box>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1, lineHeight: 1.3 }}>
                    {submission.campaign_title || "Campaign"}
                  </Typography>
                  <MuiLink
                    href={submission.content_url}
                    target="_blank"
                    rel="noreferrer"
                    sx={{
                      color: "primary.main",
                      textDecoration: "none",
                      fontSize: "0.8125rem",
                      display: "block",
                      mb: 1.5,
                      wordBreak: "break-all",
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    {submission.content_url}
                  </MuiLink>
                  {submission.status === "APPROVED" && (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75, mt: 1.5, pt: 1.5, borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <VisibilityIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                          <Typography variant="caption" color="text.secondary">
                            Views
                          </Typography>
                        </Box>
                        <Typography variant="caption" fontWeight={600}>
                          {submission.verified_views.toLocaleString()}
                        </Typography>
                      </Box>
                      {submission.calculated_earnings > 0 && (
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <AttachMoneyIcon sx={{ fontSize: 16, color: "success.main" }} />
                            <Typography variant="caption" color="text.secondary">
                              Earnings
                            </Typography>
                          </Box>
                          <Typography variant="caption" fontWeight={600} color="success.main">
                            ${submission.calculated_earnings.toFixed(2)}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  )}
                  {submission.social_account_username && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                      @{submission.social_account_username}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
