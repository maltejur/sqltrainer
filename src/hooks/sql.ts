import { useEffect, useState } from "react";
import type { SqlJsStatic, Database, SqlValue } from "sql.js";
/* @ts-ignore */
import initSqlJs from "sql.js/dist/sql-asm-memory-growth.js";

export interface Table {
  name: string;
  fields: {
    name: string;
    type: string;
  }[];
}

export default function useSql() {
  const [db, setDb] = useState<Database>();
  const [tables, setTables] = useState<Table[]>([]);
  const [_SQL, setSQL] = useState<SqlJsStatic>();

  async function setDataset(
    url: string,
    SQL: SqlJsStatic = _SQL as SqlJsStatic
  ) {
    if (!SQL) throw new Error("SQLite not initialized or available");
    const _db = new SQL.Database(
      new Uint8Array(await (await fetch(url)).arrayBuffer())
    );
    setDb(_db);
    const response = _db.exec(
      `SELECT name,sql FROM sqlite_master WHERE type="table"`
    );
    setTables(
      response[0]
        ? response[0].values.map(([name, sql]) => {
            const table: Table = { name: name!.toString(), fields: [] };
            for (const match of sql!
              .toString()
              // Just works for this dataset
              .matchAll(/^ {1,4}(.+?) (.+),.{0,1}$/gm)) {
              if (match.includes("CONSTRAINT")) continue;
              table.fields.push({
                name: match[1]
                  .replaceAll('"', "")
                  .replaceAll("[", "")
                  .replaceAll("]", ""),
                type: match[2],
              });
            }
            return table;
          })
        : []
    );
  }

  useEffect(() => {
    initSqlJs({
      locateFile: (file: any) => `https://sql.js.org/dist/${file}`,
    }).then((SQL: SqlJsStatic) => {
      setSQL(SQL);
      setDataset("/Chinook_Sqlite.sqlite", SQL);
    });
  }, []);

  return { db, tables, setDataset };
}
