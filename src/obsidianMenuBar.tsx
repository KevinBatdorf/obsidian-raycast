import { Icon, MenuBarExtra, open, Clipboard } from "@raycast/api";
import React from "react";
import { Vault } from "./utils/interfaces";
import { getPinnedNotes, unpinNote } from "./utils/pinNoteUtils";
import { getDailyNoteTarget, sortNoteByAlphabet, useObsidianVaults, vaultPluginCheck } from "./utils/utils";

function PinnedNotesList(props: { vault: Vault; key: string }) {
  const pinnedNotes = getPinnedNotes(props.vault).sort(sortNoteByAlphabet);
  return (
    <MenuBarExtra.Submenu title="Pinned Notes" key={"Pinned Notes"}>
      {pinnedNotes.map((note) => (
        <MenuBarExtra.Submenu
          title={note.title}
          key={note.path}
          //shortcut={{ modifiers: ["opt"], key: pinnedNotes.indexOf(note).toString() as Keyboard.KeyEquivalent }}
        >
          <MenuBarExtra.Item
            title="Open in Obsidian"
            icon={Icon.AppWindow}
            onAction={() => open("obsidian://open?path=" + encodeURIComponent(note.path))}
            key={"open"}
          />
          <MenuBarExtra.Item
            title="Copy Content"
            icon={Icon.CopyClipboard}
            onAction={() => Clipboard.copy(note.content)}
            key={"copy"}
          />
          <MenuBarExtra.Item
            title="Paste Content"
            icon={Icon.CopyClipboard}
            onAction={() => Clipboard.paste(note.content)}
            key={"paste"}
          />
          <MenuBarExtra.Item
            title="Unpin Note"
            icon={Icon.PinDisabled}
            onAction={() => unpinNote(note, props.vault)}
            key={"unpin"}
          />
        </MenuBarExtra.Submenu>
      ))}
    </MenuBarExtra.Submenu>
  );
}

function VaultSection(props: { vault: Vault; key: string; dailyNote: boolean }) {
  const { vault } = props;

  return (
    <React.Fragment>
      <MenuBarExtra.Item title={vault.name} key={vault.path + "Heading"} />
      <PinnedNotesList vault={vault} key={vault.path + "List"} />
      {props.dailyNote && (
        <MenuBarExtra.Item
          title="Daily Note"
          key={vault.path + "Daily Note"}
          onAction={() => open(getDailyNoteTarget(vault))}
        />
      )}
      <MenuBarExtra.Separator />
    </React.Fragment>
  );
}

export default function Command() {
  const { ready, vaults } = useObsidianVaults();

  if (!ready) {
    return <MenuBarExtra isLoading={true} />;
  } else {
    const [vaultsWithPlugin, vaultsWithoutPlugin] = vaultPluginCheck(vaults, "obsidian-advanced-uri");

    return (
      <MenuBarExtra icon={Icon.Star} tooltip="Your Pinned Notes">
        {vaults?.map((vault: Vault) => {
          return <VaultSection vault={vault} key={vault.path} dailyNote={vaultsWithPlugin.includes(vault)} />;
        })}
      </MenuBarExtra>
    );
  }
}
