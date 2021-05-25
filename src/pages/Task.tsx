import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  Button,
  CircularProgress,
  Fab,
  Paper,
  Typography,
} from "@material-ui/core";
import useSWR from "swr";
import type { Task } from "../types";
import useSql from "../hooks/sql";
import SqlEditor from "../components/SqlEditor";
import type { QueryExecResult } from "sql.js";
import { Alert } from "@material-ui/lab";
import SqlTable from "../components/SqlTable";
import { ArrowBack, ArrowForward, Check, Code } from "@material-ui/icons";
import SqlTables from "../components/SqlTables";
import useLocalStorage from "../hooks/localStorage";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";

export default function TaskView({
  solved,
  setSolved,
}: {
  solved: boolean[];
  setSolved: Dispatch<SetStateAction<boolean[]>>;
}) {
  const id = Number.parseInt(useParams<{ id: string | undefined }>().id!);
  const tasks = useSWR<Task[]>("/tasks/tasks.json").data;
  const [expected, setExpected] = useState<string>();
  const { tables, exec } = useSql(tasks ? tasks[id].db : undefined);
  const [query, setQuery] = useLocalStorage(`solution${id}`, "", [id]);
  const [status, setStatus] = useState<{
    sqlResult?: QueryExecResult[];
    error?: string;
    message?: string;
  }>({});

  useEffect(() => {
    fetch(`/tasks/expected/${id}.json`).then(async (response) => {
      setExpected(await response.text());
    });
    setStatus({});
  }, [id]);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 30,
        }}
      >
        <Link
          to={`/task/${id - 1}`}
          style={{
            opacity: id === 0 ? 0 : 1,
            pointerEvents: id === 0 ? "none" : "all",
          }}
        >
          <Button startIcon={<ArrowBack />}>Vorherige Aufgabe</Button>
        </Link>
        {solved[id] && (
          <Link
            to={
              tasks && id === tasks.length - 1 ? `/finished` : `/task/${id + 1}`
            }
          >
            <Button
              endIcon={<ArrowForward />}
              color="primary"
              variant="contained"
            >
              Nächste Aufgabe
            </Button>
          </Link>
        )}
      </div>
      {tasks ? (
        <>
          <Typography variant="h4">
            <span style={{ color: "rgb(200,200,200)", marginRight: 15 }}>
              #{id.toFixed(0).padStart(2, "0")}
            </span>
            <ReactMarkdown disallowedElements={["p"]} unwrapDisallowed={true}>
              {tasks[id].name}
            </ReactMarkdown>
            {solved[id] && (
              <Check style={{ color: "green", marginLeft: "10px" }} />
            )}
          </Typography>
          <Typography style={{ marginTop: 30, marginBottom: 30 }}>
            <ReactMarkdown disallowedElements={["p"]} unwrapDisallowed={true}>
              {tasks[id].task}
            </ReactMarkdown>
          </Typography>
          <Paper style={{ padding: 15, marginBottom: 20 }}>
            <Typography
              variant="h6"
              style={{
                fontSize: 16,
              }}
            >
              Struktur der Datenbank
            </Typography>
            <SqlTables
              tables={tables}
              include={tasks[id].includeTables}
              style={{ marginTop: 5 }}
            />
          </Paper>
          <SqlEditor
            value={query}
            onChange={setQuery}
            tables={tables.filter((table) =>
              tasks[id].includeTables.includes(table.name)
            )}
          >
            <Button
              onClick={() => {
                try {
                  let testResult = exec([
                    query,
                    ...(tasks[id].testQuery ? [tasks[id].testQuery!] : []),
                  ]);
                  if (JSON.stringify(testResult) === expected) {
                    setStatus({
                      sqlResult: testResult,
                      message: "Richtige Antwort",
                    });
                    setSolved((oldSolved: boolean[]) => {
                      const solved: boolean[] = [...oldSolved];
                      solved[id] = true;
                      return solved;
                    });
                  } else {
                    console.log(JSON.stringify(testResult));
                    console.log(expected);
                    setStatus({
                      sqlResult: testResult,
                      error: `Unerwartete Antwort${
                        !testResult.length ? " (leere Antwort)" : ""
                      }`,
                    });
                  }
                } catch (error) {
                  setStatus({ error: `SQL-Fehler: ${error.message}` });
                }
              }}
              variant="contained"
              color="primary"
              style={{ position: "absolute", right: 15, bottom: 15 }}
              disabled={query.length === 0}
            >
              Ausführen
            </Button>
          </SqlEditor>

          <div style={{ marginTop: 30 }}>
            {status.message && <Alert>{status.message}</Alert>}
            {status.error && <Alert severity="error">{status.error}</Alert>}
            {status.sqlResult?.map((queryResult, index) => (
              <SqlTable key={index} table={queryResult} />
            ))}
          </div>
        </>
      ) : (
        <CircularProgress />
      )}
    </div>
  );
}
