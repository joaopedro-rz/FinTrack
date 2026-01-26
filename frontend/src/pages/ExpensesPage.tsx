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
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  TrendingDown,
  CheckCircle,
  Schedule,
} from '@mui/icons-material';
import { expenseService, enumService } from '@/services';
import { formatCurrency, formatDate } from '@/utils/formatters';
import Loading from '@/components/common/Loading';
import EmptyState from '@/components/common/EmptyState';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import type { Expense, ExpenseRequest, EnumOption } from '@/types';

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [categories, setCategories] = useState<EnumOption[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<EnumOption[]>([]);
  const [recurrenceTypes, setRecurrenceTypes] = useState<EnumOption[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null);

  // Form state
  const [form, setForm] = useState<ExpenseRequest>({
    description: '',
    amount: 0,
    category: 'FOOD',
    paymentMethod: 'PIX',
    date: new Date().toISOString().split('T')[0],
    recurrence: 'ONCE',
    isPaid: true,
    notes: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [expensesData, enumsData] = await Promise.all([
        expenseService.getAll(),
        enumService.getAll(),
      ]);
      setExpenses(expensesData);

      // Verificar se os enums foram carregados corretamente
      if (enumsData) {
        setCategories(enumsData.expenseCategories || []);
        setPaymentMethods(enumsData.paymentMethods || []);
        setRecurrenceTypes(enumsData.recurrenceTypes || []);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (expense?: Expense) => {
    if (expense) {
      setEditingExpense(expense);
      setForm({
        description: expense.description,
        amount: expense.amount,
        category: expense.category,
        paymentMethod: expense.paymentMethod,
        date: expense.date,
        recurrence: expense.recurrence,
        isPaid: expense.isPaid,
        notes: expense.notes || '',
      });
    } else {
      setEditingExpense(null);
      setForm({
        description: '',
        amount: 0,
        category: 'FOOD',
        paymentMethod: 'PIX',
        date: new Date().toISOString().split('T')[0],
        recurrence: 'ONCE',
        isPaid: true,
        notes: '',
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingExpense(null);
  };

  const handleSubmit = async () => {
    try {
      if (editingExpense) {
        await expenseService.update(editingExpense.id, form);
      } else {
        await expenseService.create(form);
      }
      handleCloseDialog();
      loadData();
    } catch (error) {
      console.error('Erro ao salvar despesa:', error);
    }
  };

  const handleDelete = async (id: string) => {
    setExpenseToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (expenseToDelete) {
      try {
        await expenseService.delete(expenseToDelete);
        loadData();
      } catch (error) {
        console.error('Erro ao excluir despesa:', error);
      }
    }
    setDeleteDialogOpen(false);
    setExpenseToDelete(null);
  };

  const handleTogglePaid = async (expense: Expense) => {
    try {
      if (expense.isPaid) {
        await expenseService.markAsPending(expense.id);
      } else {
        await expenseService.markAsPaid(expense.id);
      }
      loadData();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  const totalExpense = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const pendingExpense = expenses
    .filter((e) => !e.isPaid)
    .reduce((sum, e) => sum + e.amount, 0);

  if (loading) {
    return <Loading message="Carregando despesas..." />;
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Despesas
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Controle seus gastos e contas
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Nova Despesa
        </Button>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: (theme) => alpha(theme.palette.error.main, 0.1),
                    color: 'error.main',
                  }}
                >
                  <TrendingDown sx={{ fontSize: 28 }} />
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Total de Despesas
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'error.main' }}>
                    {formatCurrency(totalExpense)}
                  </Typography>
                </Box>
                <Chip label={`${expenses.length} registros`} variant="outlined" sx={{ ml: 'auto' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: (theme) => alpha(theme.palette.warning.main, 0.1),
                    color: 'warning.main',
                  }}
                >
                  <Schedule sx={{ fontSize: 28 }} />
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Pendentes
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main' }}>
                    {formatCurrency(pendingExpense)}
                  </Typography>
                </Box>
                <Chip
                  label={`${expenses.filter((e) => !e.isPaid).length} a pagar`}
                  variant="outlined"
                  color="warning"
                  sx={{ ml: 'auto' }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Table */}
      {expenses.length === 0 ? (
        <EmptyState
          title="Nenhuma despesa cadastrada"
          description="Comece adicionando sua primeira despesa para controlar seus gastos."
          actionLabel="Adicionar Despesa"
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
                  <TableCell>Pagamento</TableCell>
                  <TableCell>Data</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="right">Valor</TableCell>
                  <TableCell align="center">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {expenses.map((expense) => (
                  <TableRow key={expense.id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {expense.description}
                      </Typography>
                      {expense.notes && (
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {expense.notes}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={expense.categoryDisplayName}
                        size="small"
                        sx={{ bgcolor: (theme) => alpha(theme.palette.error.main, 0.1), color: 'error.main' }}
                      />
                    </TableCell>
                    <TableCell>{expense.paymentMethodDisplayName}</TableCell>
                    <TableCell>{formatDate(expense.date)}</TableCell>
                    <TableCell align="center">
                      <Tooltip title={expense.isPaid ? 'Marcar como pendente' : 'Marcar como pago'}>
                        <Chip
                          icon={expense.isPaid ? <CheckCircle /> : <Schedule />}
                          label={expense.isPaid ? 'Pago' : 'Pendente'}
                          size="small"
                          color={expense.isPaid ? 'success' : 'warning'}
                          onClick={() => handleTogglePaid(expense)}
                          sx={{ cursor: 'pointer' }}
                        />
                      </Tooltip>
                    </TableCell>
                    <TableCell align="right">
                      <Typography sx={{ fontWeight: 600, color: 'error.main' }}>
                        {formatCurrency(expense.amount)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Editar">
                        <IconButton size="small" onClick={() => handleOpenDialog(expense)}>
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Excluir">
                        <IconButton size="small" color="error" onClick={() => handleDelete(expense.id)}>
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
          {editingExpense ? 'Editar Despesa' : 'Nova Despesa'}
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
                  label="Método de Pagamento"
                  value={form.paymentMethod}
                  onChange={(e) => setForm({ ...form, paymentMethod: e.target.value as any })}
                >
                  {paymentMethods.map((pm) => (
                    <MenuItem key={pm.value} value={pm.value}>
                      {pm.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ mb: 2.5 }}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Data"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
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
            <FormControlLabel
              control={
                <Switch
                  checked={form.isPaid}
                  onChange={(e) => setForm({ ...form, isPaid: e.target.checked })}
                />
              }
              label="Já foi pago"
              sx={{ mb: 2 }}
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
            {editingExpense ? 'Salvar' : 'Adicionar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Excluir Despesa"
        message="Tem certeza que deseja excluir esta despesa? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        confirmColor="error"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </Box>
  );
}
