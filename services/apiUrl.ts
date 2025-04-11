// const BASE_URL = "https://findyoursaas.com/api";
const BASE_URL = "http://localhost:3000/api/"; 


export const getGoogleLoginURL = (): string => `${BASE_URL}/auth/google`;
export const fetchUserURL = (): string => `${BASE_URL}/auth/me`;
export const logoutURL = (): string => `${BASE_URL}/auth/logout`;

export const listToolURL = (): string => `${BASE_URL}/list-tool`;
export const getApprovedToolsURL = (): string => `${BASE_URL}/all-approved-tools`;
export const getToolInformationURL = (id: string): string => `${BASE_URL}/tool/${id}`;
export const getAllToolsURL = (): string => `${BASE_URL}/all-tools`;
export const approveToolURL = (): string => `${BASE_URL}/approve-tool`;
export const getToolByUserIdURL = (userId: string): string => `${BASE_URL}/toolbyuserid/${userId}`;
export const updateToolURL = (toolId: string): string => `${BASE_URL}/tool/edit/${toolId}`;
export const rejectToolURL = (): string => `${BASE_URL}/tool/reject`;
export const deleteToolURL = (toolId: string): string => `${BASE_URL}/tool/${toolId}`;


export const createReviewURL = (): string => `${BASE_URL}/create-review`;
export const getReviewsURL = (toolId: string): string => `${BASE_URL}/get-reviews/${toolId}`;
export const getProductRatingURL = (toolId: string): string => `${BASE_URL}/get-product-rating/${toolId}`;
export const markHelpfulURL = (reviewId: string): string => `${BASE_URL}/mark-helpful/${reviewId}`;


export const searchToolsURL = (query: string): string =>
  `${BASE_URL}/tools/search?q=${encodeURIComponent(query)}`;
export const searchToolsSemanticURL = (query: string): string =>
  `${BASE_URL}/tools/search/semantic?q=${encodeURIComponent(query)}`;

export const trackAnalyticsURL = (): string => `${BASE_URL}/analytics/track`;
export const getToolAnalyticsURL = (toolId: string, filter: string): string =>
  `${BASE_URL}/analytics/tool?toolId=${toolId}&filter=${filter}`;

export const generateBadgeURL = (toolId: string, mode: string): string =>
  `${BASE_URL}/generate-badge/${toolId}?mode=${mode}`;

export const getCreateOrderURL = (): string => `${BASE_URL}/payment/create-order`;
export const getVerifyPaymentURL = (): string => `${BASE_URL}/payment/verify-payment`;

export const getSubscribeNewsletterURL = (): string => `${BASE_URL}/newsletter/subscribe`;
export const getUnsubscribeURL = (): string => `${BASE_URL}/newsletter/unsubscribe`;
