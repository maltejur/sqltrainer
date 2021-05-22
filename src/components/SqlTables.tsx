import React from "react";
import type { Table } from "../hooks/sql";

interface Props
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLPreElement>,
    HTMLPreElement
  > {
  tables: Table[];
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
    <pre {...props}>
      {tables
        .filter((table) => includeAll || include.includes(table.name))
        .map((table) => (
          <div key={table.name}>
            <span style={{ fontWeight: "bold" }}>
              {table.name}
              {`  `}
            </span>
            <span style={{ color: "rgb(150, 150, 150)" }}>
              {table.fields.map((field, index) => (
                <span key={field.name}>
                  <span
                    style={{
                      textDecoration:
                        field.name === table.pk ? "underline" : "initial",
                    }}
                  >
                    {field.name}
                  </span>
                  {index !== table.fields.length - 1 && `, `}
                </span>
              ))}
            </span>
          </div>
        ))}
    </pre>
  );
}
