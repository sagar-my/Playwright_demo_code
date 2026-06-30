# Playwright Automation Framework

This repository contains a Playwright JavaScript automation framework.

## Framework

- Playwright
- JavaScript
- Page Object Model (POM)
- GitHub Actions
- HTML Reports

## Folder Structure

pages/
helpers/
tests/
setup/

## Rules

- Never write locators inside test files.
- Always use Page Objects.
- Extend BaseClass.
- Use async/await.
- Use Playwright locators.
- Prefer getByRole().
- Avoid XPath.
- Never use waitForTimeout().
- Use expect() for assertions.
- Reuse existing methods.
- Follow DRY principle.
- Keep tests readable.
- Generate reusable helper functions.

## Code Style

- Use const whenever possible.
- Use descriptive variable names.
- Use ES6 syntax.
- Add comments only when needed.

## Test Writing

Arrange

Act

Assert

Generate positive and negative scenarios.

## Reporting

Generate Playwright HTML reports.

Compatible with GitHub Actions.
