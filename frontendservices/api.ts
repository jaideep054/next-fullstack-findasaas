import axios, { AxiosResponse } from 'axios';
import {
  getGoogleLoginURL,
  fetchUserURL,
  logoutURL,
  listToolURL,
  getApprovedToolsURL,
  getToolInformationURL,
  getAllToolsURL,
  approveToolURL,
  getToolByUserIdURL,
  updateToolURL,
  createReviewURL,
  getReviewsURL,
  getProductRatingURL,
  markHelpfulURL,
  rejectToolURL,
  searchToolsSemanticURL,
  deleteToolURL,
  trackAnalyticsURL,
  getToolAnalyticsURL,
  generateBadgeURL,
  getSubscribeNewsletterURL,
  getUnsubscribeURL,
} from './apiUrl';

// Common types
interface ApiResponse<T> {
  data: T;
  [key: string]: any;
}

interface User {
  id: string;
  name: string;
  email: string;
  is_seller?: boolean;
}

interface Tool {
  id: string;
  name: string;
  [key: string]: any;
}

export const googleLogin = () => {
  window.location.href = getGoogleLoginURL();
};

export const fetchUser = async (): Promise<AxiosResponse<ApiResponse<User>>> => {
  const url = fetchUserURL();
  return axios.get(url, { withCredentials: true });
};

export const logout = async (): Promise<void> => {
  const url = logoutURL();
  await axios.post(url, {}, { withCredentials: true });
};

export const listTool = async (formData: FormData): Promise<Tool> => {
  const url = listToolURL();
  const { data } = await axios.post(url, formData, { withCredentials: true });
  return data;
};

export const getApprovedTools = async (): Promise<Tool[]> => {
  const url = getApprovedToolsURL();
  const { data } = await axios.get(url);
  return data.data;
};

export const getToolInformation = async (id: string): Promise<Tool> => {
  const url = getToolInformationURL(id);
  // console.log(url)
  const { data } = await axios.get(url);

  return data;
};

export const getAllTools = async (): Promise<Tool[]> => {
  const url = getAllToolsURL();
  const { data } = await axios.get(url, { withCredentials: true });
  return data.tools;
};

export const approveTool = async (id: string): Promise<any> => {
  const url = approveToolURL();
  const { data } = await axios.post(url, { toolId: id }, { withCredentials: true });
  return data;
};

export const getToolByUserId = async (userId: string): Promise<Tool> => {
  const url = getToolByUserIdURL(userId);
  const { data } = await axios.get(url, { withCredentials: true });
  return data.tool;
};

export const updateTool = async (toolId: string, toolData: FormData): Promise<any> => {
  const url = updateToolURL(toolId);
  const { data } = await axios.post(url, toolData, {
    withCredentials: true,
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const createReview = async (data: any): Promise<any> => {
  const url = createReviewURL();
  const response = await axios.post(url, data, { withCredentials: true });
  return response.data;
};

export const getReviews = async (toolId: string): Promise<any[]> => {
  const url = getReviewsURL(toolId);
  const { data } = await axios.get(url, { withCredentials: true });
  return data;
};

export const getProductRating = async (toolId: string): Promise<number> => {
  const url = getProductRatingURL(toolId);
  const { data } = await axios.get(url, { withCredentials: true });
  return data;
};

export const markReviewHelpful = async (reviewId: string): Promise<any> => {
  const url = markHelpfulURL(reviewId);
  const { data } = await axios.get(url, { withCredentials: true });
  return data;
};

export const rejectTool = async (data: any): Promise<any> => {
  const url = rejectToolURL();
  const response = await axios.post(url, data, { withCredentials: true });
  return response.data;
};

export const searchTool = async (query: string): Promise<Tool[]> => {
  const url = searchToolsSemanticURL(query);
  const { data } = await axios.get(url);
  return data.data;
};

export const deleteTool = async (toolId: string): Promise<any> => {
  const url = deleteToolURL(toolId);
  const { data } = await axios.delete(url);
  return data.data;
};

export const trackAnalytics = async (toolId: string, eventType: string): Promise<string> => {
  const url = trackAnalyticsURL();
  console.log(url)
  const { data } = await axios.post(url, { tool_id: toolId, event_type: eventType }, { withCredentials: true });
  return data.message;
};

export const getToolAnalytics = async (toolId: string, filter: string): Promise<any> => {
  const url = getToolAnalyticsURL(toolId, filter);
  const { data } = await axios.get(url, { withCredentials: true });
  return data;
};

export const generateBadge = async (toolId: string, mode: string): Promise<any> => {
  const url = generateBadgeURL(toolId, mode);
  const { data } = await axios.post(url, {}, { withCredentials: true });
  return data;
};

export const newsletterSubscribe = async (email: string): Promise<string> => {
  const url = getSubscribeNewsletterURL();
  const { data } = await axios.post(url, { email }, { withCredentials: true });
  return data.msg;
};

export const newsletterUnsubscribe = async (email: string): Promise<string> => {
  const url = getUnsubscribeURL();
  const { data } = await axios.post(url, {}, { withCredentials: true });
  return data.msg;
};
