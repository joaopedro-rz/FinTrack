import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
  Tooltip,
  alpha,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  TrendingUp,
} from '@mui/icons-material';
import { incomeService, enumService } from '@/services';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { calculateRecurringTotal, shouldShowRecurringItem } from '@/utils/recurringCalculations';
import Loading from '@/components/common/Loading';
import EmptyState from '@/components/common/EmptyState';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import PeriodFilterSelect from '@/components/common/PeriodFilterSelect';
import { usePeriodFilter } from '@/hooks';
import type { Income, IncomeRequest, EnumOption } from '@/types';

export default function IncomesPage() {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);
  const [categories, setCategories] = useState<EnumOption[]>([]);
  const [recurrenceTypes, setRecurrenceTypes] = useState<EnumOption[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [incomeToDelete, setIncomeToDelete] = useState<string | null>(null);
  const { selectedPeriod, setSelectedPeriod, dateRange } = usePeriodFilter('30_DAYS');

  // Form state
  const [form, setForm] = useState<IncomeRequest>({
    description: '',
    amount: 0,
    category: 'SALARY',
    date: new Date().toISOString().split('T')[0],
    recurrence: 'ONCE',
    notes: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [incomesData, enumsData] = await Promise.all([
        incomeService.getAll(),
        enumService.getAll(),
      ]);
      setIncomes(incomesData);

      // Verificar se os enums foram carregados corretamente
      if (enumsData) {
        setCategories(enumsData.incomeCategories || []);
        setRecurrenceTypes(enumsData.recurrenceTypes || []);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (income?: Income) => {
    if (income) {
      setEditingIncome(income);
      setForm({
        description: income.description,
        amount: income.amount,
        category: income.category,
        date: income.date,
        recurrence: income.recurrence,
        notes: income.notes || '',
      });
    } else {
      setEditingIncome(null);
      setForm({
        description: '',
        amount: 0,
        category: 'SALARY',
        date: new Date().toISOString().split('T')[0],
        recurrence: 'ONCE',
        notes: '',
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingIncome(null);
  };

  const handleSubmit = async () => {
    try {
      if (editingIncome) {
        await incomeService.update(editingIncome.id, form);
      } else {
        await incomeService.create(form);
      }
      handleCloseDialog();
      loadData();
    } catch (error) {
      console.error('Erro ao salvar receita:', error);
    }
  };

  const handleDelete = async (id: string) => {
    setIncomeToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (incomeToDelete) {
      try {
        await incomeService.delete(incomeToDelete);
        loadData();
      } catch (error) {
        console.error('Erro ao excluir receita:', error);
      }
    }
    setDeleteDialogOpen(false);
    setIncomeToDelete(null);
  };

  const filteredIncomes = incomes
    .filter((income) => shouldShowRecurringItem(income, dateRange, 'date'))
    .sort((a, b) => {
      if (a.recurrence !== 'ONCE' && b.recurrence === 'ONCE') return -1;
      if (a.recurrence === 'ONCE' && b.recurrence !== 'ONCE') return 1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  const totalIncome = calculateRecurringTotal(filteredIncomes, dateRange, 'date');

  if (loading) {
    return <Loading message="Carregando receitas..." />;
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Receitas
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Gerencie suas fontes de renda
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Nova Receita
        </Button>
      </Box>

      {/* Summary Card */}
      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: (theme) => alpha(theme.palette.success.main, 0.1),
                  color: 'success.main',
                }}
              >
                <TrendingUp sx={{ fontSize: 28 }} />
              </Box>
            </Grid>
            <Grid item xs>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Total de Receitas
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                {formatCurrency(totalIncome)}
              </Typography>
            </Grid>
            <Grid item>
              <PeriodFilterSelect
                value={selectedPeriod}
                onChange={setSelectedPeriod}
              />
            </Grid>
            <Grid item>
              <Chip label={`${filteredIncomes.length} registros`} variant="outlined" />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Table */}
      {filteredIncomes.length === 0 ? (
        <EmptyState
          title="Nenhuma receita encontrada"
          description="Não há receitas no período selecionado. Tente ajustar o filtro ou adicione uma nova receita."
          actionLabel="Adicionar Receita"
          onAction={() => handleOpenDialog()}
        />
      ) : (
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Descrição</TableCell>
                  <TableCell>Categoria</TableCell>
                  <TableCell>Data</TableCell>
                  <TableCell>Recorrência</TableCell>
                  <TableCell align="right">Valor</TableCell>
                  <TableCell align="center">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredIncomes.map((income) => (
                  <TableRow key={income.id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {income.description}
                      </Typography>
                      {income.notes && (
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {income.notes}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={income.categoryDisplayName}
                        size="small"
                        sx={{ bgcolor: (theme) => alpha(theme.palette.success.main, 0.1), color: 'success.main' }}
                      />
                    </TableCell>
                    <TableCell>{formatDate(income.date)}</TableCell>
                    <TableCell>{income.recurrenceDisplayName}</TableCell>
                    <TableCell align="right">
                      <Typography sx={{ fontWeight: 600, color: 'success.main' }}>
                        {formatCurrency(income.amount)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Editar">
                        <IconButton size="small" onClick={() => handleOpenDialog(income)}>
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Excluir">
                        <IconButton size="small" color="error" onClick={() => handleDelete(income.id)}>
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {/* Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingIncome ? 'Editar Receita' : 'Nova Receita'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Descrição"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              sx={{ mb: 2.5 }}
              required
            />
            <TextField
              fullWidth
              label="Valor"
              type="number"
              value={form.amount === 0 ? '' : form.amount}
              onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) || 0 })}
              sx={{ mb: 2.5 }}
              required
              placeholder="0,00"
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1, color: 'text.secondary' }}>R$</Typography>,
              }}
            />
            <Grid container spacing={2} sx={{ mb: 2.5 }}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  select
                  label="Categoria"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value as any })}
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  select
                  label="Recorrência"
                  value={form.recurrence}
                  onChange={(e) => setForm({ ...form, recurrence: e.target.value as any })}
                >
                  {recurrenceTypes.map((rec) => (
                    <MenuItem key={rec.value} value={rec.value}>
                      {rec.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
            <TextField
              fullWidth
              type="date"
              label={form.recurrence === 'ONCE' ? 'Data do Recebimento' : 'Data de Recebimento (Mensal)'}
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2.5 }}
              helperText={
                form.recurrence !== 'ONCE'
                  ? 'Esta receita será contabilizada mensalmente a partir desta data'
                  : 'Data única do recebimento'
              }
            />
            <TextField
              fullWidth
              label="Observações"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              multiline
              rows={2}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {editingIncome ? 'Salvar' : 'Adicionar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Excluir Receita"
        message="Tem certeza que deseja excluir esta receita? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        confirmColor="error"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </Box>
  );
}
