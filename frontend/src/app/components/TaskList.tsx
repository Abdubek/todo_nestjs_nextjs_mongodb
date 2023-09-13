import { TaskCard } from "@/app/components/TaskCard";
import { useStore } from "@/store";
import { observer } from "mobx-react-lite";
import { Box, Link, TextField, Typography } from "@mui/material";
import SortIcon from "@mui/icons-material/Sort";
import { getActiveSortField } from "@/store/task";
import { CreateTaskDialog } from "@/app/components/CreateTaskDialog";
import { useDebounce } from "@/utils/hooks";
import { useEffect, useState } from "react";

export const TaskList = observer(() => {
  const { tasks } = useStore();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 1000);

  useEffect(() => {
    tasks.setSearchValue(debouncedSearch);
  }, [debouncedSearch]);

  return (
    <div>
      <Box mb={4}>
        <TextField
          label="Search"
          variant="outlined"
          value={search}
          fullWidth
          onChange={(e) => setSearch(e.target.value)}
        />
      </Box>

      <Box
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" component="h2" mb={2}>
          My tasks
        </Typography>
        <Box
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <span>Sort by:</span>
          <Link
            onClick={() => tasks.setSortValue("createdAt")}
            style={{
              display: "flex",
              alignItems: "center",
              margin: "10px",
            }}
          >
            Created date
            {getActiveSortField(tasks.sortValue) === "createdAt" ? (
              <SortIcon />
            ) : null}
          </Link>
          <Link
            onClick={() => tasks.setSortValue("status")}
            style={{
              display: "flex",
              alignItems: "center",
              margin: "10px",
              paddingRight: "20px",
            }}
          >
            Status
            {getActiveSortField(tasks.sortValue) === "status" ? (
              <SortIcon />
            ) : null}
          </Link>
          <CreateTaskDialog onSubmit={tasks.create} />
        </Box>
      </Box>

      {tasks.tasks.map((task) => (
        <TaskCard key={task._id} task={task} onTaskChange={tasks.changeTask} />
      ))}
    </div>
  );
});
