# Gemini CLI Setup Instructions

**Purpose:** Set up Gemini CLI for headless testing and code review agents

---

## Installation

### Step 1: Install Gemini CLI

The Gemini CLI is Google's command-line tool for interacting with Gemini AI models.

```bash
# Install via npm (recommended)
npm install -g @google/generative-ai-cli

# OR install via pip
pip install google-generativeai
```

### Step 2: Get API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the API key

### Step 3: Configure API Key

```bash
# Set environment variable (Linux/Mac)
export GOOGLE_API_KEY="your-api-key-here"

# Or add to your shell profile (~/.bashrc, ~/.zshrc, etc.)
echo 'export GOOGLE_API_KEY="your-api-key-here"' >> ~/.zshrc
source ~/.zshrc
```

For Windows:
```cmd
setx GOOGLE_API_KEY "your-api-key-here"
```

### Step 4: Test Installation

```bash
# Test with a simple prompt
gemini -p "Say hello"
```

If you see a response, Gemini CLI is working!

---

## Alternative: Using Gemini API Directly

If CLI installation has issues, we can create custom scripts that use the Gemini API directly.

### Create Testing Script

Create a file `scripts/gemini-test.js`:

```javascript
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

async function runTest(prompt) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  console.log(text);
}

const prompt = process.argv[2] || "Test prompt not provided";
runTest(prompt);
```

Usage:
```bash
node scripts/gemini-test.js "Your test prompt here"
```

---

## Agent Prompt Templates Location

All agent prompts are stored in `/agent-notes/` folder:

- `tester-agent-prompts.md` - Testing agent prompts
- `code-review-agent-prompts.md` - Code review agent prompts
- `test-results/` - Folder for storing test results

---

## Usage in Development Workflow

### Running Tester Agent

```bash
# Test a specific feature
gemini -p "$(cat agent-notes/tester-agent-prompts.md | grep -A 20 'STAGE_1_TEST')"

# Or use our custom script
node scripts/gemini-test.js "$(cat agent-notes/tester-agent-prompts.md)"
```

### Running Code Review Agent

```bash
# Review code for a stage
gemini -p "$(cat agent-notes/code-review-agent-prompts.md | grep -A 20 'STAGE_1_REVIEW')"
```

---

## Troubleshooting

### "gemini: command not found"
- Ensure Gemini CLI is installed globally
- Check PATH includes npm global bin directory
- Try reinstalling: `npm install -g @google/generative-ai-cli`

### "API Key not found"
- Ensure GOOGLE_API_KEY environment variable is set
- Restart terminal after setting environment variable
- Check key is valid in Google AI Studio

### Rate Limiting
- Gemini API has rate limits
- If you hit limits, wait a few minutes
- Consider upgrading API tier if needed

---

## Next Steps

1. Complete installation
2. Test with simple prompt
3. Review agent prompt templates
4. Ready to run automated tests!
