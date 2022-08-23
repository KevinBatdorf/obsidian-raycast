import { useNotes } from "./cache";
import { Media, Note, Vault } from "./interfaces";

export function filterNotes(notes: Note[], input: string, byContent: boolean) {
  if (input.length === 0) {
    return notes;
  }

  input = input.toLowerCase();

  if (byContent) {
    return notes.filter(
      (note) =>
        note.content.toLowerCase().includes(input) ||
        note.title.toLowerCase().includes(input) ||
        note.path.toLowerCase().includes(input)
    );
  } else {
    return notes.filter((note) => note.title.toLowerCase().includes(input));
  }
}

export function filterMedia(mediaList: Media[], input: string, vault: Vault) {
  if (input.length === 0) {
    return mediaList;
  }

  input = input.toLowerCase();

  let notes = useNotes(vault);
  notes = notes.filter((note) => note.title.toLowerCase().includes(input));

  return mediaList.filter((media) => {
    return (
      media.title.toLowerCase().includes(input) ||
      media.path.toLowerCase().includes(input) ||
      // Filter media that is mentioned in a note which has the searched title
      notes.some((note) => note.content.includes(media.title))
    );
  });
}
