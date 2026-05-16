'use client';

import React from 'react';
import { Card, CardContent, Typography, Box, Chip, IconButton } from '@mui/material';
import { 
  Work as PlacementIcon, 
  Assessment as ResultIcon, 
  Event as EventIcon,
  Circle as UnreadIcon,
  Done as ReadIcon
} from '@mui/icons-material';

const TYPE_COLORS = {
  Placement: '#22d3ee',
  Result: '#f59e0b',
  Event: '#34d399',
};

const TYPE_ICONS = {
  Placement: <PlacementIcon sx={{ color: TYPE_COLORS.Placement }} />,
  Result: <ResultIcon sx={{ color: TYPE_COLORS.Result }} />,
  Event: <EventIcon sx={{ color: TYPE_COLORS.Event }} />,
};

const NotificationCard = ({ notification, isViewed, onMarkAsRead }) => {
  const { ID, Type, Message, Timestamp } = notification;

  const date = new Date(Timestamp).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <Card 
      onClick={onMarkAsRead}
      sx={{ 
        mb: 2, 
        cursor: 'pointer',
        borderLeft: `5px solid ${TYPE_COLORS[Type]}`,
        backgroundColor: isViewed ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.1)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateX(5px)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        },
        position: 'relative',
        opacity: isViewed ? 0.8 : 1
      }}
    >
      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          width: 40,
          height: 40,
          borderRadius: '10px',
          backgroundColor: `${TYPE_COLORS[Type]}20`
        }}>
          {TYPE_ICONS[Type]}
        </Box>
        
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Typography variant="subtitle1" component="div" sx={{ fontWeight: isViewed ? 400 : 700, color: '#fff' }}>
              {Message}
            </Typography>
            {!isViewed && <UnreadIcon sx={{ fontSize: 10, color: TYPE_COLORS[Type] }} />}
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip 
              label={Type} 
              size="small" 
              sx={{ 
                height: 20, 
                fontSize: '10px', 
                backgroundColor: `${TYPE_COLORS[Type]}30`, 
                color: TYPE_COLORS[Type],
                fontWeight: 600
              }} 
            />
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
              {date}
            </Typography>
          </Box>
        </Box>

        {isViewed && (
          <ReadIcon sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 20 }} />
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationCard;
