'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Pagination, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  CircularProgress,
  Alert,
  Paper,
  Tabs,
  Tab
} from '@mui/material';
import { fetchNotifications } from '@/services/api';
import NotificationCard from '@/components/NotificationCard';

export default function Home() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [type, setType] = useState('All');
  const [viewedIds, setViewedIds] = useState(new Set());

  // Load viewed state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('viewedNotifications');
    if (saved) {
      try {
        setViewedIds(new Set(JSON.parse(saved)));
      } catch (e) {
        console.error('Failed to parse viewed notifications', e);
      }
    }
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchNotifications({ 
        limit, 
        page, 
        notification_type: type === 'All' ? '' : type 
      });
      setNotifications(data);
    } catch (err) {
      setError('Failed to fetch notifications. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [limit, page, type]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleMarkAsRead = (id) => {
    const newViewed = new Set(viewedIds);
    newViewed.add(id);
    setViewedIds(newViewed);
    localStorage.setItem('viewedNotifications', JSON.stringify(Array.from(newViewed)));
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTypeChange = (event) => {
    setType(event.target.value);
    setPage(1); // Reset to first page when filter changes
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            All Notifications
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Stay updated with the latest campus activities
          </Typography>
        </Box>

        <Paper sx={{ p: 1, backgroundColor: 'background.paper', border: '1px solid #252a40' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="caption" sx={{ ml: 1, fontWeight: 600 }}>FILTER BY TYPE:</Typography>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <Select
                value={type}
                onChange={handleTypeChange}
                sx={{ borderRadius: '8px' }}
              >
                <MenuItem value="All">All Types</MenuItem>
                <MenuItem value="Placement">Placement</MenuItem>
                <MenuItem value="Result">Result</MenuItem>
                <MenuItem value="Event">Event</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Paper>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <>
          {notifications.length === 0 ? (
            <Box sx={{ textAlign: 'center', p: 10 }}>
              <Typography variant="h6" color="text.secondary">No notifications found.</Typography>
            </Box>
          ) : (
            <Box>
              {notifications.map((n) => (
                <NotificationCard 
                  key={n.ID} 
                  notification={n} 
                  isViewed={viewedIds.has(n.ID)}
                  onMarkAsRead={() => handleMarkAsRead(n.ID)}
                />
              ))}

              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                <Pagination 
                  count={10} // Assuming 10 pages for demo purposes as API doesn't return total count
                  page={page} 
                  onChange={handlePageChange} 
                  color="primary"
                />
              </Box>
            </Box>
          )}
        </>
      )}
    </Box>
  );
}
