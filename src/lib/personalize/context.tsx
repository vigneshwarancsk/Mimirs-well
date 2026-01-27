"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from "react";
import Personalize from "@contentstack/personalize-edge-sdk";

interface PersonalizeContextType {
  isInitialized: boolean;
  variantParam: string | null;
  initialize: (
    userId: string,
    attributes: Record<string, string | number | boolean>
  ) => Promise<void>;
  triggerEvent: (eventKey: string) => void;
  triggerImpression: (experienceShortUid: string) => void;
  getVariantAlias: (experienceShortUid: string) => string | undefined;
  getExperiences: () => Array<{ shortUid: string; activeVariantShortUid: string | null }>;
}

const PersonalizeContext = createContext<PersonalizeContextType>({
  isInitialized: false,
  variantParam: null,
  initialize: async () => {},
  triggerEvent: () => {},
  triggerImpression: () => {},
  getVariantAlias: () => undefined,
  getExperiences: () => [],
});

// Type for the resolved SDK instance
type PersonalizeSdk = Awaited<ReturnType<typeof Personalize.init>>;

export function PersonalizeProvider({
  children,
  projectUid,
}: {
  children: React.ReactNode;
  projectUid?: string;
}) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [variantParam, setVariantParam] = useState<string | null>(null);
  const [sdkInstance, setSdkInstance] = useState<PersonalizeSdk | null>(null);
  
  // Prevent re-initialization across page navigations
  const initializingRef = useRef(false);
  const initializedUserRef = useRef<string | null>(null);

  // Initialize SDK with userId and liveAttributes
  // liveAttributes are sent directly to the decision engine during manifest fetch
  // for real-time variant evaluation without needing to wait for sync
  const initialize = useCallback(
    async (
      userId: string,
      attributes: Record<string, string | number | boolean>
    ) => {
      // Skip if already initialized for this user or currently initializing
      if (initializingRef.current) {
        console.log("[Personalize] Already initializing, skipping...");
        return;
      }
      
      if (initializedUserRef.current === userId && isInitialized) {
        console.log("[Personalize] Already initialized for user, using cached state");
        return;
      }

      const uid = projectUid || process.env.NEXT_PUBLIC_PERSONALIZE_PROJECT_UID;

      if (!uid) {
        console.warn(
          "Personalize: No project UID provided. Set NEXT_PUBLIC_PERSONALIZE_PROJECT_UID"
        );
        setIsInitialized(true);
        return;
      }

      initializingRef.current = true;

      try {
        // Set edge API URL if provided
        if (process.env.NEXT_PUBLIC_PERSONALIZE_EDGE_API_URL) {
          Personalize.setEdgeApiUrl(
            process.env.NEXT_PUBLIC_PERSONALIZE_EDGE_API_URL
          );
        }

        console.log("[Personalize] Initializing SDK");
        console.log("[Personalize] Project UID:", uid);
        console.log("[Personalize] User ID:", userId);
        console.log("[Personalize] Live Attributes:", attributes);
        
        // Initialize with userId and liveAttributes
        // liveAttributes are passed to the Edge API during manifest fetch
        // allowing the decision engine to evaluate variants in real-time
        const sdk = await Personalize.init(uid, {
          userId,
          liveAttributes: attributes,
        });
        
        setSdkInstance(sdk);

        // Get variant aliases after initialization
        // getVariantAliases() returns the proper format for CMS API: ['cs_personalize_0_1']
        const aliases = sdk.getVariantAliases() as string[];
        const aliasParam = aliases && aliases.length > 0 ? aliases.join(",") : null;
        
        setVariantParam(aliasParam);
        setIsInitialized(true);
        initializedUserRef.current = userId;

        // Log experiences and variants for debugging
        const experiences = sdk.getExperiences();
        
        console.log("[Personalize] ✅ SDK initialized");
        console.log("[Personalize] Experiences:", JSON.stringify(experiences, null, 2));
        console.log("[Personalize] Variant aliases:", aliases);
        console.log("[Personalize] Variant param for CMS:", aliasParam);
        
        // Check if we got a variant
        if (experiences.length > 0 && experiences[0].activeVariantShortUid) {
          console.log("[Personalize] 🎯 Active variant:", experiences[0].activeVariantShortUid);
        } else {
          console.log("[Personalize] ⚠️ No active variant - using base entry");
        }

        // Also persist attributes for future sessions
        sdk.set(attributes);
      } catch (error) {
        console.error("[Personalize] ❌ Failed to initialize SDK:", error);
        setIsInitialized(true);
      } finally {
        initializingRef.current = false;
      }
    },
    [projectUid, isInitialized]
  );

  const triggerEvent = useCallback(
    (eventKey: string) => {
      if (sdkInstance) {
        try {
          sdkInstance.triggerEvent(eventKey);
        } catch (error) {
          console.error("[Personalize] Failed to trigger event:", error);
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
          console.error("[Personalize] Failed to trigger impression:", error);
        }
      }
    },
    [sdkInstance]
  );

  const getVariantAlias = useCallback(
    (experienceShortUid: string): string | undefined => {
      if (sdkInstance) {
        try {
          const aliases = sdkInstance.getVariantAliases() as unknown as Record<
            string,
            string
          >;
          return aliases[experienceShortUid];
        } catch (error) {
          console.error("[Personalize] Failed to get variant alias:", error);
        }
      }
      return undefined;
    },
    [sdkInstance]
  );

  const getExperiences = useCallback((): Array<{
    shortUid: string;
    activeVariantShortUid: string | null;
  }> => {
    if (sdkInstance) {
      try {
        return sdkInstance.getExperiences() as Array<{
          shortUid: string;
          activeVariantShortUid: string | null;
        }>;
      } catch (error) {
        console.error("[Personalize] Failed to get experiences:", error);
      }
    }
    return [];
  }, [sdkInstance]);

  return (
    <PersonalizeContext.Provider
      value={{
        isInitialized,
        variantParam,
        initialize,
        triggerEvent,
        triggerImpression,
        getVariantAlias,
        getExperiences,
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
