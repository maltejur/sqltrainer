import { Paper } from "@material-ui/core";
import React from "react";
import MonacoEditor from "@monaco-editor/react";

export default function SqlEditor({
  value,
  onChange,
  children,
}: {
  value: string;
  onChange: (value: string) => void;
  children?: JSX.Element;
}) {
  return (
    <Paper style={{ width: "100%", zIndex: 10, position: "relative" }}>
      <MonacoEditor
        height={150}
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
