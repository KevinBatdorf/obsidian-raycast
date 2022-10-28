import { getPreferenceValues, open, showToast, Toast } from "@raycast/api";
import { URLSearchParams } from "url";
import { applyTemplates, loadObsidianJson, vaultPluginCheck } from "./utils/utils";

interface DailyNoteAppendArgs {
  text: string;
}

interface Preferences {
  appendTemplate?: string;
  vaultName?: string;
  heading?: string;
}

export default async function DailyNoteAppend(props: { arguments: DailyNoteAppendArgs }) {
  const { text } = props.arguments;
  const { appendTemplate, heading, vaultName } = getPreferenceValues<Preferences>();

  const vaults = await loadObsidianJson();
  if (vaults.length === 0) {
    return showToast({
      style: Toast.Style.Failure,
      title: "No vaults found",
      message:
        "Please use Obsidian to create a vault, or set a vault path in the extension's preferences before using this command.",
    });
  }

  const [vaultsWithPlugin, _] = vaultPluginCheck(vaults, "obsidian-advanced-uri");

  if (vaultName) {
    // Fail if selected vault doesn't have plugin
    if (!vaultsWithPlugin.some((v) => v.name === vaultName)) {
      return showToast({
        style: Toast.Style.Failure,
        title: "Advanced URI plugin not found in vault",
        message: `Vault ${vaultName} is missing the Advanced URI plugin`,
      });
    }
  }

  // Fail if there's no selected vault, and no vaults have the plugin
  if (vaultsWithPlugin.length == 0) {
    const message =
      "Advanced URI plugin not installed.\nThis command requires the [Advanced URI plugin](https://obsidian.md/plugins?id=obsidian-advanced-uri) for Obsidian.  \n  \n Install it through the community plugins list.";
    return await showToast({
      title: "Advanced URI plugin required",
      message,
    });
  }

  // Use configured vault, fallback to first vault with plugin
  const configuredVault = vaults.find((vault) => vault.name === vaultName);
  const vaultToUse = configuredVault || vaultsWithPlugin[0];

  const withTemplate = appendTemplate ? appendTemplate + text : text;
  const content = await applyTemplates(withTemplate);
  // encodeURIComponent to avoid replacing spaces with +
  const data = encodeURIComponent(content);
  const params = new URLSearchParams({
    daily: "true",
    data,
    mode: "append",
    vault: vaultToUse.name,
  });
  if (heading) {
    params.append("heading", heading);
  }
  const uri = `obsidian://advanced-uri?${params}`;
  open(uri);

  showToast({ title: "Added text to note", style: Toast.Style.Success });
}
