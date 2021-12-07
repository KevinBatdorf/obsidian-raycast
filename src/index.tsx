import { Detail, List, ListItem, ActionPanel, OpenAction, getLocalStorageItem, setLocalStorageItem, Form, print, PushAction, clearLocalStorage, SubmitFormAction, getPreferenceValues, LocalStorageValue, CopyToClipboardAction, PasteAction, OpenWithAction } from "@raycast/api";
import { useEffect, useState } from "react";
const fs = require("fs")
const path = require("path")


interface Note{
  title: string;
  content: string;
  desc: string;
  key: number;
  path: string;
  url: string;
  error?: Error;
}

interface Preferences{
  vaultPath: string;
}


const getFilesHelp = function(dirPath: string, arrayOfFiles: Array<string>) {
  let files = fs.readdirSync(dirPath)

  arrayOfFiles = arrayOfFiles || []

  files.forEach(function(file: string) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
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
  const files = getFilesHelp(vaultPath.toString(), [])
  return files;
}

function NoteJSON(files: Array<string>){
  let notes: Note[] = [];

  let key = 0;
  for (let f of files){
  
      key++;
      let comp = f.split("/");
      let f_name = comp.pop();
      let name = "default";
      if (f_name){
        name = f_name.split(".md")[0];
      }
      let content = fs.readFileSync(f,'utf8') as string;
      let note = {
        "title": name,
        "content": content,
        "desc": "Open in Obsidian or copy with cmd + enter",
        "key": key,
        "path": f,
        "url": "obsidian://open?path=" + encodeURIComponent(f)
      }
      notes.push(note)
    }
  return JSON.stringify(notes);
}

async function saveNoteJSON(json: string){
  await setLocalStorageItem("notes", json);
}

async function readSavedNotes(){
  let json = await getLocalStorageItem("notes") as string;
  return JSON.parse(json);
}


function searchList(notes: Note[]){
  return (
    <List>
      {notes.map((note) => (
        <List.Item title={note.title} subtitle={note.desc} key={note.key} actions={
          <ActionPanel>
            <OpenAction 
              title="Open in Obsidian" 
              target={note.url}
            />
            <CopyToClipboardAction
              title="Copy note content"
              content={note.content}
              shortcut={{ modifiers: ["opt"], key: "c"}}
            />
            <PasteAction 
              title="Paste note content" 
              content={note.content} 
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

      //let notes = await readSavedNotes();
      //await saveNoteJSON(json);
      
      setNotes(JSON.parse(json));
      //setNotes(notes);
      
    }
    fetch();
  }, []);

  return searchList(notes)
   
}
