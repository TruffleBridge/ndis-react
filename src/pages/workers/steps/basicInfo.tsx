import {
    Box,
    Typography,
    Button,
    Grid,
} from "@mui/material";
import {
    AutocompleteField,
    CustomSwitch,
    DateField,
    InputTextField,
    SectionCard,
    ToggleGroup,
    UploadVariant1,
} from "../../../components";
import { WorkerStyles } from "../styles";
import { ArrowForwardOutlined } from "@mui/icons-material";
import type { PersonalInfo } from "../utils/types";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

const genderOptions = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Non-binary", value: "non-binary" },
    { label: "Prefer not to say", value: "na" },
];

interface PersonalProps {
    data: PersonalInfo;
    setData: React.Dispatch<
        React.SetStateAction<PersonalInfo>
    >;
    isView: boolean;
    handleNext?: () => void;
}

const PersonalInformation = ({
    data,
    setData,
    isView,
    handleNext,
}: PersonalProps) => {
    const navigate = useNavigate();

    const updateField = (
        key: keyof PersonalInfo,
        value: any
    ) => {
        setData((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
            }}
        >
            <Box
                sx={{
                    textAlign: "left",
                    flexShrink: 0,
                    mb: 1,
                }}
            >
                <Typography sx={WorkerStyles.title}>
                    Personal Information
                </Typography>

                <Typography sx={WorkerStyles.subtitle}>
                    Just the basics - take about 30 seconds
                    to set up a secure identity
                </Typography>
            </Box>

            <Box sx={WorkerStyles.scrollArea}>
                <Grid container spacing={2}>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <InputTextField
                            label="First Name"
                            value={data.firstName}
                            placeholder="e.g. Jane Cooper"
                            isView={isView}
                            onChange={(value) =>
                                updateField("firstName", value)
                            }
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <InputTextField
                            label="Last Name"
                            value={data.lastName}
                            placeholder="e.g. Jane Cooper"
                            isView={isView}
                            onChange={(value) => {
                                updateField("lastName", value)
                            }}
                        />
                    </Grid>

                    <Grid
                        size={{ xs: 12, md: 4 }}
                        sx={WorkerStyles.dateFieldGrid}
                    >
                        <DateField
                            label="Date of Birth"
                            value={dayjs(data.dateOfBirth)}
                            isView={isView}
                            onChange={(value) =>
                                updateField(
                                    "dateOfBirth",
                                    value
                                )
                            }
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <InputTextField
                            label="Mobile Number"
                            placeholder="+61 400 000 000"
                            value={data.mobile}
                            isView={isView}
                            onChange={(value) =>
                                updateField("mobile", value)
                            }
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 8 }}>
                        <InputTextField
                            label="Email Address"
                            value={data.email}
                            placeholder="jane@gmail.com"
                            isView={isView}
                            onChange={(value) =>
                                updateField("email", value)
                            }
                        />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <InputTextField
                            label="Location / Address"
                            placeholder="Enter location / address"
                            value={data.address}
                            isView={isView}
                            onChange={(value) =>
                                updateField("address", value)
                            }
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <InputTextField
                            label="Suburb"
                            placeholder="Enter suburb"
                            required
                            value={data.suburb}
                            isView={isView}
                            onChange={(value) =>
                                updateField("suburb", value)
                            }
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <InputTextField
                            label="State"
                            placeholder="Enter state"
                            value={data.state}
                            isView={isView}
                            onChange={(value) =>
                                updateField("state", value)
                            }
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <InputTextField
                            label="Postal Code"
                            placeholder="Enter postal code"
                            value={data.postalCode}
                            isView={isView}
                            onChange={(value) =>
                                updateField("postalCode", value)
                            }
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <ToggleGroup
                            label="Gender"
                            value={data.gender}
                            options={genderOptions}
                            disabled={isView}
                            onChange={(value) =>
                                updateField("gender", value)
                            }
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <UploadVariant1
                            label="Upload ID Proof"
                            // isView={isView}
                            value={data.idProof}
                            onChange={(file: any) =>
                                updateField("idProof", file)
                            }
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }} sx={{ mb: 1 }}>
                        <CustomSwitch
                            label="Profile Preferences"
                            multiple
                            items={data.preferences}
                            disabled={isView}
                            onItemsChange={(items) =>
                                updateField("preferences", items)
                            }
                        />
                    </Grid>

                    <SectionCard title="General">
                        <Grid container spacing={2}>

                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <AutocompleteField
                                    label="Primary Language"
                                    value={data.primaryLanguage}
                                    options={[]}
                                    placeholder="Select"
                                    required
                                    readOnly={isView}
                                    // disabled={isView}
                                    isView={isView}
                                    onChange={(value) =>
                                        updateField(
                                            "primaryLanguage",
                                            value
                                        )
                                    }
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <InputTextField
                                    label="Year of Experience"
                                    placeholder="Enter year of experience"
                                    value={data.experience}
                                    required
                                    isView={isView}
                                    onChange={(value) =>
                                        updateField(
                                            "experience",
                                            value
                                        )
                                    }
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <AutocompleteField
                                    label="Current Employment Status"
                                    value={data.employmentStatus}
                                    options={[]}
                                    placeholder="Select"
                                    readOnly={isView}
                                    // disabled={isView}
                                    isView={isView}
                                    onChange={(value) =>
                                        updateField(
                                            "employmentStatus",
                                            value
                                        )
                                    }
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <CustomSwitch
                                    sxProps={{
                                        flexDirection: "column-reverse",
                                        alignItems: "baseline",
                                    }}
                                    label="Available for New Clients"
                                    checked={data.availableForNewClients}
                                    disabled={isView}
                                    onChange={(checked) =>
                                        updateField(
                                            "availableForNewClients",
                                            checked
                                        )
                                    }
                                />
                            </Grid>

                        </Grid>
                    </SectionCard>
                </Grid>
            </Box>
            <Box
                sx={{
                    flexShrink: 0,
                    display: "flex",
                    justifyContent: "space-between",
                    borderTop: "1px solid #E2E8F0",
                    pt: 2,
                    mt: 1,
                    bgcolor: "#fff",
                }}
            >
                <Button
                    sx={{
                        ...WorkerStyles.nextCta,
                        bgcolor: "transparent !important",
                        color: "#222124",
                        fontWeight: 500,
                        border: "1px solid #E2E8F0",
                    }}
                    onClick={() => navigate(-1)}
                >
                    Back
                </Button>

                <Button
                    sx={WorkerStyles.nextCta}
                    endIcon={
                        <ArrowForwardOutlined
                            sx={{
                                fontSize: "12px",
                            }}
                        />
                    }
                    onClick={handleNext}
                // disabled={isView}
                >
                    Next
                </Button>
            </Box>
        </Box>
    );
};

export default PersonalInformation;