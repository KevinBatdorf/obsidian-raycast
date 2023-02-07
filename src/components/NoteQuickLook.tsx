import { Detail, ActionPanel } from "@raycast/api";
import { useEffect, useState } from "react";

import { Note, Vault } from "../utils/interfaces";
import { NoteActions, OpenNoteActions } from "../utils/actions";
import { filterContent, getNoteFileContent } from "../utils/utils";

export function NoteQuickLook(props: { showTitle: boolean; note: Note; notes: Note[]; vault: Vault }) {
  const { note, notes, showTitle, vault } = props;

  let noteContent = note?.content;
  noteContent = filterContent(noteContent ?? "");

  const [content, setContent] = useState(noteContent);

  function reloadContent() {
    if (note) {
      const newContent = getNoteFileContent(note.path);
      note.content = newContent;
      setContent(newContent);
    }
  }

  useEffect(reloadContent, [note]);

  const title = note.starred ? `⭐️ ${note.title}` : note.title;

  return (
    <Detail
      isLoading={note === undefined}
      navigationTitle={showTitle ? title : ""}
      markdown={content}
      actions={
        <ActionPanel>
          <OpenNoteActions note={note} notes={notes} vault={vault} />
          <NoteActions note={note} notes={notes} vault={vault} />
        </ActionPanel>
      }
    />
  );
}
