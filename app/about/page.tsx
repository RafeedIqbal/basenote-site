import type { Metadata } from "next";
import AboutPage from "@/components/about/AboutPage";

export const metadata: Metadata = {
  title: "About",
  description:
    "Base Note Solutions was built at the intersection of fragrance manufacturing and technology. Meet the team behind the brand."
};

export default function About() {
  return <AboutPage />;
}
