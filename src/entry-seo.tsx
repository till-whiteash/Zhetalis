/* eslint-disable react-refresh/only-export-components -- Build-time entry, never loaded by browser HMR. */
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import App from './App';
import { I18nProvider } from './i18n/I18nProvider';
export { PAGES, ORIGIN, organization } from './seo';

// The same components produce both the public HTML and the interactive site.
export function render(pathname: string) {
  return renderToString(
    <StaticRouter location={pathname}>
      <I18nProvider initialLang="en"><App /></I18nProvider>
    </StaticRouter>,
  );
}
