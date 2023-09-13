"use client";

import { ITask } from "@/store/task";
import {
  Card,
  CardContent,
  Typography,
  Select,
  Box,
  MenuItem,
} from "@mui/material";

export const TaskCard = ({
  task,
  onTaskChange,
}: {
  task: ITask;
  onTaskChange: (task: ITask) => void;
}) => {
  console.log(task);
  return (
    <Card sx={{ minWidth: 275, marginBottom: "20px" }}>
      <CardContent
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "start",
        }}
      >
        <Box>
          <Typography variant="h5" component="div">
            {task.title}
          </Typography>
          <Typography variant="body2">{task.description}</Typography>
        </Box>

        <Select
          value={task.status}
          size="small"
          onChange={(e) =>
            onTaskChange({
              ...task,
              status: e.target.value as number,
            })
          }
        >
          <MenuItem value={0}>TODO</MenuItem>
          <MenuItem value={1}>IN PROGRESS</MenuItem>
          <MenuItem value={2}>DONE</MenuItem>
        </Select>
      </CardContent>
    </Card>
  );
};
