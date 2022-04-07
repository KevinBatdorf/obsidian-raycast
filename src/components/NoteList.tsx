import { List, ActionPanel } from "@raycast/api";
import React from "react";

import { Note } from "../utils/interfaces";
import { OpenNoteActions, NoteActions } from "../utils/actions";

export function NoteList(props: {
  notes: Array<Note> | undefined;
  action?: (note: Note) => React.ReactFragment;
  isLoading?: boolean;
  vaultPath: string;
}) {
  const notes = props.notes;
  let action = props.action;

  let isLoading = notes === undefined;

  if (notes !== undefined) {
    isLoading = notes.length == 0;
  }

  if (props.isLoading !== undefined) {
    isLoading = props.isLoading;
  }

  return (
    <List isLoading={isLoading}>
      {notes?.map((note) => (
        <List.Item
          title={note.title}
          key={note.key}
          actions={
            <ActionPanel>
              <OpenNoteActions note={note} vaultPath={props.vaultPath} />
              <NoteActions note={note} vaultPath={props.vaultPath} />
              {action && action(note)}
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
