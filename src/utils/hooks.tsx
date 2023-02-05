import { useState } from "react";
import { getNotesFromCache } from "./data/cache";
import { Note, Vault } from "./interfaces";

export function useNotes(vault: Vault) {
  /**
   * The preferred way of loading notes inside the extension
   *
   * @param vault - The Vault to get the notes from
   * @returns All notes in the cache for the vault
   */

  const notes_: Note[] = getNotesFromCache(vault);

  const [notes, setNotes] = useState<Note[]>(notes_);
  console.log("Using Notes");

  return [notes] as const;
}
