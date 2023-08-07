import {
  lowerHalf,
  getLanguage,
  lowerContent,
  openEnvelope,
  mainImage,
  setResponse,
  invitationId,
} from "./global";
import { route, routerHistory } from "./router";
import rsvp from "/rsvp.svg";
import translations from "./translations";

export default () => {
  openEnvelope();
  const language = getLanguage();

  lowerContent.classList.remove("main-page");
  lowerContent.classList.add("rsvp-page");
  lowerContent.parentElement!.classList.add("full");
  lowerHalf.style.height = `80vh`;
  lowerContent.style.maxHeight = `calc(80vh - 7rem)`;
  lowerContent.style.overflowY = `scroll`;
  mainImage.style.display = `none`;
  lowerContent.style.backgroundImage = "none";
  lowerContent.innerHTML = `
  <form id="rsvp-form" class="rsvp-form">
    <img class="header" src="${rsvp}" alt="rsvp" />
    <p>${translations.rsvp.deadline[language]}</p>
    <fieldset class="form-control">
      <label class="form-control">
        <input type="radio" name="rsvp" value="accept" />
        <span>${translations.rsvp.acceptOption[language]}</span>
      </label>

    <label class="form-control">
      <input type="radio" name="rsvp" value="decline" />
      <span>${translations.rsvp.declineOption[language]}</span>
    </label>
    </fieldset>
    <fieldset class="hidden" id="fields">
    <label>
      ${translations.rsvp.attendeesLabel[language]}
      <input name="attendees" />
    </label>
    <label>
      ${translations.rsvp.mealPreferencesLabel[language]}
      <input name="mealPreferences" />
    </label>
      <div class="form-control-inline">
        <span>${translations.rsvp.papillonOption[language]}</span>
        <div>
          <label>
          <input type="radio" name="comment" value="papillon" /> <span>${translations.yes[language]}</span>
          </label>
          <label>
          <input type="radio" name="comment" value="other" /> <span>${translations.no[language]}</span>
          </label>
        </div>
      </div>
    </fieldset>
  <button class="rsvp submit" id="rsvp">${translations.submit[language]}</button>
  </form>
  <footer tabindex="0">
  <button class="back" id="back">${translations.back[language]}</button>
  </footer>
  `;

  const backButton = document.getElementById("back") as HTMLButtonElement;
  const submitButton = document.getElementById("rsvp") as HTMLButtonElement;
  const onBackClick = () => route((routerHistory.pop() as any) || "main");
  backButton.addEventListener("click", onBackClick);
  const fieldset = document.getElementById("fields");
  const radioButtons = document.getElementsByName("rsvp");
  const form = document.getElementById("rsvp-form") as HTMLFormElement;
  fetch(`https://paintit.onrender.com/api/invitations/${invitationId}`)
    .then((res) => (res.status === 200 ? res.json() : Promise.resolve(null)))
    .then((result: any) => {
      if (!result) return;
      form.comment.value = result.comments;
      form.mealPreferences.value = result.meal_preferences;
      form.attendees.value = result.attendees;
      form.rsvp.value = result.rsvp === "true" ? "accept" : "decline";
      submitButton!.style.opacity = "1";
      if (form.rsvp.value === "accept") {
        setResponse(true);
        fieldset!.style.display = "block";
        fieldset!.style.opacity = "1";
      } else {
        fieldset!.style.display = "none";
        fieldset!.style.opacity = "0";
      }
    });
  const listeners = [
    () => {
      fieldset!.style.display = "block";
      fieldset!.style.opacity = "1";
      submitButton!.style.opacity = "1";
    },
    () => {
      submitButton!.style.opacity = "1";
      fieldset!.style.display = "none";
      fieldset!.style.opacity = "0";
    },
    (event: Event) => {
      event.preventDefault();

      fetch(`https://paintit.onrender.com/api/invitations/${invitationId}`, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        method: "POST",
        body: new URLSearchParams(new FormData(form) as any),
      }).then((res) => {
        if (res.status === 200) {
          setResponse(form.rsvp.value === "accept");
          route("done");
        }
      });
    },
  ];
  radioButtons[0].addEventListener("click", listeners[0]);
  radioButtons[1].addEventListener("click", listeners[1]);

  form!.addEventListener("submit", listeners[2]);

  return () => {
    backButton.removeEventListener("click", onBackClick);
    radioButtons[0].removeEventListener("click", listeners[0]);
    radioButtons[1].removeEventListener("click", listeners[1]);
    form!.removeEventListener("submit", listeners[2]);
  };
  return () => {};
};
