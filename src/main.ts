import "./style.css";
import mainTop from "/wedding-1.png";
import rsvp from "/rsvp.png";
// import { setupCounter } from './counter.

const PREFIX = "?key=";
console.log(window.location.search.slice(PREFIX.length));

// key is just hash.
// information must be 32 bytes
// - location -> 6 bytes / list
// - name -> 12 bytes
// - language -> 1 byte

// STORE ONLY ENCRYPTEOD
const guestList = [
  {
    name: "Konstantin",
    language: "en",
    location: "Budapest",
  },
];

// const randomBytes = window.crypto.getRandomValues(new Uint8Array(32))

// console.log(randomBytes)

const ec = new TextEncoder();
const result = guestList.map((i) => {
  const payload = new Uint8Array([
    ...ec.encode(i.language),
    i.name.length,
    ...ec.encode(i.name),
    ...ec.encode(i.location),
  ]);

  return new Uint8Array([
    ...ec.encode("invitation"),
    ...[...new Array(22 - payload.length)].map(() => 0),
    ...payload,
  ]);
});

console.log(result);

const translations = {
  requestTitle: {
    en: "REQUEST THE PLEASURE OF YOUR COMPANY AT THEIR WEDDING",
  },
  beforeDate: {
    en: "on",
  },
  date: {
    en: "Thursday, October 26th",
  },
};

const content = {
  index: {
    en: `
  <details>
    <summary>Why so far away?</summary>
    <p>
  For us this hotel is special – 6 years ago we met in the Papillon Belvil.
blablabla i need inspiration
we need to convince them that they need to show up and pay 1000 euros 

we invite you on a 3 days holiday where you party, have fun or just relax (totally up to you)

Papillon Belvil is all inclusive hotel, blablabla you will just need to pay for a tour
  </p>
  </details>

  <details>
    <summary>Timeline</summary>
<h3>26th of October </h3>
<p>
we arrive to the hotel, have rest, relax, if you have energy – gather for evening cocktail 
  </p>

<h3>27th of October </h3>
<p>
there are 2 options, up to you
</p>
<p>
1. we all meet at the breakfast (or lunch, depends on you), play beach volleyball / swim / do fun activities, cocktail party and games after dinner  
</p>
<p>
2. or you can just chill and relax all day long
</p>

<h3>28th of October</h3>
<p>
15.00  welcome drinks 
</p>

<p>16.00 ceremony begins</p>

<p>17.00 dinner in the restaurant 'DOLCE VITA'</p>

<p>00:00 the end of the party </p>

<h3>29th of October</h3>

<p>have breakfast / lunch and say goodbye </p>
  </details>

  <details>
    <summary>how to organize the trip</summary>
    <p>
    the hotel kindly allowed us to spend 3 nights even though the minimum stay is 5 nights
that's why the best way to book it – is through a travel agency. 

if you need help, please click this button and we will help you to book the trip
</p>
  </details>

  <details>
    <summary>dress code</summary>
<p>none, just be yourself </p>
  </details>
  <details>
    <summary>presents</summary>
<p>your presence is our best present, so please – nothing</p>
  </details>
    `,
  },
  back: {
    en: "BACK",
  },
  moreDetails: {
    en: "More information",
  },
  rsvp: {
    en: "RSVP",
  },
  submit: {
    en: "SUBMIT",
  },
};

const language = "en";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <section class="front" id="content">
      <img id="main-image" class="main" src="${mainTop}" alt="Andras & Olga" />
      <div class="main" id="main-offset">
        <div class="front">
        <h1>
        Dear BIBIT
        </h1>
          <button class="rsvp" id="open">OPEN</button>
        </div>
        <div class="back" id="lower-content">
        </div>
      </div/>
  </section
`;

const mainImage = document.getElementById("main-image") as HTMLImageElement;
const lowerHalf = document.getElementById("main-offset") as HTMLDivElement;
const openButton = document.getElementById("open") as HTMLButtonElement;

const lowerContent = document.getElementById("lower-content") as HTMLDivElement;

const openEnvelope = () => {
  lowerHalf.style.transform = `rotateX(0deg)`;
  openButton.style.opacity = "0";
};

type Routes = {
  main: () => () => void;
  index: () => () => void;
  rsvp: () => () => void;
  done: () => () => void;
};
const routerHistory: string[] = [];

const routes: Routes = {} as Routes;

let cleanup: null | (() => void) = null;
const router = (hash: keyof Routes) => {
  const currentRoute = document.location.hash.slice(1);
  if (currentRoute !== hash && Object.keys(routes).includes(currentRoute)) {
    routerHistory.push(currentRoute as keyof Routes);
  }
  if (cleanup) cleanup();
  if (!Object.keys(routes).includes(hash)) return;
  document.location.hash = hash;
  cleanup = routes[hash]();
};

const renderDoneContent = () => {
  openEnvelope();

  lowerContent.classList.remove("main-page");
  lowerContent.classList.add("rsvp-page");
  lowerContent.parentElement!.classList.add("full");
  lowerHalf.style.minHeight = `${2 * referenceHeight}px`;
  lowerContent.style.backgroundImage = "none";
  lowerContent.innerHTML = `
  <h1>Thank you for your response</h1>
  <p>if you need any further assistance reach out to...</p>
    `;

  return () => {};
};

const renderRSVPContent = () => {
  openEnvelope();

  lowerContent.classList.remove("main-page");
  lowerContent.classList.add("rsvp-page");
  lowerContent.parentElement!.classList.add("full");
  lowerHalf.style.minHeight = `${2 * referenceHeight}px`;
  lowerContent.style.backgroundImage = "none";
  lowerContent.innerHTML = `
  <form id="rsvp-form" class="rsvp-form">
    <img id="main-image" class="header" src="${rsvp}" alt="Andras & Olga" />
    <fieldset class="form-control">
      <label class="form-control">
        <input type="radio" name="rsvp" value="accept" />
        <span>Would be delighted to attend</span>
      </label>

    <label class="form-control">
      <input type="radio" name="rsvp" value="decline" />
      <span>Regretfully unable to attend</span>
    </label>
    </fieldset>
    <fieldset class="hidden" id="fields">
    <label>
      names of attendees (comma separated)
      <input name="attendees" />
    </label>
    <label>
      allergies or meal preferences
      <input name="mealPreferences" />
    </label>
    <label>
      song requests
      <input name="songRequest"/>
    </label>
    <label>
      special requests or comments
      <input name="comment"/>
    </label>
    </fieldset>
  <button class="rsvp submit" id="rsvp">${content.submit[language]}</button>
  </form>
  <footer tabindex="0">
  <button class="back" id="back">${content.back[language]}</button>
  </footer>
  `;

  const backButton = document.getElementById("back") as HTMLButtonElement;
  const submitButton = document.getElementById("rsvp") as HTMLButtonElement;
  const onBackClick = () => router((routerHistory.pop() as any) || "main");
  backButton.addEventListener("click", onBackClick);
  const fieldset = document.getElementById("fields");
  const radioButtons = document.getElementsByName("rsvp");
  const form = document.getElementById("rsvp-form") as HTMLFormElement;
  fetch(`http://localhost:8081/api/invitations/test`)
    .then((res) => (res.status === 200 ? res.json() : Promise.resolve(null)))
    .then((result: any) => {
      if (!result) return;
      form.comment.value = result.comments;
      form.songRequest.value = result.song_request;
      form.mealPreferences.value = result.meal_preferences;
      form.attendees.value = result.attendees;
      form.rsvp.value = result.rsvp === "true" ? "accept" : "decline";
      submitButton!.style.opacity = "1";
      if (form.rsvp.value === "accept") {
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

      fetch(`http://localhost:8081/api/invitations/test`, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        method: "POST",
        body: new URLSearchParams(new FormData(form) as any),
      }).then((res) => {
        if (res.status === 200) {
          router("done");
        }
      });
    },
  ];
  radioButtons[0].addEventListener("click", listeners[0]);
  radioButtons[1].addEventListener("click", listeners[1]);

  form!.addEventListener("submit", listeners[2]);
  /*
  const rsvpButton = document.getElementById("rsvp") as HTMLButtonElement;
  const onRSVPClick = () => router("rsvp");
  rsvpButton.addEventListener("click", onRSVPClick);*/
  return () => {
    backButton.removeEventListener("click", onBackClick);
    radioButtons[0].removeEventListener("click", listeners[0]);
    radioButtons[1].removeEventListener("click", listeners[1]);
    form!.removeEventListener("submit", listeners[2]);
    //rsvpButton.removeEventListener("click", onRSVPClick);
  };
  return () => {};
};

const renderIndexContent = () => {
  openEnvelope();

  lowerContent.classList.remove("main-page");
  lowerContent.classList.add("index-page");
  lowerContent.parentElement!.classList.add("full");
  lowerHalf.style.minHeight = `${2 * referenceHeight}px`;
  lowerContent.style.backgroundImage = "none";
  lowerContent.innerHTML = `
  ${content.index[language]}
  <footer>
  <button class="back" id="back">${content.back[language]}</button>
<button class="rsvp" id="rsvp">${content.rsvp[language]}</button>
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
  const onBackClick = () => router("main");
  backButton.addEventListener("click", onBackClick);
  const rsvpButton = document.getElementById("rsvp") as HTMLButtonElement;
  const onRSVPClick = () => router("rsvp");
  rsvpButton.addEventListener("click", onRSVPClick);
  return () => {
    backButton.removeEventListener("click", onBackClick);
    rsvpButton.removeEventListener("click", onRSVPClick);
  };
  return () => {
    details.forEach((targetDetail, i) => {
      targetDetail.removeEventListener("click", listeners[i]);
      // Close all the details that are not targetDetail.
    });
  };
};

const renderMainContent = () => {
  openEnvelope();

  lowerContent.classList.remove("index-page");
  lowerContent.classList.add("main-page");
  lowerContent.parentElement!.classList.remove("full");
  lowerHalf.style.minHeight = `${referenceHeight}px`;

  lowerContent.innerHTML = `
  <footer>
<button id="learn-more">${content.moreDetails[language]}</button>
<button class="rsvp" id="rsvp">${content.rsvp[language]}</button>
</footer>
  `;
  mainImage.src = mainTop;

  const moreInformationButton = document.getElementById(
    "learn-more"
  ) as HTMLButtonElement;
  lowerContent.style.backgroundImage = 'url("/wedding-2.png")';

  const onMoreClick = () => router("index");
  moreInformationButton.addEventListener("click", onMoreClick);
  const rsvpButton = document.getElementById("rsvp") as HTMLButtonElement;
  const onRSVPClick = () => router("rsvp");
  rsvpButton.addEventListener("click", onRSVPClick);
  return () => {
    moreInformationButton.removeEventListener("click", onMoreClick);
    rsvpButton.removeEventListener("click", onRSVPClick);
  };
};

routes.main = renderMainContent;
routes.index = renderIndexContent;
routes.rsvp = renderRSVPContent;
routes.done = renderDoneContent;

const observeUrlChange = () => {
  let oldHash = document.location.hash.slice(1);
  router(oldHash as keyof Routes);
  window.addEventListener("hashchange", () => {
    const newHash = document.location.hash.slice(1);
    if (oldHash !== newHash) {
      oldHash = newHash;
      router(newHash as keyof Routes);
    }
  });
  /*
  const body = document.body;
  const observer = new MutationObserver(() => {
  });

   observer.observe(body, { childList: true, subtree: true });
   */
};

openButton.addEventListener("click", () => router("main"));

let referenceHeight = 0;
const onResize = () => {
  referenceHeight = mainImage.getBoundingClientRect().width * 1.05;
  referenceHeight = referenceHeight > 320 ? 320 : referenceHeight;
  mainImage.style.height = `${referenceHeight}px`;
  lowerHalf.style.minHeight = `${referenceHeight}px`;

  router(document.location.hash.slice(1) as keyof Routes);
};

onResize();
window.addEventListener("resize", onResize);

window.onload = observeUrlChange;

// setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
