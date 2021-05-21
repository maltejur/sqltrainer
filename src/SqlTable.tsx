import React, { useState } from "react";
import type { QueryExecResult } from "sql.js";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { Add } from "@material-ui/icons";

export default function SqlTable({ table }: { table: QueryExecResult }) {
  const [limit, setLimit] = useState(20);

  return (
    <TableContainer component={Paper} className="tableContainer">
      <Table>
        <TableHead>
          <TableRow>
            {table.columns.map((column, index) => (
              <TableCell key={index}>{column}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {table.values.slice(0, limit).map((row, index) => (
            <TableRow key={index}>
              {row.map((column, index) => (
                <TableCell key={index}>{column}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {table.values.length > limit && (
        <Button
          className="more"
          startIcon={<Add />}
          onClick={() => setLimit((limit) => limit + 20)}
        >
          More
        </Button>
      )}
      <style jsx>
        {`
          .tableContainer {
            display: flex;
            flex-direction: column;
          }

          .more {
            align-self: center;
            margin: 20px;
          }
        `}
      </style>
    </TableContainer>
  );
}
