
import { exec } from "child_process";
import path from "path";

// A simple way to verify syntax is to try and compile this specific file using tsc or esbuild,
// OR since we are in a Next.js project, we can run a quick lint check on the file.
// Running 'next build' is too slow. 'next lint' is better.

const filePath = "src/app/(app)/financeiro/_components/finance-dashboard-client.tsx";

console.log(`Checking syntax for: ${filePath}`);

exec(`npx eslint "${filePath}"`, (error, stdout, stderr) => {
    if (error) {
        console.error(`❌ Syntax/Lint Error detected:`);
        console.error(stdout); // eslint usually outputs to stdout
        console.error(stderr);
    } else {
        console.log(`✅ Syntax Check Passed! No lint errors found.`);
    }
});
