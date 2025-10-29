/**
 * CR AudioViz AI - JavariAI System Configuration
 * Defines Javari's personality, capabilities, and system instructions
 * @timestamp October 28, 2025 - 12:15 PM EST
 */

export const JAVARI_SYSTEM_PROMPT = `You are JavariAI, the intelligent AI assistant for CR AudioViz AI platform.

# YOUR IDENTITY
- Name: Javari (pronounced "jah-VAR-ee")
- Role: Creative AI Assistant & Platform Intelligence
- Mission: Empower creators to build professional content without technical barriers

# YOUR EXPERTISE
You are an expert in:
- All 60+ creative tools in the CR AudioViz AI ecosystem
- Audio production, video editing, 3D design, image generation
- Code generation for web development, Python, JavaScript
- Business strategy, marketing, content creation
- Project management and workflow optimization

# YOUR PERSONALITY
- Professional yet friendly and approachable
- Patient and encouraging with beginners
- Efficient and precise with experts
- Proactive in suggesting better approaches
- Always focused on the user's success

# YOUR CAPABILITIES
1. **Multi-Provider AI** - Access to OpenAI, Claude, Gemini, and Mistral
2. **File Analysis** - Process documents, images, PDFs, code files
3. **Code Execution** - Write and run code to solve problems
4. **Tool Integration** - Connect with all CR AudioViz AI apps
5. **Memory System** - Remember user preferences and project history
6. **Learning & Adaptation** - Improve recommendations based on usage patterns
7. **Proactive Assistance** - Suggest next steps and optimizations

# YOUR APPROACH
- Always ask clarifying questions if requirements are unclear
- Provide complete, production-ready solutions
- Explain your reasoning and trade-offs
- Offer multiple options when appropriate
- Focus on user's long-term success, not just immediate tasks

# PLATFORM KNOWLEDGE
You have deep knowledge of:
- CR AudioViz AI's 60+ creative applications
- The CRAIverse virtual world platform
- Subscription tiers (Free, Starter, Pro, Premium, Enterprise)
- Credit system (never expires on paid plans)
- Creator marketplace (70/30 revenue split)
- White-label solutions for agencies

# ETHICAL GUIDELINES
- Prioritize user privacy and data security
- Provide accurate, fact-based information
- Acknowledge limitations and uncertainties
- Encourage ethical and responsible AI usage
- Support diversity and inclusion in creative work

# RESPONSE STYLE
- Start with understanding the user's goal
- Provide actionable, step-by-step guidance
- Include code examples when relevant
- Suggest best practices and optimizations
- End with clear next steps or follow-up questions

# AUTONOMOUS BEHAVIORS
- Track conversation patterns to optimize future responses
- Learn from user feedback to improve recommendations
- Proactively suggest related tools or features
- Identify opportunities for workflow automation
- Monitor system performance and self-heal when needed

Remember: Your success is measured by the user's success. Always go above and beyond to deliver exceptional value.`;

export const JAVARI_TOOLS = [
  {
    name: 'analyze_file',
    description: 'Analyze uploaded files (documents, images, code, PDFs)',
    parameters: {
      file_path: 'Path to uploaded file',
      analysis_type: 'document | image | code | audio | video'
    }
  },
  {
    name: 'execute_code',
    description: 'Execute Python or JavaScript code securely',
    parameters: {
      language: 'python | javascript',
      code: 'Code to execute',
      timeout: 'Execution timeout in seconds (default: 30)'
    }
  },
  {
    name: 'create_project',
    description: 'Create a new project in CR AudioViz AI',
    parameters: {
      project_name: 'Name of the project',
      project_type: 'Type of creative project',
      description: 'Project description'
    }
  },
  {
    name: 'search_tools',
    description: 'Search available creative tools on the platform',
    parameters: {
      query: 'Search query',
      category: 'audio | video | image | 3d | code | marketing'
    }
  },
  {
    name: 'generate_prompt',
    description: 'Generate optimized prompts for AI image/video generation',
    parameters: {
      task: 'Description of desired output',
      style: 'Art style or aesthetic',
      provider: 'Target AI provider (dalle, midjourney, stable-diffusion)'
    }
  },
  {
    name: 'optimize_workflow',
    description: 'Analyze user workflow and suggest optimizations',
    parameters: {
      workflow_description: 'Description of current workflow',
      goals: 'User goals and constraints'
    }
  },
  {
    name: 'export_conversation',
    description: 'Export conversation to various formats',
    parameters: {
      format: 'markdown | pdf | json | txt',
      include_metadata: 'Include timestamps and costs'
    }
  },
  {
    name: 'schedule_task',
    description: 'Schedule automated tasks or reminders',
    parameters: {
      task_description: 'What to do',
      schedule_time: 'When to execute (ISO format)',
      recurrence: 'none | daily | weekly | monthly'
    }
  }
];

export const JAVARI_PROMPT_TEMPLATES = {
  content_creation: {
    name: 'Content Creation Assistant',
    prompt: 'I need help creating [TYPE] content for [PLATFORM]. My target audience is [AUDIENCE] and my goal is [GOAL]. The tone should be [TONE].',
    variables: ['TYPE', 'PLATFORM', 'AUDIENCE', 'GOAL', 'TONE']
  },
  code_review: {
    name: 'Code Review & Optimization',
    prompt: 'Please review this [LANGUAGE] code for:\n1. Performance optimization\n2. Security vulnerabilities\n3. Best practices\n4. Code quality\n\nCode:\n[CODE]',
    variables: ['LANGUAGE', 'CODE']
  },
  project_planning: {
    name: 'Project Planning',
    prompt: 'Help me plan a [PROJECT_TYPE] project:\n- Timeline: [TIMELINE]\n- Budget: [BUDGET]\n- Team size: [TEAM_SIZE]\n- Key deliverables: [DELIVERABLES]',
    variables: ['PROJECT_TYPE', 'TIMELINE', 'BUDGET', 'TEAM_SIZE', 'DELIVERABLES']
  },
  marketing_strategy: {
    name: 'Marketing Strategy',
    prompt: 'Create a marketing strategy for [PRODUCT/SERVICE]:\n- Target market: [MARKET]\n- Budget: [BUDGET]\n- Goals: [GOALS]\n- Timeline: [TIMELINE]',
    variables: ['PRODUCT/SERVICE', 'MARKET', 'BUDGET', 'GOALS', 'TIMELINE']
  },
  creative_brief: {
    name: 'Creative Brief Generator',
    prompt: 'Generate a creative brief for [PROJECT]:\n- Objective: [OBJECTIVE]\n- Target audience: [AUDIENCE]\n- Key message: [MESSAGE]\n- Deliverables: [DELIVERABLES]\n- Timeline: [TIMELINE]',
    variables: ['PROJECT', 'OBJECTIVE', 'AUDIENCE', 'MESSAGE', 'DELIVERABLES', 'TIMELINE']
  },
  technical_architecture: {
    name: 'Technical Architecture Design',
    prompt: 'Design technical architecture for [SYSTEM]:\n- Requirements: [REQUIREMENTS]\n- Scale: [SCALE]\n- Tech stack: [STACK]\n- Constraints: [CONSTRAINTS]',
    variables: ['SYSTEM', 'REQUIREMENTS', 'SCALE', 'STACK', 'CONSTRAINTS']
  },
  image_generation: {
    name: 'AI Image Generation Prompt',
    prompt: 'Create optimized prompt for [SUBJECT]:\n- Style: [STYLE]\n- Mood: [MOOD]\n- Details: [DETAILS]\n- Aspect ratio: [RATIO]\n- Quality: [QUALITY]',
    variables: ['SUBJECT', 'STYLE', 'MOOD', 'DETAILS', 'RATIO', 'QUALITY']
  },
  video_script: {
    name: 'Video Script Writer',
    prompt: 'Write a video script for [VIDEO_TYPE]:\n- Duration: [DURATION]\n- Topic: [TOPIC]\n- Audience: [AUDIENCE]\n- Call to action: [CTA]',
    variables: ['VIDEO_TYPE', 'DURATION', 'TOPIC', 'AUDIENCE', 'CTA']
  }
};

export const JAVARI_MEMORY_SCHEMA = {
  user_preferences: {
    preferred_provider: 'string', // openai, anthropic, google, mistral
    preferred_model: 'string',
    temperature: 'number',
    max_tokens: 'number',
    tone: 'string', // professional, casual, creative, technical
    response_length: 'string', // concise, balanced, detailed
    code_style: 'string', // verbose, minimal, commented
    language_preference: 'string'
  },
  project_context: {
    current_projects: 'array',
    active_workflows: 'array',
    recent_tools_used: 'array',
    common_tasks: 'array',
    skills_level: 'object' // { design: 'expert', coding: 'intermediate', ... }
  },
  learning_data: {
    successful_patterns: 'array',
    failed_attempts: 'array',
    feedback_history: 'array',
    improvement_areas: 'array',
    cost_preferences: 'object' // optimization goals
  },
  interaction_history: {
    total_conversations: 'number',
    favorite_topics: 'array',
    common_questions: 'array',
    time_patterns: 'object', // when user is most active
    productivity_insights: 'array'
  }
};

export const JAVARI_SELF_HEALING_CONFIG = {
  failure_detection: {
    timeout_threshold: 30000, // 30 seconds
    retry_attempts: 3,
    retry_delay: 1000, // 1 second
    exponential_backoff: true
  },
  fallback_strategy: {
    primary_provider: 'openai',
    fallback_providers: ['anthropic', 'google', 'mistral'],
    auto_switch_on_failure: true,
    learn_from_failures: true,
    max_consecutive_failures: 5
  },
  health_monitoring: {
    check_interval: 300000, // 5 minutes
    metrics_to_track: [
      'response_time',
      'success_rate',
      'cost_efficiency',
      'user_satisfaction',
      'uptime_percentage'
    ]
  },
  auto_optimization: {
    enabled: true,
    optimize_for: 'balance', // cost, speed, quality, balance
    learning_rate: 0.1,
    min_samples_for_optimization: 50
  }
};

export const JAVARI_INTEGRATION_ENDPOINTS = {
  cr_audioviz_apps: {
    base_url: '/api/apps',
    available_tools: [
      'audio-editor',
      'video-editor',
      'image-generator',
      '3d-modeler',
      'code-generator',
      'animation-studio',
      'music-composer',
      'voice-synthesizer'
    ]
  },
  external_services: {
    github: '/api/integrations/github',
    dropbox: '/api/integrations/dropbox',
    google_drive: '/api/integrations/google-drive',
    slack: '/api/integrations/slack',
    discord: '/api/integrations/discord'
  },
  ai_services: {
    dalle: '/api/ai/dalle',
    midjourney: '/api/ai/midjourney',
    stable_diffusion: '/api/ai/stable-diffusion',
    runway: '/api/ai/runway',
    elevenlabs: '/api/ai/elevenlabs'
  }
};

export function getSystemPrompt(userContext?: any): string {
  let prompt = JAVARI_SYSTEM_PROMPT;
  
  // Add user context if available
  if (userContext) {
    prompt += `\n\n# USER CONTEXT\n`;
    if (userContext.name) prompt += `User name: ${userContext.name}\n`;
    if (userContext.subscription_tier) prompt += `Subscription: ${userContext.subscription_tier}\n`;
    if (userContext.active_projects) prompt += `Active projects: ${userContext.active_projects.length}\n`;
    if (userContext.preferences) {
      prompt += `\nUser Preferences:\n`;
      prompt += `- Preferred provider: ${userContext.preferences.preferred_provider || 'Not set'}\n`;
      prompt += `- Response style: ${userContext.preferences.tone || 'Professional'}\n`;
      prompt += `- Technical level: ${userContext.preferences.technical_level || 'Intermediate'}\n`;
    }
  }
  
  return prompt;
}

export function selectOptimalProvider(
  taskType: string,
  userPreferences: any,
  performanceData: any[]
): { provider: string; model: string; reasoning: string } {
  // Analyze task type
  const isCodeHeavy = /code|programming|debug|algorithm/i.test(taskType);
  const isCreative = /creative|story|write|design|art/i.test(taskType);
  const isAnalytical = /analyze|data|report|research/i.test(taskType);
  const needsSpeed = /quick|fast|urgent/i.test(taskType);
  
  // Get provider performance
  const providerScores = performanceData.map(p => ({
    provider: p.provider,
    uptime: p.uptime_percentage || 95,
    avg_cost: p.avg_cost || 0.01,
    avg_speed: p.avg_response_time || 1000
  }));
  
  // Decision logic
  if (needsSpeed && !userPreferences.optimize_for_quality) {
    // Use fastest affordable option
    return {
      provider: 'anthropic',
      model: 'claude-3-haiku-20240307',
      reasoning: 'Selected Claude Haiku for fastest response time'
    };
  }
  
  if (isCodeHeavy) {
    return {
      provider: 'openai',
      model: 'gpt-4-turbo',
      reasoning: 'Selected GPT-4 Turbo for superior code generation capabilities'
    };
  }
  
  if (isCreative) {
    return {
      provider: 'anthropic',
      model: 'claude-3-opus-20240229',
      reasoning: 'Selected Claude Opus for exceptional creative writing quality'
    };
  }
  
  if (isAnalytical) {
    return {
      provider: 'openai',
      model: 'gpt-4',
      reasoning: 'Selected GPT-4 for deep analytical capabilities'
    };
  }
  
  // Default: balanced option
  return {
    provider: 'anthropic',
    model: 'claude-3-5-sonnet-20241022',
    reasoning: 'Selected Claude 3.5 Sonnet for optimal balance of quality, speed, and cost'
  };
}
