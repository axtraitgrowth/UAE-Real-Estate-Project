import { testAuth } from "./auth.test";
import { testRbac } from "./rbac.test";
import { testIsolation } from "./isolation.test";
import { testProspect } from "./prospect.test";
import { testQualification } from "./qualification.test";

async function runAllTests() {
  console.log("=================================================");
  console.log("🚀 Apex UAE Real Estate Platform - Test Suite");
  console.log("=================================================");

  const startTime = Date.now();
  try {
    await testAuth();
    await testRbac();
    await testIsolation();
    await testProspect();
    await testQualification();

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log("\n=================================================");
    console.log(`✅ ALL TEST SUITES PASSED (${duration}s)`);
    console.log("=================================================\n");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ TEST SUITE FAILED:", error);
    process.exit(1);
  }
}

runAllTests();
