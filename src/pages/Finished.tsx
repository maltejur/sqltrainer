import { Button, Typography } from "@material-ui/core";
import { ArrowBack } from "@material-ui/icons";
import React, { Dispatch, SetStateAction, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import useSWR from "swr";
import type { Task } from "../types";
import confetti from "canvas-confetti";

export default function Finished({
  setSolved,
}: {
  setSolved: Dispatch<SetStateAction<boolean[]>>;
}) {
  const tasks = useSWR<Task[]>("/tasks/tasks.json").data;
  const history = useHistory();

  useEffect(() => {
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
    };

    function fire(particleRatio: number, opts: any) {
      confetti(
        Object.assign({}, defaults, opts, {
          particleCount: Math.floor(count * particleRatio),
        })
      );
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });
    fire(0.2, {
      spread: 60,
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  }, []);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 30,
        }}
      >
        <Link to={tasks ? `/task/${tasks.length - 1}` : "/"}>
          <Button startIcon={<ArrowBack />}>Vorherige Aufgabe</Button>
        </Link>
      </div>
      <Typography variant="h4">Sehr schön</Typography>
      <Typography style={{ marginTop: 20 }}>
        Alle Aufgaben wurden gelöst
      </Typography>
      <Link to="/task/0">
        <Button
          color="primary"
          variant="contained"
          style={{ marginTop: 20 }}
          onClick={() => {
            setSolved([]);
            localStorage.clear();
          }}
        >
          Von vorne Anfangen
        </Button>
      </Link>
    </div>
  );
}
