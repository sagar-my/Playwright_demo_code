# Playwright Page Object Model (POM) Test Suite for SauceDemo

This is a comprehensive test automation framework using Playwright with Page Object Model (POM) pattern for testing https://www.saucedemo.com/

## Project Structure

```
Playwright POM/
├── pages/                      # Page Object Model classes
│   ├── baseClass.js           # Base page class with common elements
│   ├── loginPage.js           # Login page object
│   ├── productPage.js         # Products listing page object
│   ├── productDetailPage.js   # Product detail page object
│   ├── cartPage.js            # Shopping cart page object
│   ├── checkoutInformationPage.js  # Checkout information page object
│   ├── checkoutOverviewPage.js     # Checkout overview page object
│   └── checkoutCompletePage.js     # Order completion page object
├── tests/                      # Test suites
│   ├── loginTests.spec.js      # Login tests (positive & negative)
│   ├── productTests.spec.js    # Product browsing and sorting tests
│   ├── cartTests.spec.js       # Shopping cart tests
│   ├── checkoutTests.spec.js   # Checkout flow tests (positive & negative)
│   ├── endToEndTests.spec.js   # End-to-end user journey tests
│   └── logoutTests.spec.js     # Logout functionality tests
├── helpers/                    # Helper functions
│   └── setup.js               # Common setup functions
├── data.js                     # Test data and constants
└── playwright.config.js        # Playwright configuration

```

## Test Coverage

### Login Tests (20 test cases)
- **Positive Scenarios:**
  - Login with valid credentials (standard_user, problem_user, performance_glitch_user)
  - Verify login page elements
  - Verify login button state

- **Negative Scenarios:**
  - Invalid username/password
  - Empty credentials
  - Locked out user
  - Case sensitivity tests
  - SQL injection attempts
  - XSS attempts
  - Special characters
  - Very long inputs

### Product Tests (18 test cases)
- **Positive Scenarios:**
  - View products page
  - Add single/multiple products to cart
  - Remove products from cart
  - Sort products (Name A-Z, Z-A, Price Low-High, High-Low)
  - Navigate to product detail page
  - Add/remove from detail page
  - Verify product information

- **Negative Scenarios:**
  - Cart badge visibility
  - Adding same product multiple times
  - Sorting reset after refresh

### Cart Tests (13 test cases)
- **Positive Scenarios:**
  - Navigate to cart
  - Verify empty cart
  - Add products and verify in cart
  - Remove products from cart
  - Continue shopping
  - Verify cart badge count
  - Verify checkout button state

- **Negative Scenarios:**
  - Empty cart checkout
  - Remove non-existent items
  - Cart persistence after refresh

### Checkout Tests (19 test cases)
- **Positive Scenarios:**
  - Complete checkout flow
  - Verify checkout information page
  - Cancel checkout
  - Verify overview page
  - Verify total calculation
  - Navigate back home
  - Verify completion message

- **Negative Scenarios:**
  - Empty first name
  - Empty last name
  - Empty postal code
  - All empty fields
  - Partial field completion
  - Special characters in fields
  - Very long postal code
  - Numbers in name fields

### End-to-End Tests (10 test cases)
- Complete purchase flow (single product)
- Complete purchase flow (multiple products)
- Purchase and return home
- Add/remove/add again flow
- Browse, sort, add, checkout
- View details, add, checkout
- Cancel and complete later
- Complete checkout with all products
- Login/logout/login again flow
- Verify cart cleared after order

### Logout Tests (5 test cases)
- Logout from products page
- Logout from cart page
- Verify access restriction after logout
- Logout and login again
- Verify cart cleared after logout

## Total Test Cases: 85+

## Installation

1. Install dependencies:
```bash
npm install
```

2. Install Playwright browsers:
```bash
npx playwright install
```

## Running Tests

### Run all tests:
```bash
npx playwright test
```

### Run specific test suite:
```bash
npx playwright test tests/loginTests.spec.js
npx playwright test tests/productTests.spec.js
npx playwright test tests/cartTests.spec.js
npx playwright test tests/checkoutTests.spec.js
npx playwright test tests/endToEndTests.spec.js
npx playwright test tests/logoutTests.spec.js
```

### Run tests in headed mode:
```bash
npx playwright test --headed
```

### Run tests in debug mode:
```bash
npx playwright test --debug
```

### Run tests with UI mode:
```bash
npx playwright test --ui
```

### Run specific test:
```bash
npx playwright test -g "TC001"
```

## Test Data

Test data is stored in `data.js` file and includes:
- Valid and invalid credentials
- User types (standard, locked, problem, performance)
- Product names
- Checkout information
- Sorting options
- Error messages

## Page Object Model Pattern

The framework follows POM pattern where:
- Each page has its own class
- Page classes inherit from base classes
- Locators are defined in page classes
- Actions are methods in page classes
- Tests use page objects, not direct locators

## Features

✅ Comprehensive test coverage (85+ test cases)
✅ Positive and negative test scenarios
✅ Page Object Model pattern
✅ Reusable page objects
✅ Centralized test data
✅ Clear test organization
✅ Detailed test descriptions
✅ Error handling
✅ Edge case testing

## Test Credentials

- **Standard User:** standard_user / secret_sauce
- **Locked User:** locked_out_user / secret_sauce
- **Problem User:** problem_user / secret_sauce
- **Performance User:** performance_glitch_user / secret_sauce

## Browser Support

Currently configured for Chromium. Can be extended to Firefox and WebKit in `playwright.config.js`.

## Reports

Test reports are generated in `playwright-report/` directory. View reports with:
```bash
npx playwright show-report
```

# Playwright_demo_code
