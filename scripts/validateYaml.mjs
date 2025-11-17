#!/usr/bin/env node
import fs from "fs";
import path from "path";
import YAML from "yaml";

function load(p){
  try {
    return YAML.parse(fs.readFileSync(p, "utf8"));
  } catch (error) {
    throw new Error(`Failed to parse ${p}: ${error.message}`);
  }
}

function checkState(d){
  const req = ["version","request_id","session_id","phase","plan_checksum","retries_current_phase","lock","meta"];
  for (const k of req) if (!(k in d)) throw new Error("state.md: missing "+k);
  if (d.version !== 1) throw new Error("state.md: version must be 1");
  const phases = ["idle","planning","execution","quality","verification","documentation","error"];
  if (!phases.includes(d.phase)) throw new Error("state.md: invalid phase");
}

function checkPlan(d){
  const req = ["version","request_id","goal","acceptance_criteria","plan_checksum","status","docs_snapshot"];
  for (const k of req) if (!(k in d)) throw new Error("plan.md: missing "+k);
  if (d.version !== 1) throw new Error("plan.md: version must be 1");
  if (!["absent","ready"].includes(d.status)) throw new Error("plan.md: status must be 'absent' or 'ready'");
  if (typeof d.plan_checksum !== "string") throw new Error("plan.md: plan_checksum must be a string");
}

try{
  const s = load(path.join("scratchpad", "state.md")); checkState(s);
  const p = load(path.join("scratchpad", "plan.md"));  checkPlan(p);
  console.log("OK: state.md & plan.md valid");
}catch(e){ console.error("ERROR:", e.message); process.exit(1); }
