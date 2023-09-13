"use client";

import { types } from "mobx-state-tree";
import { TaskStore } from "@/store/task";
import React, { createContext, ReactNode, useContext } from "react";

export const RootStore = types.model("RootStore", {
  tasks: types.optional(TaskStore, {
    searchValue: "",
    sortValue: "",
  }),
});

const store = RootStore.create({});

export const StoreContext = createContext(store);

export function useStore() {
  return useContext(StoreContext);
}

export const Provider = ({ children }: { children: ReactNode }) => {
  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
};
