import { SiteFrame } from "@/components/site/shared";
import common from "@/components/private-label/PrivateLabel.module.css";
import styles from "@/components/private-label/PrivateLabelGuide.module.css";
import { pageMetadata } from "@/lib/cms/public";
import PrivateLabelGuidePage from "@/components/private-label/PrivateLabelGuidePage";

export const generateMetadata = () => pageMetadata("guide");

export default function Page() {
  return <SiteFrame className={common.page + " " + styles.page}><PrivateLabelGuidePage /></SiteFrame>;
}
