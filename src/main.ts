import "./style.css";
import mainTop from "/wedding-1.svg";
import translations from "./translations";
import {
  mainImage,
  lowerHalf,
  lowerContent,
  openEnvelope,
  getReferenceHeight,
  getLanguage,
} from "./global";
import { route } from "./router";

export default () => {
  openEnvelope();
  const language = getLanguage();

  lowerContent.classList.remove("index-page");
  lowerContent.classList.add("main-page");
  lowerContent.parentElement!.classList.remove("full");
  lowerHalf.style.minHeight = `${getReferenceHeight()}px`;

  lowerContent.innerHTML = `
  <footer>
<button id="learn-more">${translations.moreDetails[language]}</button>
<button class="rsvp" id="rsvp">${translations.rsvpLabel[language]}</button>
</footer>
  `;
  mainImage.src = mainTop;

  const moreInformationButton = document.getElementById(
    "learn-more"
  ) as HTMLButtonElement;
  lowerContent.style.backgroundImage = `url('/wedding-2-${language}.svg')`;

  const onMoreClick = () => route("index");
  moreInformationButton.addEventListener("click", onMoreClick);
  const rsvpButton = document.getElementById("rsvp") as HTMLButtonElement;
  const onRSVPClick = () => route("rsvp");
  rsvpButton.addEventListener("click", onRSVPClick);
  return () => {
    moreInformationButton.removeEventListener("click", onMoreClick);
    rsvpButton.removeEventListener("click", onRSVPClick);
  };
};
