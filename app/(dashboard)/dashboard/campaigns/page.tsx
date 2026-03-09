"use client";

import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import NextLink from "next/link";
import { useAuth } from "../../../../hooks/useAuth";
import { useMyParticipations } from "../../../../queries/participations";
import type { ParticipationStatus, Participation } from "../../../../types/participation";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import CancelIcon from "@mui/icons-material/Cancel";
import SendIcon from "@mui/icons-material/Send";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CampaignIcon from "@mui/icons-material/Campaign";

export default function MyCampaignsPage() {
  const { accessToken } = useAuth();
  const [statusFilter, setStatusFilter] = useState<ParticipationStatus | "ALL">("ALL");
  const { data: participations, isLoading } = useMyParticipations(accessToken, {
    statusFilter: statusFilter === "ALL" ? undefined : statusFilter,
    limit: 100,
  });

  return (
    <Box sx={{ width: "100%", minWidth: 0 }}>
      <Box sx={{ mb: 3, display: "flex", justifyContent: "flex-end", alignItems: "flex-start", flexWrap: "wrap", gap: 2 }}>
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Status</InputLabel>
          <Select
            label="Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ParticipationStatus | "ALL")}
          >
            <MenuItem value="ALL">All</MenuItem>
            <MenuItem value="APPLIED">Applied</MenuItem>
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

      {!isLoading && (!participations || participations.length === 0) && (
        <Card sx={{ border: "1px solid rgba(255,255,255,0.08)", textAlign: "center", py: 8, bgcolor: "rgba(255,255,255,0.02)" }}>
          <CardContent>
            <CampaignIcon sx={{ fontSize: 48, color: "text.secondary", opacity: 0.5, mb: 1 }} />
            <Typography variant="body1" color="text.secondary" sx={{ mb: 0.5 }}>
              {statusFilter === "ALL" ? "No campaigns yet" : `No ${statusFilter.toLowerCase()} campaigns`}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {statusFilter === "ALL" ? "Explore campaigns to apply and start earning." : "Change the filter to see others."}
            </Typography>
          </CardContent>
        </Card>
      )}

      {!isLoading && participations && participations.length > 0 && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" },
            gap: 2,
            minWidth: 0,
          }}
        >
          {participations.map((participation: Participation) => (
            <ParticipationCard key={participation.id} participation={participation} />
          ))}
        </Box>
      )}
    </Box>
  );
}

function ParticipationCard({ participation }: { participation: Participation }) {
  const isApproved = participation.status === "APPROVED";
  const isRejected = participation.status === "REJECTED";

  return (
    <Card
      component={NextLink}
      href={`/dashboard/explore/${participation.campaign_id}`}
      sx={{
        height: "100%",
        textDecoration: "none",
        color: "inherit",
        display: "flex",
        flexDirection: "column",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: 2,
        bgcolor: "rgba(255, 255, 255, 0.03)",
        boxShadow: "0 4px 24px rgba(0, 0, 0, 0.25)",
        overflow: "hidden",
        transition: "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.2s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 12px 40px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(155, 171, 44, 0.25)",
          borderColor: "rgba(155, 171, 44, 0.4)",
        },
      }}
    >
      {/* Status accent bar */}
      <Box
        sx={{
          height: 3,
          width: "100%",
          bgcolor:
            isApproved
              ? "primary.main"
              : isRejected
                ? "error.main"
                : "rgba(255, 255, 255, 0.2)",
        }}
      />
      <CardContent sx={{ p: 2.5, flex: 1, display: "flex", flexDirection: "column", "&:last-child": { pb: 2.5 } }}>
        {/* Header: status chip + earned */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 1, mb: 2 }}>
          <Chip
            icon={
              isApproved ? (
                <CheckCircleIcon sx={{ fontSize: 18 }} />
              ) : isRejected ? (
                <CancelIcon sx={{ fontSize: 18 }} />
              ) : (
                <PendingIcon sx={{ fontSize: 18 }} />
              )
            }
            label={participation.status}
            size="small"
            sx={{
              textTransform: "capitalize",
              fontWeight: 700,
              fontSize: "0.75rem",
              height: 28,
              bgcolor: isApproved ? "rgba(155, 171, 44, 0.2)" : isRejected ? "rgba(239, 68, 68, 0.2)" : "rgba(255, 255, 255, 0.1)",
              color: isApproved ? "primary.main" : isRejected ? "error.main" : "text.secondary",
              border: "1px solid",
              borderColor: isApproved ? "primary.main" : isRejected ? "error.main" : "rgba(255,255,255,0.15)",
              "& .MuiChip-icon": {
                color: "inherit",
              },
            }}
          />
          {isApproved && participation.total_earned > 0 && (
            <Typography variant="subtitle2" fontWeight={700} sx={{ color: "primary.main" }}>
              ${participation.total_earned.toFixed(2)} earned
            </Typography>
          )}
        </Box>

        {/* Title */}
        <Typography
          variant="subtitle1"
          fontWeight={700}
          sx={{
            lineHeight: 1.35,
            mb: 2,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {participation.campaign_title || "Campaign"}
        </Typography>

        {/* Metrics */}
        <Box
          sx={{
            mt: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
            py: 1.5,
            px: 1.5,
            borderRadius: 1.5,
            bgcolor: "rgba(0, 0, 0, 0.25)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <SendIcon sx={{ fontSize: 18, color: "text.secondary" }} />
              <Typography variant="caption" color="text.secondary">Submissions</Typography>
            </Box>
            <Typography variant="body2" fontWeight={700} color="text.primary">
              {participation.total_submissions}
            </Typography>
          </Box>
          {participation.campaign_rate_per_million != null && (
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <TrendingUpIcon sx={{ fontSize: 18, color: "primary.main" }} />
              <Typography variant="caption" color="text.secondary">Rate</Typography>
            </Box>
            <Typography variant="body2" fontWeight={700} color="primary.main">
              ${participation.campaign_rate_per_million}/1M
            </Typography>
          </Box>
          )}
        </Box>

        {/* CTA hint */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 1.5, color: "primary.main" }}>
          <Typography variant="caption" fontWeight={600}>View campaign</Typography>
          <ArrowForwardIcon sx={{ fontSize: 16 }} />
        </Box>
      </CardContent>
    </Card>
  );
}
