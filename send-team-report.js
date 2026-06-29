const fs = require("fs");
const axios = require("axios");

const webhook = process.env.TEAMS_WEBHOOK_URL;

if (!webhook) {
    console.error("❌ TEAMS_WEBHOOK_URL is missing.");
    process.exit(1);
}

const reportPath = "./playwright-report/test-results.json";

if (!fs.existsSync(reportPath)) {
    console.error("❌ Playwright JSON report not found.");
    process.exit(1);
}

const report = JSON.parse(fs.readFileSync(reportPath, "utf8"));

let total = 0;
let passed = 0;
let failed = 0;
let skipped = 0;

let details = "";

function parseSuites(suites) {
    for (const suite of suites) {

        if (suite.suites && suite.suites.length) {
            parseSuites(suite.suites);
        }

        if (!suite.specs) continue;

        for (const spec of suite.specs) {

            const title = spec.title;
            const file = spec.file || "";

            for (const test of spec.tests) {

                total++;

                const result = test.results[0] || {};

                const duration =
                    ((result.duration || 0) / 1000).toFixed(2);

                const browser =
                    test.projectName || "Chromium";

                let status = result.status || test.status;

                if (status === "passed")
                    passed++;

                else if (status === "failed")
                    failed++;

                else
                    skipped++;

                const icon =
                    status === "passed"
                        ? "✅"
                        : status === "failed"
                        ? "❌"
                        : "⏭";

                details +=
`• ${title}
  📄 File : ${file},🌐 Browser  : ${browser},⏱ Duration : ${duration}s${icon} Status   : ${status}
`;
            }
        }
    }
}

parseSuites(report.suites);

const message =
`🚀 Playwright Automation Execution 
📊 Test Summary
──────────────────────────────
📦 Total Tests : ${total} ✅ Passed : ${passed} ❌ Failed : ${failed} ⏭ Skipped : ${skipped}
──────────────────────────────
${details}
──────────────────────────────
Repository : ${process.env.GITHUB_REPOSITORY}
Branch : ${process.env.GITHUB_REF_NAME}
Run :
https://github.com/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}
`;

axios
    .post(webhook, {
        text: message
    })
    .then(() => {
        console.log("✅ Teams notification sent.");
    })
    .catch(err => {
        console.error(err.response?.data || err.message);
        process.exit(1);
    });