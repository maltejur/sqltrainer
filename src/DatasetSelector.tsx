import { Button, CircularProgress } from "@material-ui/core";
import React, { useState } from "react";

export default function DatasetSelector({
  setDataset,
}: {
  setDataset: (url: string) => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);

  return (
    <div
      style={{
        position: "fixed",
        right: 10,
        top: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
      }}
    >
      {loading ? (
        <CircularProgress />
      ) : (
        [
          { name: "Chinook", url: "/Chinook_Sqlite.sqlite" },
          { name: "Northwind (small)", url: "/Northwind_small.sqlite" },
          { name: "Northwind (large)", url: "/Northwind_large.sqlite" },
          { name: "Empty", url: "/empty.sqlite" },
        ].map((dataset) => (
          <Button
            variant="contained"
            color="primary"
            style={{ marginBottom: 10 }}
            onClick={async () => {
              setLoading(true);
              await setDataset(dataset.url);
              setLoading(false);
            }}
          >
            {dataset.name}
          </Button>
        ))
      )}
    </div>
  );
}
