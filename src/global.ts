import mainTop from "/wedding-1.svg";
import translations from "./translations";
import { route } from "./router";
export type SupportedLanguages = "en" | "ru" | "hu";

const PREFIX = "?key=";
export const invitationId = window.location.search.slice(PREFIX.length);
const invitationResponse = await fetch(
  `https://paintit.onrender.com/api/verify-invitation/${invitationId}`
);
if (invitationResponse.status !== 200)
  throw new Error("invalid invitation link");
const person = (await invitationResponse.json()) as {
  address: string;
  language: SupportedLanguages;
  name: string;
};

const address =
  person.name.split(" ").length > 1
    ? `${person.address.split(" ")[0]} <br /> ${person.address
        .split(" ")
        .slice(1)
        .join(" ")}`
    : person.address;

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <section class="front" id="content">
      <img id="main-image" class="main" src="${mainTop}" alt="Andras & Olga" />
      <div class="main" id="main-offset">
        <div class="front">
        <h1>
        ${address}
        </h1>
          <button class="rsvp" id="open">${
            translations.open[person.language]
          }</button>
        </div>
        <div class="back" id="lower-content">
        </div>
      </div/>
  </section
`;

export const mainImage = document.getElementById(
  "main-image"
) as HTMLImageElement;
export const lowerHalf = document.getElementById(
  "main-offset"
) as HTMLDivElement;
const openButton = document.getElementById("open") as HTMLButtonElement;

export const lowerContent = document.getElementById(
  "lower-content"
) as HTMLDivElement;

export const openEnvelope = () => {
  lowerHalf.style.transform = `rotateX(0deg)`;
  openButton.style.opacity = "0";

  setTimeout(() => {
    lowerHalf.style.position = "relative";
  }, 2500);
};

let referenceHeight = 0;
let previousDimensions = [0, 0];
export const onResize = () => {
  if (
    window.innerWidth === previousDimensions[0] &&
    Math.abs(window.innerHeight - previousDimensions[1]) < 100
  )
    return;

  let maxHeight = window.innerHeight > 480 ? window.innerHeight * 0.46 : 320;
  maxHeight = maxHeight > 320 ? 320 : maxHeight;
  referenceHeight = mainImage.getBoundingClientRect().width * 1.05;
  referenceHeight = referenceHeight > maxHeight ? maxHeight : referenceHeight;
  if (referenceHeight > 0) {
    previousDimensions = [window.innerWidth, window.innerHeight];
    mainImage.style.height = `${referenceHeight}px`;
    lowerHalf.style.minHeight = `${referenceHeight}px`;
  }
};

export const getReferenceHeight = () => referenceHeight;
export const getLanguage = () => person.language;

let response = false;
export const getResponse = (): boolean => response;
export const setResponse = (_response: boolean) => {
  response = _response;
};

openButton.addEventListener("click", () => route("main"));
onResize();
window.addEventListener("resize", onResize);

// key is just hash.
// information must be 32 bytes
// - location -> 6 bytes / list
// - name -> 12 bytes
// - language -> 1 byte

// STORE ONLY ENCRYPTEOD
/*
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
});*/
