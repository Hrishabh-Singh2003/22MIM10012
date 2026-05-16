const BASE_URL = '/api/local-notifications';

export const fetchNotifications = async (params = {}) => {
  const { limit = 10, page = 1, notification_type = '' } = params;
  
  const url = new URL(BASE_URL, window.location.origin);
  if (limit) url.searchParams.append('limit', limit);
  if (page) url.searchParams.append('page', page);
  if (notification_type && notification_type !== 'All') {
    url.searchParams.append('notification_type', notification_type);
  }

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.notifications || [];
  } catch (error) {
    console.error('Failed to fetch notifications via local API:', error);
    throw error;
  }
};
