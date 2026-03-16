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
  MenuItem,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { Add, Edit, Delete, CheckCircle } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/client';
import Layout from '../components/Layout';

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  project_details: { name: string };
  project: number;
  due_date: string;
  estimated_hours: number;
}

const statusColors: Record<string, any> = {
  todo: 'default',
  in_progress: 'primary',
  review: 'warning',
  done: 'success',
};

const priorityColors: Record<string, any> = {
  low: 'success',
  medium: 'warning',
  high: 'error',
  urgent: 'error',
};

export default function TasksPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    project: '',
    due_date: '',
    estimated_hours: '',
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
      const [tasksRes, projectsRes] = await Promise.all([
        apiClient.get('/tasks/'),
        apiClient.get('/projects/'),
      ]);
      setTasks(tasksRes.data.results || []);
      setProjects(projectsRes.data.results || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (task?: Task) => {
    if (task) {
      setEditingTask(task);
      setFormData({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        project: String(task.project),
        due_date: task.due_date || '',
        estimated_hours: String(task.estimated_hours || ''),
      });
    } else {
      setEditingTask(null);
      setFormData({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        project: '',
        due_date: '',
        estimated_hours: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingTask(null);
  };

  const handleSubmit = async () => {
    try {
      const data = {
        ...formData,
        project: Number(formData.project),
        estimated_hours: formData.estimated_hours ? Number(formData.estimated_hours) : null,
      };
      if (editingTask) {
        await apiClient.patch(`/tasks/${editingTask.id}/`, data);
      } else {
        await apiClient.post('/tasks/', data);
      }
      fetchData();
      handleCloseDialog();
    } catch (error) {
      console.error('Failed to save task:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await apiClient.delete(`/tasks/${id}/`);
        fetchData();
      } catch (error) {
        console.error('Failed to delete task:', error);
      }
    }
  };

  const handleComplete = async (id: number) => {
    try {
      await apiClient.post(`/tasks/${id}/complete/`);
      fetchData();
    } catch (error) {
      console.error('Failed to complete task:', error);
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
            Tasks
          </Typography>
          <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenDialog()}>
            Add Task
          </Button>
        </Box>

        <Grid container spacing={2}>
          {loading ? (
            <Typography>Loading...</Typography>
          ) : tasks.length === 0 ? (
            <Grid size={{ xs: 12 }}>
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 6 }}>
                  <Typography variant="h6" color="text.secondary">
                    No tasks yet. Create your first task!
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ) : (
            tasks.map((task, index) => (
              <Grid size={{ xs: 12, md: 6 }} key={task.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      borderLeft: 4,
                      borderColor:
                        task.status === 'done'
                          ? 'success.main'
                          : task.priority === 'urgent'
                          ? 'error.main'
                          : 'primary.main',
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                          <Checkbox
                            checked={task.status === 'done'}
                            onChange={() => handleComplete(task.id)}
                            color="success"
                          />
                          <Typography
                            variant="h6"
                            fontWeight="medium"
                            sx={{
                              textDecoration: task.status === 'done' ? 'line-through' : 'none',
                              color: task.status === 'done' ? 'text.secondary' : 'text.primary',
                            }}
                          >
                            {task.title}
                          </Typography>
                        </Box>
                        <Box>
                          <IconButton size="small" onClick={() => handleOpenDialog(task)}>
                            <Edit fontSize="small" />
                          </IconButton>
                          <IconButton size="small" color="error" onClick={() => handleDelete(task.id)}>
                            <Delete fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>

                      <Typography color="text.secondary" sx={{ mb: 1 }}>
                        {task.project_details?.name}
                      </Typography>

                      <Typography variant="body2" sx={{ mb: 2 }}>
                        {task.description?.substring(0, 150)}
                        {task.description?.length > 150 ? '...' : ''}
                      </Typography>

                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip label={task.status} color={statusColors[task.status]} size="small" />
                        <Chip label={task.priority} color={priorityColors[task.priority]} size="small" />
                        {task.due_date && (
                          <Chip
                            label={new Date(task.due_date).toLocaleDateString()}
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))
          )}
        </Grid>

        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>{editingTask ? 'Edit Task' : 'Add Task'}</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Task Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  select
                  label="Project"
                  value={formData.project}
                  onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                >
                  {projects.map((project) => (
                    <MenuItem key={project.id} value={project.id}>
                      {project.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  select
                  label="Status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <MenuItem value="todo">To Do</MenuItem>
                  <MenuItem value="in_progress">In Progress</MenuItem>
                  <MenuItem value="review">Review</MenuItem>
                  <MenuItem value="done">Done</MenuItem>
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  select
                  label="Priority"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="urgent">Urgent</MenuItem>
                </TextField>
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
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Estimated Hours"
                  type="number"
                  value={formData.estimated_hours}
                  onChange={(e) => setFormData({ ...formData, estimated_hours: e.target.value })}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained">
              {editingTask ? 'Save' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Layout>
  );
}
