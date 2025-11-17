#!/usr/bin/env node
import fs from "fs";
import path from "path";
import TOML from "toml";

function isStringArray(a){ return Array.isArray(a) && a.every(x => typeof x === "string"); }

try{
  const filePath = path.join("scratchpad", "tasks.md");
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const txt = fs.readFileSync(filePath, "utf8");
  if (!txt.trim().startsWith("version")) throw new Error("tasks.md: unexpected prose before TOML");

  const data = TOML.parse(txt);

  if (data.version !== 1) throw new Error("tasks.md: version must be 1");
  if (typeof data.plan_checksum !== "string") throw new Error("tasks.md: plan_checksum must be a string");

  if (typeof data.tasks !== "object" || data.tasks === null)
    throw new Error("tasks.md: missing [tasks] table");

  const keys = Object.keys(data.tasks);
  const sorted = [...keys].sort();
  if (keys.join("\n") !== sorted.join("\n"))
    throw new Error("tasks.md: task IDs must be sorted");

  for (const [tid, t] of Object.entries(data.tasks)){
    const required = ["title","type","files","deps","dod","agent","est_min"];
    for (const f of required){
      if (!(f in t)) throw new Error(`${tid}: missing ${f}`);
    }
    if (t.agent !== "executor") throw new Error(`${tid}: agent must be 'executor'`);
    if (!isStringArray(t.files)) throw new Error(`${tid}: files must be an array of strings`);
    if (!isStringArray(t.deps))  throw new Error(`${tid}: deps must be an array of strings`);
    if (!isStringArray(t.dod))   throw new Error(`${tid}: dod must be an array of strings`);
    if (typeof t.title !== "string" || !t.title.trim()) throw new Error(`${tid}: title must be non-empty string`);
    if (typeof t.type !== "string"  || !t.type.trim())  throw new Error(`${tid}: type must be non-empty string`);
    if (typeof t.est_min !== "number" || !Number.isFinite(t.est_min) || t.est_min < 0)
      throw new Error(`${tid}: est_min must be a non-negative number`);
  }

  console.log("OK: tasks.md valid");
}catch(e){
  console.error("ERROR:", e.message);
  process.exit(1);
}