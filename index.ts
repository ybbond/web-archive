import {
  emptyDirSync,
  copySync,
  readFileStrSync,
  writeFileStrSync,
  walkSync,
} from "https://deno.land/std/fs/mod.ts";

type JSONContent = {
  title: string;
  tags: Array<string>;
  date: string;
};

emptyDirSync("./a");
const content = walkSync("./bookmarks", {
  includeDirs: false,
  skip: [/.DS_Store/],
});

let jsonObject = JSON.parse(readFileStrSync("./index.json"));

const array = [];
const result = [];
const jsonMap: Map<string, JSONContent> = new Map(Object.entries(jsonObject));
const json: { [key: string]: JSONContent } = {};

for (const entry of content) {
  const [url, date, title] = entry.name.split("-saved---on-");

  const dateString = date.split(".html")[0];
  const newUrl = `./a/${url}-saved-${date}.html`;
  const src = `./${entry.path}`;

  array.push([url, dateString, title]);

  copySync(src, newUrl);
}

const sorted = array
  .sort(function (a, b) {
    return ("" + a[1]).localeCompare(b[1]);
  })
  .reverse();

for (const entry of sorted) {
  const [url, date, title] = entry;

  const newUrl = `./a/${url}-saved-${date}.html`;

  result.push(
    `<div class="item" id="${date} ${jsonMap
      .get(title)
      ?.tags.map((item) => item)
      .join(" ")}"><p class="title"><a href="${newUrl}"><span>${
      title.split(".html")[0]
    }</span></a> saved on <time>${date}</time></p><p class="tags">${jsonMap
      .get(title)
      ?.tags.map((item) => `<span id="${item}" class="tagitem">#${item}</span>`)
      .join("")}
    </p></div>`
  );

  if (!jsonMap.has(title)) {
    jsonMap.set(title, { title, tags: [], date });
  } else {
    jsonMap.set(
      title,
      jsonMap.get(title) || {
        title,
        tags: ["hehe"],
        date: "2020-06-12T00-00-00",
      }
    );
  }
}

for (const [, entry] of jsonMap.entries()) {
  json[entry.title] = {
    title: entry.title,
    tags: entry.tags,
    date: entry.date,
  };
}

let html = `
<!DOCTYPE html>
<html ⚡
  lang="en-us"
>
  <head>
    <link rel="stylesheet" type="text/css" href="index.css">
  </head>
  <body>
    ${result.join(`\n`)}
  </body>
</html>
`;

writeFileStrSync("index.html", html);
writeFileStrSync("index.json", JSON.stringify(json));
