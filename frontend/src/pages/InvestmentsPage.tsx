import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Tooltip,
  alpha,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  ShowChart,
  TrendingUp,
  TrendingDown,
} from '@mui/icons-material';
import { investmentService, enumService } from '@/services';
import { formatCurrency, formatPercentage } from '@/utils/formatters';
import Loading from '@/components/common/Loading';
import EmptyState from '@/components/common/EmptyState';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import type { Investment, InvestmentRequest, EnumOption } from '@/types';

export default function InvestmentsPage() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingInvestment, setEditingInvestment] = useState<Investment | null>(null);
  const [investmentTypes, setInvestmentTypes] = useState<EnumOption[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [investmentToDelete, setInvestmentToDelete] = useState<string | null>(null);

  // Form state
  const [form, setForm] = useState<InvestmentRequest>({
    name: '',
    type: 'STOCKS',
    ticker: '',
    quantity: 1,
    purchasePrice: 0,
    currentPrice: 0,
    purchaseDate: new Date().toISOString().split('T')[0],
    broker: '',
    notes: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [investmentsData, enumsData] = await Promise.all([
        investmentService.getAll(),
        enumService.getAll(),
      ]);
      setInvestments(investmentsData);

      // Verificar se os enums foram carregados corretamente
      if (enumsData) {
        setInvestmentTypes(enumsData.investmentTypes || []);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (investment?: Investment) => {
    if (investment) {
      setEditingInvestment(investment);
      setForm({
        name: investment.name,
        type: investment.type,
        ticker: investment.ticker || '',
        quantity: investment.quantity,
        purchasePrice: investment.purchasePrice,
        currentPrice: investment.currentPrice || 0,
        purchaseDate: investment.purchaseDate,
        broker: investment.broker || '',
        notes: investment.notes || '',
      });
    } else {
      setEditingInvestment(null);
      setForm({
        name: '',
        type: 'STOCKS',
        ticker: '',
        quantity: 1,
        purchasePrice: 0,
        currentPrice: 0,
        purchaseDate: new Date().toISOString().split('T')[0],
        broker: '',
        notes: '',
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingInvestment(null);
  };

  const handleSubmit = async () => {
    try {
      if (editingInvestment) {
        await investmentService.update(editingInvestment.id, form);
      } else {
        await investmentService.create(form);
      }
      handleCloseDialog();
      loadData();
    } catch (error) {
      console.error('Erro ao salvar investimento:', error);
    }
  };

  const getInvestmentCategory = (type: string): 'fixed_income' | 'stocks' | 'funds' | 'crypto' | 'other' => {
    const fixedIncome = ['SAVINGS', 'CDB', 'LCI_LCA', 'TREASURY', 'DEBENTURES'];
    const stocks = ['STOCKS', 'REITS', 'BDRS'];
    const funds = ['ETFS', 'INVESTMENT_FUND', 'PENSION'];
    const crypto = ['CRYPTO'];

    if (fixedIncome.includes(type)) return 'fixed_income';
    if (stocks.includes(type)) return 'stocks';
    if (funds.includes(type)) return 'funds';
    if (crypto.includes(type)) return 'crypto';
    return 'other';
  };

  const handleTypeChange = (newType: string) => {
    setForm({
      ...form,
      type: newType as any,
      ticker: '',
      quantity: 1,
      purchasePrice: 0,
      currentPrice: 0,
      broker: '',
    });
  };

  const handleDelete = async (id: string) => {
    setInvestmentToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (investmentToDelete) {
      try {
        await investmentService.delete(investmentToDelete);
        loadData();
      } catch (error) {
        console.error('Erro ao excluir investimento:', error);
      }
    }
    setDeleteDialogOpen(false);
    setInvestmentToDelete(null);
  };

  const totalInvested = investments.reduce((sum, inv) => sum + inv.totalInvested, 0);
  const currentValue = investments.reduce((sum, inv) => sum + (inv.currentValue || 0), 0);
  const totalProfitLoss = currentValue - totalInvested;
  const profitLossPercentage = totalInvested > 0 ? (totalProfitLoss / totalInvested) * 100 : 0;

  if (loading) {
    return <Loading message="Carregando investimentos..." />;
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Investimentos
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Acompanhe sua carteira de investimentos
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Novo Investimento
        </Button>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
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
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                    color: 'primary.main',
                  }}
                >
                  <ShowChart sx={{ fontSize: 28 }} />
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Total Investido
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {formatCurrency(totalInvested)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
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
                    bgcolor: (theme) => alpha(theme.palette.info.main, 0.1),
                    color: 'info.main',
                  }}
                >
                  <ShowChart sx={{ fontSize: 28 }} />
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Valor Atual
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {formatCurrency(currentValue)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
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
                    bgcolor: (theme) => alpha(
                      totalProfitLoss >= 0 ? theme.palette.success.main : theme.palette.error.main,
                      0.1
                    ),
                    color: totalProfitLoss >= 0 ? 'success.main' : 'error.main',
                  }}
                >
                  {totalProfitLoss >= 0 ? <TrendingUp sx={{ fontSize: 28 }} /> : <TrendingDown sx={{ fontSize: 28 }} />}
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Lucro/Prejuízo
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 700, color: totalProfitLoss >= 0 ? 'success.main' : 'error.main' }}
                  >
                    {totalProfitLoss >= 0 ? '+' : ''}{formatCurrency(totalProfitLoss)}
                  </Typography>
                </Box>
                <Chip
                  label={`${profitLossPercentage >= 0 ? '+' : ''}${formatPercentage(profitLossPercentage)}`}
                  color={profitLossPercentage >= 0 ? 'success' : 'error'}
                  size="small"
                  sx={{ ml: 'auto', fontWeight: 600 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Investment Cards */}
      {investments.length === 0 ? (
        <EmptyState
          title="Nenhum investimento cadastrado"
          description="Comece adicionando seus investimentos para acompanhar a evolução da sua carteira."
          actionLabel="Adicionar Investimento"
          onAction={() => handleOpenDialog()}
        />
      ) : (
        <Grid container spacing={3}>
          {investments.map((investment) => (
            <Grid item xs={12} sm={6} lg={4} key={investment.id}>
              <Card
                sx={{
                  height: '100%',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-4px)' },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {investment.name}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Chip label={investment.typeDisplayName} size="small" variant="outlined" />
                        {investment.ticker && (
                          <Chip label={investment.ticker} size="small" color="primary" />
                        )}
                      </Box>
                    </Box>
                    <Box>
                      <Tooltip title="Editar">
                        <IconButton size="small" onClick={() => handleOpenDialog(investment)}>
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Excluir">
                        <IconButton size="small" color="error" onClick={() => handleDelete(investment.id)}>
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>

                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Quantidade
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {investment.quantity}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Preço Médio
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {formatCurrency(investment.purchasePrice)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Total Investido
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {formatCurrency(investment.totalInvested)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Valor Atual
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {formatCurrency(investment.currentValue || 0)}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Box
                    sx={{
                      mt: 2,
                      pt: 2,
                      borderTop: 1,
                      borderColor: 'divider',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 600,
                        color: (investment.profitLoss || 0) >= 0 ? 'success.main' : 'error.main',
                      }}
                    >
                      {(investment.profitLoss || 0) >= 0 ? '+' : ''}
                      {formatCurrency(investment.profitLoss || 0)}
                    </Typography>
                    <Chip
                      label={`${(investment.profitLossPercentage || 0) >= 0 ? '+' : ''}${formatPercentage(investment.profitLossPercentage || 0)}`}
                      color={(investment.profitLossPercentage || 0) >= 0 ? 'success' : 'error'}
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingInvestment ? 'Editar Investimento' : 'Novo Investimento'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            {/* Nome e Tipo */}
            <Grid container spacing={2} sx={{ mb: 2.5 }}>
              <Grid item xs={8}>
                <TextField
                  fullWidth
                  label="Nome do Investimento"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  placeholder="Ex: Petrobras PN, Tesouro Selic 2029, CDB Inter"
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  select
                  label="Tipo"
                  value={form.type}
                  onChange={(e) => handleTypeChange(e.target.value)}
                >
                  {investmentTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>

            {/* Formulário para RENDA FIXA */}
            {getInvestmentCategory(form.type) === 'fixed_income' && (
              <>
                <Grid container spacing={2} sx={{ mb: 2.5 }}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Valor Investido"
                      type="number"
                      value={form.purchasePrice === 0 ? '' : form.purchasePrice}
                      onChange={(e) => setForm({ ...form, purchasePrice: parseFloat(e.target.value) || 0, quantity: 1 })}
                      required
                      placeholder="0,00"
                      InputProps={{
                        startAdornment: <Typography sx={{ mr: 1, color: 'text.secondary' }}>R$</Typography>,
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Valor Atual"
                      type="number"
                      value={form.currentPrice === 0 ? '' : form.currentPrice}
                      onChange={(e) => setForm({ ...form, currentPrice: parseFloat(e.target.value) || 0 })}
                      placeholder="0,00"
                      helperText="Valor atual com rendimentos"
                      InputProps={{
                        startAdornment: <Typography sx={{ mr: 1, color: 'text.secondary' }}>R$</Typography>,
                      }}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={2} sx={{ mb: 2.5 }}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      type="date"
                      label="Data da Aplicação"
                      value={form.purchaseDate}
                      onChange={(e) => setForm({ ...form, purchaseDate: e.target.value })}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Instituição Financeira"
                      value={form.broker}
                      onChange={(e) => setForm({ ...form, broker: e.target.value })}
                      placeholder="Ex: Nubank, Inter, XP"
                    />
                  </Grid>
                </Grid>
              </>
            )}

            {/* Formulário para AÇÕES */}
            {getInvestmentCategory(form.type) === 'stocks' && (
              <>
                <Grid container spacing={2} sx={{ mb: 2.5 }}>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="Ticker/Código"
                      value={form.ticker}
                      onChange={(e) => setForm({ ...form, ticker: e.target.value.toUpperCase() })}
                      required
                      placeholder="Ex: PETR4, HGLG11"
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="Quantidade"
                      type="number"
                      value={form.quantity === 0 ? '' : form.quantity}
                      onChange={(e) => setForm({ ...form, quantity: parseFloat(e.target.value) || 0 })}
                      required
                      placeholder="0"
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="Preço Médio"
                      type="number"
                      value={form.purchasePrice === 0 ? '' : form.purchasePrice}
                      onChange={(e) => setForm({ ...form, purchasePrice: parseFloat(e.target.value) || 0 })}
                      required
                      placeholder="0,00"
                      InputProps={{
                        startAdornment: <Typography sx={{ mr: 1, color: 'text.secondary' }}>R$</Typography>,
                      }}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={2} sx={{ mb: 2.5 }}>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="Preço Atual"
                      type="number"
                      value={form.currentPrice === 0 ? '' : form.currentPrice}
                      onChange={(e) => setForm({ ...form, currentPrice: parseFloat(e.target.value) || 0 })}
                      placeholder="0,00"
                      InputProps={{
                        startAdornment: <Typography sx={{ mr: 1, color: 'text.secondary' }}>R$</Typography>,
                      }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      type="date"
                      label="Data da Compra"
                      value={form.purchaseDate}
                      onChange={(e) => setForm({ ...form, purchaseDate: e.target.value })}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="Corretora"
                      value={form.broker}
                      onChange={(e) => setForm({ ...form, broker: e.target.value })}
                      placeholder="Ex: XP, Clear, Rico"
                    />
                  </Grid>
                </Grid>
              </>
            )}

            {/* Formulário para FUNDOS */}
            {getInvestmentCategory(form.type) === 'funds' && (
              <>
                <Grid container spacing={2} sx={{ mb: 2.5 }}>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="Código do Fundo"
                      value={form.ticker}
                      onChange={(e) => setForm({ ...form, ticker: e.target.value.toUpperCase() })}
                      placeholder="Ex: BOVA11, HASH11"
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="Quantidade de Cotas"
                      type="number"
                      value={form.quantity === 0 ? '' : form.quantity}
                      onChange={(e) => setForm({ ...form, quantity: parseFloat(e.target.value) || 0 })}
                      required
                      placeholder="0"
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="Valor da Cota (compra)"
                      type="number"
                      value={form.purchasePrice === 0 ? '' : form.purchasePrice}
                      onChange={(e) => setForm({ ...form, purchasePrice: parseFloat(e.target.value) || 0 })}
                      required
                      placeholder="0,00"
                      InputProps={{
                        startAdornment: <Typography sx={{ mr: 1, color: 'text.secondary' }}>R$</Typography>,
                      }}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={2} sx={{ mb: 2.5 }}>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="Valor Atual da Cota"
                      type="number"
                      value={form.currentPrice === 0 ? '' : form.currentPrice}
                      onChange={(e) => setForm({ ...form, currentPrice: parseFloat(e.target.value) || 0 })}
                      placeholder="0,00"
                      InputProps={{
                        startAdornment: <Typography sx={{ mr: 1, color: 'text.secondary' }}>R$</Typography>,
                      }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      type="date"
                      label="Data da Aplicação"
                      value={form.purchaseDate}
                      onChange={(e) => setForm({ ...form, purchaseDate: e.target.value })}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="Corretora/Banco"
                      value={form.broker}
                      onChange={(e) => setForm({ ...form, broker: e.target.value })}
                      placeholder="Ex: XP, Nubank, Inter"
                    />
                  </Grid>
                </Grid>
              </>
            )}

            {/* Formulário para CRIPTOMOEDAS */}
            {getInvestmentCategory(form.type) === 'crypto' && (
              <>
                <Grid container spacing={2} sx={{ mb: 2.5 }}>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="Símbolo"
                      value={form.ticker}
                      onChange={(e) => setForm({ ...form, ticker: e.target.value.toUpperCase() })}
                      required
                      placeholder="Ex: BTC, ETH, SOL"
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="Quantidade"
                      type="number"
                      value={form.quantity === 0 ? '' : form.quantity}
                      onChange={(e) => setForm({ ...form, quantity: parseFloat(e.target.value) || 0 })}
                      required
                      placeholder="0.00000000"
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="Preço Médio (R$)"
                      type="number"
                      value={form.purchasePrice === 0 ? '' : form.purchasePrice}
                      onChange={(e) => setForm({ ...form, purchasePrice: parseFloat(e.target.value) || 0 })}
                      required
                      placeholder="0,00"
                      InputProps={{
                        startAdornment: <Typography sx={{ mr: 1, color: 'text.secondary' }}>R$</Typography>,
                      }}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={2} sx={{ mb: 2.5 }}>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="Preço Atual (R$)"
                      type="number"
                      value={form.currentPrice === 0 ? '' : form.currentPrice}
                      onChange={(e) => setForm({ ...form, currentPrice: parseFloat(e.target.value) || 0 })}
                      placeholder="0,00"
                      InputProps={{
                        startAdornment: <Typography sx={{ mr: 1, color: 'text.secondary' }}>R$</Typography>,
                      }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      type="date"
                      label="Data da Compra"
                      value={form.purchaseDate}
                      onChange={(e) => setForm({ ...form, purchaseDate: e.target.value })}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="Exchange"
                      value={form.broker}
                      onChange={(e) => setForm({ ...form, broker: e.target.value })}
                      placeholder="Ex: Binance, Coinbase, Mercado Bitcoin"
                    />
                  </Grid>
                </Grid>
              </>
            )}

            {/* Formulário para OUTROS */}
            {getInvestmentCategory(form.type) === 'other' && (
              <>
                <Grid container spacing={2} sx={{ mb: 2.5 }}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Valor Investido"
                      type="number"
                      value={form.purchasePrice === 0 ? '' : form.purchasePrice}
                      onChange={(e) => setForm({ ...form, purchasePrice: parseFloat(e.target.value) || 0, quantity: 1 })}
                      required
                      placeholder="0,00"
                      InputProps={{
                        startAdornment: <Typography sx={{ mr: 1, color: 'text.secondary' }}>R$</Typography>,
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Valor Atual Estimado"
                      type="number"
                      value={form.currentPrice === 0 ? '' : form.currentPrice}
                      onChange={(e) => setForm({ ...form, currentPrice: parseFloat(e.target.value) || 0 })}
                      placeholder="0,00"
                      InputProps={{
                        startAdornment: <Typography sx={{ mr: 1, color: 'text.secondary' }}>R$</Typography>,
                      }}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={2} sx={{ mb: 2.5 }}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      type="date"
                      label="Data da Aquisição"
                      value={form.purchaseDate}
                      onChange={(e) => setForm({ ...form, purchaseDate: e.target.value })}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Referência/Local"
                      value={form.broker}
                      onChange={(e) => setForm({ ...form, broker: e.target.value })}
                      placeholder="Ex: Localização, corretora, etc"
                    />
                  </Grid>
                </Grid>
              </>
            )}

            {/* Observações (comum a todos) */}
            <TextField
              fullWidth
              label="Observações"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              multiline
              rows={3}
              placeholder="Informações adicionais sobre o investimento"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {editingInvestment ? 'Salvar' : 'Adicionar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Excluir Investimento"
        message="Tem certeza que deseja excluir este investimento? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        confirmColor="error"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </Box>
  );
}
