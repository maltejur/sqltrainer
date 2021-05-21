import React, { useState } from "react";
import { Button, CircularProgress, Fab, Typography } from "@material-ui/core";
import useSWR from "swr";
import type { Task } from "./types";
import useSql from "./hooks/sql";
import SqlEditor from "./SqlEditor";
import type { QueryExecResult } from "sql.js";
import { Alert } from "@material-ui/lab";
import SqlTable from "./SqlTable";
import SqlTypes from "./SqlTypes";
import DatasetSelector from "./DatasetSelector";
import { Code } from "@material-ui/icons";

export default function TaskView({ id }: { id: number }) {
  const { data } = useSWR<Task[]>("/tasks/tasks.json");
  const { db, tables, setDataset } = useSql();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<{
    sqlResult?: QueryExecResult[];
    error?: Error;
    message?: string;
  }>({});
  const [showTypes, setShowTypes] = useState(false);

  return data ? (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {showTypes && (
        <>
          <SqlTypes tables={tables} />
          <DatasetSelector setDataset={setDataset} />
        </>
      )}
      <Fab
        color="primary"
        style={{ position: "fixed", bottom: 20, left: 20 }}
        onClick={() => setShowTypes((showTypes) => !showTypes)}
      >
        <Code />
      </Fab>
      <Typography variant="h4">
        <span style={{ color: "rgb(200,200,200)", marginRight: 15 }}>
          #{id.toFixed(0).padStart(2, "0")}
        </span>
        {data[id].name}
      </Typography>
      <Typography style={{ marginTop: 15, marginBottom: 15 }}>
        {data[id].task}
      </Typography>
      <SqlEditor value={query} onChange={setQuery} />
      <Button
        onClick={() => {
          if (db) {
            try {
              const sqlResult = db.exec(query);
              console.log(sqlResult);
              if (sqlResult.length) setStatus({ sqlResult });
              else
                setStatus({
                  message: `Transaction was succesfull without any answer`,
                });
            } catch (error) {
              setStatus({ error });
            }
          }
        }}
        variant="contained"
        color="primary"
        style={{ margin: 20, alignSelf: "center" }}
        disabled={query.length === 0}
      >
        Execute
      </Button>
      {status.message && <Alert>{status.message}</Alert>}
      {status.error && <Alert severity="error">{status.error.message}</Alert>}
      {status.sqlResult?.map((queryResult, index) => (
        <SqlTable key={index} table={queryResult} />
      ))}
    </div>
  ) : (
    <CircularProgress />
  );
}
