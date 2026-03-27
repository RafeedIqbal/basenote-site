import AboutPage from "@/components/about/AboutPage";
import { createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "About",
  description:
    "Meet the team behind Basenote Solutions and learn how fragrance manufacturing, brand building, and technology come together in our model.",
  path: "/about"
});

export default function About() {
  return <AboutPage />;
}
