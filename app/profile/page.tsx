'use client';

import React, { useEffect, useState } from 'react';
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
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemButton
} from '@mui/material';
import { DesignServices, AccessTime } from '@mui/icons-material';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ToastExample from '@/components/ToastExample';
import { toast } from 'react-hot-toast';

interface SavedLayout {
  _id?: string;
  name: string;
  components: any[];
  createdAt?: string;
  updatedAt?: string;
}

export default function Profile() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const [layouts, setLayouts] = useState<SavedLayout[]>([]);
  const [isLoadingLayouts, setIsLoadingLayouts] = useState(false);

  // If no user is logged in, this page should be protected by middleware
  // But we'll add an extra check just in case
  useEffect(() => {
    if (!isLoading && !user) {
      toast.error('You must be logged in to view this page');
      window.location.href = '/signin';
    }
  }, [user, isLoading, toast]);

  // Fetch user's layouts when component mounts
  useEffect(() => {
    if (user) {
      fetchUserLayouts();
    }
  }, [user]);

  // Function to fetch user's layouts
  const fetchUserLayouts = async () => {
    try {
      setIsLoadingLayouts(true);
      
      // Get auth token from cookies
      const authToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth_token='))
        ?.split('=')[1];
      
      if (!authToken) {
        console.error('Authentication token not found');
        return;
      }
      
      const response = await fetch('/api/layouts', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setLayouts(data.layouts);
      } else {
        console.error('Failed to fetch layouts:', data.error);
      }
    } catch (error) {
      console.error('Error fetching layouts:', error);
    } finally {
      setIsLoadingLayouts(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // Navigate to the editor with the selected layout
  const handleEditLayout = (layoutId: string) => {
    window.location.href = `/createui?layout=${layoutId}`;
  };

  const handleDeleteAccount = async () => {
    // ... existing code ...
    if (response.ok) {
      toast.success('Account deleted successfully');
      logout();
      window.location.href = '/';
    } else {
      // ... existing code ...
    }
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

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <Container maxWidth="md" sx={{ flex: 1, py: 4, mt: '64px' }} className="page-content">
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
                Recent UI Layouts
              </Typography>
              
              {isLoadingLayouts ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : layouts.length > 0 ? (
                <List sx={{ width: '100%' }}>
                  {layouts.slice().reverse().map((layout) => (
                    <ListItem 
                      key={layout._id} 
                      disablePadding
                      secondaryAction={
                        <Button 
                          size="small" 
                          variant="outlined" 
                          onClick={() => layout._id && handleEditLayout(layout._id)}
                        >
                          Edit
                        </Button>
                      }
                    >
                      <ListItemButton onClick={() => layout._id && handleEditLayout(layout._id)}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            <DesignServices />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText 
                          primary={layout.name} 
                          secondary={
                            <React.Fragment>
                              <AccessTime sx={{ fontSize: '0.8rem', mr: 0.5, verticalAlign: 'middle' }} />
                              {formatDate(layout.createdAt)}
                              <Typography component="span" variant="body2" sx={{ display: 'block' }}>
                                {layout.components.length} components
                              </Typography>
                            </React.Fragment>
                          } 
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box sx={{ py: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    You haven't created any UI layouts yet.
                  </Typography>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    sx={{ mt: 2 }}
                    onClick={() => window.location.href = '/createui'}
                  >
                    Create New Layout
                  </Button>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
      
      <Footer />
    </Box>
  );
} 