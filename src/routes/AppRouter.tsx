import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import WithAuthLayout from '@layouts/WithAuthLayout';
import WithoutAuthLayout from '@layouts/WithoutAuthLayout';
import RegisterPage from '@features/auth/pages/RegisterPage/RegisterPage';
import { Toaster } from 'react-hot-toast';
// Import catalog components directly (can also be lazy if preferred)
import CategoryList from '@features/category/components/pages/CategoryList';
import SubCategoryList from '@features/category/components/subcategories/SubCategoryList';
import ProductList from '@features/products/pages/ProductList';

// Lazy load all other pages
const DashboardPage = lazy(() => import('@features/dashboard/pages/dashboard'));
const LoginPage = lazy(() => import('@features/auth/pages/LoginPage/LoginPage'));
const ForgotPasswordPage = lazy(() => import('@features/auth/pages/ForgotPasswordPage/ForgotPasswordPage'));
const NotFoundPage = lazy(() => import('@pages/NotFoundPage'));
const PrivacyPolicy = lazy(() => import('@features/privacy_policy/pages/privacy_policy'));
const ReturnsRefunds = lazy(() => import('@features/returns_refunds/pages/returns_refunds'));
const TermsConditions = lazy(() => import('@features/terms_conditions/pages/terms_conditions'));
const Notification = lazy(() => import('@features/notifications/pages/notifications'));
const StoreType = lazy(() => import('@features/store_type/pages/Store_type'));
const Store = lazy(() => import('@features/store/pages/store'));
const Delevery = lazy(() => import('@features/delivery/pages/delevery'));
const DeleverySetup = lazy(() => import('@features/delevery_setup/pages/delevery_setup'));
const Discount = lazy(() => import('@features/discount/pages/discounts'));
const Settings = lazy(() => import('@features/settings/pages/settings'));
const Users = lazy(() => import('@features/users/pages/users'));
const Logs = lazy(() => import('@features/logs/pages/logs'));

const Loader: React.FC = () => (
  <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    Loading...
  </div>
);

const AppRouter: React.FC = () => {
  
  return (
    <>
   <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicRoute />}>
          <Route element={<WithoutAuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          </Route>
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<WithAuthLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/returns&refunds" element={<ReturnsRefunds />} />
            <Route path="/terms&conditions" element={<TermsConditions />} />
            <Route path="/notifications" element={<Notification />} />
            <Route path="/store-type" element={<StoreType />} />
            <Route path="/store" element={<Store />} />

                <Route path="/categories" element={<CategoryList />} />
          <Route path="/subcategories" element={<SubCategoryList />} />
          <Route path="/subcategories/:categoryId" element={<SubCategoryList />} />
          <Route path="/products" element={<ProductList />} />
            <Route path="/delivery" element={<Delevery />} />
            <Route path="/delivery_setup" element={<DeleverySetup />} />
            <Route path="/discount" element={<Discount />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/users" element={<Users />} />
            <Route path="/logs" element={<Logs />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
    </>
  );
};

export default AppRouter;