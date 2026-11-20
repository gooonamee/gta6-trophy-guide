import { guides } from "./data/guides.js";
const KEY = "leonida-field-guide-v1";
const $ = (id) => document.getElementById(id);
const trophies = (await (await fetch("data/trophies.json")).json()).trophies;
const grades = ["platinum", "gold", "silver", "bronze"];
const sensitive = new Set([37, 38, 44, 45, 46, 47, 48, 49, 50]);
let earned = new Set();
try {
  const stored = JSON.parse(localStorage.getItem(KEY) || "[]");
  if (Array.isArray(stored))
    earned = new Set(stored.filter((id) => trophies.some((t) => t.id === id)));
} catch {
  /* start fresh */
}
let revealed = new Set();
function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify([...earned]));
  } catch {
    alert(
      "Progress could not be saved in this browser. Export a backup to keep it.",
    );
  }
}
function render() {
  const percent = Math.round((earned.size / trophies.length) * 100);
  $("progress-count").innerHTML =
    `${earned.size} <small>/ ${trophies.length} EARNED</small>`;
  $("progress-percent").textContent = `${percent}%`;
  $("progress-bar").style.width = `${percent}%`;
  $("progress-message").textContent =
    earned.size === trophies.length
      ? "All 55 accounted for. You are a Leonida legend."
      : "Every legend starts somewhere. Let’s get to work.";
  $("tiers").replaceChildren();
  for (const grade of grades) {
    const group = trophies.filter((t) => t.grade === grade),
      done = group.filter((t) => earned.has(t.id)).length;
    const card = document.createElement("button");
    card.className = `tier ${grade}`;
    card.type = "button";
    card.setAttribute(
      "aria-label",
      `Show ${grade} trophies, ${done} of ${group.length} earned`,
    );
    card.innerHTML = `<span class="tier-icon">✦</span><span><small>${grade}</small><strong>${done} <i>/ ${group.length}</i></strong><small>${Math.round((done / group.length) * 100)}% COMPLETE</small></span><span class="tier-arrow">↗</span>`;
    card.onclick = () => {
      $("grade").value = grade;
      render();
      $("list").scrollIntoView({ behavior: "smooth", block: "start" });
    };
    $("tiers").append(card);
  }
  const query = $("search").value.trim().toLowerCase(),
    grade = $("grade").value,
    status = $("status").value;
  const filtered = trophies.filter(
    (t) =>
      (grade === "all" ||
        (grade === "hidden" ? sensitive.has(t.id) : t.grade === grade)) &&
      (status === "all" || (status === "done") === earned.has(t.id)) &&
      (!query || `${t.name} ${t.description}`.toLowerCase().includes(query)),
  );
  $("result-count").textContent = `/ ${filtered.length} TROPHIES`;
  $("list").replaceChildren();
  $("empty").hidden = filtered.length > 0;
  for (const g of grades) {
    const group = filtered.filter((t) => t.grade === g);
    if (!group.length) continue;
    const heading = document.createElement("div");
    heading.className = "group-heading";
    heading.innerHTML = `<span>${g} trophies</span><span>${group.length} IN VIEW</span>`;
    $("list").append(heading);
    for (const t of group) {
      const masked =
        $("spoilers").checked && sensitive.has(t.id) && !revealed.has(t.id);
      const row = document.createElement("article");
      row.className = `trophy ${earned.has(t.id) ? "earned" : ""}`;
      const check = document.createElement("input");
      check.type = "checkbox";
      check.className = "check";
      check.checked = earned.has(t.id);
      check.setAttribute(
        "aria-label",
        masked
          ? `Mark sensitive trophy ${t.id} earned`
          : `Mark ${t.name} earned`,
      );
      check.onchange = () => {
        check.checked ? earned.add(t.id) : earned.delete(t.id);
        save();
        render();
        document.querySelector(`[data-trophy-id="${t.id}"] .check`)?.focus();
      };
      row.dataset.trophyId = t.id;
      const icon = document.createElement("div");
      icon.className = `medal ${g}`;
      icon.textContent = "✦";
      const body = document.createElement("div");
      body.className = "trophy-body";
      if (masked) {
        body.innerHTML = `<div class="row-top"><span class="badge">SPOILER SENSITIVE</span><span class="row-id">NO. ${String(t.id).padStart(2, "0")}</span></div><div class="masked" aria-hidden="true">Hidden trophy details</div><p>Details are hidden to protect your journey.</p>`;
        const reveal = document.createElement("button");
        reveal.className = "reveal";
        reveal.textContent = "Reveal trophy ↗";
        reveal.onclick = () => {
          revealed.add(t.id);
          render();
        };
        body.append(reveal);
      } else {
        const details = document.createElement("details");
        const summary = document.createElement("summary");
        const top = document.createElement("div");
        top.className = "row-top";
        top.innerHTML = `<span class="badge">${t.grade}${sensitive.has(t.id) ? " / SENSITIVE" : ""}</span><span class="row-id">NO. ${String(t.id).padStart(2, "0")}</span>`;
        const title = document.createElement("h4");
        title.textContent = t.name;
        const desc = document.createElement("p");
        desc.textContent = t.description;
        const more = document.createElement("span");
        more.className = "more";
        more.textContent = "VIEW FIELD GUIDE  ↗";
        summary.append(top, title, desc, more);
        const guide = document.createElement("div");
        guide.className = "guide";
        const label = document.createElement("span");
        label.className = "micro";
        label.textContent = "FIELD NOTES / STRATEGY";
        const text = document.createElement("p");
        text.textContent = guides[t.id];
        guide.append(label, text);
        details.append(summary, guide);
        body.append(details);
      }
      row.append(check, icon, body);
      $("list").append(row);
    }
  }
}
for (const id of ["grade", "status", "spoilers"])
  $(id).addEventListener("change", render);
$("search").addEventListener("input", render);
$("clear").onclick = () => {
  $("grade").value = "all";
  $("status").value = "all";
  $("search").value = "";
  render();
};
$("export").onclick = () => {
  const url = URL.createObjectURL(
    new Blob([JSON.stringify({ version: 1, earned: [...earned] }, null, 2)], {
      type: "application/json",
    }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = "leonida-progress.json";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
$("import").onchange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    const ids = Array.isArray(data) ? data : data.earned;
    if (
      !Array.isArray(ids) ||
      ids.some(
        (id) => !Number.isInteger(id) || !trophies.some((t) => t.id === id),
      )
    )
      throw Error();
    earned = new Set(ids);
    save();
    render();
  } catch {
    alert("Could not import that file. Choose a Leonida progress export.");
  }
  e.target.value = "";
};
$("reset").onclick = () => {
  if (confirm("Reset all tracked trophies? This cannot be undone.")) {
    earned.clear();
    save();
    render();
  }
};
render();
