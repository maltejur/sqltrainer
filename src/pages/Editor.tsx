import { Button, MenuItem, Paper, Select, Typography } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import React, { useState } from "react";
import type { QueryExecResult } from "sql.js";
import SqlEditor from "../components/SqlEditor";
import SqlTable from "../components/SqlTable";
import SqlTables from "../components/SqlTables";
import useSql from "../hooks/sql";

const databases = [
  "/Chinook_Sqlite.sqlite",
  "/Northwind_small.sqlite",
  "/Northwind_large.sqlite",
];

export default function Editor() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<{
    sqlResult?: QueryExecResult[];
    error?: string;
    message?: string;
    time?: number;
  }>({});
  const [database, setDatabase] = useState(databases[0]);
  const { tables, exec } = useSql(database);

  return (
    <div>
      <Typography variant="h4" style={{ marginBottom: 20 }}>
        Editor{" "}
        <Select
          value={database}
          onChange={(event) => setDatabase(event.target.value as string)}
        >
          {databases.map((database) => (
            <MenuItem key={database} value={database}>
              {database}
            </MenuItem>
          ))}
        </Select>
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
                let time = Date.now();
                const sqlResult = exec([query]);
                time = Date.now() - time;
                downloadString(
                  JSON.stringify(sqlResult),
                  "application/json",
                  "expected.json"
                );
                setStatus({ message: "Download started", sqlResult, time });
              } catch (error: any) {
                setStatus({ error: error.message });
              }
            }}
            variant="contained"
            color="primary"
            disabled={query.length === 0 || tables.length === 0}
          >
            Save answer
          </Button>
          <Button
            onClick={() => {
              try {
                let time = Date.now();
                const sqlResult = exec([query]);
                time = Date.now() - time;
                setStatus({ sqlResult, time });
              } catch (error: any) {
                setStatus({ error: error.message });
              }
            }}
            variant="contained"
            color="primary"
            style={{ marginLeft: 10 }}
            disabled={query.length === 0 || tables.length === 0}
          >
            Run
          </Button>
        </div>
      </SqlEditor>
      <div style={{ marginTop: 30 }}>
        {status.message && <Alert>{status.message}</Alert>}
        {status.error && <Alert severity="error">{status.error}</Alert>}
        {!!status.sqlResult &&
          status.sqlResult[0] &&
          status.time !== undefined && (
            <Alert severity="info">
              {status.sqlResult[0].values.length} rows in {status.time / 1000}s
            </Alert>
          )}
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
