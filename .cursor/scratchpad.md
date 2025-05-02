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

1.  **Setup Multi-Step UI Structure:** Integrate the stepper component and conditional rendering logic for each step based on `currentStep`. (DONE)
2.  **Integrate `react-hook-form`:** Wrap the multi-step structure with the `<Form>` component and connect the Zod schema. (DONE)
3.  **Distribute Form Fields:** Move existing form fields from the temporary location to their designated steps.
    *   **Task 3.1:** Move `title`, `description`, `nft_media` to Step 1 Card.
        *   *Success Criteria:* Fields render correctly on Step 1, hidden otherwise. Validation works for Step 1 fields on 'Next'.
    *   **Task 3.2:** Move `funding_goal`, `mint_price`, `nft_name`, `nft_symbol`, `mint_start_date`, `mint_end_date` to Step 2 Card.
        *   *Success Criteria:* Fields render correctly on Step 2, hidden otherwise. Validation works for Step 2 fields on 'Next'.
    *   **Task 3.3:** Implement Review Display in Step 3 Card.
        *   *Success Criteria:* All form data (`form.watch()`) displayed correctly for review on Step 3. Submit button visible only here.
4.  **Refine Step Navigation & Validation:** Update `handleNext` to validate only the fields relevant to the *current* step. Ensure the Submit button triggers final validation and `onSubmit`.
 - [x] Task 4: Implement Image Upload (UploadThing)
   - [x] Create API route (`/api/uploadthing/core.ts`)
   - [x] Create API route handler ([/api/uploadthing/route.ts](cci:7://file:///Users/thecyberverse/Code/Quests/moviefinance/app/api/uploadthing/route.ts:0:0-0:0))
   - [x] Install `@uploadthing/react`
   - [x] Integrate `<UploadButton>` in `create-project/page.tsx`
   - [x] Define `handleUploadComplete` and `handleUploadError`
   - [x] Set up Environment Variable for UploadThing (`UPLOADTHING_TOKEN`)
   - [ ] Test upload functionality
    *   *Success Criteria:* Step-specific validation enforced by 'Next' button. Submit button works correctly on Step 3.
5.  **Address Lint Errors:** Fix any errors introduced during the refactoring.
    *   *Success Criteria:* `eslint` passes for `page.tsx`.
6.  **Implement Submission Logic:** Connect the final submit action to deploy the Zora contract, upload metadata, and save project details to Supabase.
7.  **Testing:** Thoroughly test the entire creation flow.

## Project Status Board

- [x] **Task 1:** Setup Multi-Step UI Structure
- [x] **Task 2:** Integrate `react-hook-form` 
- [x] **Task 3:** Distribute Form Fields **(Already Existed)**
  - [/] **Task 3.1:** Move Step 1 Fields (`title`, `description`, `nft_media`) - *Code moved, pending user testing*
  - [ ] **Task 3.2:** Move Step 2 Fields (funding, tokenomics, dates)
  - [ ] **Task 3.3:** Implement Step 3 Review Display
- [/] **Task 4:** Refine Step Navigation & Validation Logic
- [ ] **Task 5:** Address Lint Errors
- [ ] **Task 6:** Implement Submission Logic (Partially done, needs review after field distribution)
- [ ] **Task 7:** Testing

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
