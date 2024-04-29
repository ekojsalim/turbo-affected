import * as core from "@actions/core";

import { exec } from "@actions/exec";

run();

async function run(): Promise<void> {
  try {
    const scope = core.getInput("scope");

    const base = core.getInput("base");
    const head = core.getInput("head");
    // if one is specified, the other must be too
    if ((base && !head) || (!base && head)) {
      throw new Error("Both base and head must be specified");
    }

    const commitFilter = base ? `[${base}..${head}]` : "HEAD^";

    const command = `npx -p turbo -c "turbo build --filter=${scope}...[${commitFilter}] --dry=json"`;

    let output = "";
    await exec(command, [], {
      listeners: {
        stdout: (data: Buffer) => {
          output += data.toString();
        },
      },
      silent: core.getBooleanInput("silent"),
    });

    const parsed = JSON.parse(output);

    // check if parsed.packages is an array and has at least one element
    // if true, then the package/scope is affected
    const affected =
      Array.isArray(parsed.packages) && parsed.packages.length > 0;

    core.setOutput("affected", affected);
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    }
  }
}
