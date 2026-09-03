import { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Drawer,
  IconButton,
  InputAdornment,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import GroupIcon from "@mui/icons-material/GroupOutlined";
import EditIcon from "@mui/icons-material/EditOutlined";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";

import {
  InputTextField,
  CustomSwitch,
  Loading,
  CustomModal,
  AutocompleteField,
} from "@/components";
import { useSubscriptionStore } from "@/store/subscription";
import type {
  SubscriptionForm,
  SubscriptionItem,
  SubscriptionType,
  FeatureFlag,
} from "@/types/subscription";
import { DeleteIcon, FilledTickIcon } from "@/assets";

type PricingMode = "monthly" | "annual";

interface FormErrors {
  name?: string;
  type?: string;
  description?: string;
  monthlyPrice?: string;
  annualPrice?: string;
  maxWorkers?: string;
}

interface AutocompleteOption {
  label: string;
  value: SubscriptionType;
}

const DEFAULT_FEATURE_FLAGS: FeatureFlag[] = [
  {
    id: "advancedScheduling",
    name: "Advanced scheduling & roster optimisation",
    enabled: false,
  },
  {
    id: "isUrgentShift",
    name: "Priority job visibility",
    enabled: false,
  },
  {
    id: "customWorkflows",
    name: "Custom workflows & forms",
    enabled: false,
  },
];

const PLAN_TYPE_OPTIONS: AutocompleteOption[] = [
  {
    label: "Basic",
    value: "Basic",
  },
  {
    label: "Professional",
    value: "Professional",
  },
  {
    label: "Premium",
    value: "Premium",
  },
];

const DEFAULT_TYPE: SubscriptionType = "Basic";

const getPlanColor = () => {
  return "#0E6E5C";
};

const getPlanIcon = (plan: SubscriptionItem) => {
  if (plan.isPopular) {
    return <EmojiEventsIcon fontSize="small" />;
  }

  const type = plan.type?.toLowerCase();

  if (type?.includes("enterprise") || type?.includes("premium")) {
    return <WorkspacePremiumIcon fontSize="small" />;
  }

  return <StarIcon fontSize="small" />;
};

const normalizeFeatureFlags = (flags?: FeatureFlag[]): FeatureFlag[] => {
  if (!flags?.length) {
    return DEFAULT_FEATURE_FLAGS.map((flag) => ({ ...flag }));
  }

  return flags.map((flag) => ({ ...flag }));
};

const emptyForm = (): SubscriptionForm => ({
  name: "",
  type: DEFAULT_TYPE,
  description: "",
  monthlyPrice: 0,
  annualPrice: 0,
  maxWorkers: 10,
  isAiEnabled: true,
  isPopular: false,
  isUrgentShift: false,
  isActive: true,
  featureFlags: normalizeFeatureFlags(),
});

const validateForm = (values: SubscriptionForm): FormErrors => {
  const errors: FormErrors = {};

  if (!values.name.trim()) {
    errors.name = "Plan name is required";
  } else if (values.name.trim().length < 2) {
    errors.name = "Plan name must be at least 2 characters";
  }

  if (!values.type) {
    errors.type = "Plan type is required";
  }

  if (!values.description.trim()) {
    errors.description = "Description is required";
  }

  if (
    values.monthlyPrice === undefined ||
    values.monthlyPrice === null ||
    Number.isNaN(values.monthlyPrice)
  ) {
    errors.monthlyPrice = "Monthly price is required";
  } else if (values.monthlyPrice <= 0) {
    errors.monthlyPrice = "Monthly price must be greater than 0";
  }

  if (
    values.annualPrice === undefined ||
    values.annualPrice === null ||
    Number.isNaN(values.annualPrice)
  ) {
    errors.annualPrice = "Annual price is required";
  } else if (values.annualPrice <= 0) {
    errors.annualPrice = "Annual price must be greater than 0";
  }


  if (
    values.maxWorkers === undefined ||
    values.maxWorkers === null ||
    Number.isNaN(values.maxWorkers)
  ) {
    errors.maxWorkers = "Maximum workers is required";
  } else if (values.maxWorkers <= 0) {
    errors.maxWorkers = "Maximum workers must be greater than 0";
  }

  return errors;
};

// const getFeatureEnabled = (flags: FeatureFlag[], id: string) => {
//   return Boolean(flags.find((flag) => flag.id === id)?.enabled);
// };

// const updateFeatureFlag = (
//   flags: FeatureFlag[],
//   id: string,
//   enabled: boolean,
//   name: string
// ): FeatureFlag[] => {
//   const exists = flags.some((flag) => flag.id === id);

//   if (!exists) {
//     return [...flags, { id, name, enabled }];
//   }

//   return flags.map((flag) =>
//     flag.id === id ? { ...flag, enabled } : flag
//   );
// };

const Subscription = () => {
  const {
    subscriptions,
    loading,
    detailLoading,
    createLoading,
    updateLoading,
    deleteLoading,
    getSubscriptions,
    getSubscriptionById,
    createSubscription,
    updateSubscription,
    deleteSubscription,
    clearSelectedSubscription,
  } = useSubscriptionStore();

  const [draft, setDraft] = useState<SubscriptionForm | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  const [pricingModes, setPricingModes] = useState<
    Record<number, PricingMode>
  >({});

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletePlan, setDeletePlan] = useState<SubscriptionItem | null>(null);

  useEffect(() => {
    getSubscriptions({
      offset: 0,
      limit: 100,
    });
  }, [getSubscriptions]);

  const mapItemToForm = (
    item: SubscriptionItem
  ): SubscriptionForm => ({
    subscriptionId: item.subscriptionId,
    name: item.name ?? "",
    type: (item.type as SubscriptionType) ?? DEFAULT_TYPE,
    description: item.description ?? "",
    monthlyPrice: Number(item.monthlyPrice) || 0,
    annualPrice: Number(item.annualPrice) || 0,
    maxWorkers: Number(item.maxWorkers) || 0,
    isAiEnabled: Boolean(item.isAiEnabled),
    isPopular: Boolean(item.isPopular),
    isUrgentShift: Boolean(item.isUrgentShift),
    isActive: Boolean(item.isActive),
    featureFlags: normalizeFeatureFlags(item.featureFlags),
  });

  const openNew = () => {
    clearSelectedSubscription();
    setErrors({});
    setEditingId(null);
    setDraft(emptyForm());
  };

  const openEdit = async (plan: SubscriptionItem) => {
    setErrors({});
    setEditingId(plan.subscriptionId);
    setDraft(null);
    clearSelectedSubscription();

    const detail = await getSubscriptionById(plan.subscriptionId);

    setDraft(mapItemToForm(detail ?? plan));
  };

  const closeDrawer = () => {
    if (createLoading || updateLoading || detailLoading) {
      return;
    }

    setDraft(null);
    setEditingId(null);
    setErrors({});
    clearSelectedSubscription();
  };

  const updateValue = <K extends keyof SubscriptionForm>(
    key: K,
    value: SubscriptionForm[K]
  ) => {
    setDraft((previous) =>
      previous
        ? {
          ...previous,
          [key]: value,
        }
        : null
    );

    setErrors((previous) => ({
      ...previous,
      [key]: undefined,
    }));
  };

  const save = async () => {
    if (!draft) {
      return;
    }

    const validationErrors = validateForm(draft);

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    let success = false;

    if (editingId !== null) {
      success = await updateSubscription({
        ...draft,
        subscriptionId: editingId,
      });
    } else {
      success = await createSubscription(draft);
    }

    if (!success) {
      return;
    }

    closeDrawer();

    await getSubscriptions({
      offset: 0,
      limit: 100,
    });
  };

  const openDeleteModal = (plan: SubscriptionItem) => {
    if (deleteLoading) {
      return;
    }

    setDeletePlan(plan);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    if (deleteLoading) {
      return;
    }

    setDeleteModalOpen(false);
    setDeletePlan(null);
  };

  const handleDelete = async () => {
    if (!deletePlan || deleteLoading) {
      return;
    }

    const success = await deleteSubscription(
      deletePlan.subscriptionId
    );

    if (!success) {
      return;
    }

    setDeleteModalOpen(false);
    setDeletePlan(null);

    await getSubscriptions({
      offset: 0,
      limit: 100,
    });
  };

  const setCardPricingMode = (
    subscriptionId: number,
    mode: PricingMode
  ) => {
    setPricingModes((previous) => ({
      ...previous,
      [subscriptionId]: mode,
    }));
  };

  // const setFeatureFlag = (
  //   id: string,
  //   name: string,
  //   enabled: boolean
  // ) => {
  //   setDraft((previous) =>
  //     previous
  //       ? {
  //         ...previous,
  //         featureFlags: updateFeatureFlag(
  //           previous.featureFlags,
  //           id,
  //           enabled,
  //           name
  //         ),
  //       }
  //       : null
  //   );
  // };

  // const priorityVisibilityEnabled = draft
  //   ? getFeatureEnabled(
  //     draft.featureFlags,
  //     "isUrgentShift"
  //   )
  //   : false;

  const selectedPlanType: AutocompleteOption = {
    label: draft?.type ?? DEFAULT_TYPE,
    value: draft?.type ?? DEFAULT_TYPE,
  };

  const renderSubscriptionContent = () => {
    if (loading && subscriptions.length === 0) {
      return <Loading />;
    }

    if (subscriptions.length === 0) {
      return (
        <Card
          variant="outlined"
          sx={{
            borderRadius: 3,
            p: { xs: 3, sm: 5 },
            textAlign: "center",
          }}
        >
          <Typography
            sx={{ fontWeight: 700 }}
            color="#344054"
          >
            No subscription plans found
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            Create your first subscription plan.
          </Typography>
        </Card>
      );
    }

    return (
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
          gap: 2,
          width: "100%",
        }}
      >
        {subscriptions.map((plan) => {
          const color = getPlanColor(plan);

          const pricingMode =
            pricingModes[plan.subscriptionId] ?? "monthly";

          const displayedPrice =
            pricingMode === "monthly"
              ? plan.monthlyPrice
              : plan.annualPrice;

          return (
            <Card
              key={plan.subscriptionId}
              variant="outlined"
              sx={{
                borderRadius: 1.5,
                borderColor: plan.isPopular
                  ? color
                  : "#E4E7EC",
                boxShadow: plan.isPopular
                  ? `0 0 0 1px ${color}`
                  : "none",
                position: "relative",
                overflow: "visible",
                height: "100%",
                backgroundColor: "#FFFFFF",
              }}
            >
              {plan.isPopular && (
                <Chip
                  label="MOST POPULAR"
                  size="small"
                  sx={{
                    position: "absolute",
                    top: -12,
                    left: 16,
                    backgroundColor: "primary.main",
                    color: "#FFFFFF",
                    fontWeight: 700,
                    fontSize: 10,
                    letterSpacing: 0.4,
                    height: 24,
                  }}
                />
              )}

              <CardContent
                sx={{
                  p: { xs: 2, sm: 2.5 },
                  height: "100%",
                  boxSizing: "border-box",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 1,
                    mb: 1.5,
                  }}
                >
                  <Avatar
                    sx={{
                      backgroundColor: color,
                      width: 36,
                      height: 36,
                    }}
                  >
                    {getPlanIcon(plan)}
                  </Avatar>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      minWidth: 0,
                    }}
                  >
                    <Chip
                      label={
                        plan.isActive
                          ? "Active"
                          : "Inactive"
                      }
                      size="small"
                      sx={{
                        backgroundColor: plan.isActive
                          ? "#E7F6EC"
                          : "#F1F2F4",
                        color: plan.isActive
                          ? "#1A7F37"
                          : "#667085",
                        fontWeight: 700,
                        fontSize: 11,
                      }}
                    />

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        border: "1px solid #E4E7EC",
                        borderRadius: 1,
                        p: 0.25,
                        backgroundColor: "#F9FAFB",
                      }}
                    >
                      <Button
                        size="small"
                        onClick={() =>
                          setCardPricingMode(
                            plan.subscriptionId,
                            "monthly"
                          )
                        }
                        sx={{
                          minWidth: 0,
                          px: 1,
                          minHeight: 28,
                          fontSize: 11,
                          textTransform: "none",
                          fontWeight:
                            pricingMode === "monthly"
                              ? 700
                              : 500,
                          color:
                            pricingMode === "monthly"
                              ? "#0E6E5C"
                              : "#667085",
                          backgroundColor:
                            pricingMode === "monthly"
                              ? "#E7F6EC"
                              : "transparent",
                          "&:hover": {
                            backgroundColor:
                              pricingMode === "monthly"
                                ? "#E7F6EC"
                                : "transparent",
                          },
                        }}
                      >
                        Month
                      </Button>

                      <Button
                        size="small"
                        onClick={() =>
                          setCardPricingMode(
                            plan.subscriptionId,
                            "annual"
                          )
                        }
                        sx={{
                          minWidth: 0,
                          px: 1,
                          minHeight: 28,
                          fontSize: 11,
                          textTransform: "none",
                          fontWeight:
                            pricingMode === "annual"
                              ? 700
                              : 500,
                          color:
                            pricingMode === "annual"
                              ? "#0E6E5C"
                              : "#667085",
                          backgroundColor:
                            pricingMode === "annual"
                              ? "#E7F6EC"
                              : "transparent",
                          "&:hover": {
                            backgroundColor:
                              pricingMode === "annual"
                                ? "#E7F6EC"
                                : "transparent",
                          },
                        }}
                      >
                        Annual
                      </Button>
                    </Box>
                  </Box>
                </Box>

                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 800,
                    color: "#101828",
                  }}
                >
                  {plan.name}
                </Typography>

                {plan.type && (
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#0E6E5C",
                      fontWeight: 700,
                      mt: 0.25,
                    }}
                  >
                    {plan.type}
                  </Typography>
                )}

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    minHeight: 42,
                    mt: 0.5,
                    lineHeight: 1.5,
                  }}
                >
                  {plan.description}
                </Typography>

                <Box sx={{ mt: 0.5 }}>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 800,
                      color: "#101828",
                    }}
                  >
                    ${displayedPrice}

                    <Typography
                      component="span"
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontWeight: 600,
                        ml: 0.5,
                      }}
                    >
                      /
                      {pricingMode === "monthly"
                        ? "month"
                        : "month, billed annually"}
                    </Typography>
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Stack spacing={1} sx={{ mb: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <FilledTickIcon />

                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      Up to {plan.maxWorkers} workers
                    </Typography>
                  </Box>

                  {plan.isAiEnabled && (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <FilledTickIcon />

                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        AI assistance
                      </Typography>
                    </Box>
                  )}

                  {plan.isUrgentShift && (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <FilledTickIcon />

                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        Priority job visibility
                      </Typography>
                    </Box>
                  )}
                </Stack>

                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    mt: "auto",
                    alignItems: "center",
                  }}
                >
                  <Button
                    fullWidth
                    variant="outlined"
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => openEdit(plan)}
                    disabled={deleteLoading}
                    sx={{
                      textTransform: "none",
                      fontWeight: 600,
                      minHeight: 36,
                    }}
                  >
                    Edit plan
                  </Button>

                  <Tooltip title="Delete">
                    <IconButton
                      size="small"
                      onClick={() =>
                        openDeleteModal(plan)
                      }
                      disabled={deleteLoading}
                      sx={{
                        border: "1px solid #E4E7EC",
                        borderRadius: 2,
                        width: 36,
                        height: 36,
                        flexShrink: 0,
                        color: "#DC4E4E",
                      }}
                    >
                      {deleteLoading &&
                        deletePlan?.subscriptionId ===
                        plan.subscriptionId ? (
                        <CircularProgress size={16} />
                      ) : (
                        <DeleteIcon />
                      )}
                    </IconButton>
                  </Tooltip>
                </Box>
              </CardContent>
            </Card>
          );
        })}
      </Box>
    );
  };


  const getSaveButtonContent = (): React.ReactNode => {
    if (createLoading || updateLoading) {
      return (
        <CircularProgress
          size={20}
          sx={{
            color: "#FFFFFF",
          }}
        />
      );
    }
    if (editingId !== null) {
      return "Update plan";
    }
    return "Save plan";
  };


  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        backgroundColor: "#F4F6F7",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "flex-start" },
          gap: 2,
          mb: 3,
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              color: "#101828",
              mb: 0.5,
              fontSize: { xs: 22, sm: 24 },
              textAlign: 'start'
            }}
          >
            Subscription plans
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ lineHeight: 1.6 }}
          >
            Configure pricing, limits and feature access for your
            subscription plans.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openNew}
          disabled={subscriptions.length === 3 || loading}
          sx={{
            backgroundColor: "primary.main",
            textTransform: "none",
            fontWeight: 700,
            borderRadius: 1,
            minHeight: 40,
            whiteSpace: "nowrap",
            alignSelf: { xs: "stretch", sm: "auto" },
            "&:hover": {
              backgroundColor: "primary.main",
            },
          }}
        >
          New plan
        </Button>
      </Box>

      {renderSubscriptionContent()}

      <Drawer
        anchor="right"
        open={Boolean(draft) || detailLoading}
        onClose={closeDrawer}
        slotProps={{
          paper: {
            sx: {
              width: { xs: "100%", sm: 440 },
              maxWidth: "100%",
            },
          },
        }}
      >
        {detailLoading && <Loading />}
        {
          draft &&
          <Box
            sx={{
              p: { xs: 2, sm: 3 },
              display: "flex",
              flexDirection: "column",
              height: "100%",
              boxSizing: "border-box",
              minWidth: 0,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 1,
                mb: 2,
                flexShrink: 0,
              }}
            >
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 800,
                    color: "#101828",
                  }}
                >
                  {editingId !== null
                    ? "Edit plan"
                    : "New plan"}
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  {editingId !== null
                    ? "Update subscription plan details"
                    : "Create a new subscription plan"}
                </Typography>
              </Box>

              <IconButton
                onClick={closeDrawer}
                size="small"
                disabled={
                  createLoading || updateLoading
                }
              >
                <CloseIcon />
              </IconButton>
            </Box>

            <Box
              sx={{
                overflowY: "auto",
                overflowX: "hidden",
                flex: 1,
                pr: 0.5,
                minHeight: 0,
              }}
            >
              <Typography
                variant="overline"
                color="text.secondary"
                sx={{ fontWeight: 700 }}
              >
                Identity
              </Typography>

              <Box sx={{ mt: 1 }}>
                <InputTextField
                  label="Plan Name"
                  value={draft.name}
                  placeholder="Enter plan name"
                  errors={errors.name}
                  onChange={(value) =>
                    updateValue("name", value)
                  }
                />
              </Box>

              <Box sx={{ mt: 2 }}>
                <AutocompleteField
                  required
                  label="Plan Type"
                  value={selectedPlanType}
                  error={errors.type}
                  options={PLAN_TYPE_OPTIONS}
                  placeholder="Select plan type"
                  onChange={(value: any) => {
                    const selectedValue =
                      typeof value === "string"
                        ? value
                        : value?.value ?? value?.label;

                    if (
                      selectedValue === "Basic" ||
                      selectedValue ===
                      "Professional" ||
                      selectedValue === "Premium"
                    ) {
                      updateValue(
                        "type",
                        selectedValue
                      );
                    }
                  }}
                />
              </Box>

              <Box sx={{ mt: 2 }}>
                <InputTextField
                  label="Description"
                  value={draft.description}
                  placeholder="Enter description"
                  errors={errors.description}
                  onChange={(value) =>
                    updateValue(
                      "description",
                      value
                    )
                  }
                />
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography
                variant="overline"
                color="text.secondary"
                sx={{ fontWeight: 700 }}
              >
                Pricing
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, minmax(0, 1fr))",
                  },
                  gap: 1.5,
                  mt: 1,
                }}
              >
                <InputTextField
                  label="Monthly Price"
                  type="number"
                  value={draft.monthlyPrice}
                  placeholder="0"
                  errors={errors.monthlyPrice}
                  startAdornment={
                    <InputAdornment position="start">
                      $
                    </InputAdornment>
                  }
                  onChange={(value) =>
                    updateValue(
                      "monthlyPrice",
                      Number(value) || 0
                    )
                  }
                />

                <InputTextField
                  label="Annual Price / Month"
                  type="number"
                  value={draft.annualPrice}
                  placeholder="0"
                  errors={errors.annualPrice}
                  startAdornment={
                    <InputAdornment position="start">
                      $
                    </InputAdornment>
                  }
                  onChange={(value) =>
                    updateValue(
                      "annualPrice",
                      Number(value) || 0
                    )
                  }
                />
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography
                variant="overline"
                color="text.secondary"
                sx={{ fontWeight: 700 }}
              >
                Usage limits
              </Typography>

              <Box sx={{ mt: 1 }}>
                <InputTextField
                  label="Maximum Workers"
                  type="number"
                  value={draft.maxWorkers}
                  placeholder="Enter maximum workers"
                  errors={errors.maxWorkers}
                  startAdornment={
                    <GroupIcon
                      sx={{
                        fontSize: 18,
                        color: "#667085",
                      }}
                    />
                  }
                  onChange={(value) =>
                    updateValue(
                      "maxWorkers",
                      Number(value) || 0
                    )
                  }
                />
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography
                variant="overline"
                color="text.secondary"
                sx={{ fontWeight: 700 }}
              >
                Feature flags
              </Typography>

              <Box sx={{ mt: 0.5 }}>
                <CustomSwitch
                  sxProps={{
                    alignItems: "center",
                    justifyContent: "space-between",
                    display: "flex",
                    mb: 1,
                  }}
                  label="AI Assistance"
                  checked={draft.isAiEnabled}
                  onChange={(checked) =>
                    updateValue(
                      "isAiEnabled",
                      checked
                    )
                  }
                />

                <CustomSwitch
                  sxProps={{
                    alignItems: "center",
                    justifyContent: "space-between",
                    display: "flex",
                  }}
                  label="Priority Job Visibility"
                  checked={draft.isUrgentShift}
                  onChange={(checked) =>
                    updateValue(
                      "isUrgentShift",
                      checked
                    )
                  }
                />
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography
                variant="overline"
                color="text.secondary"
                sx={{ fontWeight: 700 }}
              >
                Status
              </Typography>

              <Box sx={{ mt: 0.5 }}>
                <CustomSwitch
                  sxProps={{
                    alignItems: "center",
                    justifyContent: "space-between",
                    display: "flex",
                    mb: 1,
                    fontSize: 12,
                  }}
                  label='Mark as "Most Popular"'
                  checked={draft.isPopular}
                  onChange={(checked) =>
                    updateValue(
                      "isPopular",
                      checked
                    )
                  }
                />

                <CustomSwitch
                  sxProps={{
                    alignItems: "center",
                    justifyContent: "space-between",
                    display: "flex",
                  }}
                  label="Active (visible in client app)"
                  checked={draft.isActive}
                  onChange={(checked) =>
                    updateValue(
                      "isActive",
                      checked
                    )
                  }
                />
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                gap: 1.5,
                pt: 2,
                flexShrink: 0,
                backgroundColor: "#FFFFFF",
              }}
            >
              <Button
                fullWidth
                variant="outlined"
                onClick={closeDrawer}
                disabled={
                  createLoading || updateLoading
                }
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  minHeight: 40,
                }}
              >
                Discard
              </Button>

              <Button
                fullWidth
                variant="contained"
                onClick={save}
                disabled={createLoading || updateLoading}
                sx={{
                  backgroundColor: "primary.main",
                  textTransform: "none",
                  fontWeight: 700,
                  minHeight: 40,
                  "&:hover": {
                    backgroundColor: "#0A5A4B",
                  },
                }}
              >
                {getSaveButtonContent()}
              </Button>

            </Box>
          </Box>}
      </Drawer>

      <CustomModal
        open={deleteModalOpen}
        onClose={closeDeleteModal}
        type="warning"
        title="Delete subscription plan?"
        description={
          deletePlan
            ? `Are you sure you want to delete "${deletePlan.name}"? This action cannot be undone.`
            : "Are you sure you want to delete this subscription plan?"
        }
        primaryText={
          deleteLoading ? "Deleting..." : "Confirm"
        }
        onPrimary={handleDelete}
      />
    </Box>
  );
};

export default Subscription;