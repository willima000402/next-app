# AI Learning Guide

An AI-powered step-by-step guided learning and workflow web app. Enter any learning goal, task, or process — the AI generates a personalised plan and guides you through it one step at a time, with targeted feedback at each step.

## What it is

This is a **guided workflow application**, not a chatbot. The key difference:

- Users enter a goal, then follow a structured AI-generated plan
- One step is active at a time — progression is gated on quality responses
- The AI evaluates only the current step and gives targeted feedback
- All accepted answers are remembered and used as context for later steps
- The session ends with an AI-synthesised final output built from the user's work

## Use cases (relabel freely)

- AI learning assistant / tutor
- LMS / e-learning workflow tool
- Employee training assistant
- Guided onboarding flow
- Skills coaching app
- Step-by-step compliance trainer
- Educational process assistant

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| AI | OpenAI API (`gpt-4o-mini` by default) |
| State | React `useReducer` custom hook |
| API | Next.js Route Handlers |

## Project structure

```
src/
├── app/
│   ├── api/
│   │   ├── generate-plan/route.ts   # POST /api/generate-plan
│   │   ├── evaluate-step/route.ts   # POST /api/evaluate-step
│   │   └── finalize/route.ts        # POST /api/finalize
│   ├── layout.tsx
│   └── page.tsx                     # Root: phase-based screen routing
│
├── lib/
│   └── ai/
│       ├── service.ts               # OpenAI client, all AI calls
│       └── prompts.ts               # Prompt templates (pure functions)
│
├── hooks/
│   └── useLearningSession.ts        # Central session state (useReducer)
│
├── screens/
│   ├── StartScreen.tsx              # Goal input + example prompts
│   ├── WorkflowScreen.tsx           # Guided step-by-step workflow
│   └── FinalScreen.tsx              # Results, accepted answers, final output
│
├── components/
│   ├── ProgressBar.tsx
│   ├── StepSidebar.tsx
│   ├── FeedbackCard.tsx
│   ├── PriorAnswersPanel.tsx
│   ├── ErrorBanner.tsx
│   └── LoadingSpinner.tsx
│
└── types/
    └── index.ts                     # All shared TypeScript types
```

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your OpenAI API key:

```
OPENAI_API_KEY=sk-...
```

> If the key is missing, the app shows a clear developer error on first use — it will not silently fail.

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## API reference

### `POST /api/generate-plan`

```json
// Request
{ "goal": "Help me learn how to solve a linear equation" }

// Response
{
  "goal": "...",
  "planTitle": "...",
  "planDescription": "...",
  "steps": [{ "id": 1, "title": "...", "instruction": "..." }]
}
```

### `POST /api/evaluate-step`

```json
// Request
{
  "goal": "...",
  "planTitle": "...",
  "currentStep": { "id": 1, "title": "...", "instruction": "..." },
  "studentAnswer": "...",
  "previousAcceptedAnswers": { "1": "..." }
}

// Response
{
  "stepId": 1,
  "evaluation": "pass",
  "feedback": "...",
  "hint": null,
  "acceptedAnswer": "...",
  "nextStepUnlocked": true
}
```

### `POST /api/finalize`

```json
// Request
{
  "goal": "...",
  "planTitle": "...",
  "acceptedAnswers": { "1": "...", "2": "..." }
}

// Response
{ "finalSummary": "...", "finalOutput": "..." }
```

## Customisation

### Change the AI model

In `.env.local`:
```
OPENAI_MODEL=gpt-4o
```

### Edit prompt behaviour

All prompts are pure functions in `src/lib/ai/prompts.ts`. Edit them to change evaluation strictness, tone, or output format without touching any other file.

### Rebrand for a specific domain

1. Update title/description in `src/app/layout.tsx`
2. Update example goals in `src/screens/StartScreen.tsx`
3. Update header copy in `src/screens/WorkflowScreen.tsx`

### Swap AI provider

All OpenAI SDK usage is isolated in `src/lib/ai/service.ts`. Replace the client and API calls there — routes, hooks, and components are unaffected.

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Run production build
npm run lint     # ESLint
```
