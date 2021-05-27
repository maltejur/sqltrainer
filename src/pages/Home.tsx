import {
  Avatar,
  Button,
  ButtonBase,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
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
        <List component={Paper} style={{ maxWidth: 500, marginTop: 30 }} dense>
          {tasks.map((task, id) => (
            <ListItem button onClick={() => history.push(`/task/${id}`)}>
              <ListItemAvatar>
                <Avatar>{id}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <ReactMarkdown
                    disallowedElements={["p"]}
                    unwrapDisallowed={true}
                  >
                    {task.name}
                  </ReactMarkdown>
                }
                secondary={`von ${task.author}`}
              />
              {solved[id] ? (
                <ListItemIcon>
                  <Check
                    style={{
                      color: "green",
                    }}
                  />
                </ListItemIcon>
              ) : (
                <div />
              )}
            </ListItem>
          ))}
        </List>
      )}
    </div>
  );
}
