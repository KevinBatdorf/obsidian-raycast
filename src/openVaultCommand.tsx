import { List, ActionPanel, Action, open, popToRoot, closeMainWindow } from "@raycast/api";

import { parseVaults } from "./utils/VaultUtils";

export default function Command() {
  const vaults = parseVaults();

  if (vaults.length == 1) {
    open("obsidian://advanced-uri?vault=" + encodeURIComponent(vaults[0].name) + "&daily=true");
    popToRoot();
    closeMainWindow();
  }

  return (
    <List isLoading={vaults === undefined}>
      {vaults?.map((vault) => (
        <List.Item
          title={vault.name}
          key={vault.key}
          actions={
            <ActionPanel>
              <Action.Open title="Open vault" target={"obsidian://open?vault=" + encodeURIComponent(vault.name)} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
