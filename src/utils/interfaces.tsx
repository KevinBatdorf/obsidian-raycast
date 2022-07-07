export interface FormValue {
  path: string;
  name: string;
  content: string;
  tags: string[];
}

export interface Preferences {
  vaultPath: string;
}

export interface NoteFormPreferences extends Preferences {
  prefPath: string;
  prefNoteName: string;
  prefNoteContent: string;
  fillFormWithDefaults: boolean;
  prefTag: string;
  tags: string;
  openOnCreate: boolean;
  folderActions: string;
}

export interface SearchNotePreferences extends Preferences {
  primaryAction: string;
  excludedFolders: string;
  removeYAML: boolean;
  removeLinks: boolean;
  removeLatex: boolean;
  appendTemplate: string;
  appendSelectedTemplate: string;
  showDetail: boolean;
  showMetadata: boolean;
  searchContent: boolean;
}

export interface Vault {
  name: string;
  key: string;
  path: string;
}

export interface Note {
  title: string;
  path: string;
  tags: string[];
  content: string;
}

interface ObsidianVaultJSON {
  path: string;
  ts: number;
  open: boolean;
}

export interface ObsidianJSON {
  vaults: Record<string, ObsidianVaultJSON>;
}

export interface ObsidianVaultsState {
  ready: boolean;
  vaults: Vault[];
}

export interface PinnedNotesJSON {
  vaultPath: string;
  pinnedNotes: string[];
}
