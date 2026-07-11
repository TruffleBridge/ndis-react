export const getHeader = (activeStep: string) => {
    switch (activeStep) {
        case "basic":
            return 'Personal Information';
        case "support":
            return 'Support Services';
        case "qual":
            return 'Qualification & Credentials';
        case "compliance":
            return 'Compliance and Verifications';
        default:
            return null;
    }
}
export const getSubHeader = (activeStep: string) => {
    switch (activeStep) {
        case "basic":
        case "support":
        case "qual":
        case "compliance":
            return 'Just the basics - take about 30 seconds to set up a secure identity';
        default:
            return null;
    }
}