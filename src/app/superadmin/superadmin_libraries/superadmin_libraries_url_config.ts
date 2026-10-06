export const LIBRARIES_URL_CONFIG = {
  ENDPOINTS: {
    GET_LIBRARIES: '/superadmin/superadmin_libraries',
    UPDATE_LIBRARY: (id: string) => `/superadmin/superadmin_libraries/${id}`,
    UPDATE_STATUS: (id: string) => `/superadmin/superadmin_libraries/${id}/status`,
  },
};
