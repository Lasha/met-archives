export const constructQueryString = (
  searchTerm,
  isOnView,
  hasImages,
  departmentId
) => {
  let params = new URLSearchParams();
  if (searchTerm) params.append('q', searchTerm);
  if (isOnView) params.append('isOnView', isOnView);
  if (hasImages) params.append('hasImages', hasImages);
  if (departmentId) params.append('departmentId', departmentId);

  return params.toString();
};

export const fetchDepartments = async () => {
  const storageKey = 'departments';
  const storedDepartments = localStorage.getItem(storageKey);

  if (storedDepartments) {
    return JSON.parse(storedDepartments);
  }

  const response = await fetch(
    'https://collectionapi.metmuseum.org/public/collection/v1/departments'
  );
  const data = await response.json();

  localStorage.setItem(storageKey, JSON.stringify(data));

  return data;
};

export const parseQueryString = () => {
  const urlParams = new URLSearchParams(window.location.search);
  let params = {};

  for (const [key, value] of urlParams.entries()) {
    params[key] = value;
  }

  return params;
};

export const clearAllLocalStorageCache = async () => {
  debugger;
  return await localStorage.clear();
};
