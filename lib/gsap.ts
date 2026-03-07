"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

if (!registered) {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
  registered = true;
}

export { gsap, ScrollTrigger, useGSAP };
