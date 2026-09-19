import Image from "next/image";
import type { GuideChoiceCard } from "@/data/site-content";
import styles from "./GuideChoiceCards.module.css";

export default function GuideChoiceCards({ cards }: { cards: GuideChoiceCard[] }) {
  return (
    <div className={styles.cards}>
      {cards.map((card) => (
        <article className={styles.card} key={card.title}>
          <div className={styles.image}>
            <Image
              src={card.image.src}
              alt={card.image.alt}
              fill
              sizes="(max-width: 559px) 70vw, (max-width: 1100px) 180px, 24vw"
            />
          </div>
          <div className={styles.copy}>
            <h4>{card.title}</h4>
            <p>{card.description}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
