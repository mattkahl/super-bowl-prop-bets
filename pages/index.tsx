import { QuestionStatus, User } from "@/src/types";

// export default function Dashboard() {
//   const { data: user, error, isLoading } = useSWR<User>("/api/user");
//   return <h1>Hello! {user?.name}</h1>;
// }

import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import CameraIcon from "@mui/icons-material/PhotoCamera";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Chip, Dialog, DialogTitle } from "@mui/material";

import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { useStore } from "@/src/clientState";

const columns: GridColDef[] = [
  { field: "currentPlace", headerName: "Place", flex: 0.2 },
  {
    field: "userName",
    headerName: "Name",
    flex: 1,
  },
  {
    field: "currentScore",
    headerName: "Score",
    type: "number",
    sortable: true,
    flex: 0.2,
  },
  {
    field: "tentativeScore",
    headerName: "Tentative Score",
    type: "number",
    flex: 0.4,
    sortable: true,
  },
];

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const theme = createTheme();

export default function Album() {
  const store = useStore();

  React.useEffect(() => {
    store.refreshLeaderboard();
    setInterval(() => {
      store.refreshLeaderboard();
    }, 1000 * 20);
  }, []);

  const rows = store.submissions || [];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap>
            🏈 Super Bowl Props 2023
          </Typography>
        </Toolbar>
      </AppBar>
      <main>
        <Grid
          container
          xs={12}
          md={6}
          sx={{
            pl: 2,
            pr: 2,
          }}
        >
          <Card sx={{ width: "100%" }}>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Leaderboard
              </Typography>
              <Typography gutterBottom variant="h6" component="div">
                1st Place (${rows.length * 5 * 0.75}) - 2nd Place ($
                {rows.length * 5 * 0.25})
              </Typography>
              <Typography gutterBottom variant="body1" component="div">
                "Tentative Score" is what your score would be if the game ended
                right now (answers that are subject to change, like total points
                in the fourth quarter, are marked correct).
              </Typography>
              <Typography variant="caption">
                {store.lastRefreshedAt
                  ? `Auto-updated at: ${store.lastRefreshedAt.toLocaleString()}`
                  : "--"}
              </Typography>
              <Box sx={{ height: "40vh", width: "100%" }}>
                <div style={{ display: "flex", height: "100%" }}>
                  <div style={{ flexGrow: 1 }}>
                    <DataGrid
                      rows={rows}
                      columns={columns}
                      pageSize={10}
                      rowsPerPageOptions={[5]}
                      getRowId={(row) => `${row.userEmail}${row.userName}`}
                      disableSelectionOnClick
                    />
                  </div>
                </div>
              </Box>
            </CardContent>
          </Card>
          <Card sx={{ width: "100%" }}>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Answers
              </Typography>
              <Stack spacing={3}>
                {store.answers?.map((answer) => {
                  return (
                    <Container key={answer.id}>
                      <Grid container>

                      </Grid>
                      <Typography variant="body2">{answer.title}</Typography>
                      {
                        answer.status === QuestionStatus.answerNotYetAvailable && (
                          <Chip label="N/A" />
                        )
                      }
                      {
                        answer.status === QuestionStatus.answeredAndCouldChange && (
                          <Chip color="primary" label="Could Change" />
                        )
                      }
                      {
                        answer.status === QuestionStatus.finalAnswerEntered && (
                          <Chip color="success" label="Final" />
                        )
                      }
                      <strong>{`    ${answer.answer}`}</strong>
                    </Container>
                  );
                })}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </main>
      {/* End footer */}
    </ThemeProvider>
  );
}
