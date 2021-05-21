import { AppBar, Toolbar, Typography } from "@material-ui/core";
import React from "react";
import TaskView from "./Task";

export default function App() {
  return (
    <div>
      <AppBar
        position="static"
        color="primary"
        style={{ color: "#fff", backgroundColor: "#3f51b5" }}
      >
        <Toolbar>
          <Typography variant="h6">SQLTrainer</Typography>
        </Toolbar>
      </AppBar>
      <div className="page">
        <TaskView id={0} />
      </div>
      <style jsx>{`
        .page {
          width: 1000px;
          max-width: calc(100% - 20px);
          margin: auto;
          padding: 50px 10px;
        }
      `}</style>
    </div>
  );
}
