import ContactPage from "@/components/contact/ContactPage";
import { createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "Contact",
  description:
    "Tell us what you're working on and we'll come back to you soon.",
  path: "/contact"
});

export default function Contact() {
  return <ContactPage />;
}
