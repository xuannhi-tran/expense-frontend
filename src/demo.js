import { AxiosError } from "axios";

// Demo mode: an in-memory stand-in for the expense API. api.js routes requests
// here when demo mode is on, so components never need to know about it.

const DEMO_KEY = "demo";
const PAGE_SIZE = 10;

export const isDemo = () => {
  try {
    if (new URLSearchParams(window.location.search).get("demo") === "1") {
      sessionStorage.setItem(DEMO_KEY, "1");
    }
    return sessionStorage.getItem(DEMO_KEY) === "1";
  } catch {
    return new URLSearchParams(window.location.search).get("demo") === "1";
  }
};

export const enterDemo = () => {
  try {
    sessionStorage.setItem(DEMO_KEY, "1");
  } catch {
    // sessionStorage unavailable; ?demo=1 still works
  }
};

export const exitDemo = () => {
  try {
    sessionStorage.removeItem(DEMO_KEY);
  } catch {
    // ignore
  }
  window.location.assign(window.location.pathname);
};

// ---- Sample data -----------------------------------------------------------

const TEMPLATES = [
  ["Groceries", "Food", 62],
  ["Coffee", "Food", 5],
  ["Lunch", "Food", 14],
  ["Dinner out", "Food", 38],
  ["Bus pass top-up", "Transport", 30],
  ["Fuel", "Transport", 55],
  ["Ride share", "Transport", 17],
  ["Electricity bill", "Utilities", 78],
  ["Internet", "Utilities", 60],
  ["Water bill", "Utilities", 34],
  ["Cinema tickets", "Entertainment", 26],
  ["Streaming subscription", "Entertainment", 12],
  ["Concert", "Entertainment", 85],
  ["Running shoes", "Shopping", 95],
  ["Books", "Shopping", 28],
  ["Desk lamp", "Shopping", 40],
  ["Gift", "Other", 33],
  ["Stationery", "Other", 11],
];

// Small deterministic PRNG so the sample set is stable between loads.
const makeRng = (seed) => {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
};

const buildSeed = () => {
  const rng = makeRng(42);
  const now = Date.now();
  const DAY = 86400000;
  const rows = [];

  for (let i = 0; i < 42; i += 1) {
    const [name, category, base] = TEMPLATES[Math.floor(rng() * TEMPLATES.length)];
    const amount = Math.round(base * (0.8 + rng() * 0.5) * 100) / 100;
    const daysAgo = Math.floor(rng() * 80);
    const created = new Date(now - daysAgo * DAY - Math.floor(rng() * DAY));
    const iso = created.toISOString();
    rows.push({ name, amount: amount.toFixed(2), category, created_at: iso, updated_at: iso });
  }

  rows.sort((a, b) => a.created_at.localeCompare(b.created_at));
  return rows.map((row, idx) => ({ id: idx + 1, ...row }));
};

let expenses = buildSeed();
let nextId = expenses.length + 1;

// ---- Fake HTTP layer -------------------------------------------------------

const respond = (config, status, data) => ({
  data,
  status,
  statusText: String(status),
  headers: {},
  config,
  request: {},
});

const fail = (config, status, data) =>
  Promise.reject(
    new AxiosError(`Demo request failed with status ${status}`, AxiosError.ERR_BAD_REQUEST, config, {}, respond(config, status, data))
  );

const parseBody = (config) => {
  if (!config.data) return {};
  if (typeof config.data === "string") {
    try {
      return JSON.parse(config.data);
    } catch {
      return {};
    }
  }
  return config.data;
};

const validate = (body, partial) => {
  const errors = {};
  if (!partial || "name" in body) {
    if (!String(body.name ?? "").trim()) errors.name = ["This field may not be blank."];
  }
  if (!partial || "amount" in body) {
    const n = Number(body.amount);
    if (!Number.isFinite(n) || n <= 0) errors.amount = ["A valid positive number is required."];
  }
  return Object.keys(errors).length ? errors : null;
};

const list = (config) => {
  const { search, category, page } = config.params || {};
  let rows = [...expenses].sort((a, b) => b.created_at.localeCompare(a.created_at));

  if (search) {
    const q = String(search).toLowerCase();
    rows = rows.filter((e) => e.name.toLowerCase().includes(q));
  }
  if (category) rows = rows.filter((e) => e.category === category);

  const pageNum = Math.max(1, Number(page) || 1);
  const start = (pageNum - 1) * PAGE_SIZE;
  const results = rows.slice(start, start + PAGE_SIZE);

  return respond(config, 200, {
    count: rows.length,
    next: start + PAGE_SIZE < rows.length ? `?page=${pageNum + 1}` : null,
    previous: pageNum > 1 ? `?page=${pageNum - 1}` : null,
    results,
  });
};

export const demoAdapter = async (config) => {
  // Small delay so loading states behave like they do with a real network.
  await new Promise((resolve) => setTimeout(resolve, 120));

  const method = (config.method || "get").toLowerCase();
  const path = String(config.url || "").split("?")[0];
  const match = path.match(/^\/expenses\/(?:(\d+)\/)?$/);

  if (!match) return fail(config, 404, { detail: "Not available in demo mode." });
  const id = match[1] ? Number(match[1]) : null;

  if (id === null) {
    if (method === "get") return list(config);
    if (method === "post") {
      const body = parseBody(config);
      const errors = validate(body, false);
      if (errors) return fail(config, 400, errors);
      const now = new Date().toISOString();
      const created = {
        id: nextId++,
        name: String(body.name).trim(),
        amount: Number(body.amount).toFixed(2),
        category: body.category || "Other",
        created_at: now,
        updated_at: now,
      };
      expenses.push(created);
      return respond(config, 201, created);
    }
  } else {
    const index = expenses.findIndex((e) => e.id === id);
    if (index === -1) return fail(config, 404, { detail: "Not found." });

    if (method === "get") return respond(config, 200, expenses[index]);
    if (method === "patch" || method === "put") {
      const body = parseBody(config);
      const errors = validate(body, true);
      if (errors) return fail(config, 400, errors);
      const current = expenses[index];
      const updated = {
        ...current,
        ...("name" in body && { name: String(body.name).trim() }),
        ...("amount" in body && { amount: Number(body.amount).toFixed(2) }),
        ...("category" in body && { category: body.category || "Other" }),
        updated_at: new Date().toISOString(),
      };
      expenses[index] = updated;
      return respond(config, 200, updated);
    }
    if (method === "delete") {
      expenses = expenses.filter((e) => e.id !== id);
      return respond(config, 204, "");
    }
  }

  return fail(config, 405, { detail: "Method not allowed." });
};
