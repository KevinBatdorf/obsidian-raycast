import { Detail, Action, ActionPanel, useNavigation } from "@raycast/api";
import { useState } from "react";

import { Note, Vault } from "../utils/interfaces";
import { NoteActions, OpenNoteActions } from "../utils/actions";
import { isNotePinned } from "../utils/PinNoteUtils";
import { NoteAction } from "../utils/constants";
import { getNoteFileContent } from "../utils/utils";

export function NoteQuickLook(props: { note: Note; vault: Vault }) {
  const note = props.note;
  const vault = props.vault;
  const { pop } = useNavigation();

  const [pinned, setPinned] = useState(isNotePinned(note, vault));
  const [content, setContent] = useState(note.content);

  function actionCallback(action: NoteAction, value: any = undefined) {
    switch (+action) {
      case NoteAction.Pin:
        setPinned(!pinned);
        break;
      case NoteAction.Delete:
        pop();
        break;
      case NoteAction.Edit:
        setContent(getNoteFileContent(note.path));
    }
  }

  return (
    <Detail
      navigationTitle={pinned ? "⭐ " + note.title : note.title}
      markdown={note.content}
      actions={
        <ActionPanel>
          <OpenNoteActions note={note} vault={vault} />
          <NoteActions note={note} vault={vault} actionCallback={actionCallback} />
        </ActionPanel>
      }
    />
  );
}
