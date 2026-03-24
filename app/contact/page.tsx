import type { Metadata } from "next";
import ContactPage from "@/components/contact/ContactPage";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Tell us what you're working on and we'll come back to you within one business day."
};

export default function Contact() {
  return <ContactPage />;
}
