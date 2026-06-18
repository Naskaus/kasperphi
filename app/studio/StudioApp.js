"use client";
import { useEffect, useRef, useState } from "react";

const CATS = [
  ["one-mon-show", "One Mon Show"],
  ["chansons", "Chansons"],
  ["images", "Images"],
  ["textes", "Textes"],
  ["pochettes", "Pochettes"],
];
const CATLABEL = Object.fromEntries(CATS);
const SETTINGS_FIELDS = [
  ["hero_title", "Titre principal (hero)", "input"],
  ["hero_subtitle", "Sous-titre", "input"],
  ["hero_lead", "Phrase d'accroche", "text"],
  ["avant_text", "Bloc « Avant d'entrer »", "text"],
  ["manifeste_body", "Texte du manifeste", "text"],
  ["contact_email", "Email de contact", "input"],
];

export default function StudioApp() {
  const [tab, setTab] = useState("creations");
  const [creations, setCreations] = useState([]);
  const [media, setMedia] = useState([]);
  const [settings, setSettings] = useState({});
  const [editing, setEditing] = useState(null);
  const [toast, setToast] = useState("");
  const toastTimer = useRef(null);

  function say(msg) {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2600);
  }

  async function loadAll() {
    const [c, m, s] = await Promise.all([
      fetch("/api/studio/creations").then((r) => r.json()),
      fetch("/api/studio/media").then((r) => r.json()),
      fetch("/api/studio/settings").then((r) => r.json()),
    ]);
    setCreations(c.creations || []);
    setMedia(m.media || []);
    setSettings(s.settings || {});
  }
  useEffect(() => { loadAll(); }, []);

  async function logout() {
    await fetch("/api/studio/login", { method: "DELETE" });
    window.location.href = "/studio/login";
  }

  // ---------- creations ----------
  async function toggleStatus(c) {
    const status = c.status === "published" ? "draft" : "published";
    await fetch(`/api/studio/creations/${c.id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setCreations((arr) => arr.map((x) => (x.id === c.id ? { ...x, status } : x)));
    say(status === "published" ? "Publié sur le site." : "Repassé en brouillon.");
  }
  async function delCreation(c) {
    if (!confirm(`Supprimer « ${c.title} » ? Cette action est définitive.`)) return;
    await fetch(`/api/studio/creations/${c.id}`, { method: "DELETE" });
    setCreations((arr) => arr.filter((x) => x.id !== c.id));
    say("Création supprimée.");
  }
  async function move(c, dir) {
    const arr = [...creations];
    const i = arr.findIndex((x) => x.id === c.id);
    const j = i + dir;
    if (j < 0 || j >= arr.length) return;
    const a = arr[i], b = arr[j];
    await Promise.all([
      fetch(`/api/studio/creations/${a.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sort_order: b.sort_order }) }),
      fetch(`/api/studio/creations/${b.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sort_order: a.sort_order }) }),
    ]);
    const so = a.sort_order; a.sort_order = b.sort_order; b.sort_order = so;
    arr[i] = b; arr[j] = a;
    setCreations(arr);
  }
  async function saveCreation(form) {
    const isNew = !form.id;
    const url = isNew ? "/api/studio/creations" : `/api/studio/creations/${form.id}`;
    const r = await fetch(url, {
      method: isNew ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const j = await r.json();
    if (!r.ok) { say(j.error || "Erreur"); return; }
    await loadAll();
    setEditing(null);
    say(isNew ? "Création ajoutée." : "Modifications enregistrées.");
  }

  // ---------- media ----------
  async function upload(files) {
    for (const file of files) {
      const fd = new FormData();
      fd.append("file", file);
      const r = await fetch("/api/studio/media", { method: "POST", body: fd });
      if (!r.ok) { say("Échec de l'upload : " + file.name); continue; }
    }
    await loadAll();
    say(files.length > 1 ? `${files.length} médias ajoutés.` : "Média ajouté.");
  }
  async function delMedia(m) {
    if (!confirm(`Supprimer le média « ${m.title} » ?`)) return;
    await fetch(`/api/studio/media?id=${m.id}`, { method: "DELETE" });
    setMedia((arr) => arr.filter((x) => x.id !== m.id));
    say("Média supprimé.");
  }
  async function renameMedia(m) {
    const title = prompt("Nouveau nom :", m.title || "");
    if (title == null) return;
    await fetch("/api/studio/media", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: m.id, title }) });
    setMedia((arr) => arr.map((x) => (x.id === m.id ? { ...x, title } : x)));
  }

  // ---------- settings ----------
  async function saveSettings(values) {
    const r = await fetch("/api/studio/settings", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
    if (r.ok) { setSettings(values); say("Réglages enregistrés."); }
    else say("Erreur d'enregistrement.");
  }

  return (
    <div className="studio">
      <div className="studio-top">
        <div>
          <div className="brand">Kasperphi</div>
          <div className="small">Studio — votre tableau de bord</div>
        </div>
        <div className="studio-actions">
          <a className="sbtn" href="/" target="_blank" rel="noreferrer">Voir le site ↗</a>
          <button className="sbtn danger" onClick={logout}>Déconnexion</button>
        </div>
      </div>

      <div className="tabs">
        <button className={"tab" + (tab === "creations" ? " active" : "")} onClick={() => setTab("creations")}>Créations</button>
        <button className={"tab" + (tab === "media" ? " active" : "")} onClick={() => setTab("media")}>Bibliothèque média</button>
        <button className={"tab" + (tab === "reglages" ? " active" : "")} onClick={() => setTab("reglages")}>Réglages</button>
      </div>

      {tab === "creations" && (
        <CreationsTab
          creations={creations} onNew={() => setEditing({ category: "textes", status: "draft" })}
          onEdit={setEditing} onToggle={toggleStatus} onDelete={delCreation} onMove={move}
        />
      )}
      {tab === "media" && (
        <MediaTab media={media} onUpload={upload} onDelete={delMedia} onRename={renameMedia} say={say} />
      )}
      {tab === "reglages" && (
        <ReglagesTab settings={settings} onSave={saveSettings} />
      )}

      {editing && (
        <Editor
          initial={editing} media={media}
          onClose={() => setEditing(null)} onSave={saveCreation}
        />
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

function CreationsTab({ creations, onNew, onEdit, onToggle, onDelete, onMove }) {
  return (
    <div className="panel">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
        <p className="muted" style={{ margin: 0 }}>{creations.length} création(s). « Publié » = visible sur le site, « Brouillon » = stocké, invisible.</p>
        <button className="sbtn primary" onClick={onNew}>＋ Nouvelle création</button>
      </div>
      {creations.length === 0 && <p className="muted">Rien encore. Cliquez « ＋ Nouvelle création ».</p>}
      {creations.map((c, i) => (
        <div className="row" key={c.id}>
          <div className="meta">
            <div className="c">{CATLABEL[c.category] || c.category}</div>
            <div className="t">{c.title}</div>
          </div>
          <div className="ctl">
            <button className="sbtn" title="Monter" onClick={() => onMove(c, -1)} disabled={i === 0}>↑</button>
            <button className="sbtn" title="Descendre" onClick={() => onMove(c, 1)} disabled={i === creations.length - 1}>↓</button>
            <div className={"switch" + (c.status === "published" ? " on" : "")} onClick={() => onToggle(c)} role="button" title="Publier / Brouillon">
              <span className="track"><span className="knob" /></span>
              <span className="lab">{c.status === "published" ? "Publié" : "Brouillon"}</span>
            </div>
            <button className="sbtn" onClick={() => onEdit(c)}>Modifier</button>
            <button className="sbtn danger" onClick={() => onDelete(c)}>Suppr.</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function MediaTab({ media, onUpload, onDelete, onRename, say }) {
  const [drag, setDrag] = useState(false);
  const inputRef = useRef(null);
  return (
    <div className="panel">
      <div
        className={"dropzone" + (drag ? " drag" : "")}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); if (e.dataTransfer.files?.length) onUpload([...e.dataTransfer.files]); }}
      >
        <div style={{ fontSize: "2rem" }}>⬆</div>
        <strong>Glissez-déposez vos fichiers ici</strong>
        <div className="hint">ou cliquez pour choisir — images, audio (chansons, One Mon Show), vidéos</div>
        <input ref={inputRef} type="file" multiple hidden accept="image/*,audio/*,video/*"
          onChange={(e) => { if (e.target.files?.length) onUpload([...e.target.files]); e.target.value = ""; }} />
      </div>

      {media.length === 0 ? (
        <p className="muted" style={{ marginTop: 18 }}>Aucun média pour l'instant.</p>
      ) : (
        <div className="media-grid">
          {media.map((m) => (
            <div className="media-tile" key={m.id}>
              {m.kind === "image" && <img className="thumb" src={m.public_url} alt={m.title} />}
              {m.kind === "audio" && <div style={{ padding: "10px 8px 0" }}><audio controls src={m.public_url} /></div>}
              {m.kind === "video" && <video className="thumb" src={m.public_url} controls />}
              {m.kind === "other" && <div className="thumb" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>📄</div>}
              <div className="info"><div className="nm" title={m.title}>{m.title}</div><div className="muted" style={{ fontSize: "0.68rem" }}>{m.kind}</div></div>
              <div className="acts">
                <button className="sbtn" onClick={() => onRename(m)}>Renommer</button>
                <button className="sbtn" onClick={() => { navigator.clipboard?.writeText(m.public_url); say("Lien copié."); }}>Lien</button>
                <button className="sbtn danger" onClick={() => onDelete(m)}>Suppr.</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ReglagesTab({ settings, onSave }) {
  const [v, setV] = useState(settings);
  useEffect(() => setV(settings), [settings]);
  return (
    <div className="panel">
      <p className="muted">Ces textes apparaissent directement sur le site public.</p>
      {SETTINGS_FIELDS.map(([key, label, type]) => (
        <div key={key}>
          <label className="flabel">{label}</label>
          {type === "input"
            ? <input className="finput" value={v[key] || ""} onChange={(e) => setV({ ...v, [key]: e.target.value })} />
            : <textarea className="ftext" value={v[key] || ""} onChange={(e) => setV({ ...v, [key]: e.target.value })} />}
        </div>
      ))}
      <div style={{ marginTop: 18 }}>
        <button className="sbtn primary" onClick={() => onSave(v)}>Enregistrer les réglages</button>
      </div>
    </div>
  );
}

function Editor({ initial, media, onClose, onSave }) {
  const [f, setF] = useState({
    id: initial.id, title: initial.title || "", category: initial.category || "textes",
    excerpt: initial.excerpt || "", body: initial.body || "",
    cover_media_id: initial.cover_media_id || "", audio_media_id: initial.audio_media_id || "",
    status: initial.status || "draft",
  });
  const images = media.filter((m) => m.kind === "image");
  const playable = media.filter((m) => m.kind === "audio" || m.kind === "video");
  const cover = media.find((m) => m.id === f.cover_media_id);

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>{f.id ? "Modifier la création" : "Nouvelle création"}</h3>

        <label className="flabel">Titre</label>
        <input className="finput" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} placeholder="Le titre de l'œuvre" />

        <label className="flabel">Rubrique</label>
        <select className="fselect" value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })}>
          {CATS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
        </select>

        <label className="flabel">Résumé (sur la carte)</label>
        <input className="finput" value={f.excerpt} onChange={(e) => setF({ ...f, excerpt: e.target.value })} placeholder="Une phrase d'accroche" />

        <label className="flabel">Texte / contenu</label>
        <textarea className="ftext" value={f.body} onChange={(e) => setF({ ...f, body: e.target.value })} placeholder="Le texte complet (laissez une ligne vide entre les paragraphes)" />

        <label className="flabel">Image de couverture</label>
        <div className="media-pick">
          <select className="fselect" style={{ maxWidth: 320 }} value={f.cover_media_id} onChange={(e) => setF({ ...f, cover_media_id: e.target.value })}>
            <option value="">— Aucune —</option>
            {images.map((m) => <option key={m.id} value={m.id}>{m.title}</option>)}
          </select>
          {cover && <img src={cover.public_url} alt="" />}
        </div>
        {images.length === 0 && <p className="hint">Uploadez d'abord des images dans « Bibliothèque média ».</p>}

        <label className="flabel">Audio / vidéo (chanson, One Mon Show…)</label>
        <select className="fselect" value={f.audio_media_id} onChange={(e) => setF({ ...f, audio_media_id: e.target.value })}>
          <option value="">— Aucun —</option>
          {playable.map((m) => <option key={m.id} value={m.id}>{m.title} ({m.kind})</option>)}
        </select>

        <label className="flabel">Diffusion</label>
        <div className={"switch" + (f.status === "published" ? " on" : "")} onClick={() => setF({ ...f, status: f.status === "published" ? "draft" : "published" })} role="button">
          <span className="track"><span className="knob" /></span>
          <span className="lab">{f.status === "published" ? "Publié (visible sur le site)" : "Brouillon (stocké, invisible)"}</span>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 22, justifyContent: "flex-end" }}>
          <button className="sbtn" onClick={onClose}>Annuler</button>
          <button className="sbtn primary" onClick={() => f.title.trim() ? onSave(f) : alert("Le titre est obligatoire.")}>Enregistrer</button>
        </div>
      </div>
    </div>
  );
}
