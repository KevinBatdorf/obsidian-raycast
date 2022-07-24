import { Note } from "./interfaces";

function levenshteinDistance(a: string, b: string) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
        ); // insertion or deletion
      }
    }
  }

  return matrix[b.length][a.length];
}

function jaccard_distance(a: string, b: string) {
  const a_words = a.split(" ");
  const b_words = b.split(" ");
  const union = new Set([...a_words, ...b_words]);
  const intersection = new Set([...a_words].filter((x) => b_words.includes(x)));
  return 1 - intersection.size / union.size;
}

export function weighToken(token: string, inputTokens: string[], by: number) {
  let weight = 0;
  inputTokens.forEach((inputToken) => {
    if (inputToken.includes(token)) {
      weight += by;
    }
  });
  return weight;
}

function tokenIn(token: string, inputTokens: string[]) {
  return inputTokens.some((inputToken) => inputToken.includes(token));
}

// Used for full content fuzzy search
export function filterNotes(notes: Note[], input: string, byContent: boolean) {
  if (input.length === 0) {
    return notes;
  }

  const inputTokens = input.split(" ").map((token) => token.toLowerCase());

  const filteredNotes = notes.filter((note) => {
    const titleTokens = note.title.split(" ").map((token) => token.toLowerCase());
    const contentTokens = note.content.split(" ").map((token) => token.toLowerCase());

    console.log(inputTokens);

    if (byContent) {
      let filter = true;
      for (const token of inputTokens) {
        filter = tokenIn(token, contentTokens) || (tokenIn(token, titleTokens) && filter);
      }
      return filter;
    } else {
      inputTokens.forEach((inputToken) => {
        if (titleTokens.includes(inputToken)) {
          return true;
        }
      });
    }
  });

  const weightedFilteredNotes = filteredNotes.map((note) => {
    const titleTokens = note.title.split(" ");
    const contentTokens = note.content.split(" ");

    const titleWeight = titleTokens.reduce((acc, token) => {
      return acc + weighToken(token, inputTokens, 1);
    }, 0);

    const contentWeight = contentTokens.reduce((acc, token) => {
      return acc + weighToken(token, inputTokens, 1 / contentTokens.length);
    }, 0);

    return { ...note, weight: titleWeight * 2 + contentWeight };
  });

  const sortedNotes = weightedFilteredNotes.sort((a, b) => {
    if (a.weight > b.weight) {
      return -1;
    } else if (a.weight < b.weight) {
      return 1;
    } else {
      return 0;
    }
  });

  console.log(sortedNotes.map((note) => note.weight));

  return sortedNotes;
}
