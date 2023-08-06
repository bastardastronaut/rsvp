import "./style.css";
import renderIndexContent from './faq'
import renderDoneContent from './done'
import renderMainContent from './main'
import renderRSVPContent from './rsvp'
import { routes, observeUrlChange } from './router'

routes.main = renderMainContent;
routes.index = renderIndexContent;
routes.rsvp = renderRSVPContent;
routes.done = renderDoneContent;
observeUrlChange();
