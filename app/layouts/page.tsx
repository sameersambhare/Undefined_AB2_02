'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/providers/AuthProvider';
import { 
  Box, 
  Typography, 
  Button, 
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
  TextField,
  MenuItem,
  Select as MuiSelect,
  FormControl,
  InputLabel,
  Divider,
  Chip,
  IconButton,
  Tooltip,
  Paper
} from '@mui/material';
import { 
  DesignServices, 
  AccessTime, 
  Delete, 
  Edit, 
  FilterList, 
  Sort, 
  Search,
  ViewModule,
  ViewList
} from '@mui/icons-material';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { toast } from 'react-hot-toast';

interface SavedLayout {
  _id?: string;
  name: string;
  components: any[];
  createdAt?: string;
  updatedAt?: string;
}

export default function Layouts() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [layouts, setLayouts] = useState<SavedLayout[]>([]);
  const [filteredLayouts, setFilteredLayouts] = useState<SavedLayout[]>([]);
  const [isLoadingLayouts, setIsLoadingLayouts] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        toast.error('You must be logged in to view your layouts');
        window.location.href = '/signin?callbackUrl=/layouts';
      } else {
        fetchLayouts();
      }
    }
  }, [user, isLoading]);

  // Filter and sort layouts when dependencies change
  useEffect(() => {
    if (layouts.length > 0) {
      let result = [...layouts];
      
      // Apply search filter
      if (searchTerm) {
        result = result.filter(layout => 
          layout.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      // Apply sorting
      result = sortLayouts(result, sortBy);
      
      setFilteredLayouts(result);
    }
  }, [layouts, searchTerm, sortBy]);

  // Function to sort layouts
  const sortLayouts = (layoutsToSort: SavedLayout[], sortOption: string) => {
    switch (sortOption) {
      case 'newest':
        return [...layoutsToSort].sort((a, b) => {
          return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime();
        });
      case 'oldest':
        return [...layoutsToSort].sort((a, b) => {
          return new Date(a.createdAt || '').getTime() - new Date(b.createdAt || '').getTime();
        });
      case 'name-asc':
        return [...layoutsToSort].sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return [...layoutsToSort].sort((a, b) => b.name.localeCompare(a.name));
      case 'components':
        return [...layoutsToSort].sort((a, b) => b.components.length - a.components.length);
      default:
        return layoutsToSort;
    }
  };

  // Function to fetch user's layouts
  const fetchLayouts = async () => {
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
        setFilteredLayouts(sortLayouts(data.layouts, sortBy));
      } else {
        console.error('Failed to fetch layouts:', data.error);
      }
    } catch (error) {
      console.error('Error fetching layouts:', error);
    } finally {
      setIsLoadingLayouts(false);
    }
  };

  // Navigate to the editor with the selected layout
  const handleEditLayout = (layoutId: string) => {
    window.location.href = `/createui?layout=${layoutId}`;
  };

  // Delete a layout
  const handleDeleteLayout = async (layoutId: string) => {
    if (!confirm('Are you sure you want to delete this layout? This action cannot be undone.')) {
      return;
    }
    
    try {
      // Get auth token from cookies
      const authToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth_token='))
        ?.split('=')[1];
      
      if (!authToken) {
        alert('Authentication token not found. Please log in again.');
        return;
      }
      
      const response = await fetch(`/api/layouts/${layoutId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        // Remove the deleted layout from state
        setLayouts(layouts.filter(layout => layout._id !== layoutId));
        alert('Layout deleted successfully!');
      } else {
        throw new Error(data.error || 'Failed to delete layout');
      }
    } catch (error) {
      console.error('Error deleting layout:', error);
      alert('There was an error deleting your layout. Please try again.');
    }
  };

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <Container maxWidth="lg" sx={{ flex: 1, py: 4, mt: '64px' }} className="page-content">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1">
            My Layouts
          </Typography>
          
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<DesignServices />}
            onClick={() => window.location.href = '/createui'}
          >
            Create New Layout
          </Button>
        </Box>
        
        <Paper sx={{ p: 2, mb: 4 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
            <TextField
              label="Search layouts"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ flexGrow: 1, minWidth: '200px' }}
              InputProps={{
                startAdornment: <Search sx={{ color: 'action.active', mr: 1 }} />,
              }}
            />
            
            <FormControl size="small" sx={{ minWidth: '150px' }}>
              <InputLabel id="sort-select-label">Sort by</InputLabel>
              <MuiSelect
                labelId="sort-select-label"
                value={sortBy}
                label="Sort by"
                onChange={(e) => setSortBy(e.target.value)}
                startAdornment={<Sort sx={{ color: 'action.active', mr: 1 }} />}
              >
                <MenuItem value="newest">Newest first</MenuItem>
                <MenuItem value="oldest">Oldest first</MenuItem>
                <MenuItem value="name-asc">Name (A-Z)</MenuItem>
                <MenuItem value="name-desc">Name (Z-A)</MenuItem>
                <MenuItem value="components">Most components</MenuItem>
              </MuiSelect>
            </FormControl>
            
            <Tooltip title={viewMode === 'grid' ? 'Switch to list view' : 'Switch to grid view'}>
              <IconButton onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}>
                {viewMode === 'grid' ? <ViewList /> : <ViewModule />}
              </IconButton>
            </Tooltip>
          </Box>
        </Paper>
        
        {isLoadingLayouts ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : filteredLayouts.length > 0 ? (
          viewMode === 'grid' ? (
            <Grid container spacing={3}>
              {filteredLayouts.map((layout) => (
                <Grid item xs={12} sm={6} md={4} key={layout._id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" component="h2" gutterBottom>
                        {layout.name}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, color: 'text.secondary' }}>
                        <AccessTime sx={{ fontSize: '0.9rem', mr: 0.5 }} />
                        <Typography variant="body2">
                          {formatDate(layout.createdAt)}
                        </Typography>
                      </Box>
                      
                      <Chip 
                        label={`${layout.components.length} components`} 
                        size="small" 
                        sx={{ mt: 1 }}
                      />
                    </CardContent>
                    
                    <Divider />
                    
                    <CardActions>
                      <Button 
                        size="small" 
                        startIcon={<Edit />}
                        onClick={() => layout._id && handleEditLayout(layout._id)}
                      >
                        Edit
                      </Button>
                      
                      <Button 
                        size="small" 
                        color="error" 
                        startIcon={<Delete />}
                        onClick={() => layout._id && handleDeleteLayout(layout._id)}
                      >
                        Delete
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Paper>
              {filteredLayouts.map((layout, index) => (
                <React.Fragment key={layout._id}>
                  {index > 0 && <Divider />}
                  <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" component="h2">
                        {layout.name}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                        <AccessTime sx={{ fontSize: '0.9rem', mr: 0.5 }} />
                        <Typography variant="body2" sx={{ mr: 2 }}>
                          {formatDate(layout.createdAt)}
                        </Typography>
                        
                        <Chip 
                          label={`${layout.components.length} components`} 
                          size="small" 
                        />
                      </Box>
                    </Box>
                    
                    <Box>
                      <Button 
                        size="small" 
                        startIcon={<Edit />}
                        sx={{ mr: 1 }}
                        onClick={() => layout._id && handleEditLayout(layout._id)}
                      >
                        Edit
                      </Button>
                      
                      <Button 
                        size="small" 
                        color="error" 
                        startIcon={<Delete />}
                        onClick={() => layout._id && handleDeleteLayout(layout._id)}
                      >
                        Delete
                      </Button>
                    </Box>
                  </Box>
                </React.Fragment>
              ))}
            </Paper>
          )
        ) : (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              No layouts found
            </Typography>
            
            {searchTerm ? (
              <Typography variant="body2" color="text.secondary" gutterBottom>
                No layouts match your search criteria. Try a different search term.
              </Typography>
            ) : (
              <Typography variant="body2" color="text.secondary" gutterBottom>
                You haven't created any UI layouts yet.
              </Typography>
            )}
            
            <Button 
              variant="contained" 
              color="primary" 
              sx={{ mt: 2 }}
              onClick={() => window.location.href = '/createui'}
            >
              Create Your First Layout
            </Button>
          </Paper>
        )}
      </Container>
      
      <Footer />
    </Box>
  );
} 