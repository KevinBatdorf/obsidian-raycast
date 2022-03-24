import { showToast, ToastStyle } from "@raycast/api";

import { parseVaults } from "./VaultUtils";
import { NoteList } from "./components/NoteList";
import { VaultSelection } from "./components/VaultSelection";

export default function Command() {
  const vaults = parseVaults();
  if (vaults.length > 1) {
    return <VaultSelection vaults={vaults} target={(path: string) => <NoteList vaultPath={path} />} />;
  } else if (vaults.length == 1) {
    return <NoteList vaultPath={vaults[0].path} />;
  } else {
    showToast(ToastStyle.Failure, "Path Error", "Something went wrong with your vault path.");
  }
}
