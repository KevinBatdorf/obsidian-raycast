import { Detail, List, ListItem, ActionPanel, OpenAction, getLocalStorageItem, setLocalStorageItem, Form, print, PushAction, clearLocalStorage, SubmitFormAction, getPreferenceValues, LocalStorageValue, CopyToClipboardAction, PasteAction, OpenWithAction } from "@raycast/api";
import { useEffect, useState } from "react";
const fs = require("fs")
const path = require("path")


interface Note{
  title: string;
  key: number;
  path: string;
}

interface Preferences{
  vaultPath: string;
  excludedFolders: string;
}


const getFilesHelp = function(dirPath: string, arrayOfFiles: Array<string>) {
  let files = fs.readdirSync(dirPath)

  arrayOfFiles = arrayOfFiles || []
  
    files.forEach(function(file: string) {

      let next = fs.statSync(dirPath + "/" + file);
        if (next.isDirectory()) {
          arrayOfFiles = getFilesHelp(dirPath + "/" + file, arrayOfFiles)
        } else {
          if (file.endsWith(".md") && !dirPath.includes(".obsidian")){
            arrayOfFiles.push(path.join(dirPath, "/", file))
          }
        }
  })

  return arrayOfFiles
}

function getFiles(){
  const pref: Preferences = getPreferenceValues();
  let vaultPath = pref.vaultPath

  let exFolders = prefExcludedFolders();

  const files = getFilesHelp(vaultPath.toString(), []);
  // let filteredFiles = []
  // for (let file of files){
  //   for (let folder of exFolders){
  //     if (!(folder.indexOf(file) !== -1)){
  //       filteredFiles.push(file);
  //       console.log(file + "\t" + folder);
  //     }
  //   }
  //}
  return files;
}

function prefExcludedFolders(){
  const pref: Preferences = getPreferenceValues();
  let foldersString = pref.excludedFolders;
  if (foldersString){
    let folders = foldersString.split(",");
    return folders;
  }else{
    return [];
  }
}

function NoteJSON(files: Array<string>){
  let notes: Note[] = [];

  let key = 0;
  for (let f of files){
  
      let comp = f.split("/");
      let f_name = comp.pop();
      let name = "default";
      if (f_name){
        name = f_name.split(".md")[0];
      }
      let note = {
        "title": name,
        "key": ++key,
        "path": f
      }
      notes.push(note)
    }
  return JSON.stringify(notes);
}


function searchList(notes: Note[]){
  return (
    <List>
      {notes.map((note) => (
        <List.Item title={note.title} subtitle={"Open in Obsidian"} key={note.key} actions={
          <ActionPanel>
            <OpenAction 
              title="Open in Obsidian" 
              target={"obsidian://open?path=" + encodeURIComponent(note.path)}
            />
            <CopyToClipboardAction
              title="Copy note content"
              content={fs.readFileSync(note.path,'utf8')}
              shortcut={{ modifiers: ["opt"], key: "c"}}
            />
            <PasteAction 
              title="Paste note content" 
              content={fs.readFileSync(note.path,'utf8')} 
              shortcut={{ modifiers: ["opt"], key: "v"}}
            />
          </ActionPanel>
        }/>
      ))}
    </List>
    )
}

export default function Command() {

  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    async function fetch() {
      let files = getFiles();
      let json = NoteJSON(files);
      setNotes(JSON.parse(json));
    }
    fetch();
  }, []);

  return searchList(notes)   
}
