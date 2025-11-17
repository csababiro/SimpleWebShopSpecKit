#!/usr/bin/env node
import fs from "fs";

const input = fs.readFileSync(0, "utf8");
const lines = input.split(/\r?\n/);

let open = false, blocks = [], body = [];
for (const l of lines){
  if (!open && l.trim() === "```diff"){ open = true; body = []; continue; }
  if (open && l.trim() === "```"){ blocks.push(body.slice()); open = false; body = []; continue; }
  if (open) body.push(l);
}

if (blocks.length !== 1){
  console.error(`ERROR: expected exactly one fenced diff block, found ${blocks.length}`);
  process.exit(1);
}
const b = blocks[0];
if ((b[0] || "").trim() !== "*** BEGIN PATCH"){
  console.error("ERROR: first line must be '*** BEGIN PATCH'");
  process.exit(1);
}
if ((b[b.length-1] || "").trim() !== "*** END PATCH"){
  console.error("ERROR: last line must be '*** END PATCH'");
  process.exit(1);
}

const hdrOld = /^--- (a\/.+|\/dev\/null)$/;
const hdrNew = /^\+\+\+ (b\/.+|\/dev\/null)$/;
const hunk   = /^@@ -\d+(,\d+)? \+\d+(,\d+)? @@/;

let i = 1; // after BEGIN PATCH
while (i < b.length - 1){ // before END PATCH
  const l = b[i];

  if (l.trim() === "") { i++; continue; }

  if (hdrOld.test(l)){
    const next = b[i+1] || "";
    if (!hdrNew.test(next)){
      console.error("ERROR: expected '+++ b/<path>' immediately after '--- a/<path>'");
      process.exit(1);
    }
    i += 2;
    continue;
  }

  if (hunk.test(l)){
    i++;
    // consume hunk body: context/added/removed lines or blank
    while (i < b.length - 1){
      const s = b[i];
      if (s === "" || /^[ \+\-].*/.test(s)) { i++; continue; }
      // next structure begins
      break;
    }
    continue;
  }

  // allow content lines only inside hunks; otherwise error
  if (/^[ \+\-].*/.test(l)){
    console.error("ERROR: change lines must be inside a @@ hunk");
    process.exit(1);
  }

  console.error("ERROR: unexpected line: " + l);
  process.exit(1);
}

console.log("OK: unified diff block valid");
