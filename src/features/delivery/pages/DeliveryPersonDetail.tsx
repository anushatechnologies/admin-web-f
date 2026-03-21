import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Avatar, 
  Chip, 
  Button, 
  Divider, 
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  useGetDeliveryPersonByIdQuery, 
  useGetPersonnelDocumentsQuery
} from '../api/deliveryApi';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import toast from 'react-hot-toast';

export default function DeliveryPersonDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: personnelResponse, isLoading: isPersonnelLoading } = useGetDeliveryPersonByIdQuery(Number(id));
  const { data: docs, isLoading: isDocsLoading } = useGetPersonnelDocumentsQuery(Number(id));
  
  const personnel = personnelResponse?.deliveryPerson;

  const [documentViewerOpen, setDocumentViewerOpen] = useState(false);
  const [selectedDocumentUrl, setSelectedDocumentUrl] = useState('');
  const [selectedDocumentName, setSelectedDocumentName] = useState('');

  const handleViewDocument = (doc: any) => {
    setSelectedDocumentUrl(doc.documentUrl);
    setSelectedDocumentName(doc.documentType);
    setDocumentViewerOpen(true);
  };

  if (isPersonnelLoading) return <Box display="flex" justifyContent="center" py={10}><CircularProgress /></Box>;

  return (
    <Box sx={{ p: 4 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 4 }}>Back</Button>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, borderRadius: 3, textAlign: 'center' }}>
            <Avatar 
              sx={{ width: 100, height: 100, mx: 'auto', mb: 2, bgcolor: 'primary.main', fontSize: '2rem' }}
            >
              {personnel?.firstName?.[0]}
            </Avatar>
            <Typography variant="h5" fontWeight={700}>{personnel?.firstName} {personnel?.lastName}</Typography>
            <Typography color="text.secondary" gutterBottom>{personnel?.phoneNumber}</Typography>
            <Chip 
              label={personnel?.approvalStatus} 
              color={personnel?.approvalStatus === 'APPROVED' ? 'success' : 'warning'}
              sx={{ mt: 1 }}
            />
            
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 3, borderRadius: 3, mb: 4 }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>Personal Information</Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <Typography variant="body2" color="text.secondary">Email</Typography>
                <Typography variant="body1">{personnel?.email || 'N/A'}</Typography>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Typography variant="body2" color="text.secondary">Vehicle Type</Typography>
                <Typography variant="body1">{personnel?.vehicleType || 'N/A'}</Typography>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Typography variant="body2" color="text.secondary">Vehicle Model</Typography>
                <Typography variant="body1">{personnel?.vehicleModel || 'N/A'}</Typography>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Typography variant="body2" color="text.secondary">Rating</Typography>
                <Typography variant="body1">⭐ {personnel?.rating || '0.0'}</Typography>
              </Grid>
            </Grid>
          </Paper>

          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>Verification Documents</Typography>
            <Divider sx={{ mb: 2 }} />
            {isDocsLoading ? <CircularProgress size={24} /> : (
              <Grid container spacing={2}>
                {docs?.documents?.map((doc: any) => (
                  <Grid size={{ xs: 12, sm: 6 }} key={doc.id}>
                    <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                      <Typography variant="subtitle2">{doc.documentType}</Typography>
                      <Typography variant="caption" color="text.secondary" display="block">Number: {doc.documentNumber}</Typography>
                      <Button 
                        size="small" 
                        variant="text" 
                        onClick={() => handleViewDocument(doc)}
                        sx={{ mt: 1 }}
                      >
                        View Document
                      </Button>
                    </Box>
                  </Grid>
                ))}
                {!docs?.documents?.length && <Alert severity="info">No documents uploaded yet.</Alert>}
              </Grid>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={documentViewerOpen} onClose={() => setDocumentViewerOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{selectedDocumentName} Document</DialogTitle>
        <DialogContent sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          {selectedDocumentUrl ? (
            <Box 
              component="img"
              src={selectedDocumentUrl}
              alt="Document Viewer"
              sx={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain', borderRadius: 2 }}
            />
          ) : (
            <Typography>No document available</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDocumentViewerOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
