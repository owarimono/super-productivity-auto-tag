/**
 * Auto Tag Manager - Host-side logic (v3).
 * Hooks live here so they stay active even when the UI is closed.
 */

(() => {
  "use strict";

  console.log("[AutoTag] plugin.js loading...");

  const API =
    window.PluginAPI || (typeof PluginAPI !== "undefined" ? PluginAPI : null);
  if (!API) {
    console.error("[AutoTag] PluginAPI not available in host context!");
    return;
  }

  // ---------- Header button ----------
  try {
    API.registerHeaderButton({
      id: "auto-tag-header-btn",
      label: "Auto Tag",
      icon: "label",
      onClick: () => API.showIndexHtmlAsView(),
    });
    console.log("[AutoTag] Header button registered.");
  } catch (err) {
    console.error("[AutoTag] Header button registration failed:", err);
  }

  // ---------- Storage ----------
  // Only rules are persisted in synced data.
  // Stats are intentionally NOT written here: a tagging write would race
  // with a settings save and could overwrite a rule edit made on another
  // device, depending on sync order.
  //
  // v3 format: { version: 3, rules: [...] }
  // v2 format: { version: 2, rules: [...], stats: {...} }  -> stats dropped
  // legacy:    [ { keyword, tags }, ... ]                  -> migrated
  const EMPTY_RULES = () => ({ version: 3, rules: [] });

  function migrate(data) {
    if (Array.isArray(data)) {
      return {
        version: 3,
        rules: data.map((r, i) => ({
          id: "legacy_" + i + "_" + Date.now(),
          keyword: r.keyword || "",
          tags: Array.isArray(r.tags) ? r.tags : [],
          enabled: true,
          createdAt: Date.now(),
        })),
      };
    }
    if (data && Array.isArray(data.rules)) {
      // Preserve rule fields as-is; drop stats if present.
      return { version: 3, rules: data.rules };
    }
    return EMPTY_RULES();
  }

  async function loadStore() {
    try {
      const raw = await API.loadSyncedData();
      if (!raw) return EMPTY_RULES();
      return migrate(JSON.parse(raw));
    } catch (err) {
      console.error("[AutoTag] loadStore failed:", err);
      return EMPTY_RULES();
    }
  }

  async function saveStore(store) {
    try {
      await API.persistDataSynced(JSON.stringify(store));
      return true;
    } catch (err) {
      console.error("[AutoTag] saveStore failed:", err);
      return false;
    }
  }

  // ---------- Core logic ----------
  async function applyRulesToTask(task) {
    if (!task || !task.title) return;

    const store = await loadStore();
    const activeRules = store.rules.filter((r) => r.enabled !== false);
    if (activeRules.length === 0) return;

    const allTags = await API.getAllTags();
    if (!allTags || allTags.length === 0) return;

    // Build a title -> id map, skipping the built-in Today tag.
    // Today membership comes from the due date, never from tagIds.
    const nameToId = new Map();
    for (const t of allTags) {
      if (t.id === "TODAY") continue;
      nameToId.set(t.title, t.id);
    }

    const tagIds = new Set(task.tagIds || []);
    const addedIds = [];

    for (const rule of activeRules) {
      let regex;
      try {
        regex = new RegExp(rule.keyword);
      } catch {
        continue;
      }
      if (!regex.test(task.title)) continue;

      for (const tagTitle of rule.tags) {
        const id = nameToId.get(tagTitle);
        if (id && !tagIds.has(id)) {
          tagIds.add(id);
          addedIds.push(id);
        }
      }
    }

    if (addedIds.length === 0) return;

    try {
      await API.updateTask(task.id, { tagIds: [...tagIds] });
      // Log the id, not the title, to keep user content out of the console.
      console.log("[AutoTag] Applied tags to task id:", task.id);
    } catch (err) {
      console.error("[AutoTag] updateTask failed:", err);
    }
  }

  // ---------- Hooks ----------
  // We intentionally do NOT register `anyTaskUpdate`:
  //   - it fires for the same events as taskCreated/taskUpdate (double-run),
  //   - it also fires on delete with the removed task, which could trigger
  //     an updateTask call on a task that no longer exists.
  //
  // For `taskUpdate` we only re-run rules when the title was actually
  // changed. Otherwise removing an auto-applied tag would immediately
  // re-add it.
  function registerHooks() {
    try {
      API.registerHook("taskCreated", async (payload) => {
        const task = payload && payload.task ? payload.task : payload;
        await applyRulesToTask(task);
      });
      console.log("[AutoTag] Registered hook: taskCreated");
    } catch (err) {
      console.warn("[AutoTag] Failed to register hook: taskCreated", err);
    }

    try {
      API.registerHook("taskUpdate", async (payload) => {
        const task = payload && payload.task ? payload.task : payload;
        const changes = payload && payload.changes;
        // Only proceed if the title changed (or if we can't tell, which
        // shouldn't happen in practice).
        if (changes && !("title" in changes)) return;
        await applyRulesToTask(task);
      });
      console.log("[AutoTag] Registered hook: taskUpdate");
    } catch (err) {
      console.warn("[AutoTag] Failed to register hook: taskUpdate", err);
    }
  }

  registerHooks();
  console.log("[AutoTag] plugin.js ready.");
})();
