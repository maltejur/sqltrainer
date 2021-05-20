import { Button, Fab, Paper, Tabs } from "@material-ui/core";
import React, { useEffect, useRef, useState } from "react";
import MonacoEditor from "@monaco-editor/react";
import type { QueryExecResult } from "sql.js";
import useSql from "./hooks/sql";
import SqlTable from "./SqlTable";
import { Alert } from "@material-ui/lab";
import SqlTypes from "./SqlTypes";
import { Code, Info } from "@material-ui/icons";
import DatasetSelector from "./DatasetSelector";

export default () => {
  const [query, setQuery] = useState("");
  const { db, tables, setDataset } = useSql();
  const [status, setStatus] = useState<{
    sqlResult?: QueryExecResult[];
    error?: Error;
    message?: string;
  }>({});

  const [showTypes, setShowTypes] = useState(false);

  return (
    <div className="page">
      {showTypes && <SqlTypes tables={tables} />}
      <Fab
        color="primary"
        style={{ position: "fixed", bottom: 20, left: 20 }}
        onClick={() => setShowTypes((showTypes) => !showTypes)}
      >
        <Code />
      </Fab>
      <DatasetSelector setDataset={setDataset} />
      <Paper style={{ width: "100%", padding: "10px 0", zIndex: 10 }}>
        <MonacoEditor
          height={150}
          value={query}
          onChange={(value) => setQuery(value || "")}
          theme="light"
          language="sql"
          options={{
            wordWrap: "on",
            scrollBeyondLastLine: false,
            minimap: { enabled: false },
          }}
        />
      </Paper>
      <Button
        onClick={() => {
          if (db) {
            try {
              const sqlResult = db.exec(query);
              if (sqlResult.length) setStatus({ sqlResult: db.exec(query) });
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
        className="executeButton"
        disabled={query.length === 0}
      >
        Execute
      </Button>
      {status.message && <Alert>{status.message}</Alert>}
      {status.error && <Alert severity="error">{status.error.message}</Alert>}
      {status.sqlResult?.map((queryResult, index) => (
        <SqlTable key={index} table={queryResult} />
      ))}
      <style jsx>{`
        .page {
          display: flex;
          flex-direction: column;
          height: calc(100vh - 20px);
          width: 1000px;
          max-width: calc(100% - 20px);
          margin: auto;
          padding: 10px;
          align-items: center;
        }

        .executeButton {
          width: 100px;
          margin: 20px;
        }
      `}</style>
    </div>
  );
};
