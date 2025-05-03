"use client";

import { useState, useCallback } from "react";
import Link from "next/link"; 
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type ControllerRenderProps } from "react-hook-form";
import * as z from "zod";
import { useAccount, useWalletClient } from 'wagmi';
import { base } from 'wagmi/chains'; 
import { Address, createPublicClient, http } from 'viem'; // Added viem
import { createCoin } from '@zoralabs/coins-sdk'; // Added Zora SDK
import { toast } from "../components/ui/use-toast";
import { supabase } from '@/lib/supabaseClient';
import { uploadJsonToPinata, uploadFileToPinata } from '@/lib/ipfs'; // Import both functions

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"; 
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "../components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "../components/ui/textarea";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Film, Loader2 } from "lucide-react"; 
import { Label } from "@/components/ui/label"; // Import Label
import { OurFileRouter } from "../api/uploadthing/core"; // Corrected path

// Zod Schema (Keep current)
const projectFormSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters.' }),
  symbol: z.string()
    .min(3, { message: 'Symbol must be 3-5 characters.' })
    .max(5, { message: 'Symbol must be 3-5 characters.' })
    .regex(/^[A-Z0-9]+$/, { message: 'Symbol must be uppercase letters/numbers.'}),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  fundingGoalUsd: z.coerce
    .number({
      required_error: 'Funding goal is required.',
      invalid_type_error: 'Funding goal must be a number',
    })
    .positive({ message: 'Funding goal must be positive.' }),
  mintPrice: z.coerce.number().nonnegative({ message: "Mint price cannot be negative." }),
  mintLimitPerWallet: z.coerce.number().int().positive({ message: "Mint limit must be a positive whole number." }),
  mintDurationDays: z.coerce.number().int().positive({ message: 'Duration must be a positive number of days' }),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

// Default Values (Keep current, ensure nft_media is initialized)
const defaultValues: Partial<ProjectFormValues> = {
  title: "",
  symbol: "",
  description: "",
  fundingGoalUsd: 50000,
  mintPrice: 0.001,
  mintLimitPerWallet: 10,
  mintDurationDays: 7,
};

export default function CreateProjectPage() {
  const [step, setStep] = useState(1);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null); // State for the image file
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { address: connectedAddress, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();

  // Define the public client for Base network (client-side)
  const publicClient = createPublicClient({
    chain: base,
    transport: http('https://mainnet.base.org'), // Using public Base RPC
  });

  // --- Stepper Logic --- START
  const nextStep = async () => {
    // Trigger validation for relevant fields before proceeding
    // Simplified: Trigger all for now
    const isValid = await form.trigger();
    if (isValid) {
      // Only increment if not already on the final review step (step 3)
      if (step < 3) {
         setStep((prev) => prev + 1);
      }
    }
  };

  const prevStep = () => {
    // Only decrement if not on the first step
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };
  // --- Stepper Logic --- END

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues,
    mode: 'onChange',
  });

  // Handler for file input change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      console.log('File selected:', file.name);
      setSelectedImageFile(file);
    } else {
      console.log('File selection cleared.');
      setSelectedImageFile(null);
    }
  };

  // --- Submission Logic --- START
  // Combined handler for step progression & final submission
  const processSubmit = (data: ProjectFormValues) => {
    if (step < 3) { // Progress if not on the final step (Step 3)
      console.log(`Data validated for Step ${step}:`, data);
      nextStep(); // Move to next step visually after validation
    } else if (step === 3) { // Trigger final submission ONLY on Step 3
      handleFinalSubmit(data);
    }
  };

  async function handleFinalSubmit(data: ProjectFormValues) {
    if (!isConnected || !connectedAddress || !walletClient) {
      toast({ 
        variant: "destructive",
        title: 'Wallet Error', 
        description: 'Please connect your wallet and switch to Base Mainnet to submit.', 
      });
      return;
    }

    // Validate that an image file has been selected
    if (!selectedImageFile) {
      toast({ 
        variant: "destructive",
        title: 'Missing Image', 
        description: 'Please select a cover image file.', 
      });
      return;
    }

    setIsSubmitting(true);
    console.log("Final submission data:", data);
    console.log("Selected image file:", selectedImageFile.name);

    try {
      // --- 1. Create Project in Supabase (get project ID) --- //
      console.log("Attempting Supabase insert with address:", connectedAddress);
      const { data: projectData, error: insertError } = await supabase
        .from('projects')
        .insert({
          // Map form data to Supabase columns
          title: data.title,
          description: data.description,
          funding_goal: data.fundingGoalUsd,
          creator_wallet_address: connectedAddress, // Correct column name
          symbol: data.symbol,
          // Add other fields as needed
          // image_url: initially null or placeholder, will be IPFS hash
        })
        .select('id')
        .single();

      if (insertError) {
        console.error("Supabase insert error:", insertError);
        throw new Error(`Database error: ${insertError.message}`);
      }
      if (!projectData?.id) {
        console.error("Supabase insert error: No project ID returned.");
        throw new Error("Failed to create project record in database.");
      }

      console.log("Project created with ID:", projectData.id);
      const projectId = projectData.id;

      // --- 2. Upload Image File to Pinata --- //
      toast({ description: 'Uploading image to IPFS...' });
      const imageIpfsUri = await uploadFileToPinata(selectedImageFile);
      console.log('Image uploaded to IPFS:', imageIpfsUri);
      toast({ description: 'Image uploaded successfully!' });

      // --- 3. Prepare and Pin Metadata (with correct image URI) to IPFS --- //    
      const metadata = {
        name: data.title,
        description: data.description,
        image: imageIpfsUri, // Use the IPFS URI for the image
        // Add other attributes as needed
      };
      
      toast({ description: 'Uploading metadata to IPFS...' });
      const metadataUri = await uploadJsonToPinata(metadata);
      console.log('Metadata pinned to IPFS:', metadataUri);
      toast({ description: 'Metadata uploaded successfully!' });

      // --- 4. Create Zora Coin on Base network --- //
      const coinParams = {
        name: data.title,
        symbol: data.symbol,
        uri: metadataUri,
        payoutRecipient: connectedAddress as Address, // User's connected wallet is the recipient
      };

      console.log('🚀 Attempting to create Zora Coin with params:', coinParams);
      console.log('Using walletClient:', walletClient);
      console.log('Using publicClient:', publicClient);

      const result = await createCoin(
        coinParams, 
        walletClient, 
        publicClient
      );

      console.log('✅ Zora Coin Creation Result:', result);
      const coinAddress = result.address;

      toast({ description: `Coin created: ${coinAddress}` });

      // --- 5. Update Supabase with Zora Contract Address --- //
      console.log(`Updating Supabase project ${projectId} with Zora address ${coinAddress}...`);
      const { error: updateError } = await supabase
        .from('projects')
        .update({ zora_contract_address: coinAddress })
        .eq('id', projectId)
        .select();

      if (updateError) {
        console.error('🔴 Supabase Update Error after Zora deploy:', updateError);
        // Note: Zora coin was created, but DB update failed. Might need manual reconciliation.
        throw new Error(`Zora coin created (${coinAddress}), but failed to update project record: ${updateError.message}`);
      }
      console.log('✅ Supabase updated successfully.');

      // --- 6. Final Success & Navigation --- //
      toast({ description: 'Project and Zora coin created successfully!' });
      // router.push(`/project/${projectId}`); // Redirect to project page

    } catch (error: unknown) { 
      console.error("Submission failed:", error);
      let errorMessage = 'An unexpected error occurred during submission.';

      // Type check before accessing properties
      if (error instanceof Error) {
        errorMessage = error.message;
        // Log the specific error during Zora creation if possible
        if (errorMessage.includes('Zora') || errorMessage.includes('coin') || errorMessage.includes('transaction')) { // Heuristic check for Zora/wallet errors
          console.error('🔴 Error details likely related to Zora/Wallet:', error);
        }
      } else {
        // Handle cases where the caught item is not an Error object
        console.error('🔴 Caught non-Error object:', error);
        errorMessage = 'An unexpected non-error value was caught.';
      }

      // Display specific error messages based on the caught error
      // (This part seems to have been overwritten/removed in previous edits, restoring basic structure)
      // Consider enhancing this logic based on the error source (Supabase, Pinata, Zora)

      toast({ // Correct error toast usage
        variant: "destructive",
        title: "Submission Error",
        description: errorMessage,
      });
    } finally { 
      setIsSubmitting(false);
    }
  }
  // --- Submission Logic --- END

  // --- JSX Structure --- START
  return (
    <div className="container px-4 py-8 md:px-6 md:py-12"> 
      {/* Added Back Link */}
      <Link
        href="/"
        className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Link>

      {/* Added Title Section */}
      <div className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Create Your Film Project</h1>
        <p className="text-muted-foreground">
          Follow the steps to launch your project on MovieFinance.
        </p>
      </div>

      <div className="mt-8"> 
        {/* --- Added Stepper UI --- START */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                    step === i
                      ? "border-red-600 bg-red-600 text-white"
                      : step > i
                      ? "border-red-600 bg-white text-red-600"
                      : "border-gray-200 bg-white text-gray-400"
                  }`}
                >
                  {step > i ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  ) : (
                    i
                  )}
                </div>
                <span className={`mt-2 text-xs ${step === i ? "font-medium text-red-600" : "text-muted-foreground"}`}>
                  {i === 1 ? "Details" : i === 2 ? "Economics" : "Review"}
                </span>
              </div>
            ))}
          </div>
          <div className="relative mt-4">
            <div className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-gray-200"></div>
            <div
              className="absolute left-0 top-1/2 h-0.5 -translate-y-1/2 bg-red-600 transition-all duration-300"
              style={{ width: `${(step - 1) * 50}%` }}
            ></div>
          </div>
        </div>
        {/* --- Added Stepper UI --- END */}

        {/* --- Form Wrapper --- START */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(processSubmit)} className="space-y-8">
            
            {/* --- Step 1 Card (Details) --- START */}
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Step 1: Project Details</CardTitle>
                  <CardDescription>
                    Tell us about your film project.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Title Field */}
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Title</FormLabel>
                        <FormControl>
                          <Input placeholder="My Awesome Film Project" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Symbol Field */}
                  <FormField
                    control={form.control}
                    name="symbol"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Coin Symbol</FormLabel>
                        <FormControl>
                          <Input placeholder="FILM" {...field} />
                        </FormControl>
                        <FormDescription>
                          3-5 uppercase letters/numbers (e.g., FILM, MOVI3).
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Description Field */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your project in detail..."
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Image Upload Field */}
                  <div className="space-y-2">
                    <Label htmlFor="cover-image">Cover Image</Label>
                    <Input 
                      id="cover-image"
                      type="file" 
                      accept="image/png, image/jpeg, image/gif, image/webp" 
                      onChange={handleFileChange}
                      className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100" // Example styling
                    />
                    {selectedImageFile && <p className="text-sm text-muted-foreground pt-1">Selected: {selectedImageFile.name}</p>}
                    <p className="text-sm text-muted-foreground">
                      Upload the main visual for your project (JPG, PNG, GIF).
                    </p>
                    {/* Manual validation message display */} 
                    {!selectedImageFile && form.formState.isSubmitted && (
                      <p className="text-sm font-medium text-destructive">Image is required.</p> 
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end"> 
                  {/* Only show Next button on step 1 */}
                  <Button type="submit" className="bg-red-600 hover:bg-red-700" disabled={isSubmitting}>
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            )}
            {/* --- Step 1 Card (Details) --- END */}

            {/* --- Step 2 Card (Economics) --- START */}
            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Step 2: Funding & Minting</CardTitle>
                  <CardDescription>
                    Set up the funding goal and NFT minting parameters.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Funding Goal Field */}
                  <FormField
                    control={form.control}
                    name="fundingGoalUsd"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Funding Goal (USD)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="50000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Mint Price Field */}
                  <FormField
                    control={form.control}
                    name="mintPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mint Price (ETH)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.001" placeholder="0.001" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Mint Limit Field */}
                  <FormField
                    control={form.control}
                    name="mintLimitPerWallet"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mint Limit Per Wallet</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="10" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Mint Duration Field */}
                  <FormField
                    control={form.control}
                    name="mintDurationDays"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mint Duration (Days)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="7" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className="flex justify-between"> 
                  {/* Show Previous and Next buttons on step 2 */}
                  <Button type="button" onClick={prevStep} variant="outline" disabled={isSubmitting}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Previous
                  </Button>
                  <Button type="submit" className="bg-red-600 hover:bg-red-700" disabled={isSubmitting}>
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            )}
            {/* --- Step 2 Card (Economics) --- END */}

            {/* --- Step 3 Card (Review & Submit) --- START */}
            {step === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>Review & Submit</CardTitle>
                  <CardDescription>Please review your project details before submitting.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Display Summary Here (using form.getValues()) */}
                  <div className="space-y-2 rounded-md border p-4">
                    <h4 className="font-medium">Project Summary</h4>
                    <p><strong>Title:</strong> {form.getValues("title")}</p>
                    <p><strong>Symbol:</strong> {form.getValues("symbol")}</p>
                    <p><strong>Description:</strong> {form.getValues("description")}</p>
                    <p><strong>Funding Goal:</strong> ${form.getValues("fundingGoalUsd").toLocaleString()}</p>
                    <p><strong>Mint Price:</strong> {form.getValues("mintPrice")} ETH</p>
                    <p><strong>Mint Limit:</strong> {form.getValues("mintLimitPerWallet")} per wallet</p>
                    <p><strong>Mint Duration:</strong> {form.getValues("mintDurationDays")} days</p>
                    {selectedImageFile && (
                      <div>
                        <p><strong>Cover Image:</strong></p>
                        <Image
                          src={URL.createObjectURL(selectedImageFile)}
                          alt="Project cover summary"
                          width={160} 
                          height={90} 
                          className="rounded-md object-cover"
                        />
                      </div>
                    )}
                  </div>
                  {/* Add wallet connection status/warning if needed */}
                  {!connectedAddress && (
                    <p className="text-sm text-destructive">Warning: Wallet not connected. Please connect to submit.</p>
                  )}
                  {walletClient && walletClient.chain.id !== base.id && (
                    <p className="text-sm text-destructive">Warning: Please switch wallet to Base Mainnet network.</p>
                  )}
                  <div className="flex justify-between">
                    <Button type="button" onClick={prevStep} variant="outline" disabled={isSubmitting}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Previous
                    </Button>
                    <Button
                      type="submit"
                      className="bg-green-600 hover:bg-green-700" // Changed to green
                      disabled={isSubmitting || !connectedAddress || (walletClient && walletClient.chain.id !== base.id)}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {/* Use imported Loader2 */}
                          Submitting...
                        </>
                      ) : (
                        "Submit Project"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            {/* --- Step 3 Card (Review & Submit) --- END */}
          </form>
        </Form>
        {/* --- Form Wrapper --- END */}
      </div>
    </div>
  );
  // --- JSX Structure --- END
}
