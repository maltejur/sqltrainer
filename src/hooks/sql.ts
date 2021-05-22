import { useEffect, useState } from "react";
import type { SqlJsStatic } from "sql.js";
/* @ts-ignore */
import initSqlJs from "sql.js/dist/sql-asm-memory-growth.js";

export interface Table {
  name: string;
  fields: {
    name: string;
    type: string;
  }[];
  pk?: string;
}

export default function useSql(url: string) {
  const [tables, setTables] = useState<Table[]>([]);
  const [SQL, setSQL] = useState<SqlJsStatic>();
  const [buffer, setBuffer] = useState<Uint8Array>();

  useEffect(() => {
    fetch(url).then(async (response) => {
      setBuffer(new Uint8Array(await response.arrayBuffer()));
    });
    initSqlJs({
      locateFile: (file: any) => `https://sql.js.org/dist/${file}`,
    }).then((SQL: SqlJsStatic) => {
      setSQL(SQL);
    });
  }, []);

  useEffect(() => {
    if (SQL && buffer) {
      const db = new SQL.Database(buffer);
      const response = db.exec(
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
              const pk = sql!
                .toString()
                .match(/PRIMARY KEY +\(\[(.+)\]\)(,|\n)/);
              if (pk) table.pk = pk[1];
              return table;
            })
          : []
      );
    }
  }, [SQL, buffer]);

  function exec(query: string) {
    if (SQL && buffer) {
      const db = new SQL.Database(buffer);
      return db.exec(query);
    } else throw new Error("SQLite not initialized yet");
  }

  return { tables, exec };
}
