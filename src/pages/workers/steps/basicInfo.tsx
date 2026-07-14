import { Box, Button, Grid } from "@mui/material";
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
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { useWorkerStore } from "../../../store/useWorker";
import type { Option } from "../../../types/worker";
import { useUploadStore } from "../../../store/useUpload";
import { getViewFunction } from "../../../utils/viewfunction";
import { onlyNumbers } from "../../../utils/helper";
import { useEffect } from "react";
import { useLookupStore } from "../../../store/useMasterAPI";

const genderOptions = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Non-binary", value: "non-binary" },
    { label: "Prefer not to say", value: "na" },
];

interface PersonalProps {
    isView?: boolean;
    handleNext?: () => void;
}

/**
 * Fully store-driven: values come from useWorkerStore, edits go through
 * setPersonalField, `isView` disables every field. Create / Edit / View all
 * reuse this same component - the store already has the right data loaded
 * for whichever mode WorkerPage booted into.
 */
const PersonalInformation = ({ isView, handleNext }: PersonalProps) => {
    const navigate = useNavigate();

    const data = useWorkerStore((s) => s.personalInfo);
    const setField = useWorkerStore((s) => s.setPersonalField);
    const errors = useWorkerStore((s) => s.errors.personal);
    const goToNextStep = useWorkerStore((s) => s.goToNextStep);
    const uploadDocument = useUploadStore((s) => s.uploadDocument);
    const idProofUploadError = useUploadStore((s) => s.uploadErrors.idProofFile);

    // const languages = useLookupStore((s) => s.languages);
    const fetchLanguages = useLookupStore((s) => s.fetchLanguages);
    const getLanguageOptions = useLookupStore((s) => s.getLanguageOptions);

    const onNext = () => {
        if (isView) {
            handleNext?.();
            return;
        }
        const valid = goToNextStep("basic");
        if (valid) handleNext?.();
    };


    const handleUpload = async (file: any) => {
        const files = file?.file
        if (!files) {
            setField("idProof", null);
            return;
        }
        // Actually uploads to /api/uploads/, stamps documentType
        const uploaded = await uploadDocument(files, 'Upload ID Proof', "idProof");
        if (uploaded) setField("idProof", {
            ...file,
            url: uploaded?.url,
            uploadedAt: uploaded?.uploadedAt
        });
    }
    const preferences = [
        {
            label: "Pet Friendly",
            key: "petFriendly",
            value: data.preferences.includes("petFriendly")
        },

        {
            label: "Non Smoker",
            key: "nonSmoker",
            value: data.preferences.includes("nonSmoker")
        },

        {
            label: "Own Vehicle",
            key: "ownVehicle",
            value: data.preferences.includes("ownVehicle")
        },

        {
            label: "Emergency Shift",
            key: "emergencyShift",
            value: data.preferences.includes("emergencyShift")
        },
    ];

    useEffect(() => {
        if (!isView) { fetchLanguages(); }
    }, []);

    return (
        <Box sx={WorkerStyles.mainHeightRes}>
            <Box sx={WorkerStyles.subHeightRes}>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 4 }}>
                        {isView ? getViewFunction('First Name', data?.firstName, 'plain') :
                            <InputTextField
                                label="First Name"
                                value={data?.firstName}
                                placeholder="e.g. Jane Cooper"
                                errors={errors.firstName}
                                onChange={(value) => setField("firstName", value)}
                            />}
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        {isView ? getViewFunction('Last Name', data?.lastName, 'plain') :
                            <InputTextField
                                label="Last Name"
                                value={data.lastName}
                                placeholder="e.g. Jane Cooper"
                                errors={errors.lastName}
                                onChange={(value) => setField("lastName", value)}
                            />}
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }} sx={WorkerStyles.dateFieldGrid}>
                        {isView ? getViewFunction('Date of Birth', dayjs(data?.dateOfBirth).format('DD-MM-YYYY'), 'plain') :
                            <DateField
                                label="Date of Birth"
                                value={data.dateOfBirth ? dayjs(data.dateOfBirth) : null}
                                minDate={dayjs("1900-01-01")}
                                maxDate={dayjs(new Date())}
                                referenceDate={dayjs("1900-01-01")}
                                openToYear="year"
                                error={errors.dateOfBirth}
                                onChange={(value) => setField("dateOfBirth", value ? value.format("YYYY-MM-DD") : null)}
                            />}
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        {isView ? getViewFunction('Mobile Number', data?.mobile, 'plain') :
                            <InputTextField
                                label="Mobile Number"
                                placeholder="+61 400 000 000"
                                value={data.mobile}
                                errors={errors.mobile}
                                onChange={(value) => setField("mobile", onlyNumbers(value))}
                            />}
                    </Grid>

                    <Grid size={{ xs: 12, md: 8 }}>
                        {isView ? getViewFunction('Email Address', data?.email, 'plain') :
                            <InputTextField
                                label="Email Address"
                                value={data.email}
                                placeholder="jane@gmail.com"
                                errors={errors.email}
                                onChange={(value) => setField("email", value)}
                            />}
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        {isView ? getViewFunction('Location / Address', data?.address, 'plain') :
                            <InputTextField
                                label="Location / Address"
                                placeholder="Enter location / address"
                                value={data.address}
                                errors={errors.address}
                                onChange={(value) => setField("address", value)}
                            />}
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        {isView ? getViewFunction('Suburb', data?.suburb, 'plain') :
                            <InputTextField
                                label="Suburb"
                                placeholder="Enter suburb"
                                required
                                value={data.suburb}
                                errors={errors.suburb}
                                onChange={(value) => setField("suburb", value)}
                            />}
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        {isView ? getViewFunction('State', data?.state, 'plain') :
                            <InputTextField
                                label="State"
                                placeholder="Enter state"
                                value={data.state}
                                onChange={(value) => setField("state", value)}
                            />}
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        {isView ? getViewFunction('Postal Code', data?.postalCode, 'plain') :
                            <InputTextField
                                label="Postal Code"
                                placeholder="Enter postal code"
                                value={data.postalCode}
                                onChange={(value) => setField("postalCode", onlyNumbers(value))}
                            />}
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <ToggleGroup
                            label="Gender"
                            value={data.gender}
                            options={genderOptions}
                            disabled={isView}
                            onChange={(value) => setField("gender", value)}
                            errors={errors.gender}
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <UploadVariant1
                            label="Upload ID Proof"
                            value={data.idProof}
                            // loading={isUploadingIdProof}
                            onChange={(file) => handleUpload(file)}
                            disabled={isView}
                            errors={idProofUploadError || errors.idProof}
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }} sx={{ mb: 1 }}>
                        <CustomSwitch
                            label="Profile Preferences"
                            multiple
                            items={preferences}
                            disabled={isView}
                            onItemsChange={(items) => {
                                const selected = items?.filter(item => item.value)?.map(item => item.key);
                                setField("preferences", selected);
                            }}
                        />
                    </Grid>

                    <SectionCard title="General">
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                {isView ? getViewFunction('Primary Language', data?.primaryLanguage?.label, 'plain') :
                                    <AutocompleteField
                                        label="Primary Language"
                                        value={data?.primaryLanguage}
                                        options={getLanguageOptions()}
                                        placeholder="Select"
                                        required
                                        error={errors.primaryLanguage}
                                        onChange={(value) => setField("primaryLanguage", value as Option)}
                                    // onLoadMore={() => fetchLanguages()}
                                    // hasMore={languages.hasMore}
                                    // loadingMore={languages.loading}
                                    />}
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                {isView ? getViewFunction('Year of Experience', data?.experience, 'plain') :
                                    <InputTextField
                                        label="Year of Experience"
                                        placeholder="Enter year of experience"
                                        value={data?.experience}
                                        required
                                        errors={errors.experience}
                                        onChange={(value) => setField("experience", onlyNumbers(value))}
                                    />}
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6, md: 3.5 }}>
                                {isView ? getViewFunction('Current Employment Status', data?.employmentStatus?.label, 'plain') :
                                    <AutocompleteField
                                        label="Current Employment Status"
                                        value={data?.employmentStatus}
                                        options={[
                                            {
                                                label: 'Yes',
                                                value: 'yes'
                                            },
                                            {
                                                label: 'No',
                                                value: 'no'
                                            }
                                        ]}
                                        placeholder="Select"
                                        onChange={(value) => setField("employmentStatus", value as Option)}
                                    />}
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6, md: 2.5 }}>
                                <CustomSwitch
                                    sxProps={{ flexDirection: "column-reverse", alignItems: "baseline" }}
                                    label="Available for New Clients"
                                    checked={data.availableForNewClients}
                                    disabled={isView}
                                    onChange={(checked) => setField("availableForNewClients", checked)}
                                />
                            </Grid>
                        </Grid>
                    </SectionCard>
                </Grid>
            </Box>

            <Box sx={WorkerStyles.bottomFixed}>
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

                <Button sx={WorkerStyles.nextCta} endIcon={<ArrowForwardOutlined sx={{ fontSize: "12px" }} />} onClick={onNext}>
                    Next
                </Button>
            </Box>
        </Box>
    );
};

export default PersonalInformation;