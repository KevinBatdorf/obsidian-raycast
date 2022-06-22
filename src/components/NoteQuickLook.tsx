import { Detail, Action, ActionPanel } from "@raycast/api";
import { useState } from "react";

import { Note } from "../utils/interfaces";
import { NoteActions, OpenNoteActions } from "../utils/actions";
import { isNotePinned } from "../utils/PinNoteUtils";

export function NoteQuickLook(props: { note: Note; vaultPath: string }) {
  const note = props.note;

  const [pinned, setPinned] = useState(isNotePinned(note, props.vaultPath));

  const pin = function () {
    setPinned(!pinned);
  };

  return (
    <Detail
      navigationTitle={pinned ? "⭐ " + note.title : note.title}
      markdown={note.content}
      actions={
        <ActionPanel>
          <OpenNoteActions note={note} vaultPath={props.vaultPath} />
          <NoteActions note={note} vaultPath={props.vaultPath} onPin={pin} />
        </ActionPanel>
      }
    />
  );
}
