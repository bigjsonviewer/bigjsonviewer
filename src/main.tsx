import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import {Analytics} from "@vercel/analytics/react"
import {SpeedInsights} from "@vercel/speed-insights/react";
import '@ant-design/v5-patch-for-react-19';


ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <App/>
        {import.meta.env.PROD && <>
            <Analytics/>
            <SpeedInsights/>
        </>}
    </React.StrictMode>,
);
