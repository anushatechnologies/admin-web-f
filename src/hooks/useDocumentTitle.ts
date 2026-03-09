// useDocumentTitle.ts
import { useEffect } from 'react';

/**
 * Custom hook to update the page title.
 * @param title - The title you want to set for the page.
 * @param prefix - Optional prefix (e.g., app name).
 */
const useDocumentTitle = (title: string, prefix?: string) => {
  useEffect(() => {
    const prevTitle = document.title; // this is helps restore the title later
    document.title = prefix ? `${prefix} | ${title}` : title;

    // Optional cleanup: restore previous title when component unmounts
    return () => {
      document.title = prevTitle;
    };
  }, [title, prefix]);
};

export default useDocumentTitle;
