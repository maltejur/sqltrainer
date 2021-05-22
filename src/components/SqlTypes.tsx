import React from "react";
import type { Table } from "../hooks/sql";

export default function SqlTypes({ tables }: { tables: Table[] }) {
  return (
    <pre
      style={{
        position: "fixed",
        left: 10,
        top: 0,
        height: "calc(100vh - 20px)",
        overflowY: "auto",
      }}
    >
      {tables.map((table) => (
        <div key={table.name}>
          <div>{table.name}</div>
          {table.fields.map((field) => (
            <div key={field.name}>
              {"  "}
              {field.name}{" "}
              <span style={{ color: "rgb(200,200,200)" }}>{field.type}</span>
            </div>
          ))}
        </div>
      ))}
    </pre>
  );
}
