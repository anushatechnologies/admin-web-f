import { useEffect } from 'react';
import { useDocumentTitle } from '@hooks/index';
import { useDispatch } from 'react-redux';
import { setPageName } from '@app/app-slices/appSlice';

interface PageMeta {
  name?: string;
  title?: string;
  middleware?: string[];
  layout?: string;
}

/**
 * Custom hook to define page metadata (like Nuxt's definePageMeta).
 * Handles document title and supports middleware/layout flags.
 */
const usePageMeta = (meta: PageMeta) => {
  const dispatch = useDispatch();
  const { name, title, middleware, layout } = meta;

  // 1️⃣ Set page title
  useDocumentTitle(title ?? 'LMS');

  useEffect(() => {
    if (name) {
      dispatch(setPageName(name));
    }
  }, [name, dispatch]);

  // 2️⃣ Store page name in a <meta> tag for global access
  useEffect(() => {
    let metaTag = document.querySelector('meta[name="page-name"]');

    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.setAttribute('name', 'page-name');
      document.head.appendChild(metaTag);
    }

    metaTag.setAttribute('content', name ?? '');
  }, [name]);

  // 3️⃣ Optional: debugging
  useEffect(() => {
    console.log('PageMeta', { name, middleware, layout });
  }, [name, middleware, layout]);

  return { name, title, middleware, layout };
};

export default usePageMeta;

/**
 * Get metadata from the document (global access)
 */
export const getMetaData = () => {
  const title = document.title || 'LMS';
  const name = document.querySelector('meta[name="page-name"]')?.getAttribute('content') || '';

  return { name, title };
};
