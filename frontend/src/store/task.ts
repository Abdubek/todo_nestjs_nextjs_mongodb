import {
  cast,
  flow,
  Instance,
  SnapshotIn,
  SnapshotOut,
  types,
} from "mobx-state-tree";
import api from "@/utils/api";

export enum TaskStatus {
  TODO,
  IN_PROGRESS,
  DONE,
}

const Task = types.model("Task", {
  _id: types.maybe(types.string),
  title: types.string,
  description: types.string,
  status: types.number,
  createdAt: types.string,
});

export const TaskStore = types
  .model("TaskStore", {
    tasks: types.array(Task),
    searchValue: types.string,
    sortValue: types.string,
  })
  .actions((self) => {
    const load = flow(function* () {
      const searchParams = new URLSearchParams();
      if (self.searchValue) {
        searchParams.append("search", self.searchValue);
      }
      if (self.sortValue) {
        searchParams.append("sort", self.sortValue);
      }
      try {
        self.tasks = cast(
          yield api.request("/tasks?" + searchParams.toString()),
        );
      } catch (e) {
        console.error(e);
      }
    });

    return {
      afterCreate() {
        load();
      },
      create: flow(function* (title: string, description: string) {
        const newTask = yield api.request("/tasks", {
          method: "POST",
          body: JSON.stringify({
            title,
            description,
          }),
        });
        self.tasks = cast([newTask, ...self.tasks]);
      }),
      setSearchValue: function (value: string) {
        self.searchValue = value;
        load();
      },
      setSortValue: function (field: string) {
        if (self.sortValue) {
          const [property, direction] = self.sortValue.split(":");
          if (field === property) {
            self.sortValue = `${field}:${inverseDirection(direction)}`;
          } else {
            self.sortValue = `${field}:asc`;
          }
        } else {
          self.sortValue = `${field}:asc`;
        }
        load();
      },
      changeTask: flow(function* (task: ITask) {
        const newTask = yield api.request(`/tasks/${task._id}`, {
          method: "PUT",
          body: JSON.stringify(task),
        });

        self.tasks = cast(
          self.tasks.map((task) => (task._id === newTask._id ? newTask : task)),
        );
      }),
    };
  });

const inverseDirection = (direction: string) => {
  if (direction === "asc") {
    return "desc";
  }
  return "asc";
};

export const getActiveSortField = (sort: string): string | null => {
  if (sort) {
    const [property, _] = sort.split(":");
    return property;
  }
  return null;
};

interface ITaskStore extends Instance<typeof TaskStore> {}
export interface ITask extends SnapshotIn<typeof Task> {}
