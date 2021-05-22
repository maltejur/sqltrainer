import { AppBar, Toolbar, Typography } from "@material-ui/core";
import React, { useState } from "react";
import useLocalStorage from "./hooks/localStorage";
import TaskView from "./pages/Task";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Finished from "./pages/Finished";
import Page404 from "./pages/404";
import Editor from "./pages/Editor";

export default function App() {
  const [solved, setSolved] = useLocalStorage<boolean[]>("solved", []);

  return (
    <Router>
      <AppBar
        position="static"
        color="primary"
        style={{ color: "#fff", backgroundColor: "#3f51b5" }}
      >
        <Toolbar>
          <Link to="/" style={{ color: "white", textDecoration: "none" }}>
            <Typography variant="h6">SQLTrainer</Typography>
          </Link>
        </Toolbar>
      </AppBar>
      <div className="page">
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/task/:id">
            <TaskView solved={solved} setSolved={setSolved} />
          </Route>
          <Route exact path="/finished">
            <Finished setSolved={setSolved} />
          </Route>
          <Route exact path="/editor">
            <Editor />
          </Route>
          <Route path="*">
            <Page404 />
          </Route>
        </Switch>
      </div>
      <style>{`
        .page {
          width: 1000px;
          max-width: calc(100% - 20px);
          margin: auto;
          padding: 50px 10px;
        }
      `}</style>
    </Router>
  );
}
