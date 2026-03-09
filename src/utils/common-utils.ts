export const parseCrfBranches = (data: any) => {
  return data?.data[0]?.crf_branches.data || [];
};
// It extracts CRF branches from a nested API response.
// If anything is missing → it returns an empty array instead of crashing.

export const cleanedFilters = (filters: any) => {
  return Object.fromEntries(
    Object.entries(filters).filter(
      ([_, value]) => value !== '' && value !== null && value !== undefined,
    ), // It removes all empty values from filters
  );
};
