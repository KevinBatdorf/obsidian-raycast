import { deleteNoteFromCache } from "./cache";
import { Note, Vault } from "./interfaces";
import { deleteNote } from "./utils";

export enum NoteReducerActionType {
  Set,
  Delete,
}

export type NoteReducerAction =
  | {
      type: NoteReducerActionType.Set;
      payload: Note[];
    }
  | {
      type: NoteReducerActionType.Delete;
      payload: {
        note: Note;
        vault: Vault;
      };
    };

export function NoteReducer(notes: Note[], action: NoteReducerAction) {
  switch (action.type) {
    case NoteReducerActionType.Set:
      return action.payload;
    case NoteReducerActionType.Delete:
      deleteNote(action.payload.note);
      deleteNoteFromCache(action.payload.vault, action.payload.note);
      return notes.filter((note) => note.path !== action.payload.note.path);
    default:
      return notes;
  }
}
