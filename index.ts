import {
  emptyDirSync,
  copySync,
  writeFileStrSync,
  walkSync,
} from "https://deno.land/std/fs/mod.ts";

emptyDirSync("./a");
const content = walkSync("./bookmarks", {
  includeDirs: false,
  skip: [/.DS_Store/],
});
const array = [];
const result = [];

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
    `<p><a href="${newUrl}"><span>${
      title.split(".html")[0]
    }</span></a> saved on <time>${date}</time></p>`
  );
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

console.log(">> html", html);

writeFileStrSync("index.html", html);
