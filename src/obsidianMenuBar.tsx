import { MenuBarExtra, open } from "@raycast/api";
import { ObsidianIconDynamicBold } from "./utils/constants";
import { Vault } from "./utils/interfaces";
import { getObsidianTarget, ObsidianTargetType, useObsidianVaults, vaultPluginCheck } from "./utils/utils";

function DailyNoteVaultSelection(props: { vaults: Vault[] }) {
  const [withPlugin, _] = vaultPluginCheck(props.vaults, "obsidian-advanced-uri");
  return (
    <MenuBarExtra.Submenu title="Daily Note" key={"Daily Note"}>
      {withPlugin.map((vault) => (
        <MenuBarExtra.Item
          title={vault.name}
          key={vault.path + "Daily Note"}
          tooltip="Open Daily Note"
          onAction={() => open(getObsidianTarget({ type: ObsidianTargetType.DailyNote, vault: vault }))}
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
          onAction={() => open(getObsidianTarget({ type: ObsidianTargetType.OpenVault, vault: vault }))}
        />
      ))}
    </MenuBarExtra.Submenu>
  );
}

function ObsidianMenuBar(props: { vaults: Vault[] }) {
  return (
    <MenuBarExtra icon={ObsidianIconDynamicBold} tooltip="Obsidian">
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
