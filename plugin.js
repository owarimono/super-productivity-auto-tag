/**
 * Auto Tag Manager - Host-side logic (v2).
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
  // New format: { version: 2, rules: [...], stats: {...} }
  // Old format: [ { keyword, tags }, ... ]  → auto-migrated.

  function migrate(data) {
    if (Array.isArray(data)) {
      return {
        version: 2,
        rules: data.map((r, i) => ({
          id: "legacy_" + i + "_" + Date.now(),
          keyword: r.keyword || "",
          tags: Array.isArray(r.tags) ? r.tags : [],
          enabled: true,
          createdAt: Date.now(),
          applyCount: 0,
        })),
        stats: { totalApplied: 0, lastAppliedAt: null },
      };
    }
    if (data && Array.isArray(data.rules)) {
      return {
        version: 2,
        rules: data.rules,
        stats: data.stats || { totalApplied: 0, lastAppliedAt: null },
      };
    }
    return {
      version: 2,
      rules: [],
      stats: { totalApplied: 0, lastAppliedAt: null },
    };
  }

  async function loadStore() {
    try {
      const raw = await API.loadSyncedData();
      if (!raw)
        return {
          version: 2,
          rules: [],
          stats: { totalApplied: 0, lastAppliedAt: null },
        };
      return migrate(JSON.parse(raw));
    } catch (err) {
      console.error("[AutoTag] loadStore failed:", err);
      return {
        version: 2,
        rules: [],
        stats: { totalApplied: 0, lastAppliedAt: null },
      };
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

    const nameToId = new Map(allTags.map((t) => [t.title, t.id]));
    const tagIds = new Set(task.tagIds || []);
    let changed = false;

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
          changed = true;
        }
      }

      if (changed) {
        rule.applyCount = (rule.applyCount || 0) + 1;
      }
    }

    if (changed) {
      try {
        await API.updateTask(task.id, { tagIds: [...tagIds] });
        store.stats.totalApplied = (store.stats.totalApplied || 0) + 1;
        store.stats.lastAppliedAt = Date.now();
        await saveStore(store);
        console.log("[AutoTag] Applied tags to:", task.title);
      } catch (err) {
        console.error("[AutoTag] updateTask failed:", err);
      }
    }
  }

  // ---------- Hooks ----------
  function registerHooks() {
    ["taskCreated", "taskUpdate", "anyTaskUpdate"].forEach((name) => {
      try {
        API.registerHook(name, async (payload) => {
          const task = payload && payload.task ? payload.task : payload;
          await applyRulesToTask(task);
        });
        console.log("[AutoTag] Registered hook:", name);
      } catch (err) {
        console.warn("[AutoTag] Failed to register hook:", name, err);
      }
    });
  }

  registerHooks();
  console.log("[AutoTag] plugin.js ready.");
})();
