/**
 * Global teardown hook - runs after all tests complete
 * Adds a wait time before closing browsers
 */
async function globalTeardown() {
  console.log('All tests completed. Teardown starting.');
}

export default globalTeardown;

