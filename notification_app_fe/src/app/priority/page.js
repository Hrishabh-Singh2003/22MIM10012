'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, 
  Typography, 
  CircularProgress,
  Alert,
  Paper,
  Slider,
  Divider
} from '@mui/material';
import { fetchNotifications } from '@/services/api';
import { getTopNotifications } from '@/utils/priority';
import NotificationCard from '@/components/NotificationCard';
import { Star as StarIcon } from '@mui/icons-material';

export default function PriorityPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [topN, setTopN] = useState(10);
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
      // Fetch a larger batch to find the top priority ones
      const data = await fetchNotifications({ limit: 50, page: 1 });
      
      // Filter for unread notifications for priority logic (optional, but makes sense for "Inbox")
      // However, the requirement says "distinguish between new and viewed", 
      // so I'll show top N regardless of status but clearly marked.
      const top = getTopNotifications(data, topN);
      setNotifications(top);
    } catch (err) {
      setError('Failed to fetch priority notifications.');
    } finally {
      setLoading(false);
    }
  }, [topN]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleMarkAsRead = (id) => {
    const newViewed = new Set(viewedIds);
    newViewed.add(id);
    setViewedIds(newViewed);
    localStorage.setItem('viewedNotifications', JSON.stringify(Array.from(newViewed)));
  };

  const handleSliderChange = (event, newValue) => {
    setTopN(newValue);
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 3 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <StarIcon sx={{ color: '#fbbf24' }} />
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Priority Inbox
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Your top most important notifications ranked by weight and recency.
          </Typography>
        </Box>

        <Paper sx={{ p: 3, backgroundColor: 'background.paper', border: '1px solid #252a40', minWidth: 250 }}>
          <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 2 }}>
            TOP "N" NOTIFICATIONS: {topN}
          </Typography>
          <Slider
            value={topN}
            onChange={handleSliderChange}
            min={5}
            max={20}
            step={1}
            marks
            valueLabelDisplay="auto"
            sx={{ color: '#6c63ff' }}
          />
        </Paper>
      </Box>

      <Paper sx={{ p: 2, mb: 4, backgroundColor: 'rgba(108, 99, 255, 0.05)', border: '1px dashed #6c63ff' }}>
        <Typography variant="caption" sx={{ color: '#6c63ff', fontWeight: 600 }}>
          LOGIC: Placement (Weight 3) &gt; Result (Weight 2) &gt; Event (Weight 1) + Recency
        </Typography>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <Box>
          {notifications.map((n, index) => (
            <Box key={n.ID} sx={{ position: 'relative' }}>
              <Box sx={{ 
                position: 'absolute', 
                left: -35, 
                top: 20, 
                display: { xs: 'none', md: 'block' },
                color: index < 3 ? '#fbbf24' : 'text.secondary',
                fontWeight: 700,
                fontSize: '1.2rem'
              }}>
                #{index + 1}
              </Box>
              <NotificationCard 
                notification={n} 
                isViewed={viewedIds.has(n.ID)}
                onMarkAsRead={() => handleMarkAsRead(n.ID)}
              />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
