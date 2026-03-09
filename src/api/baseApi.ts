import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { logoutUser } from '@features/auth/authSlice';


// -------------------- BASE QUERY WRAPPER (PROTECTED ENDPOINTS) --------------------
const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  const rawBaseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL, // ✅ Uses your .env
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      // ✅ FIXED: Use localStorage instead of Cookies
      const token = localStorage.getItem('token') || '';
      headers.set('Authorization', `Bearer ${token}`);
      headers.set('sessionid', localStorage.getItem('sessionid') || '');
      return headers;
    },
  });

  const result = await rawBaseQuery(args, api, extraOptions);

  // ✅ Handle 401/403 - Auto logout
  if (result?.error?.status === 403 || result?.error?.status === 401) {
    console.log("🚨 401/403 detected — Auto logging out");
    
    // Clear everything
    localStorage.removeItem('token');
    localStorage.removeItem('sessionid');
    api.dispatch(logoutUser());
    
    // Redirect to login
    window.location.href = '/login';
  }

  return result;
};


// -------------------- PUBLIC API (No Auth Required) --------------------
export const baseApi = createApi({
  reducerPath: 'baseApiWithoutAuth',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['User'],
  endpoints: () => ({}),
});


// -------------------- PROTECTED API (With Auth Headers) --------------------
export const baseApiWithAuth = createApi({
  reducerPath: 'baseApiWithAuth',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Dashboard'],
  endpoints: () => ({}),
});
