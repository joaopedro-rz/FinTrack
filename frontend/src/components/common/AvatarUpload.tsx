import { useState, useRef, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Slider,
  Typography,
  IconButton,
  Avatar,
  Badge,
} from '@mui/material';
import {
  CameraAlt,
  ZoomIn,
  RotateRight,
  Close,
} from '@mui/icons-material';
import AvatarEditor from 'react-avatar-editor';

interface AvatarUploadProps {
  currentAvatar?: string | null;
  userName: string;
  onSave: (imageData: string) => void;
}

/**
 * Componente para upload e edição de foto de perfil.
 * Permite selecionar imagem do dispositivo, ajustar zoom e rotação.
 */
export default function AvatarUpload({ currentAvatar, userName, onSave }: AvatarUploadProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  const editorRef = useRef<AvatarEditor>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione apenas arquivos de imagem.');
        return;
      }
      // Validar tamanho (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('A imagem deve ter no máximo 5MB.');
        return;
      }
      setImage(file);
      setDialogOpen(true);
      setZoom(1);
      setRotation(0);
    }
  }, []);

  const handleOpenFilePicker = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleClose = useCallback(() => {
    setDialogOpen(false);
    setImage(null);
    setZoom(1);
    setRotation(0);
    // Limpar input para permitir selecionar o mesmo arquivo novamente
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const handleSave = useCallback(() => {
    if (editorRef.current) {
      // Obter a imagem editada como base64
      const canvas = editorRef.current.getImageScaledToCanvas();
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      onSave(dataUrl);
      handleClose();
    }
  }, [onSave, handleClose]);

  const handleRotate = useCallback(() => {
    setRotation((prev) => (prev + 90) % 360);
  }, []);

  return (
    <>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        // Permite captura de câmera em dispositivos móveis
        capture="environment"
      />


      <Badge
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        badgeContent={
          <IconButton
            size="small"
            onClick={handleOpenFilePicker}
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              '&:hover': { bgcolor: 'primary.dark' },
              width: 32,
              height: 32,
            }}
          >
            <CameraAlt fontSize="small" />
          </IconButton>
        }
      >
        <Avatar
          src={currentAvatar || undefined}
          sx={{
            width: 100,
            height: 100,
            fontSize: '2.5rem',
            bgcolor: 'primary.main',
            cursor: 'pointer',
          }}
          onClick={handleOpenFilePicker}
        >
          {!currentAvatar && userName?.charAt(0).toUpperCase()}
        </Avatar>
      </Badge>


      <Dialog open={dialogOpen} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          Editar Foto de Perfil
          <IconButton onClick={handleClose} size="small">
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          {image && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>

              <Box
                sx={{
                  border: 2,
                  borderColor: 'divider',
                  borderRadius: 2,
                  overflow: 'hidden',
                }}
              >
                <AvatarEditor
                  ref={editorRef}
                  image={image}
                  width={250}
                  height={250}
                  border={20}
                  borderRadius={125}
                  color={[0, 0, 0, 0.6]}
                  scale={zoom}
                  rotate={rotation}
                />
              </Box>


              <Box sx={{ width: '100%', maxWidth: 300 }}>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <ZoomIn sx={{ color: 'text.secondary' }} />
                  <Slider
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    onChange={(_, value) => setZoom(value as number)}
                    aria-label="Zoom"
                  />
                  <Typography variant="body2" sx={{ minWidth: 40, textAlign: 'right' }}>
                    {Math.round(zoom * 100)}%
                  </Typography>
                </Box>


                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Button
                    variant="outlined"
                    startIcon={<RotateRight />}
                    onClick={handleRotate}
                  >
                    Girar 90°
                  </Button>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} color="inherit">
            Cancelar
          </Button>
          <Button onClick={handleSave} variant="contained">
            Salvar Foto
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
