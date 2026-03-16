'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Skeleton,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/client';
import Layout from '../components/Layout';

interface DashboardStats {
  clients: { total: number; active: number };
  projects: { total: number; in_progress: number; completed: number; planning?: number };
  tasks: { total: number; done: number };
  invoices: { total_amount: number; paid: number; pending: number; overdue?: number };
}

const COLORS = ['#6366f1', '#ec4899', '#10b981', '#f59e0b'];

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const [clientsRes, projectsRes, tasksRes, invoicesRes] = await Promise.all([
        apiClient.get('/clients/stats/'),
        apiClient.get('/projects/stats/'),
        apiClient.get('/tasks/stats/'),
        apiClient.get('/invoices/stats/'),
      ]);

      setStats({
        clients: clientsRes.data,
        projects: projectsRes.data,
        tasks: tasksRes.data,
        invoices: invoicesRes.data,
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const projectData = stats
    ? [
        { name: 'Planning', value: stats.projects.planning || stats.projects.total - stats.projects.in_progress - stats.projects.completed || 0 },
        { name: 'In Progress', value: stats.projects.in_progress || 0 },
        { name: 'Completed', value: stats.projects.completed || 0 },
      ]
    : [];

  const invoiceData = stats
    ? [
        { name: 'Paid', value: stats.invoices.paid || 0 },
        { name: 'Pending', value: stats.invoices.pending || 0 },
        { name: 'Overdue', value: stats.invoices.overdue || 0 },
      ]
    : [];

  if (authLoading || !user) {
    return null;
  }

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Welcome back, {user.first_name}!
        </Typography>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
              <Card>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Active Clients
                  </Typography>
                  <Typography variant="h3" component="div" fontWeight="bold" color="primary">
                    {loading ? <Skeleton width={60} /> : stats?.clients.active || 0}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Active Projects
                  </Typography>
                  <Typography variant="h3" component="div" fontWeight="bold" color="secondary">
                    {loading ? <Skeleton width={60} /> : stats?.projects.in_progress || 0}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Tasks Completed
                  </Typography>
                  <Typography variant="h3" component="div" fontWeight="bold" sx={{ color: '#10b981' }}>
                    {loading ? <Skeleton width={60} /> : stats?.tasks.done || 0}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Revenue
                  </Typography>
                  <Typography variant="h3" component="div" fontWeight="bold" sx={{ color: '#f59e0b' }}>
                    {loading ? <Skeleton width={100} /> : `$${stats?.invoices.paid?.toLocaleString() || 0}`}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Card sx={{ height: 400 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Project Status
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    {loading ? (
                      <Skeleton variant="rectangular" height={300} />
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={projectData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="value" fill="#6366f1" />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <Card sx={{ height: 400 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Invoice Status
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    {loading ? (
                      <Skeleton variant="rectangular" height={300} />
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={invoiceData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                            label
                          >
                            {invoiceData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
}
