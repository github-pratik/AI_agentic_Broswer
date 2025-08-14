import React, { createContext, useContext, useReducer, useEffect } from "react";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

const AIContext = createContext();

const initialState = {
  messages: [],
  isLoading: false,
  isSidebarOpen: false,
  currentModel: "gemini-1.5-flash-002",
  apiKeys: {
    openai: "",
    gemini: "",
    openrouter: "",
  },
  availableModels: [
    // OpenAI Models
    {
      id: "gpt-4",
      name: "GPT-4",
      description: "Most capable model, best for complex tasks and reasoning",
      provider: "openai",
    },
    {
      id: "gpt-3.5-turbo",
      name: "GPT-3.5 Turbo",
      description: "Fast and efficient model, good for most tasks",
      provider: "openai",
    },
    // Gemini Models (Latest)
    {
      id: "gemini-2.0-flash-exp",
      name: "Gemini 2.0 Flash (Experimental)",
      description:
        "Latest experimental Gemini model with cutting-edge capabilities",
      provider: "gemini",
    },
    {
      id: "gemini-exp-1206",
      name: "Gemini Experimental 1206",
      description: "Experimental Gemini model with advanced reasoning",
      provider: "gemini",
    },
    {
      id: "gemini-1.5-pro-002",
      name: "Gemini 1.5 Pro (Latest)",
      description:
        "Most powerful thinking model with features for complex reasoning and much more",
      provider: "gemini",
    },
    {
      id: "gemini-1.5-flash-002",
      name: "Gemini 1.5 Flash (Latest)",
      description:
        "Newest multimodal model with next generation features and improved capabilities",
      provider: "gemini",
    },
    {
      id: "gemini-1.5-flash-8b",
      name: "Gemini 1.5 Flash-8B",
      description:
        "Fastest and most cost-efficient multimodal model with great performance for high-frequency tasks",
      provider: "gemini",
    },
    {
      id: "gemini-1.5-pro",
      name: "Gemini 1.5 Pro",
      description:
        "Previous version of Gemini Pro for complex reasoning and analysis",
      provider: "gemini",
    },
    {
      id: "gemini-1.5-flash",
      name: "Gemini 1.5 Flash",
      description: "Previous version of Gemini Flash for fast processing",
      provider: "gemini",
    },
    // Specialized Gemini Models
    {
      id: "gemini-1.5-pro-vision",
      name: "Gemini 1.5 Pro Vision",
      description:
        "Gemini Pro with advanced vision capabilities for image analysis",
      provider: "gemini",
    },
    {
      id: "text-embedding-004",
      name: "Gemini Text Embeddings",
      description:
        "Gemini embedding model designed for production RAG workflows",
      provider: "gemini",
    },
    // OpenRouter Models
    {
      id: "openrouter/auto",
      name: "OpenRouter Auto",
      description: "Automatically selects the best model for your query",
      provider: "openrouter",
    },
    {
      id: "anthropic/claude-3-opus",
      name: "Claude 3 Opus",
      description: "Anthropic's most capable model via OpenRouter",
      provider: "openrouter",
    },
    {
      id: "anthropic/claude-3-sonnet",
      name: "Claude 3 Sonnet",
      description: "Balanced performance and speed via OpenRouter",
      provider: "openrouter",
    },
    {
      id: "meta-llama/llama-2-70b-chat",
      name: "Llama 2 70B",
      description: "Meta's open-source model via OpenRouter",
      provider: "openrouter",
    },
    // Open Source Alternative
    {
      id: "gpt-neo",
      name: "GPT-Neo (Demo)",
      description: "Open source alternative (simulated responses)",
      provider: "huggingface",
    },
  ],
  error: null,
};

const aiReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };

    case "ADD_MESSAGE":
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };

    case "SET_MESSAGES":
      return {
        ...state,
        messages: action.payload,
      };

    case "TOGGLE_SIDEBAR":
      return {
        ...state,
        isSidebarOpen: !state.isSidebarOpen,
      };

    case "SET_SIDEBAR_OPEN":
      return {
        ...state,
        isSidebarOpen: action.payload,
      };

    case "SET_CURRENT_MODEL":
      return {
        ...state,
        currentModel: action.payload,
      };

    case "SET_API_KEY":
      return {
        ...state,
        apiKeys: {
          ...state.apiKeys,
          [action.payload.provider]: action.payload.key,
        },
      };

    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
      };

    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

export const AIProvider = ({ children }) => {
  const [state, dispatch] = useReducer(aiReducer, initialState);

  // Load settings from localStorage on mount
  useEffect(() => {
    const loadSettings = () => {
      try {
        // Load API keys
        const savedOpenAIKey = localStorage.getItem("ai-api-key-openai");
        const savedGeminiKey = localStorage.getItem("ai-api-key-gemini");
        const savedOpenRouterKey = localStorage.getItem(
          "ai-api-key-openrouter"
        );
        const savedModel = localStorage.getItem("ai-current-model");

        console.log("Loading settings from localStorage:");
        console.log("OpenAI key:", savedOpenAIKey ? "Present" : "Missing");
        console.log("Gemini key:", savedGeminiKey ? "Present" : "Missing");
        console.log(
          "OpenRouter key:",
          savedOpenRouterKey ? "Present" : "Missing"
        );
        console.log("Saved model:", savedModel);

        if (savedOpenAIKey) {
          dispatch({
            type: "SET_API_KEY",
            payload: { provider: "openai", key: savedOpenAIKey },
          });
        }
        if (savedGeminiKey) {
          dispatch({
            type: "SET_API_KEY",
            payload: { provider: "gemini", key: savedGeminiKey },
          });
        }
        if (savedOpenRouterKey) {
          dispatch({
            type: "SET_API_KEY",
            payload: { provider: "openrouter", key: savedOpenRouterKey },
          });
        }
        if (savedModel) {
          dispatch({ type: "SET_CURRENT_MODEL", payload: savedModel });
        }
      } catch (error) {
        console.error("Error loading AI settings:", error);
      }
    };

    loadSettings();
  }, []);

  const sendMessage = async (message, context = "", pageContent = "", preventActions = false) => {
    console.log("sendMessage called with:", { message, context, pageContent, preventActions });
    console.log("Current state:", {
      currentModel: state.currentModel,
      apiKeys: state.apiKeys,
    });

    // Get current page content if not provided
    if (!pageContent && window.electronAPI && window.electronAPI.getPageContent) {
      try {
        const currentPageData = await window.electronAPI.getPageContent();
        if (currentPageData && currentPageData.content) {
          pageContent = `Current page: ${currentPageData.title}\nURL: ${currentPageData.url}\n\nPage headings: ${currentPageData.headings ? currentPageData.headings.join(', ') : 'None'}\n\nMain content: ${currentPageData.content}\n\nAvailable links: ${currentPageData.links ? currentPageData.links.slice(0, 5).map(l => l.text).join(', ') : 'None'}`;
          console.log("Retrieved current page content:", currentPageData);
        } else {
          console.log("No page content available");
        }
      } catch (error) {
        console.log("Could not retrieve page content:", error);
      }
    }

    const currentModelInfo = state.availableModels.find(
      (m) => m.id === state.currentModel
    );
    const provider = currentModelInfo?.provider;
    const apiKey = state.apiKeys[provider];

    console.log("Model info:", {
      currentModelInfo,
      provider,
      apiKey: apiKey ? "Present" : "Missing",
    });

    // Additional debugging
    console.log("=== DETAILED DEBUG ===");
    console.log("Full state.apiKeys object:", state.apiKeys);
    console.log("Looking for provider:", provider);
    console.log("Available providers in apiKeys:", Object.keys(state.apiKeys));
    console.log(
      "Direct access state.apiKeys[provider]:",
      state.apiKeys[provider]
    );
    console.log("Direct access state.apiKeys.gemini:", state.apiKeys.gemini);
    console.log("localStorage check:");
    console.log(
      "- ai-api-key-gemini:",
      localStorage.getItem("ai-api-key-gemini")
    );

    if (!apiKey) {
      const errorMsg = `API key not configured for ${provider}. Please set it in settings.`;
      console.error(errorMsg);
      dispatch({ type: "SET_ERROR", payload: errorMsg });
      return;
    }

    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "CLEAR_ERROR" });

    // Add user message to chat
    const userMessage = {
      role: "user",
      content: message,
      timestamp: new Date().toISOString(),
    };
    dispatch({ type: "ADD_MESSAGE", payload: userMessage });

    try {
      let response;

      const systemPrompt = `You are an intelligent browser assistant that can understand natural language commands and take browser actions. You have the following capabilities:

IMPORTANT: Only respond with JSON for BROWSER ACTIONS. For information requests, content extraction, or questions about the page, respond with regular text.

BROWSER ACTIONS (respond with JSON when user wants to perform web actions):
1. "search" - Search for information on Google
2. "navigate" - Go to a specific website  
3. "interact" - Perform actions on the current webpage (click, fill forms, etc.)
4. "workflow" - Execute complex multi-step tasks (job applications, form submissions, etc.)

INFORMATION REQUESTS (respond with regular text):
- "what's on this page" - Summarize page content
- "extract information from this page" - Extract key data
- "tell me about..." - Answer questions about page content
- "summarize this" - Provide content summary
- "what are the main points" - Extract key information

RESPONSE FORMAT:
For browser actions, respond with ONLY the raw JSON object (no markdown code blocks, no extra text):

SEARCH/NAVIGATE:
{
  "action": "search" | "navigate",
  "query": "search terms" | "website url",
  "summary": "Brief explanation"
}

INTERACT WITH PAGE:
{
  "action": "interact",
  "steps": [
    {"type": "click", "selector": "button.apply-btn", "description": "Click apply button"},
    {"type": "fill", "selector": "input[name='email']", "value": "user@example.com", "description": "Fill email field"},
    {"type": "select", "selector": "select[name='experience']", "value": "3-5 years", "description": "Select experience level"},
    {"type": "wait", "duration": 2000, "description": "Wait for page to load"}
  ],
  "summary": "Performing page interactions"
}

COMPLEX WORKFLOW:
{
  "action": "workflow",
  "task": "job_application",
  "steps": [
    {"action": "navigate", "url": "https://linkedin.com/jobs"},
    {"action": "interact", "steps": [
      {"type": "fill", "selector": "input[placeholder*='Search jobs']", "value": "software engineer", "description": "Search for jobs"},
      {"type": "click", "selector": "button[type='submit']", "description": "Submit search"},
      {"type": "wait", "duration": 3000, "description": "Wait for results"},
      {"type": "click", "selector": ".job-card:first-child .apply-button", "description": "Click first job apply button"}
    ]}
  ],
  "summary": "Executing job application workflow"
}

EXAMPLES:
User: "search george mason university"
Response: {"action": "search", "query": "george mason university", "summary": "Searching for George Mason University"}

User: "go to linkedin.com"
Response: {"action": "navigate", "query": "https://linkedin.com", "summary": "Navigating to LinkedIn"}

User: "click the login button on this page"
Response: {"action": "interact", "steps": [{"type": "click", "selector": "button[data-testid='login-button'], .login-btn, button:contains('Login')", "description": "Click login button"}], "summary": "Clicking the login button"}

User: "fill out this contact form with my email john@example.com"
Response: {"action": "interact", "steps": [{"type": "fill", "selector": "input[type='email'], input[name*='email']", "value": "john@example.com", "description": "Fill email field"}], "summary": "Filling contact form with email"}

User: "click the first job result" or "click the first LinkedIn search result"
Response: {"action": "interact", "steps": [{"type": "click", "selector": ".jobs-search-results__list-item:first-child .job-card-container__link", "description": "Click the first LinkedIn search result"}], "summary": "Clicking the first job search result"}

INFORMATION EXAMPLES:
User: "what's on this page" or "extract information from this page"
Response: Based on the current page content, here are the main points: [provide actual content summary]

User: "tell me about this Wikipedia article"
Response: This Wikipedia article is about [topic]. The main sections include: [list key sections and information]

User: "summarize the key facts from this page"
Response: Here are the key facts: [provide actual extracted facts and data]

BROWSER ACTION EXAMPLES:
User: "show page elements" or "what can I click"
Response: {"action": "analyze", "type": "elements", "summary": "Analyzing available page elements"}

User: "help me click something on this page"
Response: {"action": "analyze", "type": "interactive", "summary": "Finding clickable elements on the current page"}

User: "apply for software engineer jobs on LinkedIn"
Response: {"action": "workflow", "task": "job_application", "steps": [{"action": "navigate", "url": "https://linkedin.com/jobs"}, {"action": "interact", "steps": [{"type": "fill", "selector": "input[placeholder*='Search jobs']", "value": "software engineer", "description": "Search for software engineer jobs"}, {"type": "click", "selector": "button[type='submit']", "description": "Submit job search"}]}], "summary": "Starting LinkedIn job application process for software engineer positions"}

Current context: ${context}
${
  pageContent
    ? `\n\nCURRENT PAGE CONTENT (use this to answer questions):\n${pageContent.substring(0, 4000)}`
    : ""
}
      
      CRITICAL INSTRUCTIONS:
      1. If the user wants to DO something (navigate, click, search, fill forms) → respond with JSON
      2. If the user wants to KNOW something (extract info, summarize, explain, "what's on this page") → respond with regular text using the page content above
      3. When responding with browser actions, return ONLY the JSON object without any markdown formatting
      4. When providing information, extract and present the actual content from the current page
      5. For questions like "what's on this page", "extract information", "summarize" → provide detailed text answers using the page content
      
      REMEMBER: Information requests get text responses with actual page content, not JSON actions!`;

      console.log(`Calling ${provider} API with model: ${state.currentModel}`);

      if (provider === "openai") {
        response = await callOpenAI(
          state.currentModel,
          apiKey,
          systemPrompt,
          message
        );
      } else if (provider === "gemini") {
        response = await callGemini(
          state.currentModel,
          apiKey,
          systemPrompt,
          message
        );
      } else if (provider === "openrouter") {
        response = await callOpenRouter(
          state.currentModel,
          apiKey,
          systemPrompt,
          message
        );
      } else if (state.currentModel === "gpt-neo") {
        response = await simulateGPTNeoResponse(message, context, pageContent);
      } else {
        response = `This model (${state.currentModel}) is not yet implemented.`;
      }

      console.log("API response:", response);

      // Check if the response contains a browser action (but only if actions are allowed)
      let actionTaken = false;
      let displayResponse = response;

      if (!preventActions) {
        try {
        // Try to parse the response as JSON to see if it's a browser action
        let jsonResponse = response;

        // Check if response is wrapped in code blocks
        const jsonMatch =
          response.match(/```json\s*([\s\S]*?)\s*```/) ||
          response.match(/```\s*([\s\S]*?)\s*```/);
        if (jsonMatch) {
          jsonResponse = jsonMatch[1].trim();
          console.log("Extracted JSON from code block:", jsonResponse);
        }

        // Also try to extract JSON from text that starts with {
        if (!jsonMatch && response.includes("{")) {
          const jsonStart = response.indexOf("{");
          const jsonEnd = response.lastIndexOf("}") + 1;
          if (jsonStart !== -1 && jsonEnd > jsonStart) {
            jsonResponse = response.substring(jsonStart, jsonEnd);
            console.log("Extracted JSON from text:", jsonResponse);
          }
        }

        const actionData = JSON.parse(jsonResponse);
        if (
          actionData.action &&
          (actionData.query || actionData.steps || actionData.task)
        ) {
          actionTaken = true;
          displayResponse = actionData.summary || "Taking browser action...";

          console.log("Executing browser action:", actionData);

          // Execute the browser action
          await executeBrowserAction(actionData);

          // Add a note about the action taken
          if (actionData.action === "search") {
            displayResponse += `\n\n🔍 Searching for: "${actionData.query}"`;
          } else if (actionData.action === "navigate") {
            displayResponse += `\n\n🌐 Navigating to: "${actionData.query}"`;
          } else if (actionData.action === "interact") {
            displayResponse += `\n\n⚡ Performing page interactions`;
          } else if (actionData.action === "workflow") {
            displayResponse += `\n\n🚀 Executing workflow: ${actionData.task}`;
          } else if (actionData.action === "analyze") {
            displayResponse += `\n\n🔍 Analyzing page: ${actionData.type}`;
          }
        }
        } catch (e) {
          // Not JSON, treat as regular response
          console.log(
            "Response is not a browser action, treating as regular text:",
            e.message
          );
        }
      } else {
        console.log("Browser actions prevented for this request");
      }

      // Add AI response to chat
      const aiMessage = {
        role: "assistant",
        content: displayResponse,
        timestamp: new Date().toISOString(),
      };
      dispatch({ type: "ADD_MESSAGE", payload: aiMessage });

      // If we took a browser action, optionally summarize (but don't auto-trigger to avoid loops)
      if (actionTaken) {
        // Add a message suggesting the user can ask for a summary if they want
        setTimeout(() => {
          const suggestionMessage = {
            role: "assistant",
            content: "✅ Navigation completed! You can ask me to 'summarize this page' if you'd like an overview of the content.",
            timestamp: new Date().toISOString(),
          };
          dispatch({ type: "ADD_MESSAGE", payload: suggestionMessage });
        }, 2000);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      dispatch({
        type: "SET_ERROR",
        payload: `Error: ${error.message || "Failed to get response from AI"}`,
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // OpenAI API call
  const callOpenAI = async (model, apiKey, systemPrompt, message) => {
    const openai = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true,
    });

    const messages = [
      { role: "system", content: systemPrompt },
      ...state.messages.slice(-10).map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      { role: "user", content: message },
    ];

    const completion = await openai.chat.completions.create({
      model: model,
      messages: messages,
      max_tokens: 1500,
      temperature: 0.7,
    });

    return completion.choices[0].message.content;
  };

  // Gemini API call
  const callGemini = async (model, apiKey, systemPrompt, message) => {
    try {
      console.log(
        "Initializing Gemini with API key:",
        apiKey ? "Present" : "Missing"
      );
      const genAI = new GoogleGenerativeAI(apiKey);

      // Use the model name directly as it matches the API
      let actualModel = model;

      console.log("Using Gemini model:", actualModel);

      // Configure generation settings for better responses
      const generationConfig = {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      };

      const geminiModel = genAI.getGenerativeModel({
        model: actualModel,
        generationConfig,
      });

      const prompt = `${systemPrompt}\n\nUser: ${message}`;
      console.log(
        "Sending prompt to Gemini:",
        prompt.substring(0, 200) + "..."
      );

      const result = await geminiModel.generateContent(prompt);
      const response = await result.response;

      // Handle potential safety blocks or other issues
      if (response.promptFeedback && response.promptFeedback.blockReason) {
        throw new Error(
          `Content blocked: ${response.promptFeedback.blockReason}`
        );
      }

      const text = response.text();
      console.log("Gemini response:", text);
      return text || "No response generated";
    } catch (error) {
      console.error("Gemini API error:", error);
      throw new Error(`Gemini API error: ${error.message || "Unknown error"}`);
    }
  };

  // OpenRouter API call
  const callOpenRouter = async (model, apiKey, systemPrompt, message) => {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": window.location.origin,
          "X-Title": "AI Browser",
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: "system", content: systemPrompt },
            ...state.messages.slice(-10).map((msg) => ({
              role: msg.role,
              content: msg.content,
            })),
            { role: "user", content: message },
          ],
          max_tokens: 1500,
          temperature: 0.7,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  };

  const simulateGPTNeoResponse = async (message, context, pageContent) => {
    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (message.toLowerCase().includes("summarize")) {
      return `Based on the current page content, here's a summary:\n\n• This appears to be a web page with various content sections\n• The page contains text, links, and potentially multimedia elements\n• Key topics and themes are present throughout the content\n\nNote: This is a simulated response from GPT-Neo. For full functionality, please configure an OpenAI API key.`;
    }

    return `I understand you're asking: "${message}"\n\nThis is a simulated response from GPT-Neo. For full AI capabilities including web content analysis, search, and task automation, please configure an OpenAI API key in settings.`;
  };

  const toggleSidebar = () => {
    dispatch({ type: "TOGGLE_SIDEBAR" });
  };

  const setSidebarOpen = (isOpen) => {
    dispatch({ type: "SET_SIDEBAR_OPEN", payload: isOpen });
  };

  const setCurrentModel = (modelId) => {
    dispatch({ type: "SET_CURRENT_MODEL", payload: modelId });
    localStorage.setItem("ai-current-model", modelId);
  };

  const setApiKey = (provider, apiKey) => {
    console.log(
      `Setting API key for ${provider}:`,
      apiKey ? "Present" : "Missing"
    );
    dispatch({ type: "SET_API_KEY", payload: { provider, key: apiKey } });
    localStorage.setItem(`ai-api-key-${provider}`, apiKey);
    console.log(`Saved to localStorage: ai-api-key-${provider}`);
  };

  const saveSettings = async (modelId, apiKeys) => {
    setCurrentModel(modelId);
    // Save all API keys
    Object.entries(apiKeys).forEach(([provider, key]) => {
      if (key) {
        setApiKey(provider, key);
      }
    });
  };

  const clearMessages = () => {
    dispatch({ type: "SET_MESSAGES", payload: [] });
  };

  // Execute browser actions based on AI commands
  const executeBrowserAction = async (actionData) => {
    console.log("Executing browser action:", actionData);

    try {
      if (actionData.action === "search") {
        // Use Google search for search queries
        const url = `https://www.google.com/search?q=${encodeURIComponent(
          actionData.query
        )}`;
        if (window.electronAPI) {
          console.log("Navigating to:", url);
          await window.electronAPI.navigateTo(url);
        }
      } else if (actionData.action === "navigate") {
        // Direct navigation
        let url = actionData.query;
        // Add protocol if missing
        if (!url.startsWith("http://") && !url.startsWith("https://")) {
          url = "https://" + url;
        }
        if (window.electronAPI) {
          console.log("Navigating to:", url);
          await window.electronAPI.navigateTo(url);
        }
      } else if (actionData.action === "interact") {
        // Execute page interactions
        await executePageInteractions(actionData.steps);
      } else if (actionData.action === "workflow") {
        // Execute complex workflow
        await executeWorkflow(actionData);
      } else if (actionData.action === "analyze") {
        // Analyze current page
        await analyzePageForUser(actionData.type);
      }
    } catch (error) {
      console.error("Error executing browser action:", error);
      // Add error message to chat
      const errorMessage = {
        role: "assistant",
        content: `❌ Error executing action: ${error.message}`,
        timestamp: new Date().toISOString(),
      };
      dispatch({ type: "ADD_MESSAGE", payload: errorMessage });
    }
  };

  // Execute page interactions (clicking, filling forms, etc.)
  const executePageInteractions = async (steps) => {
    console.log("Executing page interactions:", steps);

    for (const step of steps) {
      try {
        console.log("Executing step:", step);

        // Add a message showing what we're doing
        const stepMessage = {
          role: "assistant",
          content: `🔄 ${step.description}`,
          timestamp: new Date().toISOString(),
        };
        dispatch({ type: "ADD_MESSAGE", payload: stepMessage });

        // Execute the step via Electron's main process
        if (window.electronAPI && window.electronAPI.executePageAction) {
          const result = await window.electronAPI.executePageAction(step);
          console.log("Step execution result:", result);
          
          // Add success message
          const successMessage = {
            role: "assistant",
            content: `✅ ${step.description}`,
            timestamp: new Date().toISOString(),
          };
          dispatch({ type: "ADD_MESSAGE", payload: successMessage });
        } else {
          // Fallback: try to execute in the renderer process
          await executeStepInRenderer(step);
        }

        // Wait a bit between steps
        await new Promise((resolve) => setTimeout(resolve, 1500));
      } catch (error) {
        console.error("Error executing step:", step, error);
        
        // Provide more detailed error information
        let errorDetails = error.message;
        if (error.message.includes('Element not found')) {
          errorDetails += "\n\nTip: The page might have loaded differently than expected. Try refreshing the page or using a different search term.";
        } else if (error.message.includes('Script failed to execute')) {
          errorDetails += "\n\nTip: The page might still be loading. Wait a moment and try again.";
        }
        
        const errorMessage = {
          role: "assistant",
          content: `❌ Failed to ${step.description}: ${errorDetails}`,
          timestamp: new Date().toISOString(),
        };
        dispatch({ type: "ADD_MESSAGE", payload: errorMessage });
        
        // Don't stop the entire workflow for one failed step
        console.log("Continuing with next step despite error...");
      }
    }
  };

  // Execute workflow (complex multi-step tasks)
  const executeWorkflow = async (workflowData) => {
    console.log("Executing workflow:", workflowData);

    const workflowMessage = {
      role: "assistant",
      content: `🚀 Starting workflow: ${workflowData.task}`,
      timestamp: new Date().toISOString(),
    };
    dispatch({ type: "ADD_MESSAGE", payload: workflowMessage });

    for (const step of workflowData.steps) {
      if (step.action === "navigate") {
        let url = step.url;
        if (!url.startsWith("http://") && !url.startsWith("https://")) {
          url = "https://" + url;
        }
        if (window.electronAPI) {
          await window.electronAPI.navigateTo(url);
          await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for page load
        }
      } else if (step.action === "interact") {
        await executePageInteractions(step.steps);
      }
    }

    const completionMessage = {
      role: "assistant",
      content: `✅ Workflow completed: ${workflowData.task}`,
      timestamp: new Date().toISOString(),
    };
    dispatch({ type: "ADD_MESSAGE", payload: completionMessage });
  };

  // Fallback: Execute step in renderer process (limited capabilities)
  const executeStepInRenderer = async (step) => {
    // This is a fallback for when Electron main process doesn't have the capability
    // In a real implementation, you'd want to do this in the main process for security

    if (step.type === "wait") {
      await new Promise((resolve) => setTimeout(resolve, step.duration));
    } else {
      // For other actions, we'd need to communicate with the webview
      // This is a placeholder - in production you'd implement proper webview communication
      console.log("Would execute in webview:", step);
      throw new Error("Page interaction requires main process implementation");
    }
  };

  // Helper function to analyze current page for better AI responses
  const analyzeCurrentPage = async () => {
    try {
      if (window.electronAPI && window.electronAPI.getPageContent) {
        const pageData = await window.electronAPI.getPageContent();
        return pageData;
      }
    } catch (error) {
      console.error("Error analyzing current page:", error);
    }
    return null;
  };

  // Analyze page for user and provide helpful information
  const analyzePageForUser = async (analysisType = "general") => {
    try {
      const pageData = await analyzeCurrentPage();
      
      if (!pageData) {
        const errorMessage = {
          role: "assistant",
          content: "❌ Unable to analyze the current page. Make sure a page is loaded.",
          timestamp: new Date().toISOString(),
        };
        dispatch({ type: "ADD_MESSAGE", payload: errorMessage });
        return;
      }

      let analysisContent = "";

      if (analysisType === "elements" || analysisType === "interactive") {
        analysisContent = `📋 **Page Analysis: ${pageData.title}**\n\n`;
        analysisContent += `🌐 **URL:** ${pageData.url}\n\n`;
        
        if (pageData.links && pageData.links.length > 0) {
          analysisContent += `🔗 **Clickable Links Found:**\n`;
          pageData.links.slice(0, 10).forEach((link, index) => {
            if (link.text && link.text.length > 0) {
              analysisContent += `${index + 1}. "${link.text.substring(0, 50)}${link.text.length > 50 ? '...' : ''}"\n`;
            }
          });
          analysisContent += `\n💡 **Tip:** You can ask me to "click the first link" or "click the link about [topic]"\n\n`;
        }

        if (pageData.headings && pageData.headings.length > 0) {
          analysisContent += `📑 **Page Sections:**\n`;
          pageData.headings.forEach((heading, index) => {
            if (heading && heading.length > 0) {
              analysisContent += `• ${heading.substring(0, 60)}${heading.length > 60 ? '...' : ''}\n`;
            }
          });
          analysisContent += `\n`;
        }

        // Add specific tips based on the URL
        if (pageData.url.includes('linkedin.com')) {
          analysisContent += `🎯 **LinkedIn Tips:**\n`;
          analysisContent += `• "click the first job result" - Click the top job listing\n`;
          analysisContent += `• "apply to this job" - Apply to the currently viewed job\n`;
          analysisContent += `• "search for [job title]" - Search for specific jobs\n\n`;
        } else if (pageData.url.includes('google.com')) {
          analysisContent += `🔍 **Google Search Tips:**\n`;
          analysisContent += `• "click the first result" - Click the top search result\n`;
          analysisContent += `• "search for [query]" - Perform a new search\n\n`;
        }

      } else {
        // General analysis
        analysisContent = `📊 **Page Summary: ${pageData.title}**\n\n`;
        analysisContent += `🌐 **URL:** ${pageData.url}\n\n`;
        analysisContent += `📝 **Content Preview:**\n${pageData.content.substring(0, 500)}${pageData.content.length > 500 ? '...' : ''}\n\n`;
        
        if (pageData.headings && pageData.headings.length > 0) {
          analysisContent += `📑 **Main Sections:**\n`;
          pageData.headings.slice(0, 5).forEach(heading => {
            if (heading && heading.length > 0) {
              analysisContent += `• ${heading}\n`;
            }
          });
        }
      }

      const analysisMessage = {
        role: "assistant",
        content: analysisContent,
        timestamp: new Date().toISOString(),
      };
      dispatch({ type: "ADD_MESSAGE", payload: analysisMessage });

    } catch (error) {
      console.error("Error analyzing page for user:", error);
      const errorMessage = {
        role: "assistant",
        content: `❌ Error analyzing page: ${error.message}`,
        timestamp: new Date().toISOString(),
      };
      dispatch({ type: "ADD_MESSAGE", payload: errorMessage });
    }
  };

  // Automatically summarize the current page after navigation
  const summarizeCurrentPage = async () => {
    try {
      console.log("Auto-summarizing current page...");

      // Get current page info
      let currentUrl = "";
      let currentTitle = "";

      if (window.electronAPI) {
        currentUrl = await window.electronAPI.getUrl();
        currentTitle = await window.electronAPI.getTitle();
      }

      if (currentUrl && currentTitle) {
        const summaryPrompt = `Please provide a concise summary of this webpage: ${currentTitle} (${currentUrl})`;

        // Send the summary request
        await sendMessage(
          summaryPrompt,
          `Auto-summary of: ${currentTitle}`,
          ""
        );
      }
    } catch (error) {
      console.error("Error auto-summarizing page:", error);
    }
  };

  const value = {
    ...state,
    sendMessage,
    toggleSidebar,
    setSidebarOpen,
    setCurrentModel,
    setApiKey,
    saveSettings,
    clearMessages,
    getProviderForModel: (modelId) => {
      const model = state.availableModels.find((m) => m.id === modelId);
      return model?.provider;
    },
  };

  return <AIContext.Provider value={value}>{children}</AIContext.Provider>;
};

export const useAI = () => {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error("useAI must be used within an AIProvider");
  }
  return context;
};
