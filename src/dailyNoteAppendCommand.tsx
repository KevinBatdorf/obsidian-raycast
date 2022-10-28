import { getPreferenceValues, open, Detail, showToast, Toast, useNavigation } from "@raycast/api";
import { URLSearchParams } from "url";
import { applyTemplates } from "./utils/utils";

interface QuickAppendArgs {
  text: string;
}

interface Preferences {
  appendTemplate?: string;
  vault?: string;
  heading?: string;
}

export default async function DailyNoteAppend(props: { arguments: QuickAppendArgs }) {
  const { text } = props.arguments;
  const { appendTemplate, heading, vault } = getPreferenceValues<Preferences>();

  const withTemplate = appendTemplate ? appendTemplate + text : text;
  const content = await applyTemplates(withTemplate);
  // encodeURIComponent to avoid replacing spaces with +
  const data = encodeURIComponent(content);
  const params = new URLSearchParams({
    daily: "true",
    data,
    mode: "append",
  });
  if (heading) {
    params.append("heading", heading);
  }
  if (vault) {
    params.append("vault", vault);
  }
  const uri = `obsidian://advanced-uri?${params}`;
  open(uri);

  showToast({ title: "Added text to note", style: Toast.Style.Success });
}
