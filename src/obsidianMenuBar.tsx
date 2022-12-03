import { Icon, MenuBarExtra, open, Clipboard } from "@raycast/api";
import { ObsidianIconDynamicBold } from "./utils/constants";
import { Vault } from "./utils/interfaces";
import { getPinnedNotes, unpinNote } from "./utils/pinNoteUtils";
import {
  getDailyNoteTarget,
  getOpenPathInObsidianTarget,
  sortNoteByAlphabet,
  useObsidianVaults,
  vaultPluginCheck,
} from "./utils/utils";

function PinnedNotesList(props: { vault: Vault; key: string }) {
  const pinnedNotes = getPinnedNotes(props.vault).sort(sortNoteByAlphabet);
  const { vault } = props;
  const [withPlugin, _] = vaultPluginCheck([vault], "obsidian-advanced-uri");
  return (
    <MenuBarExtra.Submenu title={vault.name} key={vault.name}>
      {pinnedNotes.map((note) => (
        <MenuBarExtra.Submenu
          title={note.title}
          key={note.path}
          //shortcut={{ modifiers: ["opt"], key: pinnedNotes.indexOf(note).toString() as Keyboard.KeyEquivalent }}
        >
          <MenuBarExtra.Item
            title="Open in Obsidian"
            icon={ObsidianIconDynamicBold}
            tooltip="Opens this note in Obsidian"
            onAction={() => open(getOpenPathInObsidianTarget(note.path))}
            key={"open"}
          />
          {withPlugin.length == 1 ? (
            <MenuBarExtra.Item
              title="Open in new Pane"
              icon={ObsidianIconDynamicBold}
              tooltip="Opens this note in a new pane"
              onAction={() =>
                open(
                  "obsidian://advanced-uri?vault=" +
                    encodeURIComponent(vault.name) +
                    "&filepath=" +
                    encodeURIComponent(note.path.replace(vault.path, "")) +
                    "&newpane=true"
                )
              }
            />
          ) : null}
          <MenuBarExtra.Item
            title="Copy Content"
            icon={Icon.CopyClipboard}
            tooltip="Copies the content of this note to the clipboard"
            onAction={() => Clipboard.copy(note.content)}
            key={"copy"}
          />
          <MenuBarExtra.Item
            title="Paste Content"
            icon={Icon.CopyClipboard}
            tooltip="Pastes the content of this note to the current application"
            onAction={() => Clipboard.paste(note.content)}
            key={"paste"}
          />
          <MenuBarExtra.Item
            title="Unpin Note"
            icon={Icon.PinDisabled}
            tooltip="Unpins this note"
            onAction={() => unpinNote(note, vault)}
            key={"unpin"}
          />
        </MenuBarExtra.Submenu>
      ))}
    </MenuBarExtra.Submenu>
  );
}

function PinnedVaultSelection(props: { vaults: Vault[] }) {
  return (
    <MenuBarExtra.Submenu title="Pinned Notes" key={"Pinned Notes"}>
      {props.vaults.map((vault) => (
        <PinnedNotesList vault={vault} key={vault.path} />
      ))}
    </MenuBarExtra.Submenu>
  );
}

function DailyNoteVaultSelection(props: { vaults: Vault[] }) {
  const [withPlugin, _] = vaultPluginCheck(props.vaults, "obsidian-advanced-uri");
  return (
    <MenuBarExtra.Submenu title="Daily Note" key={"Daily Note"}>
      {withPlugin.map((vault) => (
        <MenuBarExtra.Item
          title={vault.name}
          key={vault.path + "Daily Note"}
          tooltip="Open Daily Note"
          onAction={() => open(getDailyNoteTarget(vault))}
        />
      ))}
    </MenuBarExtra.Submenu>
  );
}

function OpenVaultSelection(props: { vaults: Vault[] }) {
  return (
    <MenuBarExtra.Submenu title="Open Vault" key={"Open Vault"}>
      {props.vaults.map((vault) => (
        <MenuBarExtra.Item
          title={vault.name}
          key={vault.path}
          tooltip="Open Vault"
          onAction={() => open(getOpenPathInObsidianTarget(vault.path))}
        />
      ))}
    </MenuBarExtra.Submenu>
  );
}

function ObsidianMenuBar(props: { vaults: Vault[] }) {
  return (
    <MenuBarExtra icon={ObsidianIconDynamicBold} tooltip="Obsidian">
      <PinnedVaultSelection vaults={props.vaults}></PinnedVaultSelection>
      <DailyNoteVaultSelection vaults={props.vaults}></DailyNoteVaultSelection>
      <OpenVaultSelection vaults={props.vaults}></OpenVaultSelection>
    </MenuBarExtra>
  );
}

export default function Command() {
  const { ready, vaults } = useObsidianVaults();

  if (!ready) {
    return <MenuBarExtra isLoading={true} />;
  } else {
    return <ObsidianMenuBar vaults={vaults} />;
  }
}
