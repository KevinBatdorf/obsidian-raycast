import { Icon, Image } from "@raycast/api";
import { VIDEO_FILE_EXTENSIONS } from "./constants";
import { Note, Vault, Media } from "./interfaces";
import { getNoteFileContent, prefExcludedFolders, tagsFor, walkFilesHelper } from "./utils";

export class NoteLoader {
  vaultPath: string;

  constructor(vault: Vault) {
    this.vaultPath = vault.path;
  }

  loadNotes() {
    const notes: Note[] = [];
    const files = this._getFiles();

    for (const f of files) {
      const comp = f.split("/");
      const f_name = comp.pop();
      let name = "default";
      if (f_name) {
        name = f_name.split(".md")[0];
      }

      const noteContent = getNoteFileContent(f, false);

      const note: Note = {
        title: name,
        path: f,
        tags: tagsFor(noteContent),
        content: noteContent,
      };
      notes.push(note);
    }
    return notes;
  }

  _getFiles() {
    const exFolders = prefExcludedFolders();
    const files = walkFilesHelper(this.vaultPath, exFolders, [".md"], []);
    return files;
  }
}

export class MediaLoader {
  vaultPath: string;

  constructor(vault: Vault) {
    this.vaultPath = vault.path;
  }

  _getFiles() {
    const exFolders = prefExcludedFolders();
    const files = walkFilesHelper(this.vaultPath, exFolders, [".jpg", ".png", ".gif", ".mp4", ".pdf"], []);
    return files;
  }

  loadMedia() {
    const medias: Media[] = [];
    const files = this._getFiles();

    for (const f of files) {
      const icon = this.getIconFor(f);
      const media: Media = {
        title: f.split("/").pop() ?? "",
        path: f,
        icon: icon,
      };
      medias.push(media);
    }
    return medias;
  }

  getIconFor(path: string) {
    for (const ext of VIDEO_FILE_EXTENSIONS) {
      if (path.endsWith(ext)) {
        return { source: Icon.Video };
      }
    }
    return { source: path };
  }
}
