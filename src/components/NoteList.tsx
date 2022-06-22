import { List, ActionPanel, getPreferenceValues, useNavigation } from "@raycast/api";
import React, { useState } from "react";

import { Note, Vault, SearchNotePreferences } from "../utils/interfaces";
import { OpenNoteActions, NoteActions } from "../utils/actions";
import { readingTime, wordCount, trimPath, createdDateFor, fileSizeFor, getNoteFileContent } from "../utils/utils";
import { isNotePinned } from "../utils/PinNoteUtils";
import { NoteAction } from "../utils/constants";

export function NoteListItem(props: {
  note: Note;
  vault: Vault;
  key: number;
  pref: SearchNotePreferences;
  onDelete: (note: Note) => void;
}) {
  const note = props.note;
  const vault = props.vault;
  const [content, setContent] = useState(note.content);
  const [pinned, setPinned] = useState(isNotePinned(note, vault));

  function actionCallback(action: NoteAction) {
    switch (+action) {
      case NoteAction.Pin:
        setPinned(!pinned);
        break;
      case NoteAction.Delete:
        props.onDelete(note);
        break;
      case NoteAction.Edit:
        const newContent = getNoteFileContent(note.path);
        setContent((content) => newContent);
    }
  }

  return (
    <List.Item
      title={note.title}
      accessories={[{ text: pinned ? "⭐️" : "" }]}
      detail={
        <List.Item.Detail
          markdown={content}
          metadata={
            props.pref.showMetadata ? (
              <List.Item.Detail.Metadata>
                <List.Item.Detail.Metadata.Label title="Character Count" text={content.length.toString()} />
                <List.Item.Detail.Metadata.Label title="Word Count" text={wordCount(content).toString()} />
                <List.Item.Detail.Metadata.Label
                  title="Reading Time"
                  text={readingTime(content).toString() + " min read"}
                />
                <List.Item.Detail.Metadata.Separator />
                <List.Item.Detail.Metadata.Label
                  title="Creation Date"
                  text={createdDateFor(note).toLocaleDateString()}
                />
                <List.Item.Detail.Metadata.Label title="File Size" text={fileSizeFor(note).toFixed(2) + " KB"} />
                <List.Item.Detail.Metadata.Label
                  title="Note Path"
                  text={trimPath(note.path.split(vault.path)[1], 55)}
                />
              </List.Item.Detail.Metadata>
            ) : (
              <React.Fragment />
            )
          }
        />
      }
      actions={
        <ActionPanel>
          <OpenNoteActions note={note} vault={vault} />
          <NoteActions note={note} vault={vault} actionCallback={actionCallback} />
          {/* {action && action(note)} */}
        </ActionPanel>
      }
    />
  );
}

export function NoteList(props: {
  notes: Note[] | undefined;
  isLoading?: boolean;
  vault: Vault;
  onSearchChange: (search: string) => void;
  onDelete: (note: Note) => void;
}) {
  const notes = props.notes;
  const vault = props.vault;
  const pref: SearchNotePreferences = getPreferenceValues();

  let isLoading = notes === undefined;

  if (notes !== undefined) {
    isLoading = notes.length == 0;
  }

  if (props.isLoading !== undefined) {
    isLoading = props.isLoading;
  }

  return (
    <List isLoading={isLoading} isShowingDetail={pref.showDetail} onSearchTextChange={props.onSearchChange}>
      {notes?.map((note) => (
        <NoteListItem note={note} vault={vault} key={note.key} pref={pref} onDelete={props.onDelete} />
      ))}
    </List>
  );
}
