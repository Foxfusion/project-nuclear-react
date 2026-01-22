/*
Date Created: 12/02/2025
Modified Date:
Author: William Fox
Filename: ApplcationsPage.tsx
Files Required: None
Description:
API Calls:


 */


import layout from "../styles/layout/app.module.css";
import pageStyles from "../styles/pages/ApplicationsPage.module.css";
import card from "../styles/components/cards.module.css";

export default function ApplicationsPage() {
    return (
        <div className={layout.shell}>
            <div className={layout.metal} />

            <div className={layout.main}>
                <h1 className={card.title}>
                    Applications <span className={card.accent}>Registry</span>
                </h1>
                <p className={card.sub}>
                    Track frontend/backend apps, services, and integrations wired into your stack.
                </p>

                <div className={pageStyles.grid}>
                    <div className={card.card}>
                        <h2 className={card.title}>Apache Spark</h2>
                        <p className={card.sub}>Compute engine</p>
                    </div>

                    <div className={card.card}>
                        <h2 className={card.title}>Airflow</h2>
                        <p className={card.sub}>Orchestration</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
