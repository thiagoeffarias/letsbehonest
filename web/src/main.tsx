import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/bricolage-grotesque/700.css';
import '@fontsource/instrument-sans/400.css';
import '@fontsource/instrument-sans/500.css';
import '@fontsource/instrument-sans/600.css';
import '@fontsource/jetbrains-mono/500.css';
import '@preco-real/ui/tokens.css';
import './global.css';
import { App } from './App';
import { installLinkInterceptor } from './lib/router';

installLinkInterceptor();
createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
