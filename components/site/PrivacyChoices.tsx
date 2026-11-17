"use client";

import Link from "next/link";
import Script from "next/script";
import { useEffect, useRef, useState, useSyncExternalStore, type FormEvent } from "react";

import { PRIVACY_CHANGE_EVENT, PRIVACY_COOKIE, privacyChoice } from "@/lib/privacy-choice";

import styles from "./PrivacyChoices.module.css";

function readChoice() {
  return document.cookie.split("; ").find((cookie) => cookie.startsWith(`${PRIVACY_COOKIE}=`))?.slice(PRIVACY_COOKIE.length + 1) ?? "";
}

function subscribe(onChange: () => void) {
  window.addEventListener(PRIVACY_CHANGE_EVENT, onChange);
  return () => window.removeEventListener(PRIVACY_CHANGE_EVENT, onChange);
}

const serverChoice = () => "";

export function CookieSettings() {
  return <button id="cookie-settings" type="button" className={styles.settings} onClick={() => window.dispatchEvent(new Event("basenote:privacy-open"))}>Cookie settings</button>;
}

export default function PrivacyChoices() {
  const saved = useSyncExternalStore(subscribe, readChoice, serverChoice);
  const choice = privacyChoice(saved);
  const [open, setOpen] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const show = () => setOpen(true);
    window.addEventListener("basenote:privacy-open", show);
    return () => window.removeEventListener("basenote:privacy-open", show);
  }, []);

  useEffect(() => {
    if (open) heading.current?.focus();
  }, [open]);

  function close() {
    setOpen(false);
    if (open) document.getElementById("cookie-settings")?.focus();
  }

  function save(analytics: boolean, marketing: boolean) {
    document.cookie = `${PRIVACY_COOKIE}=v1.${Number(analytics)}${Number(marketing)}; Path=/; Max-Age=15552000; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
    // Clear our first-party tracking cookies on withdrawal, including parent-domain cookies.
    for (const cookie of document.cookie.split("; ")) {
      const name = cookie.split("=")[0];
      if ((!marketing && /^_fb[cp]$/.test(name)) || (!analytics && /^_g(a|id|at)(_|$)/.test(name))) {
        for (const domain of ["", location.hostname, "basenotesolutions.com"]) {
          document.cookie = `${name}=; Path=/; Max-Age=0${domain ? `; Domain=${domain}` : ""}`;
        }
      }
    }
    // Unmounting a script cannot stop an already loaded SDK; reload when withdrawing.
    if ((choice.analytics && !analytics) || (choice.marketing && !marketing)) {
      location.reload();
      return;
    }
    close();
    window.dispatchEvent(new Event(PRIVACY_CHANGE_EVENT));
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    save(data.has("analytics"), data.has("marketing"));
  }

  return <>
    {choice.analytics && <Script id="google-tag-manager" strategy="afterInteractive">
      {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('consent','default',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
(function(w,d,s,l,i){w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s);j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-NWTC77JT');`}
    </Script>}
    {choice.marketing && <Script id="meta-pixel" strategy="afterInteractive">
      {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','1630012237997794');fbq('track','PageView');`}
    </Script>}
    {(!choice.chosen || open) && <section className={styles.panel} aria-labelledby="privacy-heading">
      <h2 ref={heading} id="privacy-heading" tabIndex={-1}>Your cookie choices</h2>
      <p>Essential tools keep this site and its forms working. You choose whether Google can measure visits and Meta can measure advertising. <Link href="/privacy-policy">Read our privacy policy</Link>.</p>
      <form key={saved} onSubmit={submit}>
        <div className={styles.options}>
          <label><input type="checkbox" name="analytics" defaultChecked={choice.analytics} /> Google Analytics</label>
          <label><input type="checkbox" name="marketing" defaultChecked={choice.marketing} /> Meta advertising</label>
        </div>
        <div className={styles.actions}>
          <button type="button" onClick={() => save(false, false)}>Reject optional</button>
          <button type="button" onClick={() => save(true, true)}>Allow all</button>
          <button type="submit">Save choices</button>
          {open && choice.chosen && <button type="button" onClick={close}>Cancel</button>}
        </div>
        {open && (choice.analytics || choice.marketing) && <p className={styles.note}>Turning off tracking refreshes this page. Save any enquiry text first.</p>}
      </form>
    </section>}
  </>;
}
