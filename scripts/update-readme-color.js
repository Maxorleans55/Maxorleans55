// scripts/update-readme-color.js
// Picks a random hex color and swaps it into every capsule-render
// "color=" param in README.md (header + footer), keeping the design
// (type=waving, animation, text, etc.) exactly the same.

const fs = require("fs");
const path = require("path");

const README_PATH = path.join(__dirname, "..", "README.md");

function randomHexColor() {
  // Avoid near-white/near-black so text/badges stay readable
  const min = 0x30;
  const max = 0xd0;
  const rand = () =>
    Math.floor(Math.random() * (max - min + 1) + min)
      .toString(16)
      .padStart(2, "0");
  return `${rand()}${rand()}${rand()}`;
}

function main() {
  let readme = fs.readFileSync(README_PATH, "utf8");
  const newColor = randomHexColor();

  // Matches color=XXXXXX inside any capsule-render.vercel.app URL,
  // but leaves color=gradient (used elsewhere) untouched.
  const capsuleColorRegex =
    /(capsule-render\.vercel\.app\/api\?[^"'\s]*?color=)([0-9a-fA-F]{6})/g;

  let matches = 0;
  readme = readme.replace(capsuleColorRegex, (full, prefix) => {
    matches += 1;
    return `${prefix}${newColor}`;
  });

  if (matches === 0) {
    console.log("No capsule-render color= params found. Nothing changed.");
    return;
  }

  fs.writeFileSync(README_PATH, readme, "utf8");
  console.log(`Updated ${matches} capsule-render color param(s) to #${newColor}`);
}

main();
