import { getPreferenceValues } from "@raycast/api";

import fs from "fs";

import { Note, SearchNotePreferences } from "../utils/interfaces";

export function getNoteContent(note: Note) {
  const pref: SearchNotePreferences = getPreferenceValues();

  let content = fs.readFileSync(note.path, "utf8") as string;
  if (pref.removeYAML) {
    const yamlHeader = content.match(/---(.|\n)*?---/gm);
    if (yamlHeader) {
      content = content.replace(yamlHeader[0], "");
    }
  }
  if (pref.removeLatex) {
    const latex = content.matchAll(/\$\$(.|\n)*?\$\$/gm);
    for (const match of latex) {
      content = content.replace(match[0], "");
    }
    const latex_one = content.matchAll(/\$(.|\n)*?\$/gm);
    for (const match of latex_one) {
      content = content.replace(match[0], "");
    }
  }

  if (pref.removeLinks) {
    content = content.replaceAll("![[", "");
    content = content.replaceAll("[[", "");
    content = content.replaceAll("]]", "");
  }
  return content;
}
