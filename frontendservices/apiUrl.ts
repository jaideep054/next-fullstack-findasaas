// const BASE_URL = "https://findyoursaas.vercel.app/api";
const BASE_URL = "http://localhost:3001/api"; 

// const BASE_URL = typeof window !== 'undefined' ? `${window.location.origin}/api` : '';


export const getGoogleLoginURL = (): string => `${BASE_URL}/auth/google`; //done
export const fetchUserURL = (): string => `${BASE_URL}/auth/me`; // done
export const logoutURL = (): string => `${BASE_URL}/auth/logout`; // done

export const listToolURL = (): string => `${BASE_URL}/list-tool`;
export const getApprovedToolsURL = (): string => `${BASE_URL}/tools/all-approved-tools`; // done
export const getToolInformationURL = (id: string): string => `${BASE_URL}/tools/${id}`; // done
export const getAllToolsURL = (): string => `${BASE_URL}/all-tools`;
export const approveToolURL = (): string => `${BASE_URL}/approve-tool`;
export const getToolByUserIdURL = (userId: string): string => `${BASE_URL}/toolbyuserid/${userId}`; //done
export const updateToolURL = (toolId: string): string => `${BASE_URL}/tool/edit/${toolId}`;
export const rejectToolURL = (): string => `${BASE_URL}/tool/reject`;
export const deleteToolURL = (toolId: string): string => `${BASE_URL}/tool/${toolId}`;


export const createReviewURL = (): string => `${BASE_URL}/create-review`; // done
export const getReviewsURL = (toolId: string): string => `${BASE_URL}/get-reviews/${toolId}`;// done
export const getProductRatingURL = (toolId: string): string => `${BASE_URL}/get-product-rating/${toolId}`;//done
export const markHelpfulURL = (reviewId: string): string => `${BASE_URL}/mark-helpful/${reviewId}`; //done
export const searchToolsSemanticURL = (query: string): string =>
  `${BASE_URL}/tools/search/semantic?q=${encodeURIComponent(query)}`;// done

export const trackAnalyticsURL = (): string => `${BASE_URL}/analytics/track`; // done
export const getToolAnalyticsURL = (toolId: string, filter: string): string =>
  `${BASE_URL}/analytics/tool?toolId=${toolId}&filter=${filter}`; // done

export const generateBadgeURL = (toolId: string, mode: string): string =>
  `${BASE_URL}/generate-badge/${toolId}?mode=${mode}`; //done

export const getCreateOrderURL = (): string => `${BASE_URL}/payment/create-order`;
export const getVerifyPaymentURL = (): string => `${BASE_URL}/payment/verify-payment`;

export const getSubscribeNewsletterURL = (): string => `${BASE_URL}/newsletter/subscribe`; //done
export const getUnsubscribeURL = (): string => `${BASE_URL}/newsletter/unsubscribe`; //done
