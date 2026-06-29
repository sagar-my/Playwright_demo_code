/**
 * Global teardown hook - runs after all tests complete
 * Adds a wait time before closing browsers
 */
async function globalTeardown() {
  // Wait for 2 seconds after all tests complete
  await new Promise(resolve => setTimeout(resolve, 2000));
  console.log('All tests completed. Waiting before teardown...');
}

export default globalTeardown;

