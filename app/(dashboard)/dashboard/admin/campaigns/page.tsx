"use client";

import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import NextLink from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAuth } from "../../../../../hooks/useAuth";
import {
  useCampaigns,
  useCreateCampaign,
  useCampaignPlatforms,
  useUpdateCampaign,
  useDeleteCampaign,
} from "../../../../../queries/campaigns";
import { useAdminBrands } from "../../../../../queries/admin";
import type { Campaign } from "../../../../../types/campaign";

const AdminCreateCampaignSchema = z.object({
  brand_id: z.string().min(1, "Select a brand"),
  title: z.string().min(2),
  category: z.string().optional(),
  content_type: z.enum(["VIDEO", "IMAGE"]),
  description: z.string().optional(),
  total_budget: z.coerce.number().positive(),
  rate_per_million_views: z.coerce.number().positive(),
  max_submissions_per_account: z.coerce.number().optional(),
  max_earnings_per_creator: z.coerce.number().optional(),
  max_earnings_per_post: z.coerce.number().optional(),
  start_date: z.string(),
  end_date: z.string(),
  logo_drive_link: z.string().url().optional().or(z.literal("")),
  guidelines_link: z.string().url().optional().or(z.literal("")),
  discord_link: z.string().url().optional().or(z.literal("")),
  platform_ids: z.array(z.string()).min(1, "Select at least one platform"),
});

const AdminEditCampaignSchema = AdminCreateCampaignSchema.omit({ brand_id: true }).extend({
  status: z.enum(["ACTIVE", "PAUSED", "COMPLETED"]),
});

type AdminCreateCampaignValues = z.infer<typeof AdminCreateCampaignSchema>;
type AdminEditCampaignValues = z.infer<typeof AdminEditCampaignSchema>;

export default function AdminCampaignsPage() {
  const { accessToken } = useAuth();
  const { data: campaigns = [], isLoading } = useCampaigns(accessToken);
  const { data: brands = [] } = useAdminBrands(accessToken);
  const { data: platforms = [] } = useCampaignPlatforms(accessToken);
  const createMutation = useCreateCampaign(accessToken);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [deleteCampaign, setDeleteCampaign] = useState<{ id: string; title: string } | null>(null);

  const brandMap = useMemo(() => new Map(brands.map((b) => [b.id, b])), [brands]);

  const createForm = useForm<AdminCreateCampaignValues>({
    resolver: zodResolver(AdminCreateCampaignSchema),
    defaultValues: { content_type: "VIDEO", platform_ids: [] },
  });
  const editForm = useForm<AdminEditCampaignValues>({
    resolver: zodResolver(AdminEditCampaignSchema),
    defaultValues: { content_type: "VIDEO", platform_ids: [], status: "ACTIVE" },
  });

  const selectedCreatePlatformIds = createForm.watch("platform_ids") ?? [];
  const selectedEditPlatformIds = editForm.watch("platform_ids") ?? [];
  const selectedBrandId = createForm.watch("brand_id");

  const updateMutation = useUpdateCampaign(accessToken, editingCampaign?.id ?? "");
  const deleteMutation = useDeleteCampaign(accessToken, deleteCampaign?.id ?? "");

  const onCreateSubmit = (values: AdminCreateCampaignValues) => {
    setSubmitError(null);
    createMutation.mutate(
      {
        ...values,
        brand_id: values.brand_id,
        logo_drive_link: values.logo_drive_link || undefined,
        guidelines_link: values.guidelines_link || undefined,
        discord_link: values.discord_link || undefined,
        platform_ids: values.platform_ids,
      },
      {
        onSuccess: () => {
          createForm.reset({ content_type: "VIDEO", platform_ids: [], brand_id: "", total_budget: 1, rate_per_million_views: 1 });
        },
        onError: (err: unknown) => {
          const e = err as { response?: { data?: { detail?: string } } };
          setSubmitError(e.response?.data?.detail ?? "Failed to create campaign.");
        },
      }
    );
  };

  React.useEffect(() => {
    if (editingCampaign) {
      editForm.reset({
        title: editingCampaign.title,
        category: editingCampaign.category ?? "",
        content_type: editingCampaign.content_type,
        description: editingCampaign.description ?? "",
        total_budget: editingCampaign.total_budget,
        rate_per_million_views: editingCampaign.rate_per_million_views,
        max_submissions_per_account: editingCampaign.max_submissions_per_account ?? undefined,
        max_earnings_per_creator: editingCampaign.max_earnings_per_creator ?? undefined,
        max_earnings_per_post: editingCampaign.max_earnings_per_post ?? undefined,
        start_date: editingCampaign.start_date,
        end_date: editingCampaign.end_date,
        logo_drive_link: editingCampaign.logo_drive_link ?? "",
        guidelines_link: editingCampaign.guidelines_link ?? "",
        discord_link: editingCampaign.discord_link ?? "",
        platform_ids: (editingCampaign.platforms ?? []).map((p) => p.id),
        status: editingCampaign.status,
      });
    }
  }, [editingCampaign, editForm]);

  const onEditSubmit = (values: AdminEditCampaignValues) => {
    if (!editingCampaign) return;
    setSubmitError(null);
    updateMutation.mutate(
      {
        ...values,
        logo_drive_link: values.logo_drive_link || undefined,
        guidelines_link: values.guidelines_link || undefined,
        discord_link: values.discord_link || undefined,
        platform_ids: values.platform_ids,
        status: values.status,
      },
      {
        onSuccess: () => {
          setEditingCampaign(null);
        },
        onError: (err: unknown) => {
          const e = err as { response?: { data?: { detail?: string } } };
          setSubmitError(e.response?.data?.detail ?? "Failed to update campaign.");
        },
      }
    );
  };

  const onConfirmDelete = () => {
    if (!deleteCampaign) return;
    deleteMutation.mutate(undefined, {
      onSuccess: () => setDeleteCampaign(null),
    });
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
        Campaigns (admin)
      </Typography>

      {/* List */}
      <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
        All campaigns
      </Typography>
      {isLoading ? (
        <Typography color="text.secondary">Loading…</Typography>
      ) : (
        <TableContainer component={Paper} sx={{ mb: 4, border: "1px solid rgba(255,255,255,0.08)", borderRadius: 2 }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Brand</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Platforms</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Total budget</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Start / End</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {campaigns.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} sx={{ color: "text.secondary" }}>
                    No campaigns yet. Create one below.
                  </TableCell>
                </TableRow>
              ) : (
                campaigns.map((c) => (
                  <TableRow key={c.id} hover>
                    <TableCell>
                      <Typography
                        component={NextLink}
                        href={`/dashboard/admin/campaigns/${c.id}`}
                        sx={{ color: "primary.main", fontWeight: 500, textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
                      >
                        {c.title}
                      </Typography>
                    </TableCell>
                    <TableCell>{brandMap.get(c.brand_id)?.company_name ?? c.brand_id}</TableCell>
                    <TableCell>
                      {(c.platforms ?? []).map((p) => p.name).join(", ") || "—"}
                    </TableCell>
                    <TableCell>{c.status}</TableCell>
                    <TableCell>${c.total_budget.toLocaleString()}</TableCell>
                    <TableCell>{c.start_date} / {c.end_date}</TableCell>
                    <TableCell align="right">
                      <Button size="small" component={NextLink} href={`/dashboard/admin/campaigns/${c.id}`} sx={{ mr: 0.5 }}>
                        View
                      </Button>
                      <Button size="small" onClick={() => setEditingCampaign(c)}>
                        Edit
                      </Button>
                      <Button size="small" color="error" onClick={() => setDeleteCampaign({ id: c.id, title: c.title })}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Create */}
      <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
        Create campaign on behalf of a brand
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Select a brand and fill in the campaign details. Platform selection is required.
      </Typography>
      <Box component="form" onSubmit={createForm.handleSubmit(onCreateSubmit)} sx={{ maxWidth: 720, mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth error={!!createForm.formState.errors.brand_id} size="small">
              <InputLabel>Brand</InputLabel>
              <Select
                label="Brand"
                value={selectedBrandId ?? ""}
                onChange={(e) => createForm.setValue("brand_id", e.target.value, { shouldValidate: true })}
              >
                <MenuItem value="">Select a brand</MenuItem>
                {brands.map((b) => (
                  <MenuItem key={b.id} value={b.id}>
                    {b.company_name}
                    {b.industry ? ` (${b.industry})` : ""}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{createForm.formState.errors.brand_id?.message}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              Platforms for this campaign
            </Typography>
            <FormGroup row>
              {platforms.map((p) => (
                <FormControlLabel
                  key={p.id}
                  control={
                    <Checkbox
                      checked={selectedCreatePlatformIds.includes(p.id)}
                      onChange={(e) => {
                        const next = e.target.checked
                          ? [...selectedCreatePlatformIds, p.id]
                          : selectedCreatePlatformIds.filter((id) => id !== p.id);
                        createForm.setValue("platform_ids", next, { shouldValidate: true });
                      }}
                    />
                  }
                  label={p.name}
                />
              ))}
            </FormGroup>
            {createForm.formState.errors.platform_ids && (
              <FormHelperText error>{createForm.formState.errors.platform_ids.message}</FormHelperText>
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label="Title" fullWidth size="small" {...createForm.register("title")} error={!!createForm.formState.errors.title} helperText={createForm.formState.errors.title?.message} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label="Category" fullWidth size="small" {...createForm.register("category")} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label="Content type" select fullWidth size="small" SelectProps={{ native: true }} {...createForm.register("content_type")}>
              <option value="VIDEO">VIDEO</option>
              <option value="IMAGE">IMAGE</option>
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label="Total budget" type="number" fullWidth size="small" {...createForm.register("total_budget")} error={!!createForm.formState.errors.total_budget} helperText={createForm.formState.errors.total_budget?.message} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label="Rate per 1M views" type="number" fullWidth size="small" {...createForm.register("rate_per_million_views")} error={!!createForm.formState.errors.rate_per_million_views} helperText={createForm.formState.errors.rate_per_million_views?.message} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label="Max submissions/account" type="number" fullWidth size="small" {...createForm.register("max_submissions_per_account")} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label="Max earnings/creator" type="number" fullWidth size="small" {...createForm.register("max_earnings_per_creator")} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label="Max earnings/post" type="number" fullWidth size="small" {...createForm.register("max_earnings_per_post")} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label="Start date" type="date" fullWidth size="small" InputLabelProps={{ shrink: true }} {...createForm.register("start_date")} error={!!createForm.formState.errors.start_date} helperText={createForm.formState.errors.start_date?.message} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label="End date" type="date" fullWidth size="small" InputLabelProps={{ shrink: true }} {...createForm.register("end_date")} error={!!createForm.formState.errors.end_date} helperText={createForm.formState.errors.end_date?.message} />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField label="Logo drive link" fullWidth size="small" {...createForm.register("logo_drive_link")} />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField label="Guidelines link" fullWidth size="small" {...createForm.register("guidelines_link")} />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField label="Discord link" fullWidth size="small" {...createForm.register("discord_link")} />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Description" fullWidth size="small" multiline minRows={3} {...createForm.register("description")} />
          </Grid>
          {submitError && (
            <Grid item xs={12}>
              <Typography variant="body2" color="error">{submitError}</Typography>
            </Grid>
          )}
          <Grid item xs={12}>
            <Button type="submit" variant="contained" disabled={createMutation.isPending} sx={{ backgroundColor: "primary.main", "&:hover": { backgroundColor: "primary.dark" } }}>
              {createMutation.isPending ? "Creating…" : "Create campaign"}
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Edit dialog */}
      <Dialog open={!!editingCampaign} onClose={() => setEditingCampaign(null)} maxWidth="md" fullWidth>
        <DialogTitle>Edit campaign</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={editForm.handleSubmit(onEditSubmit)} id="admin-edit-campaign-form" sx={{ py: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  Platforms for this campaign
                </Typography>
                <FormGroup row>
                  {platforms.map((p) => (
                    <FormControlLabel
                      key={p.id}
                      control={
                        <Checkbox
                          checked={selectedEditPlatformIds.includes(p.id)}
                          onChange={(e) => {
                            const next = e.target.checked
                              ? [...selectedEditPlatformIds, p.id]
                              : selectedEditPlatformIds.filter((id) => id !== p.id);
                            editForm.setValue("platform_ids", next, { shouldValidate: true });
                          }}
                        />
                      }
                      label={p.name}
                    />
                  ))}
                </FormGroup>
                {editForm.formState.errors.platform_ids && (
                  <FormHelperText error>{editForm.formState.errors.platform_ids.message}</FormHelperText>
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="Title" fullWidth size="small" {...editForm.register("title")} error={!!editForm.formState.errors.title} helperText={editForm.formState.errors.title?.message} />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Status</InputLabel>
                  <Select
                    label="Status"
                    value={editForm.watch("status") ?? "ACTIVE"}
                    onChange={(e) => editForm.setValue("status", e.target.value as "ACTIVE" | "PAUSED" | "COMPLETED")}
                  >
                    <MenuItem value="ACTIVE">ACTIVE</MenuItem>
                    <MenuItem value="PAUSED">PAUSED</MenuItem>
                    <MenuItem value="COMPLETED">COMPLETED</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="Category" fullWidth size="small" {...editForm.register("category")} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="Content type" select fullWidth size="small" SelectProps={{ native: true }} {...editForm.register("content_type")}>
                  <option value="VIDEO">VIDEO</option>
                  <option value="IMAGE">IMAGE</option>
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="Total budget" type="number" fullWidth size="small" {...editForm.register("total_budget")} error={!!editForm.formState.errors.total_budget} helperText={editForm.formState.errors.total_budget?.message} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="Rate per 1M views" type="number" fullWidth size="small" {...editForm.register("rate_per_million_views")} error={!!editForm.formState.errors.rate_per_million_views} helperText={editForm.formState.errors.rate_per_million_views?.message} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="Max submissions/account" type="number" fullWidth size="small" {...editForm.register("max_submissions_per_account")} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="Max earnings/creator" type="number" fullWidth size="small" {...editForm.register("max_earnings_per_creator")} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="Max earnings/post" type="number" fullWidth size="small" {...editForm.register("max_earnings_per_post")} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="Start date" type="date" fullWidth size="small" InputLabelProps={{ shrink: true }} {...editForm.register("start_date")} error={!!editForm.formState.errors.start_date} helperText={editForm.formState.errors.start_date?.message} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="End date" type="date" fullWidth size="small" InputLabelProps={{ shrink: true }} {...editForm.register("end_date")} error={!!editForm.formState.errors.end_date} helperText={editForm.formState.errors.end_date?.message} />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField label="Logo drive link" fullWidth size="small" {...editForm.register("logo_drive_link")} />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField label="Guidelines link" fullWidth size="small" {...editForm.register("guidelines_link")} />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField label="Discord link" fullWidth size="small" {...editForm.register("discord_link")} />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Description" fullWidth size="small" multiline minRows={3} {...editForm.register("description")} />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setEditingCampaign(null)}>Cancel</Button>
          <Button type="submit" form="admin-edit-campaign-form" variant="contained" disabled={updateMutation.isPending} sx={{ backgroundColor: "primary.main", "&:hover": { backgroundColor: "primary.dark" } }}>
            {updateMutation.isPending ? "Saving…" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog open={!!deleteCampaign} onClose={() => setDeleteCampaign(null)}>
        <DialogTitle>Delete campaign</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this campaign?{" "}
            {deleteCampaign && <strong>{deleteCampaign.title}</strong>}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteCampaign(null)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={onConfirmDelete} disabled={deleteMutation.isPending}>
            {deleteMutation.isPending ? "Deleting…" : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
