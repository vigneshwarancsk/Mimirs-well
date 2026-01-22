"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import Personalize from "@contentstack/personalize-edge-sdk";

interface PersonalizeContextType {
  isInitialized: boolean;
  variantParam: string | null;
  setUserAttributes: (attrs: Record<string, string | number | boolean>) => void;
  triggerEvent: (eventKey: string) => void;
  triggerImpression: (experienceShortUid: string) => void;
  getVariantAlias: (experienceShortUid: string) => string | undefined;
}

const PersonalizeContext = createContext<PersonalizeContextType>({
  isInitialized: false,
  variantParam: null,
  setUserAttributes: () => {},
  triggerEvent: () => {},
  triggerImpression: () => {},
  getVariantAlias: () => undefined,
});

export function PersonalizeProvider({
  children,
  projectUid,
}: {
  children: React.ReactNode;
  projectUid?: string;
}) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [variantParam, setVariantParam] = useState<string | null>(null);
  const [sdkInstance, setSdkInstance] = useState<ReturnType<
    typeof Personalize.init
  > | null>(null);

  useEffect(() => {
    async function initPersonalize() {
      const uid =
        projectUid || process.env.NEXT_PUBLIC_PERSONALIZE_PROJECT_UID;

      if (!uid) {
        console.warn(
          "Personalize: No project UID provided. Set NEXT_PUBLIC_PERSONALIZE_PROJECT_UID"
        );
        setIsInitialized(true); // Mark as initialized but without SDK
        return;
      }

      try {
        // Set edge API URL if provided
        if (process.env.NEXT_PUBLIC_PERSONALIZE_EDGE_API_URL) {
          Personalize.setEdgeApiUrl(
            process.env.NEXT_PUBLIC_PERSONALIZE_EDGE_API_URL
          );
        }

        // Initialize the SDK
        const sdk = await Personalize.init(uid);
        setSdkInstance(sdk as ReturnType<typeof Personalize.init>);
        setVariantParam(sdk.getVariantParam());
        setIsInitialized(true);

        console.log("Personalize SDK initialized successfully");
      } catch (error) {
        console.error("Failed to initialize Personalize SDK:", error);
        setIsInitialized(true); // Mark as initialized to prevent blocking
      }
    }

    initPersonalize();
  }, [projectUid]);

  const setUserAttributes = useCallback(
    (attrs: Record<string, string | number | boolean>) => {
      if (sdkInstance) {
        try {
          sdkInstance.set(attrs);
          // Update variant param after setting attributes
          setVariantParam(sdkInstance.getVariantParam());
        } catch (error) {
          console.error("Failed to set user attributes:", error);
        }
      }
    },
    [sdkInstance]
  );

  const triggerEvent = useCallback(
    (eventKey: string) => {
      if (sdkInstance) {
        try {
          sdkInstance.triggerEvent(eventKey);
        } catch (error) {
          console.error("Failed to trigger event:", error);
        }
      }
    },
    [sdkInstance]
  );

  const triggerImpression = useCallback(
    (experienceShortUid: string) => {
      if (sdkInstance) {
        try {
          sdkInstance.triggerImpression(experienceShortUid);
        } catch (error) {
          console.error("Failed to trigger impression:", error);
        }
      }
    },
    [sdkInstance]
  );

  const getVariantAlias = useCallback(
    (experienceShortUid: string): string | undefined => {
      if (sdkInstance) {
        try {
          const aliases = sdkInstance.getVariantAliases();
          return aliases[experienceShortUid];
        } catch (error) {
          console.error("Failed to get variant alias:", error);
        }
      }
      return undefined;
    },
    [sdkInstance]
  );

  return (
    <PersonalizeContext.Provider
      value={{
        isInitialized,
        variantParam,
        setUserAttributes,
        triggerEvent,
        triggerImpression,
        getVariantAlias,
      }}
    >
      {children}
    </PersonalizeContext.Provider>
  );
}

export function usePersonalize() {
  const context = useContext(PersonalizeContext);
  if (!context) {
    throw new Error("usePersonalize must be used within PersonalizeProvider");
  }
  return context;
}
