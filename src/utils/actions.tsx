import { Action, getPreferenceValues, Icon, Color } from "@raycast/api";

import React, { useState } from "react";

import { AppendNoteForm } from "../components/AppendNoteForm";
import { EditNote } from "../components/EditNote";
import { SearchNotePreferences, Note, Vault } from "./interfaces";
import { isNotePinned, pinNote, unpinNote } from "./pinNoteUtils";
import { NoteQuickLook } from "../components/NoteQuickLook";
import { deleteNote, appendSelectedTextTo } from "./utils";
import { NoteAction, PrimaryAction } from "./constants";

export function NoteActions(props: { note: Note; vault: Vault; actionCallback: (action: NoteAction) => void }) {
  const note = props.note;
  const vault = props.vault;
  const URIEncodedPath = encodeURIComponent(note.path);
  const actionCallback = props.actionCallback;

  const [pinned, setPinned] = useState(isNotePinned(note, vault));

  return (
    <React.Fragment>
      <Action.ShowInFinder
        title="Show in Finder"
        icon={Icon.Finder}
        path={note.path}
        shortcut={{ modifiers: ["opt"], key: "enter" }}
      />

      <Action.Push
        title="Edit Note"
        target={<EditNote note={note} actionCallback={actionCallback} />}
        shortcut={{ modifiers: ["opt"], key: "e" }}
        icon={Icon.Pencil}
      />

      <Action.Push
        title="Append to Note"
        target={<AppendNoteForm note={note} actionCallback={actionCallback} />}
        shortcut={{ modifiers: ["opt"], key: "a" }}
        icon={Icon.Pencil}
      />

      <Action
        title="Append Selected Text to Note"
        shortcut={{ modifiers: ["opt"], key: "s" }}
        onAction={async () => {
          let done = await appendSelectedTextTo(note);
          if (done) {
            actionCallback(NoteAction.Append);
          }
        }}
        icon={Icon.Pencil}
      />

      <Action.CopyToClipboard
        title="Copy Note Content"
        content={note.content}
        shortcut={{ modifiers: ["opt"], key: "c" }}
      />

      <Action.Paste title="Paste Note Content" content={note.content} shortcut={{ modifiers: ["opt"], key: "v" }} />

      <Action.CopyToClipboard
        title="Copy Markdown Link"
        icon={Icon.Link}
        content={`[${note.title}](obsidian://open?path=${URIEncodedPath})`}
        shortcut={{ modifiers: ["opt"], key: "l" }}
      />

      <Action.CopyToClipboard
        title="Copy Obsidian URI"
        icon={Icon.Link}
        content={`obsidian://open?path=${URIEncodedPath}`}
        shortcut={{ modifiers: ["opt"], key: "u" }}
      />

      <Action
        title={pinned ? "Unpin Note" : "Pin Note"}
        shortcut={{ modifiers: ["opt"], key: "p" }}
        onAction={() => {
          if (pinned) {
            unpinNote(note, vault);
            setPinned(!pinned);
            actionCallback(NoteAction.Pin);
          } else {
            pinNote(note, vault);
            setPinned(!pinned);
            actionCallback(NoteAction.Pin);
          }
        }}
        icon={pinned ? Icon.XmarkCircle : Icon.Pin}
      />

      <Action
        title="Delete Note"
        shortcut={{ modifiers: ["opt"], key: "d" }}
        onAction={async () => {
          const deleted = await deleteNote(note, vault);
          if (deleted) {
            actionCallback(NoteAction.Delete);
          }
        }}
        icon={{ source: Icon.Trash, tintColor: Color.Red }}
      />
    </React.Fragment>
  );
}

export function OpenNoteActions(props: { note: Note; vault: Vault; actionCallback: (action: NoteAction) => void }) {
  const note = props.note;
  const vault = props.vault;
  const { primaryAction } = getPreferenceValues<SearchNotePreferences>();

  const quicklook = (
    <Action.Push
      title="Quick Look"
      target={<NoteQuickLook note={note} vault={vault} actionCallback={props.actionCallback} />}
      icon={Icon.Eye}
    />
  );

  const obsidian = (
    <Action.Open
      title="Open in Obsidian"
      target={"obsidian://open?path=" + encodeURIComponent(note.path)}
      icon={Icon.TextDocument}
    />
  );

  if (primaryAction == PrimaryAction.QuickLook) {
    return (
      <React.Fragment>
        {quicklook}
        {obsidian}
      </React.Fragment>
    );
  } else if (primaryAction == PrimaryAction.OpenInObsidian) {
    return (
      <React.Fragment>
        {obsidian}
        {quicklook}
      </React.Fragment>
    );
  } else {
    return (
      <React.Fragment>
        {quicklook}
        {obsidian}
      </React.Fragment>
    );
  }
}
