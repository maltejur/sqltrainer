import { Paper } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import MonacoEditor, { useMonaco } from "@monaco-editor/react";
import type {
  IDisposable,
  languages,
} from "monaco-editor/esm/vs/editor/editor.api";
import type { Table } from "../hooks/sql";

let existingProvider: IDisposable;

export default function SqlEditor({
  value,
  onChange,
  children,
  tables,
}: {
  value: string;
  onChange: (value: string) => void;
  children?: JSX.Element;
  tables: Table[];
}) {
  const monaco = useMonaco();

  useEffect(() => {
    if (monaco && tables) {
      if (existingProvider) existingProvider.dispose();
      existingProvider = monaco.languages.registerCompletionItemProvider(
        "sql",
        {
          provideCompletionItems: (model, position, context, token) => {
            return {
              suggestions: [
                ...[
                  // From https://www.sqlite.org/lang_keywords.html
                  "ABORT",
                  "ACTION",
                  "ADD",
                  "AFTER",
                  "ALL",
                  "ALTER",
                  "ALWAYS",
                  "ANALYZE",
                  "AND",
                  "AS",
                  "ASC",
                  "ATTACH",
                  "AUTOINCREMENT",
                  "BEFORE",
                  "BEGIN",
                  "BETWEEN",
                  "BY",
                  "CASCADE",
                  "CASE",
                  "CAST",
                  "CHECK",
                  "COLLATE",
                  "COLUMN",
                  "COMMIT",
                  "CONFLICT",
                  "CONSTRAINT",
                  "CREATE",
                  "CROSS",
                  "CURRENT",
                  "CURRENT_DATE",
                  "CURRENT_TIME",
                  "CURRENT_TIMESTAMP",
                  "DATABASE",
                  "DEFAULT",
                  "DEFERRABLE",
                  "DEFERRED",
                  "DELETE",
                  "DESC",
                  "DETACH",
                  "DISTINCT",
                  "DO",
                  "DROP",
                  "EACH",
                  "ELSE",
                  "END",
                  "ESCAPE",
                  "EXCEPT",
                  "EXCLUDE",
                  "EXCLUSIVE",
                  "EXISTS",
                  "EXPLAIN",
                  "FAIL",
                  "FILTER",
                  "FIRST",
                  "FOLLOWING",
                  "FOR",
                  "FOREIGN",
                  "FROM",
                  "FULL",
                  "GENERATED",
                  "GLOB",
                  "GROUP",
                  "GROUPS",
                  "HAVING",
                  "IF",
                  "IGNORE",
                  "IMMEDIATE",
                  "IN",
                  "INDEX",
                  "INDEXED",
                  "INITIALLY",
                  "INNER",
                  "INSERT",
                  "INSTEAD",
                  "INTERSECT",
                  "INTO",
                  "IS",
                  "ISNULL",
                  "JOIN",
                  "KEY",
                  "LAST",
                  "LEFT",
                  "LIKE",
                  "LIMIT",
                  "MATCH",
                  "MATERIALIZED",
                  "NATURAL",
                  "NO",
                  "NOT",
                  "NOTHING",
                  "NOTNULL",
                  "NULL",
                  "NULLS",
                  "OF",
                  "OFFSET",
                  "ON",
                  "OR",
                  "ORDER",
                  "OTHERS",
                  "OUTER",
                  "OVER",
                  "PARTITION",
                  "PLAN",
                  "PRAGMA",
                  "PRECEDING",
                  "PRIMARY",
                  "QUERY",
                  "RAISE",
                  "RANGE",
                  "RECURSIVE",
                  "REFERENCES",
                  "REGEXP",
                  "REINDEX",
                  "RELEASE",
                  "RENAME",
                  "REPLACE",
                  "RESTRICT",
                  "RETURNING",
                  "RIGHT",
                  "ROLLBACK",
                  "ROW",
                  "ROWS",
                  "SAVEPOINT",
                  "SELECT",
                  "SET",
                  "TABLE",
                  "TEMP",
                  "TEMPORARY",
                  "THEN",
                  "TIES",
                  "TO",
                  "TRANSACTION",
                  "TRIGGER",
                  "UNBOUNDED",
                  "UNION",
                  "UNIQUE",
                  "UPDATE",
                  "USING",
                  "VACUUM",
                  "VALUES",
                  "VIEW",
                  "VIRTUAL",
                  "WHEN",
                  "WHERE",
                  "WINDOW",
                  "WITH",
                  "WITHOUT",
                ].map(
                  (x) =>
                    ({
                      label: x,
                      kind: monaco.languages.CompletionItemKind.Function,
                      insertText: x,
                      insertTextRules:
                        monaco.languages.CompletionItemInsertTextRule
                          .InsertAsSnippet,
                    } as languages.CompletionItem)
                ),
                ...tables.flatMap((table) =>
                  [
                    table.name,
                    ...table.fields.flatMap((field) => [
                      `${table.name}.${field.name}`,
                      field.name,
                    ]),
                  ].map(
                    (x) =>
                      ({
                        label: x,
                        kind: monaco.languages.CompletionItemKind.Variable,
                        insertText: x,
                        insertTextRules:
                          monaco.languages.CompletionItemInsertTextRule
                            .InsertAsSnippet,
                      } as languages.CompletionItem)
                  )
                ),
              ],
            };
          },
        }
      );
    }
  }, [monaco, tables]);

  return (
    <Paper style={{ width: "100%", zIndex: 10, position: "relative" }}>
      <MonacoEditor
        height={180}
        value={value}
        onChange={(value) => onChange(value || "")}
        theme="light"
        language="sql"
        options={{
          wordWrap: "on",
          scrollBeyondLastLine: false,
          minimap: { enabled: false },
          padding: {
            top: 15,
            bottom: 15,
          },
        }}
      />
      {children && children}
    </Paper>
  );
}
