import { Detail, List, ListItem, ActionPanel, OpenAction, getLocalStorageItem, setLocalStorageItem, Form, print, PushAction, clearLocalStorage, SubmitFormAction, getPreferenceValues } from "@raycast/api";
import { useEffect, useState } from "react";
const fs = require("fs")
const path = require("path")


interface Note{
  title: string;
  content: string;
  key: number;
  url: string;
  error?: Error;
}

interface Preferences{
  vaultPath: string;
}


const getAllFiles = function(dirPath: string, arrayOfFiles: Array<string>) {
  let files = fs.readdirSync(dirPath)

  arrayOfFiles = arrayOfFiles || []

  files.forEach(function(file: string) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
    } else {
      if (file.endsWith(".md") && !dirPath.includes(".obsidian")){
        arrayOfFiles.push(path.join(dirPath, "/", file))
      }
    }
  })

  return arrayOfFiles
}


async function getNotes(){
  let vaultPath = await getLocalStorageItem("vaultPath")
  
  let notes_: Note[] = []
  if (vaultPath != undefined){
    const files = getAllFiles(vaultPath.toString(), [])
    let key = 0
    files.forEach(function(file: string){

      key += 1;
      let comp = file.split("/");
      let f_name = comp.pop();
      let name = "default";
      if (f_name){
        name = f_name.split(".md")[0];
      }
      

      notes_.push({title: name, content: "Open", key: key, url: "obsidian://open?path=" + encodeURIComponent(file)})
    });
  }
  return notes_
}



function searchList(notes: Note[]){
  
  return (
    <List>
      {notes.map((note) => (
        <List.Item title={note.title} subtitle={note.content.substring(0, 50)} key={note.key} actions={
          <ActionPanel>
            <OpenAction title="Open in Obsidian" target={note.url}></OpenAction>
          </ActionPanel>
        }/>
      ))}
    </List>

    )

}



export default function Command() {

  const pref: Preferences = getPreferenceValues();
  let vaultPath = pref.vaultPath

  let notes_: Note[] = [] 

  const files = getAllFiles(vaultPath.toString(), [])
  let key = 0
  files.forEach(function(file: string){

    key += 1;
    let comp = file.split("/");
    let f_name = comp.pop();
    let name = "default";
    if (f_name){
      name = f_name.split(".md")[0];
    }    

    notes_.push({title: name, content: "Open", key: key, url: "obsidian://open?path=" + encodeURIComponent(file)})
  });


  const [notes, setNotes] = useState<Note[]>(notes_);


  // useEffect(() => {
  //   async function fetchFiles() {
  //     try {
  //       const notes = await getNotes();
  //       setNotes(notes);
  //     } catch (error) {
  //       setNotes([{title: "Error", content: "Error", key:-1, url: "no", error: error instanceof Error ? error : new Error("Something went wrong") }])
  //     }
  //   }
  //   fetchFiles();
  // }, []);

  return searchList(notes_)

 
}
