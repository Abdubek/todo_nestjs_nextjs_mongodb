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
import { SubmitHandler, useForm } from "react-hook-form";

type FormInputs = {
  title: string;
  description: string;
};

type Props = {
  onCreate: (title: string, description: string) => void;
};

export const CreateTaskDialog = ({ onCreate }: Props) => {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    onCreate(data.title, data.description);
    setOpen(false);
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        New task
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>New Task</DialogTitle>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <TextField
              autoFocus
              required
              margin="dense"
              id="title"
              label="Title"
              type="text"
              fullWidth
              variant="standard"
              error={!!errors.title}
              helperText={errors?.title?.message || ""}
              {...register("title", {
                required: "Title is required",
              })}
            />
            <TextField
              autoFocus
              required
              margin="dense"
              id="description"
              label="Description"
              type="text"
              fullWidth
              variant="standard"
              error={!!errors.description}
              helperText={errors?.description?.message || ""}
              {...register("description", {
                required: "Description is required",
              })}
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
