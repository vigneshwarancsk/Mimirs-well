import Contentstack, { Region } from "@contentstack/delivery-sdk";

// Map region string to Region enum
const getRegion = (): Region => {
  const region = process.env.NEXT_PUBLIC_CONTENTSTACK_REGION || "US";
  const regionMap: Record<string, Region> = {
    US: Region.US,
    EU: Region.EU,
    AZURE_NA: Region.AZURE_NA,
    AZURE_EU: Region.AZURE_EU,
    GCP_NA: Region.GCP_NA,
  };
  return regionMap[region] || Region.US;
};

// Initialize Contentstack client
const stack = Contentstack.stack({
  apiKey: process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY || "",
  deliveryToken: process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN || "",
  environment:
    process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT || "development",
  region: getRegion(),
});

export default stack;
