'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import {
  Dashboard,
  People,
  Folder,
  Assignment,
  Receipt,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

export default function Home() {
  const router = useRouter();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography variant="h2" component="h1" fontWeight="bold" gutterBottom>
              ClientFlow
            </Typography>
            <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
              The ultimate CRM for freelancers and web developers
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => router.push('/login')}
                sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: 'grey.100' } }}
              >
                Sign In
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => router.push('/register')}
                sx={{ borderColor: 'white', color: 'white', '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' } }}
              >
                Get Started
              </Button>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" component="h2" textAlign="center" fontWeight="bold" gutterBottom>
          Everything you need to manage your business
        </Typography>
        <Typography variant="body1" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
          Streamline your workflow with powerful tools designed for freelancers
        </Typography>

        <Grid container spacing={4}>
          {[
            { icon: <People fontSize="large" />, title: 'Client Management', desc: 'Track clients, contacts, and communication history' },
            { icon: <Folder fontSize="large" />, title: 'Project Tracking', desc: 'Manage projects with progress tracking and deadlines' },
            { icon: <Assignment fontSize="large" />, title: 'Task Management', desc: 'Organize tasks with priorities and due dates' },
            { icon: <Receipt fontSize="large" />, title: 'Invoicing', desc: 'Create and track invoices with payment status' },
            { icon: <Dashboard fontSize="large" />, title: 'Dashboard', desc: 'Visualize your business metrics with analytics' },
          ].map((feature, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
                  <CardContent>
                    <Box sx={{ color: 'primary.main', mb: 2 }}>{feature.icon}</Box>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.desc}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Footer */}
      <Box sx={{ bgcolor: 'grey.900', color: 'grey.400', py: 4, textAlign: 'center' }}>
        <Typography variant="body2">
          © 2025 ClientFlow. Built for freelancers.
        </Typography>
      </Box>
    </Box>
  );
}
