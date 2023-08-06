import {
  lowerHalf,
  getLanguage,
  lowerContent,
  openEnvelope,
  getReferenceHeight,
  getResponse,
  invitationId,
} from "./global";
import finish from "/finish.svg";
import translations from "./translations";

export default () => {
  openEnvelope();
  const language = getLanguage();

  lowerContent.classList.remove("main-page");
  lowerContent.classList.add("rsvp-page");
  lowerContent.parentElement!.classList.add("full");
  lowerHalf.style.minHeight = `${2 * getReferenceHeight()}px`;
  lowerContent.style.backgroundImage = "none";
  lowerContent.innerHTML = `
  <section class="text-center">
  <h1>${translations.done.thankYou[language]}</h1>
    ${
      getResponse()
        ? `<img class="finish-header" src="${finish}" alt="rsvp" /><p>${translations.done.seeYouSoon[language]}</p><p>${translations.done.reachOut[language]}</p>`
        : ""
    }
    ${invitationId === 'd72c53bb42f27880ea5c378029e6b6d86f87be50e5a9d47d17aac8df348e7ebe' ? `<p>ya bastart astronaut</p>` : ''}

    </section>
    `;

  return () => {};
};
