"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Stack,
  useTheme,
  useMediaQuery,
  Paper,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";

/** ------------ Types ------------ */
export type Lender = {
  _id?: string;
  lenderName?: string;
  state?: string;
  city?: string;
  bankerName?: string;
  email?: string;
  rmName?: string;
  rmContact?: string;
  asmName?: string;
  asmContact?: string;
  rsmName?: string;
  rsmContact?: string;
  zsmName?: string;

  // meta fields that may come from backend — we won't send them back:
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
};

interface LenderFormDialogProps {
  open: boolean;
  initialData: Lender | null; // null => add, object => edit
  onClose: () => void;
  onSuccess: () => void; // parent will refetch
}

/** ------------ Styles ------------ */
const textFieldSx = {
  "& .MuiOutlinedInput-root": {
    color: "#000",
    backgroundColor: "#F9FAFB",
    "& fieldset": { borderColor: "#60A5FA" },
    "&:hover fieldset": { borderColor: "#3B82F6" },
    "&.Mui-focused fieldset": { borderColor: "#2563EB" },
  },
  "& .MuiInputLabel-root": { color: "#2563EB" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#2563EB" },
} as const;

/** ------------ Helpers ------------ */
type LenderEditable = {
  lenderName?: string;
  state?: string;
  city?: string;
  bankerName?: string;
  email?: string;
  rmName?: string;
  rmContact?: string;
  asmName?: string;
  asmContact?: string;
  rsmName?: string;
  rsmContact?: string;
  zsmName?: string;
};

const toEditablePayload = (src: any): LenderEditable => ({
  lenderName: src?.lenderName ?? "",
  state: src?.state ?? "",
  city: src?.city ?? "",
  bankerName: src?.bankerName ?? "",
  email: src?.email ?? "",
  rmName: src?.rmName ?? "",
  rmContact: src?.rmContact ?? "",
  asmName: src?.asmName ?? "",
  asmContact: src?.asmContact ?? "",
  rsmName: src?.rsmName ?? "",
  rsmContact: src?.rsmContact ?? "",
  zsmName: src?.zsmName ?? "",
});

/** ------------ Component ------------ */
export default function LenderFormDialog({
  open,
  initialData,
  onClose,
  onSuccess,
}: LenderFormDialogProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [form, setForm] = useState<Lender>({});
  const [saving, setSaving] = useState(false);

  // Reset + clean form whenever dialog opens or initialData changes
  useEffect(() => {
    if (!open) return;
    if (!initialData) {
      setForm({});
      return;
    }
    // keep _id locally (for edit route), but remove meta fields from state
    const { createdAt, updatedAt, __v, ...clean } = initialData;
    setForm(clean);
  }, [open, initialData]);

  const handleChange =
    (key: keyof Lender) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const isEdit = !!form?._id;

  // Required fields – align with your backend DTO validation
  const canSave = useMemo(() => {
    return (
      !!form?.lenderName?.trim() &&
      !!form?.state?.trim() &&
      !!form?.city?.trim() &&
      !!form?.bankerName?.trim() &&
      !!form?.email?.trim()
    );
  }, [form]);

  const handleSave = async () => {
    if (!canSave || saving) return;
    setSaving(true);
    try {
      const base = process.env.NEXT_PUBLIC_BACKEND_URL;
      const payload = toEditablePayload(form); // strips _id, createdAt, updatedAt, __v

      if (isEdit) {
        await axios.put(`${base}/lenders/update-lenders/${form._id}`, payload);
      } else {
        await axios.post(`${base}/lenders/create-lenders`, payload);
      }

      onSuccess();
    } catch (err: any) {
      console.error("Save lender failed:", err?.response?.data || err?.message);
      alert(err?.response?.data?.message || "Failed to save lender");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth scroll="body">
      <DialogTitle
        sx={{
          color: "#fff",
          bgcolor: "primary.main",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pr: 1,
        }}
      >
        {isEdit ? "Edit Lender" : "Add Lender"}
        <IconButton onClick={onClose} size="small" sx={{ color: "#fff" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ bgcolor: "#F3F4F6" }}>
        <Paper elevation={0} sx={{ p: isMobile ? 2 : 3, bgcolor: "#fff", borderRadius: 2 }}>
          <Stack spacing={2}>
            <Grid container spacing={2}>
              {/* Required */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Lender Name *"
                  value={form?.lenderName ?? ""}
                  onChange={handleChange("lenderName")}
                  fullWidth
                  sx={textFieldSx}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="State *"
                  value={form?.state ?? ""}
                  onChange={handleChange("state")}
                  fullWidth
                  sx={textFieldSx}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="City *"
                  value={form?.city ?? ""}
                  onChange={handleChange("city")}
                  fullWidth
                  sx={textFieldSx}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Banker Name *"
                  value={form?.bankerName ?? ""}
                  onChange={handleChange("bankerName")}
                  fullWidth
                  sx={textFieldSx}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email *"
                  type="email"
                  value={form?.email ?? ""}
                  onChange={handleChange("email")}
                  fullWidth
                  sx={textFieldSx}
                />
              </Grid>

              {/* Optional */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="RM Name"
                  value={form?.rmName ?? ""}
                  onChange={handleChange("rmName")}
                  fullWidth
                  sx={textFieldSx}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="RM Contact"
                  value={form?.rmContact ?? ""}
                  onChange={handleChange("rmContact")}
                  fullWidth
                  sx={textFieldSx}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="ASM Name"
                  value={form?.asmName ?? ""}
                  onChange={handleChange("asmName")}
                  fullWidth
                  sx={textFieldSx}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="ASM Contact"
                  value={form?.asmContact ?? ""}
                  onChange={handleChange("asmContact")}
                  fullWidth
                  sx={textFieldSx}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="RSM Name"
                  value={form?.rsmName ?? ""}
                  onChange={handleChange("rsmName")}
                  fullWidth
                  sx={textFieldSx}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="RSM Contact"
                  value={form?.rsmContact ?? ""}
                  onChange={handleChange("rsmContact")}
                  fullWidth
                  sx={textFieldSx}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="ZSM Name"
                  value={form?.zsmName ?? ""}
                  onChange={handleChange("zsmName")}
                  fullWidth
                  sx={textFieldSx}
                />
              </Grid>
            </Grid>
          </Stack>
        </Paper>
      </DialogContent>

      <DialogActions sx={{ bgcolor: "#F3F4F6", px: 3, py: 2 }}>
        <Button onClick={onClose} variant="outlined" color="primary">
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          disabled={!canSave || saving}
          sx={{ bgcolor: "#2563EB", "&:hover": { bgcolor: "#1e4ed8" } }}
        >
          {saving ? "Saving..." : isEdit ? "Save Changes" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
