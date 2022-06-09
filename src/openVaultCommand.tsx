import { Action, ActionPanel, closeMainWindow, List, open, popToRoot } from "@raycast/api";

import { useObsidianVaults } from "./utils/utils";

const getTarget = (vaultName: string) => {
  return "obsidian://open?vault=" + encodeURIComponent(vaultName);
};

export default function Command() {
  const { ready, vaults } = useObsidianVaults();

  if (vaults.length === 1) {
    open(getTarget(vaults[0].name));
    popToRoot();
    closeMainWindow();
  }

  return (
    <List isLoading={!ready}>
      {vaults?.map((vault) => (
        <List.Item
          title={vault.name}
          key={vault.key}
          actions={
            <ActionPanel>
              <Action.Open title="Open vault" target={getTarget(vault.name)} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
