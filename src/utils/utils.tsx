import { getPreferenceValues } from "@raycast/api";

import fs from "fs";
import fsPath from "path";

import {
  Note,
  ObsidianJson,
  ObsidianVaultsState,
  Preferences,
  SearchNotePreferences,
  Vault
} from "../utils/interfaces";
import { readFile } from "fs/promises";
import { homedir } from "os";
import { useEffect, useMemo, useState } from "react";

export function getNoteContent(note: Note) {
  const pref: SearchNotePreferences = getPreferenceValues();

  let content = "";

  try {
    content = fs.readFileSync(note.path, "utf8") as string;
  } catch {
    content = "Couldn't read file. Did you move, delete or rename the file?";
  }

  if (pref.removeYAML) {
    const yamlHeader = content.match(/---(.|\n)*?---/gm);
    if (yamlHeader) {
      content = content.replace(yamlHeader[0], "");
    }
  }
  if (pref.removeLatex) {
    const latex = content.matchAll(/\$\$(.|\n)*?\$\$/gm);
    for (const match of latex) {
      content = content.replace(match[0], "");
    }
    const latex_one = content.matchAll(/\$(.|\n)*?\$/gm);
    for (const match of latex_one) {
      content = content.replace(match[0], "");
    }
  }

  if (pref.removeLinks) {
    content = content.replaceAll("![[", "");
    content = content.replaceAll("[[", "");
    content = content.replaceAll("]]", "");
  }
  return content;
}

export function vaultPluginCheck(vaults: Vault[], plugin: string) {
  const vaultsWithoutPlugin: Vault[] = [];
  vaults = vaults.filter((vault: Vault) => {
    const communityPluginsPath = vault.path + "/.obsidian/community-plugins.json";
    if (!fs.existsSync(communityPluginsPath)) {
      vaultsWithoutPlugin.push(vault);
    } else {
      const plugins: string[] = JSON.parse(fs.readFileSync(communityPluginsPath, "utf-8"));

      if (plugins.includes(plugin)) {
        return vault;
      } else {
        vaultsWithoutPlugin.push(vault);
      }
    }
  });
  return [vaults, vaultsWithoutPlugin];
}

function getVaultNameFromPath(vaultPath: string): string {
  const name = vaultPath
    .split(fsPath.sep)
    .filter((i) => {
      if (i != "") {
        return i;
      }
    })
    .pop();
  if (name) {
    return name;
  } else {
    return "Default Vault Name (check your path preferences)";
  }
}

export function parseVaults(): Vault[] {
  const pref: Preferences = getPreferenceValues();
  const vaultString = pref.vaultPath;
  return vaultString
    .split(",")
    .filter((vaultPath) => vaultPath.trim() !== '')
    .map((vault) => ({ name: getVaultNameFromPath(vault.trim()), key: vault.trim(), path: vault.trim() }))
}

async function loadObsidianJson(): Promise<Vault[]> {
  const obsidianJsonPath = fsPath.resolve(`${homedir()}/Library/Application Support/obsidian/obsidian.json`);
  try {
    const obsidianJson = JSON.parse(await readFile(obsidianJsonPath, "utf8")) as ObsidianJson;
    return Object.values(obsidianJson.vaults).map(({ path }) => ({
      name: getVaultNameFromPath(path), key: path, path
    }));
  } catch (e) {
    return [];
  }
}

export function useObsidianVaults(): ObsidianVaultsState {
  const pref = useMemo(() => getPreferenceValues(), []);
  const [state, setState] = useState<ObsidianVaultsState>(pref.vaultPath ? {
    ready: true,
    vaults: parseVaults()
  } : { ready: false, vaults: [] });

  useEffect(() => {
    if (!state.ready) {
      loadObsidianJson().then((vaults) => {
        setState({ vaults, ready: true });
      }).catch(() => setState({ vaults: parseVaults(), ready: true }));
    }
  }, []);

  return state;
}