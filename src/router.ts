type Routes = {
  main: () => () => void;
  index: () => () => void;
  rsvp: () => () => void;
  done: () => () => void;
};

export const routerHistory: string[] = []
export const route = (hash: string) => (document.location.hash = hash);

export const routes: Routes = {} as Routes;

let cleanup: null | (() => void) = null;
const router = (hash: keyof Routes) => {
  if (cleanup) cleanup();console.log(routes)
  if (!Object.keys(routes).includes(hash)) return;
  document.location.hash = hash;
  routes[hash]();
};

export const observeUrlChange = () => {
  let oldHash = document.location.hash.slice(1);
  router(oldHash as keyof Routes);
  window.addEventListener("hashchange", () => {
    routerHistory.push(oldHash);
    const newHash = document.location.hash.slice(1);
    if (oldHash !== newHash) {
      oldHash = newHash;
      router(newHash as keyof Routes);
    }
  });
};
