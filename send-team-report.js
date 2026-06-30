import fs from "fs";
import path from "path";
import axios from "axios";

const webhookUrl = "https://default85707f27830a4b92aa8c3830bfb6c6.f5.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/45ed6cf3998b446b92b2479ade6bb385/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=jZouY04HqXShwIVIBzSlDture4kMYw-h81MyeXiKtRM"; // Add your Teams webhook URL here

if (!webhookUrl) {
  console.error("❌ TEAMS_WEBHOOK_URL not set. Set env var or edit the script.");
  process.exit(1);
}

const reportPath = path.resolve("./test-results/test-results.json");

if (!fs.existsSync(reportPath)) {
  console.error(`❌ JSON report not found at ${reportPath}`);
  process.exit(1);
}

const raw = fs.readFileSync(reportPath, "utf-8");

let report;
try {
  report = JSON.parse(raw);
} catch (err) {
  console.error("❌ Invalid JSON in report file. Aborting.");
  console.error(err);
  process.exit(1);
}

// Helper function
const get = (obj, pathArr, fallback = undefined) => {
  let cur = obj;
  for (const p of pathArr) {
    if (cur == null) return fallback;
    cur = cur[p];
  }
  return cur ?? fallback;
};

const DEFAULT_BROWSER =
  process.env.TEST_BROWSER ||
  process.env.BROWSER ||
  "Chromium";

// Collect tests
const collected = [];

function traverse(obj) {
  if (!obj || typeof obj !== "object") return;

  const maybeTitle =
    obj.title ??
    obj.name ??
    obj.testTitle ??
    undefined;

  const maybeStatus = (
    obj.status ??
    (obj.ok === true
      ? "passed"
      : obj.ok === false
      ? "failed"
      : undefined)
  )
    ?.toString()
    ?.toLowerCase();

  if (
    typeof maybeTitle === "string" &&
    typeof maybeStatus === "string"
  ) {
    let id;

    const idMatch = maybeTitle.match(
      /(TC[-_\s]?\d{2,6}|ID[-_:]?\d{2,6})/i
    );

    if (idMatch) id = idMatch[0];

    const file =
      obj.location?.file ??
      obj.file ??
      obj.url ??
      undefined;

    let browser =
      get(obj, ["project", "name"]) ??
      obj.projectName ??
      undefined;

    if (!browser) {
      const topProject =
        get(report, ["project", "name"]) ??
        get(report, ["projects", "0", "name"]);

      if (topProject) browser = topProject;
    }

    if (!browser) browser = DEFAULT_BROWSER;

    collected.push({
      id,
      name: maybeTitle,
      file,
      browser,
      status: maybeStatus,
    });

    return;
  }

  if (Array.isArray(obj.tests) && obj.tests.length) {
    obj.tests.forEach(traverse);
    return;
  }

  if (Array.isArray(obj)) {
    obj.forEach(traverse);
    return;
  }

  Object.values(obj).forEach(traverse);
}

function walkSuites(s) {
  if (!s) return;

  if (Array.isArray(s)) {
    s.forEach(walkSuites);
    return;
  }

  if (s.specs) {
    s.specs.forEach((spec) => {
      if (spec.tests) {
        spec.tests.forEach((t) => {
          const title = t.title ?? t.name;

          const status = (
            t.status ??
            (t.ok ? 'passed' : 'failed')
          )
            ?.toString()
            ?.toLowerCase();

          if (title && status) {
            collected.push({
              id:
                (
                  title.match(
                    /(TC[-_\s]?\d{2,6}|ID[-_:]?\d{2,6})/i
                  ) || []
                )[0],
              name: title,
              file: spec.file ?? t.file,
              browser:
                get(t, ['project', 'name']) ??
                DEFAULT_BROWSER,
              status,
            });
          }
        });
      }

      if (spec.suites) {
        walkSuites(spec.suites);
      }
    });
  }
}

traverse(report);

// Fallback for Playwright JSON format
if (collected.length === 0) {
  const suites = report.suites ?? report;
  walkSuites(suites);
}

// Summary
const total = collected.length;
const passed = collected.filter(
  (t) => t.status === "passed"
).length;

const failed = collected.filter(
  (t) => t.status === "failed"
).length;

const skipped = collected.filter(
  (t) => t.status === "skipped"
).length;

// Teams Message
const MAX_LINES = 100;

const lines = collected
  .slice(0, MAX_LINES)
  .map((t) => {
    const idPart = t.id ? `**${t.id}** • ` : "";
    const filePart = t.file
      ? ` (_${path.basename(t.file)}_)`
      : "";

    const browserPart = t.browser
      ? ` • Browser: **${t.browser}**`
      : "";

    const statusPart = t.status
      ? ` • Status: **${
          t.status.charAt(0).toUpperCase() +
          t.status.slice(1)
        }**`
      : "";

    return `- ${idPart}${t.name}${filePart}${browserPart}${statusPart}`;
  });

const moreNote =
  total > MAX_LINES
    ? `\n\n_...and ${
        total - MAX_LINES
      } more tests omitted in this message._`
    : "";

const payload = {
  "@type": "MessageCard",
  "@context": "https://schema.org/extensions",
  summary: "Automation Execution Report",
  themeColor: failed > 0 ? "FF0000" : "00C853",
  title:
    failed > 0
      ? `❌ Automation Execution — ${failed} failed`
      : `✅ Automation Execution — All Passed (${passed}/${total})`,
  sections: [
    {
      activityTitle: `Total: **${total}** • Passed: **${passed}** • Failed: **${failed}** • Skipped: **${skipped}**`,
      text: lines.length
        ? lines.join("\n") + moreNote
        : "_No tests found in JSON report_",
      markdown: true,
    },
  ],
};

// Send to Teams
(async () => {
  try {
    const res = await axios.post(
      webhookUrl,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log(
      "✅ Sent summary to Teams:",
      res.status
    );
  } catch (err) {
    console.error(
      "❌ Error sending message to Teams:",
      err.response?.status,
      err.response?.data || err.message
    );
  }
})();