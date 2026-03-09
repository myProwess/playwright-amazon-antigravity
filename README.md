<div align="center">
  <h1>🛒 Amazon E2E Automated Testing Framework</h1>
  <p>
    <strong>A robust, scalable Playwright & TypeScript automation suite for Amazon search operations.</strong>
  </p>

  <!-- Badges -->
  <p>
    <img src="https://img.shields.io/badge/Playwright-45ba4b?style=for-the-badge&logo=playwright&logoColor=white" alt="Playwright" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  </p>
</div>

---

## 📖 Project Overview

This project is a high-performance end-to-end (E2E) UI automation framework designed to navigate and scrape data from Amazon. Built utilizing the modern web automation capabilities of **Playwright** and the type safety of **TypeScript**, the suite executes a core workflow: navigating to Amazon, searching for "Iphone 17 pro", scraping the top 5 product titles and prices, saving the data to a local file, and extracting specific top-result prices.

By implementing industry best practices such as the **Page Object Model (POM)** and custom Playwright **Fixtures**, this framework ensures high maintainability, robust retry mechanisms, and resilience against UI changes with dynamic XPath locators.

<br/>

## 🏗️ Architecture & Technologies

The framework separates the test logic from the page execution steps, ensuring a clean and extensible architecture.

### Key Technologies 
- **[Playwright](https://playwright.dev/)**: Core web automation engine ensuring fast parallel execution and intercept capabilities.
- **[TypeScript](https://www.typescriptlang.org/)**: Enforces static typing to minimize runtime errors and improve developer experience.
- **[Winston](https://github.com/winstonjs/winston)**: Comprehensive contextual logging system supporting both console outputs and file logs (timestamped).
- **[Allure Report](https://allurereport.org/)**: Configured via `allure-playwright` plugin to generate beautifully structured graphical test execution reports.
- **Fixture injection**: Utilizes Playwright's `test.extend` API to lazily initialize Page Objects cleanly into each test file.

<br/>

## 📸 Visuals 

> **Suggestion**: Add a GIF or screenshot showing the headed execution of the Playwright script passing smoothly here! For example: 
> `![Headed Execution Demo](./docs/demo.gif)`

> **Suggestion**: Attach an image of the rich Allure HTML report here to showcase the reporting capabilities.
> `![Allure Report Output](./docs/allure.png)`

<br/>

## ⚙️ Installation & Setup

### Prerequisites

Ensure the following dependencies are installed on your machine:
- **Node.js** (v16.14.0 or higher)
- **npm** or **yarn** or **pnpm**

### 1. Clone & Install Dependencies

Clone this repository and run standard package installation:

```bash
# Clone the repository
git clone https://github.com/your-username/AmazonPlaywrightRepo.git
cd AmazonPlaywrightRepo

# Install Node dependencies
npm install

# Install Playwright browser binaries
npx playwright install chromium --with-deps
```

### 2. Required Environment Variables

The framework reads the `HEADED` environment variable to determine the execution mode. If not provided, it falls back to background headless mode.
- `HEADED`: Set this to `true` to launch tests with a visible UI (e.g., `HEADED=true`).

<br/>

## 🚀 Usage & Execution Examples

The framework provides several scripts defined in `package.json` for varying execution strategies.

### Run Tests Headlessly (CI/CD Default)
By default, running the test will execute silently and quickly in the background:
```bash
npx playwright test
```

### Run Tests in UI/Headed Mode
To visually watch the automation process unfold (highly recommended for debugging Amazon search constraints):
```bash
# On Windows PowerShell
$env:HEADED="true"; npx playwright test

# Or via npm script
npm run test:headed
```

### View Rich Allure Reports
After test execution, generate and serve the Allure HTML report:
```bash
npm run report
```

### Check Logs & Output
1. Generated product data is dynamically written to `top_5_iphones.txt` at the core directory.
2. Execution step-by-step logs are stored in `logs/test-execution.log`.

<br/>

## 📂 Directory Structure

```text
AmazonPlaywrightRepo/
├── fixtures/
│   └── fixtures.ts            # Extension injecting POM objects into tests
├── logs/
│   └── test-execution.log     # Winston execution log output
├── pages/
│   ├── HomePage.ts            # POM: Amazon entrypoint and search bar
│   └── SearchResultsPage.ts   # POM: Logic to scrape items and prices
├── tests/
│   └── amazon.spec.ts         # Main E2E flow orchestrating steps 1-3
├── utils/
│   ├── logger.ts              # Global Winston logger configuration
│   └── fileWriter.ts          # Utility translating Object arrays to .txt
├── playwright.config.ts       # Global timeout, retries, reporting, browser launch config
├── package.json               # NPM scripts and project dependencies
└── top_5_iphones.txt          # Exported scraped prices (ignored in VCS typically)
```

<br/>

## 🤝 Contribution Guidelines

We welcome community contributions! Please adhere to the following when extending the framework:

1. **Branch Management**: Create a feature branch off `main` (e.g., `feature/add-login-step`).
2. **Page Object Model**: Ensure all locators and methods interacting with the DOM are confined to the `pages/` directory. Tests inside `tests/` must only call POM methods.
3. **Use Locators**: Do not use raw `$()` or `$$()` queries; rely on Playwright's native `page.locator()` combined with dynamic XPath data attributes where possible.
4. **Log State**: Ensure all new logical steps are logged via `logger.info()` or `logger.warn()` in `utils/logger.ts` for consistent debug capability.

**Pull Requests** must successfully pass `npm run test:headed` locally and demonstrate 0 TypeScript compiler warnings (`npx tsc --noEmit`).

<br/>

## 📄 License

This project is licensed under the **MIT License**. You are free to modify, distribute, and use this codebase for personal and commercial applications. See the [LICENSE](./LICENSE) file for more information.
