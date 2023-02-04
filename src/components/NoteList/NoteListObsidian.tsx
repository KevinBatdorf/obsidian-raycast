import React, { createContext, useContext, useReducer, useState } from "react";

import { useNotes } from "../../utils/hooks";
import { Note, Vault, SearchArguments } from "../../utils/interfaces";
import { NoteList } from "./NoteList";
import { NoteActions, OpenNoteActions } from "../../utils/actions";
import { NoteAction } from "../../utils/constants";
import { NoteReducer } from "../../utils/reducers";
import { NoteListContext } from "../../utils/utils";

export function NoteListObsidian(props: { vault: Vault; showTitle: boolean; searchArguments: SearchArguments }) {
  const { showTitle, vault, searchArguments } = props;

  const [allNotes] = useNotes(vault);
  const [currentViewNoteList, dispatch] = useReducer(NoteReducer, allNotes);

  return (
    <NoteListContext.Provider value={[dispatch, allNotes]}>
      <NoteList
        title={showTitle ? "Search Note in " + vault.name : ""}
        notes={currentViewNoteList}
        vault={vault}
        searchArguments={searchArguments}
        action={(note: Note, vault: Vault, actionCallback: (action: NoteAction) => void) => {
          return (
            <React.Fragment>
              <OpenNoteActions note={note} notes={allNotes} vault={vault} actionCallback={actionCallback} />
              <NoteActions notes={allNotes} note={note} vault={vault} actionCallback={actionCallback} />
            </React.Fragment>
          );
        }}
      />
    </NoteListContext.Provider>
  );
}
