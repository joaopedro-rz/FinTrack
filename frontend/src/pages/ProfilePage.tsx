import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  Divider,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Person,
  Email,
  CalendarMonth,
  Save,
} from '@mui/icons-material';
import { useAuthStore } from '@/store/authStore';
import { formatDate } from '@/utils/formatters';
import AvatarUpload from '@/components/common/AvatarUpload';

export default function ProfilePage() {
  const { name, email, createdAt, avatarUrl, updateAvatar, removeAvatar } = useAuthStore();

  const [formData, setFormData] = useState({
    name: name || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning',
  });

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  /**
   * TODO: [FEATURE] Implementar endpoint PUT /api/users/profile no backend
   * Issue: #BACKLOG - Permitir atualização de nome do usuário
   */
  const handleUpdateProfile = async () => {
    setSnackbar({
      open: true,
      message: '⚠️ Em desenvolvimento: A atualização de perfil estará disponível em breve.',
      severity: 'info',
    });
  };

  const handleChangePassword = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      setSnackbar({
        open: true,
        message: 'As senhas não coincidem!',
        severity: 'error',
      });
      return;
    }

    if (formData.newPassword.length < 6) {
      setSnackbar({
        open: true,
        message: 'A nova senha deve ter pelo menos 6 caracteres!',
        severity: 'error',
      });
      return;
    }

    /**
     * TODO: [FEATURE] Implementar endpoint PUT /api/users/password no backend
     * Issue: #BACKLOG - Permitir alteração de senha do usuário
     */
    setSnackbar({
      open: true,
      message: '⚠️ Em desenvolvimento: A alteração de senha estará disponível em breve.',
      severity: 'info',
    });

    // Limpar campos de senha
    setFormData({
      ...formData,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  return (
    <Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Meu Perfil
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Gerencie suas informações pessoais
        </Typography>
      </Box>

      <Grid container spacing={3}>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ p: 3, textAlign: 'center' }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <AvatarUpload
                  currentAvatar={avatarUrl}
                  userName={name || ''}
                  onSave={(imageData) => {
                    updateAvatar(imageData);
                    setSnackbar({
                      open: true,
                      message: 'Foto de perfil atualizada com sucesso!',
                      severity: 'success',
                    });
                  }}
                />
              </Box>


              {avatarUrl && (
                <Box sx={{ mb: 2 }}>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => {
                      removeAvatar();
                      setSnackbar({
                        open: true,
                        message: 'Foto de perfil removida',
                        severity: 'info',
                      });
                    }}
                  >
                    Remover Foto
                  </Button>
                </Box>
              )}

              <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
                {name}
              </Typography>

              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                {email}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
                <CalendarMonth sx={{ color: 'text.secondary', fontSize: 20 }} />
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Membro desde {formatDate(createdAt)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>


        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Informações Pessoais
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Nome"
                    value={formData.name}
                    onChange={handleChange('name')}
                    InputProps={{
                      startAdornment: <Person sx={{ color: 'text.secondary', mr: 1 }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="E-mail"
                    value={email}
                    disabled
                    InputProps={{
                      startAdornment: <Email sx={{ color: 'text.secondary', mr: 1 }} />,
                    }}
                    helperText="O e-mail não pode ser alterado"
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={handleUpdateProfile}
                >
                  Salvar Alterações
                </Button>
              </Box>
            </CardContent>
          </Card>


          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Alterar Senha
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    type="password"
                    label="Senha Atual"
                    value={formData.currentPassword}
                    onChange={handleChange('currentPassword')}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="password"
                    label="Nova Senha"
                    value={formData.newPassword}
                    onChange={handleChange('newPassword')}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="password"
                    label="Confirmar Nova Senha"
                    value={formData.confirmPassword}
                    onChange={handleChange('confirmPassword')}
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={handleChangePassword}
                  disabled={!formData.currentPassword || !formData.newPassword || !formData.confirmPassword}
                >
                  Alterar Senha
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>


      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
