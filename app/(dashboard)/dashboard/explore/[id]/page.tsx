"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "../../../../../hooks/useAuth";
import { useCampaign } from "../../../../../queries/campaigns";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import ImageIcon from "@mui/icons-material/Image";
import InfoIcon from "@mui/icons-material/Info";
import CampaignIcon from "@mui/icons-material/Campaign";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import PersonIcon from "@mui/icons-material/Person";
import ArticleIcon from "@mui/icons-material/Article";
import LinearProgress from "@mui/material/LinearProgress";
import { toDriveImageUrl } from "../../../../../lib/driveImage";
import { useParticipationByCampaign, useApplyToCampaign } from "../../../../../queries/participations";
import { useCampaignSubmissions } from "../../../../../queries/submissions";
import { useCampaignSubmissionsAdmin, useUpdateSubmission } from "../../../../../queries/adminSubmissions";
import { SubmissionForm } from "../../../../../components/SubmissionForm";
import { useQueryClient } from "@tanstack/react-query";

export default function ExploreCampaignDetailPage() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const { accessToken, currentUser } = useAuth();
  const queryClient = useQueryClient();
  const { data: campaign } = useCampaign(accessToken, id);
  const { data: participation } = useParticipationByCampaign(accessToken, id);
  const { data: submissions } = useCampaignSubmissions(accessToken, id);
  const { data: adminSubmissions } = useCampaignSubmissionsAdmin(accessToken, id);
  const applyMutation = useApplyToCampaign(accessToken);
  const updateSubmissionMutation = useUpdateSubmission(accessToken);
  const [applyError, setApplyError] = useState<string | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<string | null>(null);
  const [submissionAction, setSubmissionAction] = useState<"approve" | "reject" | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [verifiedViews, setVerifiedViews] = useState("");
  const [calculatedEarnings, setCalculatedEarnings] = useState("");

  const handleApply = () => {
    if (!id) return;
    setApplyError(null);
    applyMutation.mutate(
      { campaign_id: id },
      {
        onError: (error: any) => {
          setApplyError(error?.response?.data?.detail || "Failed to apply to campaign");
        },
      }
    );
  };

  const isCreator = currentUser?.role === "CREATOR";
  const isAdmin = currentUser?.role === "ADMIN";
  const isBrand = currentUser?.role === "BRAND";
  const hasApplied = !!participation;
  const isApproved = participation?.status === "APPROVED";
  const canManageSubmissions = isAdmin || isBrand;
  
  // Use admin submissions for admins/brands, creator submissions for creators
  const displaySubmissions = canManageSubmissions ? adminSubmissions : submissions;

  if (!campaign) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 400,
          gap: 2,
        }}
      >
        <CircularProgress sx={{ color: "primary.main" }} />
        <Typography variant="body1" color="text.secondary">
          Loading campaign…
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 4, width: "100%", maxWidth: 960, mx: "auto" }}>
      <Card sx={{ mb: 3, overflow: "hidden", borderRadius: 3, border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 4px 24px rgba(0,0,0,0.2)" }}>
        <Box sx={{ position: "relative" }}>
          {toDriveImageUrl(campaign.logo_drive_link) ? (
            <Box
              component="img"
              src={toDriveImageUrl(campaign.logo_drive_link) as string}
              alt={campaign.title}
              loading="lazy"
              referrerPolicy="no-referrer"
              sx={{ width: "100%", height: { xs: 180, sm: 220 }, objectFit: "cover", display: "block" }}
            />
          ) : (
            <Box
              sx={{
                width: "100%",
                height: { xs: 180, sm: 220 },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "rgba(255,255,255,0.04)",
              }}
            >
              <CampaignIcon sx={{ fontSize: 64, color: "primary.main", opacity: 0.9 }} />
            </Box>
          )}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.15) 45%, rgba(0,0,0,0.75) 100%)",
            }}
          />
          <Box sx={{ position: "absolute", left: { xs: 16, sm: 24 }, bottom: { xs: 16, sm: 20 }, right: { xs: 16, sm: 24 } }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap", mb: 1.5 }}>
              <Chip
                label={campaign.status}
                color={campaign.status === "ACTIVE" ? "success" : "default"}
                sx={{ textTransform: "capitalize", fontWeight: 700 }}
              />
              <Chip
                icon={campaign.content_type === "VIDEO" ? <VideoLibraryIcon /> : <ImageIcon />}
                label={campaign.content_type}
                variant="outlined"
                sx={{
                  fontWeight: 600,
                  borderColor: "rgba(255,255,255,0.35)",
                  color: "rgba(255,255,255,0.92)",
                  "& .MuiChip-icon": { color: "rgba(255,255,255,0.92)" },
                }}
              />
              {campaign.category && (
                <Chip
                  label={campaign.category}
                  variant="outlined"
                  sx={{
                    fontWeight: 700,
                    borderColor: "rgba(255,255,255,0.35)",
                    color: "rgba(255,255,255,0.92)",
                  }}
                />
              )}
            </Box>
            <Typography
              variant="h4"
              fontWeight={800}
              sx={{
                mb: 0,
                lineHeight: 1.15,
                color: "#fff",
                textShadow: "0 8px 24px rgba(0,0,0,0.55)",
              }}
            >
              {campaign.title}
            </Typography>
          </Box>
        </Box>
      </Card>

      {isCreator && (
        <Box sx={{ mb: 3 }}>
          {applyError && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 1.5 }}>
              {applyError}
            </Alert>
          )}
          {hasApplied ? (
            <Card sx={{ border: "1px solid rgba(255, 255, 255, 0.08)", mb: 2 }}>
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <CheckCircleIcon sx={{ color: participation.status === "APPROVED" ? "success.main" : "text.secondary" }} />
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600}>
                        Participation Status: {participation.status}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {participation.status === "APPROVED"
                          ? "You can now submit content for this campaign"
                          : participation.status === "APPLIED"
                          ? "Your application is pending approval"
                          : "Your application was rejected"}
                      </Typography>
                    </Box>
                  </Box>
                  {participation.status === "APPROVED" && (
                    <Chip
                      label={`${participation.total_submissions} submissions • $${participation.total_earned.toFixed(2)} earned`}
                      color="success"
                      size="small"
                    />
                  )}
                </Box>
              </CardContent>
            </Card>
          ) : (
            <Card sx={{ border: "1px solid rgba(255, 255, 255, 0.08)", mb: 2 }}>
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 0.5 }}>
                      Ready to participate?
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Apply to this campaign to start submitting content
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    onClick={handleApply}
                    disabled={applyMutation.isPending || campaign.status !== "ACTIVE"}
                    sx={{ minWidth: 120 }}
                  >
                    {applyMutation.isPending ? "Applying..." : "Apply to Campaign"}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          )}
        </Box>
      )}

      {isApproved && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
            Submit Content
          </Typography>
          <SubmissionForm
            campaignId={id!}
            onSuccess={() => {
              queryClient.invalidateQueries({ queryKey: ["submissions"] });
              queryClient.invalidateQueries({ queryKey: ["participations"] });
            }}
          />
        </Box>
      )}

      {isApproved && displaySubmissions && displaySubmissions.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 1.5 }}>
            {canManageSubmissions ? `Submissions (${displaySubmissions.length})` : `Your Submissions (${displaySubmissions.length})`}
          </Typography>
          <Grid container spacing={2}>
            {displaySubmissions.map((submission) => (
              <Grid item xs={12} sm={6} key={submission.id}>
                <Card sx={{ border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                      <Chip
                        label={submission.status}
                        size="small"
                        color={submission.status === "APPROVED" ? "success" : submission.status === "REJECTED" ? "error" : "default"}
                        sx={{ textTransform: "capitalize" }}
                      />
                      {submission.status === "APPROVED" && (
                        <Typography variant="body2" fontWeight={600} color="success.main">
                          ${submission.calculated_earnings.toFixed(2)}
                        </Typography>
                      )}
                    </Box>
                    {canManageSubmissions && submission.social_account_username && (
                      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
                        @{submission.social_account_username} ({submission.social_platform})
                      </Typography>
                    )}
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1, wordBreak: "break-all" }}>
                      {submission.content_url}
                    </Typography>
                    {submission.status === "APPROVED" && (
                      <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                        {submission.verified_views.toLocaleString()} views
                      </Typography>
                    )}
                    {canManageSubmissions && submission.status === "PENDING" && (
                      <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          startIcon={<CheckCircleIcon />}
                          onClick={() => {
                            setSelectedSubmission(submission.id);
                            setSubmissionAction("approve");
                            setVerifiedViews("");
                            setCalculatedEarnings("");
                            setRejectionReason("");
                          }}
                          disabled={updateSubmissionMutation.isPending}
                          sx={{ flex: 1 }}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          startIcon={<CancelIcon />}
                          onClick={() => {
                            setSelectedSubmission(submission.id);
                            setSubmissionAction("reject");
                            setRejectionReason("");
                            setVerifiedViews("");
                            setCalculatedEarnings("");
                          }}
                          disabled={updateSubmissionMutation.isPending}
                          sx={{ flex: 1 }}
                        >
                          Reject
                        </Button>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Campaign Description */}
      <Card sx={{ bgcolor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 3, mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
            <InfoIcon sx={{ color: "primary.main", fontSize: 22 }} />
            <Typography variant="h6" fontWeight={600} color="text.primary">Description</Typography>
          </Box>
          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
            {campaign.description || "No description provided."}
          </Typography>
        </CardContent>
      </Card>

      {/* Budget used – separate section, before Overall Campaign */}
      <Typography variant="subtitle1" fontWeight={700} color="text.secondary" sx={{ mb: 1.5, letterSpacing: 0.5 }}>
        Budget used
      </Typography>
      <Card sx={{ bgcolor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 3, mb: 3, overflow: "hidden" }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2, mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={{ width: 48, height: 48, borderRadius: 2, bgcolor: "rgba(110, 235, 131, 0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <AccountBalanceWalletIcon sx={{ color: "primary.main", fontSize: 26 }} />
              </Box>
              <Box>
                <Typography variant="overline" sx={{ color: "text.secondary", fontWeight: 600 }}>Spent</Typography>
                <Typography variant="h4" fontWeight={800} color="primary.main">${campaign.used_budget.toLocaleString()}</Typography>
              </Box>
            </Box>
            <Typography variant="caption" color="text.secondary" fontWeight={600}>All-time</Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={campaign.total_budget > 0 ? Math.min(100, (campaign.used_budget / campaign.total_budget) * 100) : 0}
            sx={{ height: 10, borderRadius: 2, bgcolor: "rgba(255,255,255,0.1)", "& .MuiLinearProgress-bar": { borderRadius: 2, bgcolor: "primary.main" } }}
          />
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1.5 }}>
            <Typography variant="body2" color="text.secondary">Spent: ${campaign.used_budget.toLocaleString()}</Typography>
            <Typography variant="body2" color="text.secondary">Total: ${campaign.total_budget.toLocaleString()}</Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Overall Campaign – only Max Submissions/Account, Max Earnings/Creator, Max Earnings/Post */}
      <Typography variant="subtitle1" fontWeight={700} color="text.secondary" sx={{ mb: 1.5, letterSpacing: 0.5 }}>
        Overall Campaign
      </Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {campaign.max_submissions_per_account != null && (
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ bgcolor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 3, height: "100%", transition: "box-shadow 0.2s ease", "&:hover": { boxShadow: "0 8px 24px rgba(0,0,0,0.2)" } }}>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
                  <Box sx={{ width: 44, height: 44, borderRadius: 2, bgcolor: "rgba(155, 171, 44, 0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <ArticleIcon sx={{ color: "primary.main", fontSize: 22 }} />
                  </Box>
                  <Typography variant="body2" color="text.secondary" fontWeight={500}>Max Submissions / Account</Typography>
                </Box>
                <Typography variant="h6" fontWeight={700} color="text.primary">{campaign.max_submissions_per_account}</Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
        {campaign.max_earnings_per_creator != null && (
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ bgcolor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 3, height: "100%", transition: "box-shadow 0.2s ease", "&:hover": { boxShadow: "0 8px 24px rgba(0,0,0,0.2)" } }}>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
                  <Box sx={{ width: 44, height: 44, borderRadius: 2, bgcolor: "rgba(155, 171, 44, 0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <PersonIcon sx={{ color: "primary.main", fontSize: 22 }} />
                  </Box>
                  <Typography variant="body2" color="text.secondary" fontWeight={500}>Max Earnings / Creator</Typography>
                </Box>
                <Typography variant="h6" fontWeight={700} color="primary.main">${campaign.max_earnings_per_creator.toLocaleString()}</Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
        {campaign.max_earnings_per_post != null && (
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ bgcolor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 3, height: "100%", transition: "box-shadow 0.2s ease", "&:hover": { boxShadow: "0 8px 24px rgba(0,0,0,0.2)" } }}>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
                  <Box sx={{ width: 44, height: 44, borderRadius: 2, bgcolor: "rgba(155, 171, 44, 0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <ArticleIcon sx={{ color: "primary.main", fontSize: 22 }} />
                  </Box>
                  <Typography variant="body2" color="text.secondary" fontWeight={500}>Max Earnings / Post</Typography>
                </Box>
                <Typography variant="h6" fontWeight={700} color="primary.main">${campaign.max_earnings_per_post.toLocaleString()}</Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      {/* Resources */}
      <Card sx={{ bgcolor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 3, maxWidth: 420 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="subtitle1" fontWeight={700} color="text.secondary" sx={{ mb: 2, letterSpacing: 0.5 }}>Resources</Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {campaign.guidelines_link && (
              <Link href={campaign.guidelines_link} target="_blank" rel="noreferrer" sx={{ color: "primary.main", textDecoration: "none", fontWeight: 500, "&:hover": { textDecoration: "underline" } }}>
                View Guidelines →
              </Link>
            )}
            {campaign.discord_link && (
              <Link href={campaign.discord_link} target="_blank" rel="noreferrer" sx={{ color: "primary.main", textDecoration: "none", fontWeight: 500, "&:hover": { textDecoration: "underline" } }}>
                Join Discord →
              </Link>
            )}
            {!campaign.guidelines_link && !campaign.discord_link && (
              <Typography variant="body2" color="text.secondary">No links added.</Typography>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Submission Approval/Rejection Dialog */}
      <Dialog
        open={!!selectedSubmission && !!submissionAction}
        onClose={() => {
          setSelectedSubmission(null);
          setSubmissionAction(null);
          setRejectionReason("");
          setVerifiedViews("");
          setCalculatedEarnings("");
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {submissionAction === "approve" ? "Approve Submission?" : "Reject Submission?"}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {submissionAction === "approve" ? (
              <>
                Approve this content submission? You can optionally set verified views and calculated earnings.
              </>
            ) : (
              <>
                Reject this content submission? Provide a reason (optional).
              </>
            )}
          </Typography>
          {submissionAction === "approve" && (
            <>
              <TextField
                fullWidth
                label="Verified Views (Optional)"
                type="number"
                value={verifiedViews}
                onChange={(e) => setVerifiedViews(e.target.value)}
                sx={{ mb: 2 }}
                placeholder="e.g., 50000"
              />
              <TextField
                fullWidth
                label="Calculated Earnings (Optional)"
                type="number"
                value={calculatedEarnings}
                onChange={(e) => setCalculatedEarnings(e.target.value)}
                placeholder="e.g., 25.00"
              />
            </>
          )}
          {submissionAction === "reject" && (
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Rejection Reason (Optional)"
              placeholder="Provide a reason for rejection..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => {
              setSelectedSubmission(null);
              setSubmissionAction(null);
              setRejectionReason("");
              setVerifiedViews("");
              setCalculatedEarnings("");
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color={submissionAction === "approve" ? "success" : "error"}
            onClick={() => {
              if (!selectedSubmission) return;
              updateSubmissionMutation.mutate(
                {
                  submissionId: selectedSubmission,
                  payload: {
                    status: submissionAction === "approve" ? "APPROVED" : "REJECTED",
                    verified_views: submissionAction === "approve" && verifiedViews ? Number(verifiedViews) : undefined,
                    calculated_earnings: submissionAction === "approve" && calculatedEarnings ? Number(calculatedEarnings) : undefined,
                    reason: submissionAction === "reject" && rejectionReason ? rejectionReason : undefined,
                  },
                },
                {
                  onSuccess: () => {
                    setSelectedSubmission(null);
                    setSubmissionAction(null);
                    setRejectionReason("");
                    setVerifiedViews("");
                    setCalculatedEarnings("");
                  },
                }
              );
            }}
            disabled={updateSubmissionMutation.isPending}
          >
            {updateSubmissionMutation.isPending ? "Processing..." : submissionAction === "approve" ? "Approve" : "Reject"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
