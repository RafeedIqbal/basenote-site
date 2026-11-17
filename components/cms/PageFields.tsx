"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useField, useFormFields } from "@payloadcms/ui";
import type { JSONFieldClientComponent } from "payload";
import { isPageKey, pageTemplates } from "@/data/cms-pages";
import { contentFields, type TextValues } from "@/lib/cms/fields";
import { mediaSource } from "@/lib/cms/article";
import type { Media } from "@/cms/payload-types";
import styles from "./PageFields.module.css";

export const PageFields: JSONFieldClientComponent = ({ path, readOnly }) => {
  const { value, setValue, errorMessage, showError } = useField<TextValues>({ path });
  const key = useFormFields(([fields]) => fields.key?.value);
  const [search, setSearch] = useState("");
  const [media, setMedia] = useState<Media[]>([]);
  const [mediaError, setMediaError] = useState(false);
  const fields = useMemo(() => typeof key === "string" && isPageKey(key) ? contentFields(pageTemplates[key]) : [], [key]);
  const visible = fields.filter(f => (f.group + " " + f.label + " " + (value?.[f.key] ?? f.initial)).toLowerCase().includes(search.toLowerCase()));
  const groups = Array.from(new Set(visible.map(f => f.group)));
  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      const docs: Media[] = [];
      for (let page = 1; ; page++) {
        const response = await fetch("/api/media?limit=100&depth=0&page=" + page, { signal: controller.signal });
        if (!response.ok) throw new Error("Media unavailable");
        const result = await response.json();
        docs.push(...result.docs);
        if (!result.hasNextPage) break;
      }
      setMedia(docs);
    }
    load().catch(() => { if (!controller.signal.aborted) setMediaError(true); });
    return () => controller.abort();
  }, []);
  return <div className={styles.editor}>
    {(key === "guide" || key === "private-label") && <p className={styles.note}>Editorial sign-off covers guide prose, the guide teaser, and private-label search descriptions. Confirm approval before publishing changes to these fields.</p>}
    <label className={styles.search}>Find a field<input type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search sections, labels or copy" /></label>
    {fields.some(f => f.kind === "image") && <p className={styles.library}><a href="/admin/collections/media" target="_blank" rel="noreferrer">Open media library</a> to upload an image. Reopen this page to use it.</p>}
    {showError && <p role="alert">{errorMessage}</p>}
    {mediaError && <p role="status">The media library could not load. Reload this page to choose another image.</p>}
    {!visible.length && <p>No matching fields.</p>}
    {groups.map((group, index) => <details key={group} open={search ? true : index === 0} className={styles.group}>
      <summary>{group}</summary>
      <div className={styles.fields}>{visible.filter(f => f.group === group).map(f => {
        const current = value?.[f.key] ?? f.initial;
        const change = (next: string) => setValue({ ...value, [f.key]: next });
        return <label key={f.key}><span>{f.label}</span>
          {f.kind === "image" ? <><Image className={styles.thumbnail} src={current} width={192} height={108} alt="" /><select disabled={readOnly} value={current} onChange={e => change(e.target.value)}>
            {!media.some(m => mediaSource(m) === current) && <option value={current}>{current}</option>}
            {media.map(m => <option key={m.id} value={mediaSource(m)}>{m.alt || m.filename}</option>)}
          </select></> : f.initial.length > 70 || current.length > 100 ? <textarea readOnly={readOnly} rows={3} value={current} onChange={e => change(e.target.value)} /> : <input readOnly={readOnly} value={current} onChange={e => change(e.target.value)} />}
        </label>;
      })}</div>
    </details>)}
  </div>;
};
