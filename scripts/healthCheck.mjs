#!/usr/bin/env node
import fs from "fs";
import path from "path";
import YAML from "yaml";
import TOML from "toml";
import crypto from "crypto";

const sha256 = s => crypto.createHash("sha256").update(s,"utf8").digest("hex");

// Check if files exist before reading
const planPath = path.join("scratchpad", "plan.md");
const tasksPath = path.join("scratchpad", "tasks.md");

if (!fs.existsSync(planPath)) {
  console.error(`ERROR: File not found: ${planPath}`);
  process.exit(1);
}

if (!fs.existsSync(tasksPath)) {
  console.error(`ERROR: File not found: ${tasksPath}`);
  process.exit(1);
}

let plan, tasks;
try {
  plan = YAML.parse(fs.readFileSync(planPath,"utf8"));
} catch (error) {
  console.error(`ERROR: Failed to parse ${planPath}: ${error.message}`);
  process.exit(1);
}

try {
  tasks = TOML.parse(fs.readFileSync(tasksPath,"utf8"));
} catch (error) {
  console.error(`ERROR: Failed to parse ${tasksPath}: ${error.message}`);
  process.exit(1);
}

const pc = plan.plan_checksum || "";
const tc = tasks.plan_checksum || "";

// Get current phase from state.md for context-aware validation
let currentPhase = "idle";
try {
  const statePath = path.join("scratchpad", "state.md");
  if (fs.existsSync(statePath)) {
    const state = YAML.parse(fs.readFileSync(statePath, "utf8"));
    currentPhase = state.phase || "idle";
  }
} catch (error) {
  console.log("Warning: Could not read state.md for phase context");
}

// Phase-aware checksum validation
if (currentPhase === "idle") {
  // Both files may have empty checksums in idle phase
  if (pc.length > 0 && tc.length > 0 && pc !== tc) {
    console.error("ERROR: plan_checksum mismatch between plan.md and tasks.md");
    process.exit(1);
  }
} else if (currentPhase === "planning") {
  // plan.md may have empty checksum, tasks.md must have empty checksum
  if (tc.length > 0) {
    console.error("ERROR: tasks.md should have empty checksum in planning phase");
    process.exit(1);
  }
} else {
  // execution phase and later: both files must have matching non-empty checksums
  if (pc.length === 0 || tc.length === 0) {
    console.error("ERROR: Both plan.md and tasks.md must have non-empty checksums in execution phase and later");
    process.exit(1);
  }
  if (pc !== tc) {
    console.error("ERROR: plan_checksum mismatch between plan.md and tasks.md");
    process.exit(1);
  }
}

// Only validate checksum computation if plan has content
const ac = Array.isArray(plan.acceptance_criteria) ? plan.acceptance_criteria : [];
const hasPlanContent = (plan.goal && plan.goal.length > 0) || ac.length > 0;
if (hasPlanContent && pc.length > 0) {
  const recomputed = sha256((plan.goal||"") + "\n" + ac.join("\n"));
  if (recomputed !== pc){
    console.error("ERROR: plan_checksum does not match computed checksum");
    process.exit(1);
  }
}
console.log("OK: health check");
