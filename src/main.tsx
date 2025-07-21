// import React from "react";
import {Analytics} from "@vercel/analytics/react"
import {SpeedInsights} from "@vercel/speed-insights/react";
import ReactDOM from "react-dom/client";

import App from "./App";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    // <React.StrictMode>
    <>
        <App/>
        {import.meta.env.PROD && <>
            <Analytics/>
            <SpeedInsights/>
        </>}
    </>
    // </React.StrictMode>,
);
