import { List, getPreferenceValues, ActionPanel, Action } from "@raycast/api";
import { useState, useMemo, useContext } from "react";

import { NoteListProps } from "../../utils/interfaces";
import { MAX_RENDERED_NOTES } from "../../utils/constants";
import { tagsForNotes } from "../../utils/yaml";
import { NoteListItem } from "./NoteListItem";
import { NoteListDropdown } from "./NoteListDropdown";
import { filterNotes } from "../../utils/search";
import { getObsidianTarget, NoteListContext, ObsidianTargetType } from "../../utils/utils";
import { SearchNotePreferences } from "../../utils/preferences";

export function NoteList(props: NoteListProps) {
  const [_, allNotes] = useContext(NoteListContext);

  const { notes, vault, title, searchArguments, action } = props;

  const pref = getPreferenceValues<SearchNotePreferences>();

  const [searchText, setSearchText] = useState(searchArguments.searchArgument ?? "");
  const list = useMemo(() => filterNotes(notes ?? [], searchText, pref.searchContent), [notes, searchText]);
  const _notes = list.slice(0, MAX_RENDERED_NOTES);

  const tags = tagsForNotes(allNotes);

  const isNotesUndefined = notes === undefined;
  if (_notes.length == 0) {
    return (
      <List
        navigationTitle={title}
        onSearchTextChange={(value) => {
          setSearchText(value);
        }}
      >
        <List.Item
          title={`🗒️ Create Note "${searchText}"`}
          actions={
            <ActionPanel>
              <Action.Open
                title="Create Note"
                target={getObsidianTarget({ type: ObsidianTargetType.NewNote, vault: vault, name: searchText })}
              />
            </ActionPanel>
          }
        />
      </List>
    );
  }

  return (
    <List
      throttle={true}
      isLoading={isNotesUndefined}
      isShowingDetail={pref.showDetail}
      onSearchTextChange={(value) => {
        setSearchText(value);
      }}
      navigationTitle={title}
      searchText={searchText}
      searchBarAccessory={<NoteListDropdown tags={tags} searchArguments={searchArguments} />}
    >
      {_notes?.map((note) => (
        <NoteListItem note={note} vault={vault} key={note.path} pref={pref} action={action} />
      ))}
    </List>
  );
}
