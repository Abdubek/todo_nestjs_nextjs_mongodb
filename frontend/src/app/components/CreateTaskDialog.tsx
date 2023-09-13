import { useState, FormEvent } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";

type Props = {
  onSubmit: (title: string, description: string) => void;
};

export const CreateTaskDialog = ({ onSubmit }: Props) => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const title = data.get("title") as string;
    const description = data.get("description") as string;
    console.log(title, description);
    if (title && description) {
      onSubmit(title, description);
      setOpen(false);
    }
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        New task
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>New Task</DialogTitle>
        <Box component="form" onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              required
              margin="dense"
              id="title"
              name="title"
              label="Title"
              type="text"
              fullWidth
              variant="standard"
            />
            <TextField
              autoFocus
              required
              margin="dense"
              id="description"
              name="description"
              label="Description"
              type="text"
              fullWidth
              variant="standard"
            />
          </DialogContent>
          <DialogActions>
            <Button type="button" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">Create</Button>
          </DialogActions>
        </Box>
      </Dialog>
    </div>
  );
};
