import type { Table as TableType } from "../hooks/sql";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@material-ui/core";
import React from "react";

interface Props
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLPreElement>,
    HTMLPreElement
  > {
  tables: TableType[];
  include?: string[];
  includeAll?: boolean;
}

export default function SqlTables({
  tables,
  include = [],
  includeAll = false,
  ...props
}: Props) {
  return (
    <TableContainer>
      <Table size="small">
        <TableBody>
          {tables
            .filter((table) => includeAll || include.includes(table.name))
            .map((table) => (
              <TableRow key={table.name}>
                <TableCell style={{ fontWeight: "bold" }}>
                  {table.name}
                  {` `}
                </TableCell>
                <TableCell
                  style={{
                    color: "rgb(150, 150, 150)",
                  }}
                >
                  {table.fields.map((field, index) => (
                    <>
                      <span
                        style={{
                          textDecoration:
                            field.name === table.pk ? "underline" : "initial",
                        }}
                      >
                        {field.name}
                      </span>
                      {index !== table.fields.length - 1 && `, `}
                    </>
                  ))}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
