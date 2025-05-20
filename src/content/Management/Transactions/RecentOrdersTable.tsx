import { FC, ChangeEvent, useState, useEffect } from 'react';
import {
  Tooltip,
  Divider,
  Box,
  Card,
  Checkbox,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableContainer,
  
  useTheme,
  CardHeader,
  CircularProgress
} from '@mui/material';

import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import axios from 'axios';
import BulkActions from './BulkActions';

interface Lender {
  _id: string;
  lenderName: string;
  state: string;
  city: string;
  managerName: string;
  bankerName: string;
  email: string;
  rmName: string;
  rmContact: string;
  asmName: string;
  asmContact: string;
  rsmName: string;
  rsmContact: string;
  zsmName: string;
}

const RecentLendersTable: FC = () => {
  const [lenders, setLenders] = useState<Lender[]>([]);
  const [selectedLenders, setSelectedLenders] = useState<string[]>([]);
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  // API Call
useEffect(() => {
  const fetchLenders = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/lenders/get-lenders`);
      setLenders(res.data);
    } catch (error) {
      console.error('Error fetching lenders:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchLenders();
}, []);


  // Pagination
  const paginatedLenders = lenders.slice(page * limit, page * limit + limit);

  const selectedAll = selectedLenders.length === lenders.length;
  const selectedSome =
    selectedLenders.length > 0 && selectedLenders.length < lenders.length;
  const selectedBulkActions = selectedLenders.length > 0;

  const handleSelectAll = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedLenders(event.target.checked ? lenders.map((l) => l._id) : []);
  };

  const handleSelectOne = (_e: ChangeEvent<HTMLInputElement>, id: string) => {
    setSelectedLenders((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const handlePageChange = (_e: any, newPage: number) => setPage(newPage);
  const handleLimitChange = (e: ChangeEvent<HTMLInputElement>) =>
    setLimit(parseInt(e.target.value));

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Card>
      {selectedBulkActions ? (
        <Box flex={1} p={2}>
          <BulkActions />
        </Box>
      ) : (
        <CardHeader title="Recent Lenders" />
      )}
      <Divider />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  checked={selectedAll}
                  indeterminate={selectedSome}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>Lender Name</TableCell>
              <TableCell>State</TableCell>
              <TableCell>City</TableCell>
              <TableCell>Manager</TableCell>
              <TableCell>Banker</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>RM</TableCell>
              <TableCell>ASM</TableCell>
              <TableCell>RSM</TableCell>
              <TableCell>ZSM</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedLenders.map((lender) => {
              const isSelected = selectedLenders.includes(lender._id);
              return (
                <TableRow hover key={lender._id} selected={isSelected}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={isSelected}
                      onChange={(e) => handleSelectOne(e, lender._id)}
                    />
                  </TableCell>
                  <TableCell>{lender.lenderName}</TableCell>
                  <TableCell>{lender.state}</TableCell>
                  <TableCell>{lender.city}</TableCell>
                  <TableCell>{lender.managerName}</TableCell>
                  <TableCell>{lender.bankerName}</TableCell>
                  <TableCell>{lender.email}</TableCell>
                  <TableCell>
                    {lender.rmName}
                    <br />
                    <small>{lender.rmContact}</small>
                  </TableCell>
                  <TableCell>
                    {lender.asmName}
                    <br />
                    <small>{lender.asmContact}</small>
                  </TableCell>
                  <TableCell>
                    {lender.rsmName}
                    <br />
                    <small>{lender.rsmContact}</small>
                  </TableCell>
                  <TableCell>{lender.zsmName}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit" arrow>
                      <IconButton
                        sx={{
                          '&:hover': {
                            background: theme.colors.primary.lighter
                          },
                          color: theme.palette.primary.main
                        }}
                        size="small"
                      >
                        <EditTwoToneIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete" arrow>
                      <IconButton
                        sx={{
                          '&:hover': {
                            background: theme.colors.error.lighter
                          },
                          color: theme.palette.error.main
                        }}
                        size="small"
                      >
                        <DeleteTwoToneIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Box p={2}>
        <TablePagination
          component="div"
          count={lenders.length}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
          page={page}
          rowsPerPage={limit}
          rowsPerPageOptions={[5, 10, 25, 30]}
        />
      </Box>
    </Card>
  );
};

export default RecentLendersTable;
