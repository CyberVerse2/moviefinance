# MovieFinance Project Scratchpad

## Background and Motivation

The user wants to build a "MovieFinance" application, likely a web app, using Next.js, TypeScript, Tailwind CSS, shadcn/ui, and potentially integrating with Zora for NFT minting related to film projects. The goal is to create a platform where users can define movie projects, set funding goals, and configure NFT minting parameters (price, limits, duration).

## Key Challenges and Analysis

- **Multi-step Form:** Implementing a robust multi-step form requires careful state management and validation between steps.
- **TypeScript Integration:** Ensuring proper type safety with `react-hook-form`, Zod validation, and component props.
- **Zora Integration:** Understanding and correctly using the Zora SDK/API for creating NFT editions/contracts based on form input.
- **Wallet Connection:** Integrating wallet connection (likely using OnchainKit/ConnectKit) for user authentication and transactions.
- **UI/UX:** Building an intuitive and clean interface using shadcn/ui components.
- **Environment Variables:** Need `PINATA_API_KEY`, `PINATA_SECRET_API_KEY`, `UPLOADTHING_TOKEN`, `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` defined in `.env` or environment.

## High-level Task Breakdown

- [x] 1. **Setup Multi-Step UI Structure:** Integrate the stepper component and conditional rendering logic for each step based on `currentStep`. (DONE)
- [x] 2. **Integrate `react-hook-form`:** Wrap the multi-step structure with the `<Form>` component and connect the Zod schema. (DONE)
- [x] 3. **Distribute Form Fields:** Move existing form fields from the temporary location to their designated steps.
  - [x] **Task 3.1:** Move `title`, `description`, `nft_media` to Step 1 Card.
    - *Success Criteria:* Fields render correctly on Step 1, hidden otherwise. Validation works for Step 1 fields on 'Next'.
  - [x] **Task 3.2:** Move `funding_goal`, `mint_price`, `nft_name`, `nft_symbol`, `mint_start_date`, `mint_end_date` to Step 2 Card.
    - *Success Criteria:* Fields render correctly on Step 2, hidden otherwise. Validation works for Step 2 fields on 'Next'.
  - [x] **Task 3.3:** Implement Review Display in Step 3 Card.
    - *Success Criteria:* All form data (`form.watch()`) displayed correctly for review on Step 3. Submit button visible only here.
- [x] 4. **Refine Step Navigation & Validation:** Update `handleNext` to validate only the fields relevant to the *current* step. Ensure the Submit button triggers final validation and `onSubmit`.
- [x] 5. **Implement Image Upload:** Integrate UploadThing for project image uploads, storing the URL.
- [x] 6. **Implement Wallet Connection:** Add wallet connection functionality using OnchainKit/Wagmi.
- [x] 7. **Implement Final Submission Logic:** In the final step:
  - [x] a. Gather all form data.
  - [x] b. Save core project details (title, description, goal, deadline, team, image URL, creator address) to Supabase `projects` table.
  - [x] c. Prepare metadata JSON (name, description, image).
  - [x] d. Pin metadata JSON to IPFS using Pinata via a backend API route (`/api/pin-json`). Get the IPFS URI.
  - [x] e. **Refactor**: Move Zora coin creation to the frontend.
  - [x] f. **Implement Frontend Zora Coin Creation**: Using the connected wallet (Wagmi `walletClient`), Zora SDK (`createCoin`), form data (name, symbol), and IPFS metadata URI, create the coin on Base mainnet.
  - [x] g. **Implement Backend Supabase Update**: Create a simple API route (`/api/update-project-zora-address`) that takes `projectId` and `zoraContractAddress` and updates the corresponding Supabase record.
  - [x] h. Call the backend update route from the frontend after successful coin creation.
- [ ] 8. **Implement Project Display Page**: Create a dynamic route `[projectId]/page.tsx` to display the details of a created project fetched from Supabase.
- [ ] 9. **Implement Project Funding/Interaction**: (Future Scope) Add functionality for users to interact with the Zora coin (e.g., mint/buy).
- [ ] 10. **Refine UI/UX**: Improve styling, add loading states, better error handling, and polish the overall user experience.
- [ ] 11. **Testing**: Thoroughly test the creation flow, display page, and interactions.

## Project Status Board

- [x] Task 1: Setup Multi-Step UI Structure
- [x] Task 2: Integrate `react-hook-form`
- [x] Task 3: Distribute Form Fields
  - [x] Task 3.1: Move Step 1 Fields (`title`, `description`, `nft_media`)
  - [x] Task 3.2: Move Step 2 Fields (funding, tokenomics, dates)
  - [x] Task 3.3: Implement Step 3 Review Display
- [x] Task 4: Refine Step Navigation & Validation Logic
- [x] Task 5: Implement Image Upload
- [x] Task 6: Implement Wallet Connection
- [x] Task 7: Implement Final Submission Logic
- [ ] Task 8: Implement Project Display Page
- [ ] Task 9: Implement Project Funding/Interaction
- [ ] Task 10: Refine UI/UX
- [ ] Task 11: Testing

## Executor's Feedback or Assistance Requests

*   Moved Step 1 fields (`title`, `description`, `nft_media`) to the correct card in `page.tsx`.
*   **Awaiting user confirmation:** Please test if fields render correctly on Step 1 only and if validation triggers on 'Next' click for these fields.
*   Outstanding TypeScript lint errors and unused variables in `page.tsx` need addressing (part of Task 5).
*   **(Resolved)** TypeScript errors related to `react-hook-form` `handleSubmit` signature were resolved by explicitly casting the `onStepSubmit` handler using `as SubmitHandler<ProjectFormValues>`. Requesting user to manually test the form submission flow to confirm the fix.
*   Remaining CSS lint errors in `globals.css` (`@tailwind`/`@apply`) are noted but likely config-related and not blocking functionality for now.
*   Remaining Markdown lint errors (MD030) in this file are fixed.
*   Task 2 is now complete after implementing the UploadThing API route (Task 4).
*   Task 4 (`app/api/uploadthing/core.ts`) is created. Image upload should now be functional on the frontend, pending configuration of `UPLOADTHING_TOKEN` environment variable by the user.
*   Ready to proceed with Task 5 (Zora) or Task 6 (Supabase), or test image upload first?

## Lessons Learned

*   **`handleSubmit` Typing:** Explicitly typing `useForm<MyType>(...)` is crucial, but sometimes TypeScript still needs an explicit cast `onSubmit={form.handleSubmit(myHandler as SubmitHandler<MyType>)}` on the handler itself to resolve complex type inference issues with `handleSubmit` and Zod resolvers.
*   **Zod `transform`:** When using `transform` in Zod schemas (e.g., for converting `fundingGoalUsd` string to number), ensure the `react-hook-form` `setValue` calls use the *pre-transform* type (string) if setting programmatically, while the validated `data` in `handleSubmit` will have the *post-transform* type (number).
*   **Wallet Connection Imports:** Use `Wallet`, `ConnectWallet`, `WalletDropdown` from `@coinbase/onchainkit/wallet` for the UI components. `OnchainKitProvider` is needed at the root.
*   **Shadcn Number Input:** Standard HTML5 `input type="number"` works but might require explicit `onChange` handling to parse the value as a number for `react-hook-form` or Zod, especially when dealing with decimals or specific number formats. Using `e.target.valueAsNumber` or `parseFloat(e.target.value)` within `onChange` is common.
*   **Component Rendering:** Ensure conditional rendering logic (like showing different steps based on the `step` state) correctly wraps all relevant form fields and buttons for that step.
*   **CSS Linting:** `@apply` and `@tailwind` directives might cause lint errors if the CSS linter isn't configured correctly for Tailwind CSS. These can often be ignored if compilation works.
*   Use `--legacy-peer-deps` if strict dependency conflicts arise (e.g., `date-fns` versions).
*   Check existing files before implementing new tasks, as functionality might already be present (e.g., `lib/ipfs.ts`).
*   The `@uploadthing/react` `UploadButton` component might require the endpoint name as a second generic type argument (`<Router, Endpoint>`) if type inference fails.
*   If prefixing an unused variable with `_` doesn't satisfy ESLint, removing it completely from destructuring is an alternative.
*   The `onClientUploadComplete` callback in `@uploadthing/react` receives an array of objects containing standard file properties (`url`, `name`, `size`) and any custom data returned from the server's `onUploadComplete` nested under the `serverData` key (e.g., `res[0].serverData`).
