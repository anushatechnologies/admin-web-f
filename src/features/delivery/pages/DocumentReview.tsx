import React from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  Chip, 
  Grid,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import { 
  useGetPendingDocumentsQuery, 
  useApproveDocumentMutation, 
  useRejectDocumentMutation 
} from '../api/deliveryApi';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function DocumentReview() {
  const { data, isLoading } = useGetPendingDocumentsQuery();
  const [approve] = useApproveDocumentMutation();
  const [reject] = useRejectDocumentMutation();

  const [rejectId, setRejectId] = useState<number | null>(null);
  const [remarks, setRemarks] = useState('');

  const handleApprove = async (id: number) => {
    try {
      await approve({ documentId: id, adminId: 1 }).unwrap();
      toast.success('Document approved');
    } catch (err) {
      toast.error('Approval failed');
    }
  };

  const handleReject = async () => {
    if (!rejectId) return;
    try {
      await reject({ documentId: rejectId, adminId: 1, remarks }).unwrap();
      toast.success('Document rejected');
      setRejectId(null);
      setRemarks('');
    } catch (err) {
      toast.error('Rejection failed');
    }
  };

  const documents = data?.documents || [];

  return (
    <Box sx={{ p: 4 }}>
      <Box mb={4}>
        <Typography variant="h4" fontWeight={700}>Verification Documents</Typography>
        <Typography color="text.secondary">Review and approve delivery personnel documents</Typography>
      </Box>

      {isLoading ? (
        <Typography>Loading documents...</Typography>
      ) : documents.length === 0 ? (
        <Card sx={{ p: 4, textAlign: 'center', bgcolor: 'grey.50' }}>
          <Typography color="text.secondary">No documents pending review</Typography>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {documents.map((doc) => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={doc.id}>
              <Card sx={{ borderRadius: 3, boxShadow: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box 
                  component="img" 
                  src={doc.documentUrl} 
                  sx={{ height: 200, width: '100%', objectFit: 'cover', borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Stack direction="row" justifyContent="space-between" mb={1}>
                    <Typography variant="subtitle1" fontWeight={600}>{doc.documentType.replace('_', ' ')}</Typography>
                    <Chip label={doc.status} size="small" color="warning" />
                  </Stack>
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    Number: {doc.documentNumber}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Uploaded: {new Date(doc.uploadedAt).toLocaleString()}
                  </Typography>
                </CardContent>
                <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                  <Stack direction="row" spacing={2}>
                    <Button 
                      fullWidth 
                      variant="contained" 
                      color="success" 
                      onClick={() => handleApprove(doc.id)}
                    >
                      Approve
                    </Button>
                    <Button 
                      fullWidth 
                      variant="outlined" 
                      color="error" 
                      onClick={() => setRejectId(doc.id)}
                    >
                      Reject
                    </Button>
                  </Stack>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Reject Dialog */}
      <Dialog open={!!rejectId} onClose={() => setRejectId(null)}>
        <DialogTitle>Reject Document</DialogTitle>
        <DialogContent>
          <Typography variant="body2" mb={2}>Please provide a reason for rejection.</Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="e.g. Image is blurry, Expired document..."
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setRejectId(null)}>Cancel</Button>
          <Button 
            variant="contained" 
            color="error" 
            onClick={handleReject}
            disabled={!remarks.trim()}
          >
            Confirm Reject
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
