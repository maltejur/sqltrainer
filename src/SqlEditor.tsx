import { Paper } from "@material-ui/core";
import React from "react";
import MonacoEditor from "@monaco-editor/react";

export default function SqlEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Paper style={{ width: "100%", zIndex: 10 }}>
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
    </Paper>
  );
}
