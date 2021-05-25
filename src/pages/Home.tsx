import {
  Button,
  ButtonBase,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import React from "react";
import useSWR from "swr";
import type { Task } from "../types";
import { Link, useHistory } from "react-router-dom";
import useLocalStorage from "../hooks/localStorage";
import { Check } from "@material-ui/icons";
import ReactMarkdown from "react-markdown";

export default function Home() {
  const tasks = useSWR<Task[]>("/tasks/tasks.json").data;
  const [solved] = useLocalStorage<boolean[]>("solved", []);
  const history = useHistory();

  return (
    <div>
      <Typography variant="h4">SQLTrainer</Typography>
      {tasks && (
        <TableContainer component={Paper} style={{ marginTop: 30 }}>
          <Table size="small">
            <TableHead>
              <TableCell>Nummer</TableCell>
              <TableCell>Aufgabe</TableCell>
              <TableCell>Gelöst</TableCell>
            </TableHead>
            <TableBody>
              {tasks.map((task) => (
                <ButtonBase
                  component={TableRow}
                  onClick={() => history.push(`/task/${task.id}`)}
                >
                  <TableCell>{task.id}</TableCell>
                  <TableCell>
                    <ReactMarkdown
                      disallowedElements={["p"]}
                      unwrapDisallowed={true}
                    >
                      {task.name}
                    </ReactMarkdown>
                  </TableCell>
                  <TableCell>
                    {solved[task.id] ? (
                      <Check
                        style={{
                          color: "green",
                        }}
                      />
                    ) : (
                      <div />
                    )}
                  </TableCell>
                </ButtonBase>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
}
