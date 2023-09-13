"use client";

import { Container } from "@mui/material";
import { TaskList } from "@/app/components/TaskList";

export default function Home() {
  return (
    <Container component="main" maxWidth="md">
      <TaskList />
    </Container>
  );
}
