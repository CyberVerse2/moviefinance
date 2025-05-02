# MovieFinance Project Scratchpad

## Background and Motivation

The user wants to build a "MovieFinance" application, likely a web app, using Next.js, TypeScript, Tailwind CSS, shadcn/ui, and potentially integrating with Zora for NFT minting related to film projects. The goal is to create a platform where users can define movie projects, set funding goals, and configure NFT minting parameters (price, limits, duration).

## Key Challenges and Analysis

- **Multi-step Form:** Implementing a robust multi-step form requires careful state management and validation between steps.
- **TypeScript Integration:** Ensuring proper type safety with `react-hook-form`, Zod validation, and component props.
- **Zora Integration:** Understanding and correctly using the Zora SDK/API for creating NFT editions/contracts based on form input.
- **Wallet Connection:** Integrating wallet connection (likely using OnchainKit/ConnectKit) for user authentication and transactions.
- **UI/UX:** Building an intuitive and clean interface using shadcn/ui components.

## High-level Task Breakdown

1.  **Setup Project Structure:** (Implicitly done via `create-next-app`)
2.  **Create Multi-Step Form UI:**
    -  Define form steps (Project Details, Token Setup, Review).
    -  Use shadcn/ui components (`Card`, `Input`, `Button`, `Progress`, etc.).
    -  Implement basic step navigation (Next/Previous buttons).
3.  **Implement Form Logic & Validation:**
    -  Integrate `react-hook-form` for state management.
    -  Define Zod schema for validation across all steps.
    -  Implement per-step validation logic using `trigger`.
    -  Handle form submission (`handleSubmit`).
4.  **Integrate Wallet Connection:**
    -  Add `ConnectWallet` button using `@coinbase/onchainkit`.
    -  Ensure provider setup is correct (`OnchainKitProvider`).
5.  **Integrate Zora Minting:**
    -  Identify necessary Zora functions (e.g., creating an edition).
    -  Pass validated form data to Zora functions on final submission.
    -  Handle transaction states (loading, success, error).
6.  **Refinement & Error Handling:**
    -  Improve UI/UX based on testing.
    -  Add comprehensive error handling and user feedback.
    -  Fix any remaining TypeScript/linting errors.

## Project Status Board

- [x] Setup basic Next.js project
- [x] Install necessary dependencies (shadcn/ui, react-hook-form, zod, Zora SDK, OnchainKit)
- [x] Create basic multi-step form UI structure (`create-project/page.tsx`)
- [x] Define Zod schema (`projectFormSchema`) for form validation
- [x] Integrate `react-hook-form` and `zodResolver`
- [x] Implement basic step navigation (`nextStep`, `prevStep`)
- [x] Implement per-step validation using `trigger` before advancing
- [x] Integrate Wallet Connection components (`ConnectWallet`, `WalletDropdown`)
- [x] Fix TypeScript errors in form submission (`handleSubmit` typing)
- [ ] Connect form submission to Zora minting logic
- [ ] Implement image upload/preview for project cover
- [ ] Add final review step displaying all entered data
- [ ] Add loading states and feedback during Zora interaction
- [ ] Refine UI/UX

## Executor's Feedback or Assistance Requests

*   **(Resolved)** TypeScript errors related to `react-hook-form` `handleSubmit` signature were resolved by explicitly casting the `onStepSubmit` handler using `as SubmitHandler<ProjectFormValues>`. Requesting user to manually test the form submission flow to confirm the fix.
*   Remaining CSS lint errors in `globals.css` (`@tailwind`/`@apply`) are noted but likely config-related and not blocking functionality for now.
*   Remaining Markdown lint errors (MD030) in this file are fixed.

## Lessons Learned

*   **`handleSubmit` Typing:** Explicitly typing `useForm<MyType>(...)` is crucial, but sometimes TypeScript still needs an explicit cast `onSubmit={form.handleSubmit(myHandler as SubmitHandler<MyType>)}` on the handler itself to resolve complex type inference issues with `handleSubmit` and Zod resolvers.
*   **Zod `transform`:** When using `transform` in Zod schemas (e.g., for converting `fundingGoalUsd` string to number), ensure the `react-hook-form` `setValue` calls use the *pre-transform* type (string) if setting programmatically, while the validated `data` in `handleSubmit` will have the *post-transform* type (number).
*   **Wallet Connection Imports:** Use `Wallet`, `ConnectWallet`, `WalletDropdown` from `@coinbase/onchainkit/wallet` for the UI components. `OnchainKitProvider` is needed at the root.
*   **Shadcn Number Input:** Standard HTML5 `input type="number"` works but might require explicit `onChange` handling to parse the value as a number for `react-hook-form` or Zod, especially when dealing with decimals or specific number formats. Using `e.target.valueAsNumber` or `parseFloat(e.target.value)` within `onChange` is common.
*   **Component Rendering:** Ensure conditional rendering logic (like showing different steps based on the `step` state) correctly wraps all relevant form fields and buttons for that step.
*   **CSS Linting:** `@apply` and `@tailwind` directives might cause lint errors if the CSS linter isn't configured correctly for Tailwind CSS. These can often be ignored if compilation works.

## TODOs (Specific Action Items)

- Implement `trigger()` validation within `nextStep` function.
- Add image upload functionality (Step 1).
- Build out the final Review step (Step 4).
- Write the actual Zora integration logic triggered by the final form submission.
- Add loading indicators/feedback for async operations (Zora minting).
