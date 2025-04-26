import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Include FontAwesome
const fontAwesomeLink = document.createElement('link');
fontAwesomeLink.rel = 'stylesheet';
fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
document.head.appendChild(fontAwesomeLink);

// Include Inter font
const interFontLink = document.createElement('link');
interFontLink.rel = 'stylesheet';
interFontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
document.head.appendChild(interFontLink);

createRoot(document.getElementById("root")!).render(<App />);
