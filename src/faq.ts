import {
  lowerHalf,
  getLanguage,
  lowerContent,
  openEnvelope,
  getReferenceHeight,
} from "./global";
import { route } from "./router";
import translations from "./translations";

export default () => {
  openEnvelope();

  lowerContent.classList.remove("main-page");
  lowerContent.classList.add("index-page");
  lowerContent.parentElement!.classList.add("full");
  lowerHalf.style.minHeight = `${2 * getReferenceHeight()}px`;
  lowerContent.style.backgroundImage = "none";
  const language = getLanguage();
  lowerContent.innerHTML = `
  ${translations.index.content[language]}
  <footer>
  <button class="back" id="back">${translations.back[language]}</button>
<button class="rsvp" id="rsvp">${translations.rsvpLabel[language]}</button>
  </footer>
  `;
  const details = document.querySelectorAll("details");

  // Add the onclick listeners.
  const listeners: (() => void)[] = [];
  details.forEach((targetDetail) => {
    listeners.push(() => {
      details.forEach((detail) => {
        if (detail !== targetDetail) {
          detail.removeAttribute("open");
        }
      });
    });
    targetDetail.addEventListener("click", listeners[listeners.length - 1]);
  });

  const backButton = document.getElementById("back") as HTMLButtonElement;
  const onBackClick = () => route("main");
  backButton.addEventListener("click", onBackClick);
  const rsvpButton = document.getElementById("rsvp") as HTMLButtonElement;
  const onRSVPClick = () => route("rsvp");
  rsvpButton.addEventListener("click", onRSVPClick);
  return () => {
    backButton.removeEventListener("click", onBackClick);
    rsvpButton.removeEventListener("click", onRSVPClick);
  };
  return () => {
    details.forEach((targetDetail, i) => {
      targetDetail.removeEventListener("click", listeners[i]);
    });
  };
};
