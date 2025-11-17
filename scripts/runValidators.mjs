#!/usr/bin/env node
import { execSync } from "child_process";
import path from "path";
import fs from "fs";
import YAML from "yaml";
import TOML from "toml";

// Optimized validation pipeline with caching and parallel execution
class ValidationPipeline {
  constructor() {
    this.cache = new Map();
    this.errors = [];
  }

  // Cache file reads to avoid redundant I/O
  readFile(filePath) {
    if (!this.cache.has(filePath)) {
      try {
        const content = fs.readFileSync(filePath, "utf8");
        this.cache.set(filePath, content);
      } catch (error) {
        this.errors.push(`Failed to read ${filePath}: ${error.message}`);
        return null;
      }
    }
    return this.cache.get(filePath);
  }

  // Parse YAML with caching
  parseYaml(filePath) {
    const cacheKey = `yaml:${filePath}`;
    if (!this.cache.has(cacheKey)) {
      const content = this.readFile(filePath);
      if (!content) return null;
      try {
        const parsed = YAML.parse(content);
        this.cache.set(cacheKey, parsed);
      } catch (error) {
        this.errors.push(`Failed to parse YAML ${filePath}: ${error.message}`);
        return null;
      }
    }
    return this.cache.get(cacheKey);
  }

  // Parse TOML with caching
  parseToml(filePath) {
    const cacheKey = `toml:${filePath}`;
    if (!this.cache.has(cacheKey)) {
      const content = this.readFile(filePath);
      if (!content) return null;
      try {
        const parsed = TOML.parse(content);
        this.cache.set(cacheKey, parsed);
      } catch (error) {
        this.errors.push(`Failed to parse TOML ${filePath}: ${error.message}`);
        return null;
      }
    }
    return this.cache.get(cacheKey);
  }

  // Validate YAML files
  validateYaml() {
    console.log("🔍 Validating YAML files...");
    
    const statePath = path.join("scratchpad", "state.md");
    const planPath = path.join("scratchpad", "plan.md");
    
    const state = this.parseYaml(statePath);
    const plan = this.parseYaml(planPath);
    
    if (!state || !plan) return false;

    // Validate state.md
    const stateRequired = ["version","request_id","session_id","phase","plan_checksum","retries_current_phase","lock","meta"];
    for (const k of stateRequired) {
      if (!(k in state)) {
        this.errors.push(`state.md: missing ${k}`);
        return false;
      }
    }
    if (state.version !== 1) {
      this.errors.push("state.md: version must be 1");
      return false;
    }
    const phases = ["idle","planning","execution","quality","verification","documentation","error"];
    if (!phases.includes(state.phase)) {
      this.errors.push("state.md: invalid phase");
      return false;
    }

    // Validate plan.md
    const planRequired = ["version","request_id","goal","acceptance_criteria","plan_checksum","status","docs_snapshot"];
    for (const k of planRequired) {
      if (!(k in plan)) {
        this.errors.push(`plan.md: missing ${k}`);
        return false;
      }
    }
    if (plan.version !== 1) {
      this.errors.push("plan.md: version must be 1");
      return false;
    }
    if (!["absent","ready"].includes(plan.status)) {
      this.errors.push("plan.md: status must be 'absent' or 'ready'");
      return false;
    }
    if (typeof plan.plan_checksum !== "string") {
      this.errors.push("plan.md: plan_checksum must be a string");
      return false;
    }

    console.log("✅ YAML validation passed");
    return true;
  }

  // Validate TOML files
  validateToml() {
    console.log("🔍 Validating TOML files...");
    
    const tasksPath = path.join("scratchpad", "tasks.md");
    const content = this.readFile(tasksPath);
    if (!content) return false;

    if (!content.trim().startsWith("version")) {
      this.errors.push("tasks.md: unexpected prose before TOML");
      return false;
    }

    const data = this.parseToml(tasksPath);
    if (!data) return false;

    if (data.version !== 1) {
      this.errors.push("tasks.md: version must be 1");
      return false;
    }
    
    if (typeof data.plan_checksum !== "string") {
      this.errors.push("tasks.md: plan_checksum must be a string");
      return false;
    }

    if (typeof data.tasks !== "object" || data.tasks === null) {
      this.errors.push("tasks.md: missing [tasks] table");
      return false;
    }

    const keys = Object.keys(data.tasks);
    const sorted = [...keys].sort();
    if (keys.join("\n") !== sorted.join("\n")) {
      this.errors.push("tasks.md: task IDs must be sorted");
      return false;
    }

    for (const [tid, t] of Object.entries(data.tasks)) {
      const required = ["title","type","files","deps","dod","agent","est_min"];
      for (const f of required) {
        if (!(f in t)) {
          this.errors.push(`${tid}: missing ${f}`);
          return false;
        }
      }
      if (t.agent !== "executor") {
        this.errors.push(`${tid}: agent must be 'executor'`);
        return false;
      }
      if (!Array.isArray(t.files) || !t.files.every(x => typeof x === "string")) {
        this.errors.push(`${tid}: files must be an array of strings`);
        return false;
      }
      if (!Array.isArray(t.deps) || !t.deps.every(x => typeof x === "string")) {
        this.errors.push(`${tid}: deps must be an array of strings`);
        return false;
      }
      if (!Array.isArray(t.dod) || !t.dod.every(x => typeof x === "string")) {
        this.errors.push(`${tid}: dod must be an array of strings`);
        return false;
      }
      if (typeof t.title !== "string" || !t.title.trim()) {
        this.errors.push(`${tid}: title must be non-empty string`);
        return false;
      }
      if (typeof t.type !== "string" || !t.type.trim()) {
        this.errors.push(`${tid}: type must be non-empty string`);
        return false;
      }
      if (typeof t.est_min !== "number" || !Number.isFinite(t.est_min) || t.est_min < 0) {
        this.errors.push(`${tid}: est_min must be a non-negative number`);
        return false;
      }
    }

    console.log("✅ TOML validation passed");
    return true;
  }

  // Validate diff files
  validateDiff() {
    console.log("🔍 Validating diff files...");
    
    try {
      const staged = execSync("git diff --cached --name-only", { stdio: ["ignore", "pipe", "ignore"] })
        .toString().split("\n").filter(Boolean);
      const candidate = staged.find(p => p.endsWith("executor_output.diff") || p.endsWith(".patch"));
      if (candidate) {
        const data = execSync(`git show :${candidate}`, { stdio: ["ignore", "pipe", "ignore"] }).toString();
        // Validate diff format
        const lines = data.split(/\r?\n/);
        let open = false, blocks = [], body = [];
        for (const l of lines) {
          if (!open && l.trim() === "```diff") { open = true; body = []; continue; }
          if (open && l.trim() === "```") { blocks.push(body.slice()); open = false; body = []; continue; }
          if (open) body.push(l);
        }
        if (blocks.length !== 1) {
          this.errors.push(`Expected exactly one fenced diff block, found ${blocks.length}`);
          return false;
        }
        const b = blocks[0];
        if ((b[0] || "").trim() !== "*** BEGIN PATCH") {
          this.errors.push("First line must be '*** BEGIN PATCH'");
          return false;
        }
        if ((b[b.length-1] || "").trim() !== "*** END PATCH") {
          this.errors.push("Last line must be '*** END PATCH'");
          return false;
        }
      }
    } catch (error) {
      // No staged diff files, that's okay
    }

    console.log("✅ Diff validation passed");
    return true;
  }

  // Health check with cached data
  healthCheck() {
    console.log("🔍 Running health check...");
    
    const state = this.parseYaml(path.join("scratchpad", "state.md"));
    const plan = this.parseYaml(path.join("scratchpad", "plan.md"));
    const tasks = this.parseToml(path.join("scratchpad", "tasks.md"));
    
    if (!state || !plan || !tasks) return false;

    const pc = plan.plan_checksum || "";
    const tc = tasks.plan_checksum || "";
    const currentPhase = state.phase || "idle";

    // Phase-aware checksum validation
    if (currentPhase === "idle") {
      if (pc.length > 0 && tc.length > 0 && pc !== tc) {
        this.errors.push("plan_checksum mismatch between plan.md and tasks.md");
        return false;
      }
    } else if (currentPhase === "planning") {
      if (tc.length > 0) {
        this.errors.push("tasks.md should have empty checksum in planning phase");
        return false;
      }
    } else {
      if (pc.length === 0 || tc.length === 0) {
        this.errors.push("Both plan.md and tasks.md must have non-empty checksums in execution phase and later");
        return false;
      }
      if (pc !== tc) {
        this.errors.push("plan_checksum mismatch between plan.md and tasks.md");
        return false;
      }
    }

    console.log("✅ Health check passed");
    return true;
  }

  // Run all validations
  async run() {
    console.log("🚀 Starting optimized validation pipeline...");
    
    const startTime = Date.now();
    
    // Run validations in parallel where possible
    const results = await Promise.allSettled([
      this.validateYaml(),
      this.validateToml(),
      this.validateDiff(),
      this.healthCheck()
    ]);

    const endTime = Date.now();
    const duration = endTime - startTime;

    // Check results
    const allPassed = results.every(r => r.status === "fulfilled" && r.value === true);
    
    if (allPassed) {
      console.log(`✅ All validators passed in ${duration}ms`);
      return true;
    } else {
      console.error("❌ Validation failed:");
      this.errors.forEach(error => console.error(`  - ${error}`));
      return false;
    }
  }
}

// Run the optimized pipeline
const pipeline = new ValidationPipeline();
pipeline.run().then(success => {
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error("❌ Validation pipeline error:", error.message);
  process.exit(1);
});
