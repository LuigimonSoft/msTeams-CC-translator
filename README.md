# msTeams-CC-translator

## Project Description

**msTeams-CC-translator** is an open-source application designed to translate real-time closed captions from Microsoft Teams meetings. The project uses JavaScript to capture and process the automatically generated captions by Microsoft Teams and translates them using the [LibreTranslate](https://github.com/LibreTranslate/LibreTranslate) machine translation API.

### Key Features:
- Real-time capture of closed captions from Microsoft Teams (web version).
- Automatic translation using a self-hosted LibreTranslate REST API.
- User-friendly interface to display translated captions.
- LibreTranslate uses the open-source Argos Translate engine, making it completely free and open-source, avoiding proprietary services like Google or Azure.
- **Guaranteed Privacy**: If you host LibreTranslate locally, all your data remains on your machine, with no need for external services.

### Usage Modes:
1. **JavaScript Code in Console**: You can manually run the code from your browser's console.
2. **Chrome Extension** (recommended): Automatically detects when you're in a Microsoft Teams meeting and translates captions in real-time.

---

## Table of Contents

- [Installation](#installation)
- [System Requirements](#system-requirements)
- [Usage](#usage)
  - [Option 1: Running the Code from the Console](#option-1-running-the-code-from-the-console)
  - [Option 2: Installing the Chrome Extension](#option-2-installing-the-chrome-extension)
- [Contributions](#contributions)
- [License](#license)

---

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/msTeams-CC-translator.git
```

### 2. Install LibreTranslate Locally (Optional but Recommended)

To ensure complete privacy, you can install and run LibreTranslate locally on your machine. This ensures that your information never leaves your computer.

#### Option A: Install Using Docker
Follow the instructions on the [official LibreTranslate repository](https://github.com/LibreTranslate/LibreTranslate) to install and set up a local instance using Docker.

```bash
git clone https://github.com/LibreTranslate/LibreTranslate.git
cd LibreTranslate
docker-compose up -d
```

#### Option B: Install Using `pip`
1. Install LibreTranslate using `pip`:
   ```bash
   pip install libretranslate
```
2. Run LibreTranslate:
   ```bash
   libretranslate [args]
```

### 3. Configure the LibreTranslate API
Ensure the LibreTranslate REST API is running locally on your machine, as it will be used to translate captions in real-time. By default, the API will run on `http://localhost:5000`.

### 4. Configure the msTeams-CC-translator Application
1. Edit the `config.js` file to point to your LibreTranslate instance. You can modify the API endpoint if necessary.

```js
const LIBRETRANSLATE_API_URL = 'http://localhost:5000/translate'; // Your LibreTranslate instance URL
 ```

## Usage

### Option 1: Running the Code from the Console

1. **Open Microsoft Teams in your browser**: Go to the web version of Microsoft Teams.
2. **Enable live captions**: During a meeting, enable the live closed captions feature in Microsoft Teams.
3. **Open the browser console**: Press `F12` or `Ctrl + Shift + I` to open the developer tools in your browser.
4. **Copy and paste the JavaScript code**: Copy the code from the `basic-translator.js` file in this repository and paste it into your browser console.
5. **Run the code**: The script will capture the live captions, send them to the LibreTranslate API, and display the translated captions in the console.

### Option 2: Installing the Chrome Extension (Recommended)

1. **Install the Chrome Extension**:
   - Download the extension source code from the `chrome-extension` directory in the repository.
   - Open Chrome and go to `chrome://extensions/`.
   - Enable "Developer mode" in the top right corner.
   - Click "Load unpacked" and select the downloaded extension folder.

2. **Use the extension**:
   - Open Microsoft Teams in the Chrome web version.
   - The extension will automatically detect when you're in a meeting with live captions enabled.
   - The captions will be captured, sent to the LibreTranslate API, and displayed in real-time in the extension interface.


