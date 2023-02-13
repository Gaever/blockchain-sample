import Footer from "@/components/footer";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow, { TableRowProps } from "@mui/material/TableRow";
import BigNumber from "bignumber.js";
import HeaderToolbar from "../components/header-toolbar";
import MiniChart from "../components/mini-chart";
import useStockListSubscription from "../hooks/use-stock-list-subscription";

const StyledTableRow = styled(TableRow)<TableRowProps>(({ theme }) => ({
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
    cursor: "pointer",
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
  textDecoration: "none",
}));

function StockListPage() {
  const { stockList } = useStockListSubscription();

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <HeaderToolbar />
      <Box sx={{ height: "calc(100vh - 81px)", display: "flex", justifyContent: "space-between", flexDirection: "column" }}>
        <TableContainer component={Paper} sx={{ "&.MuiPaper-root": { boxShadow: "none" } }}>
          <Table
            sx={{
              "& .MuiTableCell-root.md": {
                display: { xs: "none", md: "table-cell" },
              },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell>Symbol</TableCell>
                <TableCell align="center">Stock</TableCell>
                <TableCell align="center">Price</TableCell>
                <TableCell className="md" align="center">
                  Change
                </TableCell>
                <TableCell className="md" align="center">
                  Change %
                </TableCell>
                <TableCell className="md" align="center">
                  Root volume
                </TableCell>
                <TableCell className="md" align="center">
                  Volume
                </TableCell>
                <TableCell className="md" align="center">
                  Chart
                </TableCell>
                <TableCell align="center"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(stockList || []).map((row) => (
                <StyledTableRow
                  key={row.id}
                  // @ts-ignore
                  component="a"
                  href={`/stock/${row.id}`}
                  sx={{
                    "& .MuiTableCell-root": {
                      borderBottomWidth: "1px",
                      borderBottomStyle: "solid",
                      borderBottomColor: "divider",
                    },
                    borderBottomWidth: "1px",
                    borderBottomStyle: "solid",
                    borderBottomColor: "divider",
                  }}
                >
                  <TableCell component="th" scope="row">
                    {`${row.cur1.toUpperCase()}${row.cur2.toUpperCase()}`}
                  </TableCell>
                  <TableCell align="center">{row.title}</TableCell>
                  <TableCell align="center">{new BigNumber(row.rate || "0").sd(10).toFormat()}</TableCell>
                  <TableCell
                    className="md"
                    align="center"
                    sx={{
                      color: +(row?.diff || 0) >= 0 ? "primary.main" : "error.main",
                    }}
                  >
                    {+(row?.diff || 0) >= 0 ? "+" : "-"}
                    {new BigNumber(row.diff || "0").sd(5).toFormat()}
                  </TableCell>
                  <TableCell
                    className="md"
                    align="center"
                    sx={{
                      color: +(row?.diff || 0) >= 0 ? "primary.main" : "error.main",
                    }}
                  >
                    {+(row?.diff || 0) >= 0 ? "+" : "-"}
                    {new BigNumber(row.diffPercent || 0).sd(3).toFormat()}
                  </TableCell>
                  <TableCell className="md" align="center">
                    {new BigNumber(row.volume1 || 0).sd(10).toFormat()} {row.cur1?.toUpperCase?.()}
                  </TableCell>
                  <TableCell className="md" align="center">
                    {new BigNumber(row.volume2 || 0).sd(10).toFormat()} {row.cur2?.toUpperCase?.()}
                  </TableCell>
                  <TableCell className="md" align="center" sx={{ maxWidth: "220px" }}>
                    <MiniChart layout={{ width: 200, height: 40 }} data={row.chartData || []} />
                  </TableCell>
                  <TableCell
                    // @ts-ignore
                    component="a"
                    href={`${process.env.REACT_APP_API_URL}/stock/${row.id}/pdf`}
                    target="_blank"
                    align="center"
                    onClick={(event) => {
                      event.stopPropagation();
                    }}
                    sx={{
                      borderBottomWidth: "1px",
                      borderBottomStyle: "solid",
                      borderBottomColor: "divider",
                    }}
                  >
                    PDF
                  </TableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Footer />
      </Box>
    </Box>
  );
}

export default StockListPage;
