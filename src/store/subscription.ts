import { create } from "zustand";

import {
  getApiRequest,
  deleteApiRequest,
  createApiRequest,
  updateApiRequest,
} from "@/api/api";

import type {
  SubscriptionForm,
  SubscriptionFilters,
  SubscriptionItem,
} from "@/types/subscription";

import { handleApiError } from "@/utils/errorHandler";

interface SubscriptionStore {
  subscriptions: SubscriptionItem[];
  selectedSubscription: SubscriptionItem | null;

  loading: boolean;
  detailLoading: boolean;
  createLoading: boolean;
  updateLoading: boolean;
  deleteLoading: boolean;

  total: number;

  getSubscriptions: (
    payload: SubscriptionFilters
  ) => Promise<void>;

  getSubscriptionById: (
    id: number
  ) => Promise<SubscriptionItem | null>;

  createSubscription: (
    payload: SubscriptionForm
  ) => Promise<boolean>;

  updateSubscription: (
    payload: SubscriptionForm
  ) => Promise<boolean>;

  deleteSubscription: (
    id: number
  ) => Promise<boolean>;

  clearSelectedSubscription: () => void;
}

export const useSubscriptionStore =
  create<SubscriptionStore>((set) => ({
    subscriptions: [],
    selectedSubscription: null,

    loading: false,
    detailLoading: false,
    createLoading: false,
    updateLoading: false,
    deleteLoading: false,

    total: 0,

    // ============================================================
    // GET ALL
    // ============================================================

    getSubscriptions: async (payload) => {
      try {
        set({
          loading: true,
        });

        const response = await createApiRequest(
          "subscriptions/list",
          payload
        );

        const rows =
          response?.data?.data?.rows ??
          response?.data?.rows ??
          response?.data?.data ??
          [];

        const total =
          response?.data?.totalCount ??
          response?.data?.data?.totalCount ??
          rows.length;

        const normalizedRows: SubscriptionItem[] =
          rows.map((item: any) => ({
            ...item,

            subscriptionId:
              item?.subscriptionId ??
              item?.id,

            name: item?.name ?? "",
            type: item?.type ?? "",
            description: item?.description ?? "",

            monthlyPrice:
              Number(item?.monthlyPrice) || 0,

            annualPrice:
              Number(item?.annualPrice) || 0,

            maxWorkers:
              Number(item?.maxWorkers) || 0,

            isAiEnabled:
              Boolean(item?.isAiEnabled),

            isPopular:
              Boolean(item?.isPopular),

            isUrgentShift:
              Boolean(item?.isUrgentShift),

            isActive:
              Boolean(item?.isActive),

            featureFlags:
              item?.featureFlags ?? [],
          }));

        set({
          subscriptions: normalizedRows,
          total,
        });
      } catch (error) {
        console.error(
          "Failed to fetch subscriptions:",
          error
        );

        set({
          subscriptions: [],
          total: 0,
        });
      } finally {
        set({
          loading: false,
        });
      }
    },

    // ============================================================
    // GET BY ID
    // ============================================================

    getSubscriptionById: async (id) => {
      try {
        set({
          detailLoading: true,
          selectedSubscription: null,
        });

        const response = await getApiRequest(
          `subscriptions/${id}`
        );

        const data =
          response?.data?.data ??
          response?.data ??
          null;

        if (!data) {
          set({
            selectedSubscription: null,
          });

          return null;
        }

        const subscription: SubscriptionItem = {
          ...data,

          subscriptionId:
            data?.subscriptionId ??
            data?.id ??
            id,

          name: data?.name ?? "",
          type: data?.type ?? "",
          description: data?.description ?? "",

          monthlyPrice:
            Number(data?.monthlyPrice) || 0,

          annualPrice:
            Number(data?.annualPrice) || 0,

          maxWorkers:
            Number(data?.maxWorkers) || 0,

          isAiEnabled:
            Boolean(data?.isAiEnabled),

          isPopular:
            Boolean(data?.isPopular),

          isUrgentShift:
            Boolean(data?.isUrgentShift),

          isActive:
            Boolean(data?.isActive),

          featureFlags:
            data?.featureFlags ?? [],
        };

        set({
          selectedSubscription: subscription,
        });

        return subscription;
      } catch (error) {
        console.error(
          "Failed to fetch subscription:",
          error
        );

        set({
          selectedSubscription: null,
        });

        handleApiError(
          error,
          "Failed to fetch subscription"
        );

        return null;
      } finally {
        set({
          detailLoading: false,
        });
      }
    },

    // ============================================================
    // CREATE
    // ============================================================

    createSubscription: async (payload) => {
      try {
        set({
          createLoading: true,
        });

        await createApiRequest(
          "subscriptions/create",
          payload
        );

        return true;
      } catch (error) {
        handleApiError(
          error,
          "Failed to create subscription"
        );

        return false;
      } finally {
        set({
          createLoading: false,
        });
      }
    },

    // ============================================================
    // UPDATE
    // ============================================================

    updateSubscription: async (payload) => {
      try {
        set({
          updateLoading: true,
        });

        await updateApiRequest(
          "subscriptions/update",
          payload
        );

        return true;
      } catch (error) {
        handleApiError(
          error,
          "Failed to update subscription"
        );

        return false;
      } finally {
        set({
          updateLoading: false,
        });
      }
    },

    // ============================================================
    // DELETE
    // ============================================================

    deleteSubscription: async (id) => {
      try {
        set({
          deleteLoading: true,
        });

        await deleteApiRequest(
          "subscriptions",
          {
            subscriptionId: id,
          }
        );

        return true;
      } catch (error) {
        handleApiError(
          error,
          "Failed to delete subscription"
        );

        return false;
      } finally {
        set({
          deleteLoading: false,
        });
      }
    },

    // ============================================================
    // CLEAR
    // ============================================================

    clearSelectedSubscription: () => {
      set({
        selectedSubscription: null,
      });
    },
  }));