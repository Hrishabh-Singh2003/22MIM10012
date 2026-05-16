'use client';

import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { 
  Box, 
  Drawer, 
  AppBar, 
  Toolbar, 
  List, 
  Typography, 
  Divider, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText,
  Container,
  useMediaQuery,
  IconButton
} from '@mui/material';
import { 
  Notifications as AllIcon, 
  Star as PriorityIcon, 
  Menu as MenuIcon 
} from '@mui/icons-material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const drawerWidth = 240;

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6c63ff',
    },
    background: {
      default: '#0d0f1a',
      paper: '#141726',
    },
    text: {
      primary: '#e2e8f0',
      secondary: '#94a3b8',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#141726',
          border: '1px solid #252a40',
        },
      },
    },
  },
});

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const isMobile = useMediaQuery(darkTheme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: 'All Notifications', icon: <AllIcon />, path: '/' },
    { text: 'Priority Inbox', icon: <PriorityIcon />, path: '/priority' },
  ];

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 800, color: '#6c63ff' }}>
          CAMPUS NOTIF
        </Typography>
      </Toolbar>
      <Divider sx={{ borderColor: '#252a40' }} />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <Link href={item.path} style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
              <ListItemButton 
                selected={pathname === item.path}
                onClick={() => isMobile && setMobileOpen(false)}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(108, 99, 255, 0.15)',
                    borderRight: '3px solid #6c63ff',
                    '&:hover': {
                      backgroundColor: 'rgba(108, 99, 255, 0.25)',
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ color: pathname === item.path ? '#6c63ff' : 'inherit' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
            backgroundColor: 'rgba(13, 15, 26, 0.8)',
            backdropFilter: 'blur(8px)',
            boxShadow: 'none',
            borderBottom: '1px solid #252a40'
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 600 }}>
              {menuItems.find(i => i.path === pathname)?.text || 'Campus Notifications'}
            </Typography>
          </Toolbar>
        </AppBar>
        
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        >
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, backgroundColor: '#0d0f1a', borderRight: '1px solid #252a40' },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, backgroundColor: '#0d0f1a', borderRight: '1px solid #252a40' },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>
        
        <Box
          component="main"
          sx={{ 
            flexGrow: 1, 
            p: 3, 
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            minHeight: '100vh',
            pt: 10
          }}
        >
          <Container maxWidth="lg">
            {children}
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
