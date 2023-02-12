import * as React from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Link from "@mui/material/Link";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";
import LayersIcon from "@mui/icons-material/Layers";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { QuestionCard } from "@/src/QuestionCard";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Modal,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
  Unstable_Grid2 as Grid2,
} from "@mui/material";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import {
  AddQuestionRequestBody,
  Question,
  questions,
  QuestionStatus,
  UpdateQuestionRequestBody
} from "@/src/types";
import { useStore } from "@/src/clientState";

const mainListItems = (
  <React.Fragment>
    <ListItemButton>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <ShoppingCartIcon />
      </ListItemIcon>
      <ListItemText primary="Orders" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <PeopleIcon />
      </ListItemIcon>
      <ListItemText primary="Customers" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <BarChartIcon />
      </ListItemIcon>
      <ListItemText primary="Reports" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <LayersIcon />
      </ListItemIcon>
      <ListItemText primary="Integrations" />
    </ListItemButton>
  </React.Fragment>
);

const secondaryListItems = (
  <React.Fragment>
    <ListSubheader component="div" inset>
      Saved reports
    </ListSubheader>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Current month" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Last quarter" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Year-end sale" />
    </ListItemButton>
  </React.Fragment>
);

// import { mainListItems, secondaryListItems } from './listItems';
// import Chart from './Chart';
// import Deposits from './Deposits';
// import Orders from './Orders';

function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const drawerWidth: number = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const mdTheme = createTheme();

type FormQuestion = Question | AddQuestionRequestBody;
// { question, onCancel: () => {}, onSaveComplete: () => {}} : { question: EditableQuestion, onCance: () => void, onSaveComplete: () => void }
const EditQuestionForm = ({
  onCancel,
  onSaveComplete,
  question,
}: {
  onCancel: () => void;
  onSaveComplete: () => void;
  question: FormQuestion;
}) => {
  const store = useStore();
  const [currentQuestion, setCurrentQuestion] = React.useState({ ...question });
  const [isSavingInProgress, setIsSavingInProgress] = React.useState(false);

  const onClickSave = async () => {
    const questionToSave: FormQuestion = currentQuestion;
    setIsSavingInProgress(true);
    if ("id" in question){
      await store.updateQuestion(questionToSave as UpdateQuestionRequestBody);
    } else {
      await store.addQuestion(questionToSave);
    }
    setIsSavingInProgress(false);
    onSaveComplete();
  };

  return (
    <Box component="form" sx={{ mt: 2, "& .MuiTextField-root": { mb: 2 } }}>
      <h4>Answer</h4>
      <Stack>
        <TextField
          fullWidth
          label="Answer"
          value={currentQuestion.answer}
          onChange={(event) => {
            setCurrentQuestion({
              ...currentQuestion,
              ...{ answer: event.target.value || null },
            });
          }}
        />
        <Select
          value={currentQuestion.status}
          label="Status"
          onChange={(event) => {
            setCurrentQuestion({
              ...currentQuestion,
              ...{ status: event.target.value },
            });
          }}
        >
          <MenuItem value={QuestionStatus.answerNotYetAvailable}>
            {QuestionStatus.answerNotYetAvailable}
          </MenuItem>
          <MenuItem value={QuestionStatus.answeredAndCouldChange}>
            {QuestionStatus.answeredAndCouldChange}
          </MenuItem>
          <MenuItem value={QuestionStatus.finalAnswerEntered}>
            {QuestionStatus.finalAnswerEntered}
          </MenuItem>
        </Select>
        <FormControlLabel
          control={
            <Checkbox
              checked={currentQuestion.is_finalized}
              onChange={(event) => {
                setCurrentQuestion({
                  ...currentQuestion,
                  ...{ is_finalized: event.target.checked },
                });
              }}
            />
          }
          label="Finalized?"
        />
      </Stack>
      <h4>Question</h4>
      <Stack>
        <TextField
          fullWidth
          value={currentQuestion.title}
          label={"Title"}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setCurrentQuestion({
              ...currentQuestion,
              ...{ title: event.target.value },
            });
          }}
        />
        <TextField
          fullWidth
          multiline
          value={currentQuestion.content}
          label={"Content"}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setCurrentQuestion({
              ...currentQuestion,
              ...{ content: event.target.value || null },
            });
          }}
        />
      </Stack>
      <h4>Choices</h4>
      {currentQuestion.choices.map((choice, choiceIndex) => (
        <Grid key={choiceIndex} container>
          <Button
            onClick={() => {
              const newChoices = [...currentQuestion.choices];
              newChoices.splice(choiceIndex, 1);
              setCurrentQuestion({
                ...currentQuestion,
                ...{ choices: newChoices },
              });
            }}
          >
            Remove
          </Button>
          <TextField
            fullWidth
            value={choice}
            onChange={(event) => {
              const newChoices = [...currentQuestion.choices];
              newChoices[choiceIndex] = event.target.value;
              setCurrentQuestion({
                ...currentQuestion,
                ...{ choices: newChoices },
              });
            }}
          />
        </Grid>
      ))}
      <Button
        onClick={() => {
          const newChoices = [...currentQuestion.choices, ""];
          setCurrentQuestion({
            ...currentQuestion,
            ...{ choices: newChoices },
          });
        }}
      >
        Add Choice
      </Button>
      <Box>
        <h3>Preview</h3>
        <code>{JSON.stringify(currentQuestion)}</code>
        <QuestionCard
          question={{
            ...currentQuestion
          }}
        />
      </Box>
      <Stack spacing={2} sx={{ mt: 2 }} direction="row">
        <Button disabled={isSavingInProgress} variant="text" onClick={onCancel}>
          Cancel
        </Button>
        <Button disabled={isSavingInProgress} variant="contained" color="primary" onClick={onClickSave}>
          Save
        </Button>
      </Stack>
    </Box>
  );
};

function DashboardContent() {
  const [open, setOpen] = React.useState(true);
  const [editingQuestion, setEditingQuestion] = React.useState<
    Question | AddQuestionRequestBody | null
  >(null);
  const store = useStore();

  React.useEffect(() => {
    store.initPage();
  }, []);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const onAddQuestion = () => {
    const newQuestion: AddQuestionRequestBody = {
      answer: null,
      choices: [],
      content: null,
      is_finalized: false,
      order: 1,
      question_pool_id: "2023",
      status: QuestionStatus.answerNotYetAvailable,
      title: "New Question",
    };
    setEditingQuestion(newQuestion);
  };

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: "24px", // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: "36px",
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              Dashboard
            </Typography>
            <IconButton color="inherit">
              <Badge badgeContent={4} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            {mainListItems}
            <Divider sx={{ my: 1 }} />
            {secondaryListItems}
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Toolbar />

          <Button onClick={onAddQuestion}>Add Question</Button>
          <Modal
            open={Boolean(editingQuestion)}
            // onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box
              sx={{
                position: "absolute" as "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                maxWidth: "60%",
                bgcolor: "background.paper",
                border: "2px solid #000",
                boxShadow: 24,
                p: 4,
              }}
            >
              {editingQuestion && (
                <EditQuestionForm
                  question={editingQuestion}
                  onSaveComplete={() => {
                    setEditingQuestion(null);
                  }}
                  onCancel={() => {
                    setEditingQuestion(null);
                  }}
                />
              )}
            </Box>
          </Modal>
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid2
              container
              spacing={{ xs: 2, md: 3 }}
              columns={{ xs: 4, sm: 8, md: 12 }}
            >
              {store.questions?.map((question) => (
                <Grid2 xs={4} sm={4} md={4} key={question.id} alignSelf="stretch">
                  <Button onClick={() => {
                    setEditingQuestion(question);
                  }}>Edit</Button>
                  <QuestionCard key={question.id} question={question} />
                </Grid2>
              ))}
            </Grid2>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default function Dashboard() {
  return <DashboardContent />;
}
