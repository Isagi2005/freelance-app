'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  MenuItem,
} from '@mui/material';
import { Add, Edit, Delete, Send, CheckCircle, Visibility } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/client';
import Layout from '../components/Layout';

interface Invoice {
  id: number;
  invoice_number: string;
  client_details: { company_name: string };
  client: number;
  project: number | null;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  total: number;
  issue_date: string;
  due_date: string;
}

const statusColors: Record<string, any> = {
  draft: 'default',
  sent: 'primary',
  paid: 'success',
  overdue: 'error',
  cancelled: 'default',
};

export default function InvoicesPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<{ id: number; company_name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [formData, setFormData] = useState({
    invoice_number: '',
    client: '',
    status: 'draft',
    issue_date: '',
    due_date: '',
    notes: '',
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const [invoicesRes, clientsRes] = await Promise.all([
        apiClient.get('/invoices/'),
        apiClient.get('/clients/'),
      ]);
      setInvoices(invoicesRes.data.results || []);
      setClients(clientsRes.data.results || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (invoice?: Invoice) => {
    if (invoice) {
      setEditingInvoice(invoice);
      setFormData({
        invoice_number: invoice.invoice_number,
        client: String(invoice.client),
        status: invoice.status,
        issue_date: invoice.issue_date,
        due_date: invoice.due_date,
        notes: '',
      });
    } else {
      setEditingInvoice(null);
      const date = new Date();
      const invoiceNumber = `INV-${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
        invoices.length + 1
      ).padStart(3, '0')}`;
      setFormData({
        invoice_number: invoiceNumber,
        client: '',
        status: 'draft',
        issue_date: date.toISOString().split('T')[0],
        due_date: new Date(date.setDate(date.getDate() + 30)).toISOString().split('T')[0],
        notes: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingInvoice(null);
  };

  const handleSubmit = async () => {
    try {
      const data = {
        ...formData,
        client: Number(formData.client),
      };
      if (editingInvoice) {
        await apiClient.patch(`/invoices/${editingInvoice.id}/`, data);
      } else {
        await apiClient.post('/invoices/', data);
      }
      fetchData();
      handleCloseDialog();
    } catch (error) {
      console.error('Failed to save invoice:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this invoice?')) {
      try {
        await apiClient.delete(`/invoices/${id}/`);
        fetchData();
      } catch (error) {
        console.error('Failed to delete invoice:', error);
      }
    }
  };

  const handleSend = async (id: number) => {
    try {
      await apiClient.post(`/invoices/${id}/send/`);
      fetchData();
    } catch (error) {
      console.error('Failed to send invoice:', error);
    }
  };

  const handleMarkPaid = async (id: number) => {
    try {
      await apiClient.post(`/invoices/${id}/mark_paid/`);
      fetchData();
    } catch (error) {
      console.error('Failed to mark invoice as paid:', error);
    }
  };

  if (authLoading || !user) {
    return null;
  }

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Invoices
          </Typography>
          <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenDialog()}>
            Create Invoice
          </Button>
        </Box>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Invoice #</TableCell>
                  <TableCell>Client</TableCell>
                  <TableCell>Issue Date</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7}>Loading...</TableCell>
                  </TableRow>
                ) : invoices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No invoices yet. Create your first invoice!
                    </TableCell>
                  </TableRow>
                ) : (
                  invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell>
                        <Typography fontWeight="medium">{invoice.invoice_number}</Typography>
                      </TableCell>
                      <TableCell>{invoice.client_details?.company_name}</TableCell>
                      <TableCell>{new Date(invoice.issue_date).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(invoice.due_date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Typography fontWeight="medium">${invoice.total?.toLocaleString() || 0}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={invoice.status} color={statusColors[invoice.status]} size="small" />
                      </TableCell>
                      <TableCell align="right">
                        {invoice.status === 'draft' && (
                          <IconButton size="small" color="primary" onClick={() => handleSend(invoice.id)}>
                            <Send fontSize="small" />
                          </IconButton>
                        )}
                        {invoice.status !== 'paid' && invoice.status !== 'cancelled' && (
                          <IconButton size="small" color="success" onClick={() => handleMarkPaid(invoice.id)}>
                            <CheckCircle fontSize="small" />
                          </IconButton>
                        )}
                        <IconButton size="small" onClick={() => handleOpenDialog(invoice)}>
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => handleDelete(invoice.id)}>
                          <Delete fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </motion.div>

        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>{editingInvoice ? 'Edit Invoice' : 'Create Invoice'}</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Invoice Number"
                  value={formData.invoice_number}
                  onChange={(e) => setFormData({ ...formData, invoice_number: e.target.value })}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  select
                  label="Client"
                  value={formData.client}
                  onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                >
                  {clients.map((client) => (
                    <MenuItem key={client.id} value={client.id}>
                      {client.company_name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Issue Date"
                  type="date"
                  value={formData.issue_date}
                  onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Due Date"
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Notes"
                  multiline
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained">
              {editingInvoice ? 'Save' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Layout>
  );
}
