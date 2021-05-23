import { Button, Paper, Typography } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import React, { useState } from "react";
import type { QueryExecResult } from "sql.js";
import SqlEditor from "../components/SqlEditor";
import SqlTable from "../components/SqlTable";
import SqlTables from "../components/SqlTables";
import useSql from "../hooks/sql";

export default function Editor() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<{
    sqlResult?: QueryExecResult[];
    error?: string;
    message?: string;
  }>({});
  const { tables, exec } = useSql("/Chinook_Sqlite.sqlite");

  return (
    <div>
      <Typography variant="h4" style={{ marginBottom: 20 }}>
        Editor
      </Typography>
      <Paper style={{ padding: 15, marginBottom: 30 }}>
        <SqlTables tables={tables} includeAll style={{ margin: 0 }} />
      </Paper>
      <SqlEditor value={query} onChange={setQuery} tables={tables}>
        <div
          style={{
            position: "absolute",
            right: 15,
            bottom: 15,
            display: "flex",
          }}
        >
          <Button
            onClick={() => {
              try {
                const sqlResult = exec([query]);
                downloadString(
                  JSON.stringify(sqlResult),
                  "application/json",
                  "expected.json"
                );
                setStatus({ message: "Download started", sqlResult });
              } catch (error) {
                setStatus({ error: error.message });
              }
            }}
            variant="contained"
            color="primary"
          >
            Save answer
          </Button>
          <Button
            onClick={() => {
              try {
                const sqlResult = exec([query]);
                setStatus({ sqlResult });
              } catch (error) {
                setStatus({ error: error.message });
              }
            }}
            variant="contained"
            color="primary"
            style={{ marginLeft: 10 }}
          >
            Run
          </Button>
        </div>
      </SqlEditor>
      <div style={{ marginTop: 30 }}>
        {status.message && <Alert>{status.message}</Alert>}
        {status.error && <Alert severity="error">{status.error}</Alert>}
        {status.sqlResult?.map((queryResult, index) => (
          <SqlTable key={index} table={queryResult} />
        ))}
      </div>
    </div>
  );
}

function downloadString(text: string, fileType: string, fileName: string) {
  const blob = new Blob([text], { type: fileType });
  const a = document.createElement("a");
  a.download = fileName;
  a.href = URL.createObjectURL(blob);
  a.dataset.downloadurl = [fileType, a.download, a.href].join(":");
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(function () {
    URL.revokeObjectURL(a.href);
  }, 1500);
}
