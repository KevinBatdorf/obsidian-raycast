import { useState, useEffect, useMemo } from "react";

import { Note, SearchNotePreferences, Vault } from "../utils/interfaces";
import { NoteList } from "./NoteList";
import { getPinnedNotes } from "../utils/PinNoteUtils";
import { getPreferenceValues } from "@raycast/api";
import { filterNotes } from "../utils/utils";
import { MAX_RENDERED_NOTES } from "../utils/constants";

export function NoteListPinned(props: { vault: Vault }) {
  const pref: SearchNotePreferences = getPreferenceValues();

  const [pinnedNotes, setPinnedNotes] = useState<Note[]>([]);
  const [input, setInput] = useState<string>("");
  const list = useMemo(() => filterNotes(pinnedNotes, input, pref.searchContent), [pinnedNotes, input]);
  const vault = props.vault;

  function onDelete(note: Note) {
    console.log("delete", note);
    setPinnedNotes(pinnedNotes.filter((n) => n.path !== note.path));
  }

  useEffect(() => {
    const pinnedNotes = getPinnedNotes(vault);
    setPinnedNotes(pinnedNotes);
  }, []);

  return (
    <NoteList
      notes={list.slice(0, MAX_RENDERED_NOTES)}
      isLoading={pinnedNotes === undefined}
      vault={vault}
      onSearchChange={setInput}
      onDelete={onDelete}
    />
  );
}
