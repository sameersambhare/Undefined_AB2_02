'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/providers/AuthProvider';
import { 
  Box, 
  Card, 
  Typography, 
  Button, 
  Avatar, 
  Divider, 
  CircularProgress,
  Container,
  Paper,
  Grid
} from '@mui/material';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Profile() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  // If no user is logged in, this page should be protected by middleware
  // But we'll add an extra check just in case
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/signin');
    }
  }, [user, isLoading, router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Get initials for avatar
  const getInitials = (name: string) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <Container maxWidth="md" sx={{ flex: 1, py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
          My Profile
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Avatar 
                sx={{ 
                  width: 100, 
                  height: 100, 
                  mx: 'auto', 
                  mb: 2,
                  bgcolor: 'primary.main',
                  fontSize: '2rem'
                }}
              >
                {user ? getInitials(user.name) : '?'}
              </Avatar>
              
              <Typography variant="h5" gutterBottom>
                {user?.name}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {user?.email}
              </Typography>
              
              <Button 
                variant="outlined" 
                color="primary" 
                fullWidth 
                sx={{ mt: 2 }}
                onClick={handleLogout}
              >
                Sign Out
              </Button>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Account Information
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Name
                </Typography>
                <Typography variant="body1">
                  {user?.name}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="body1">
                  {user?.email}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Account Created
                </Typography>
                <Typography variant="body1">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                Recent Activity
              </Typography>
              
              <Typography variant="body2" color="text.secondary">
                No recent activity to display.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
      
      <Footer />
    </Box>
  );
} 