"use client";

import { useState, useCallback } from "react";
import Link from "next/link"; 
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type ControllerRenderProps } from "react-hook-form";
import * as z from "zod";
import { useAccount, useWalletClient } from 'wagmi';
import { base } from 'wagmi/chains'; 
// import { parseEther } from 'viem'; // Commented out as it's unused now
import { UploadButton } from '@uploadthing/react'; // Import ClientUploadedFileData
import Image from "next/image";
import { ArrowLeft, ArrowRight, Film, Loader2 } from "lucide-react"; 
import { OurFileRouter } from "../api/uploadthing/core"; // Corrected path

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"; 
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { toast } from "../components/ui/use-toast";
// import { deployZoraNftCollection } from '../../lib/zora'; // TODO: Implement or find this function
import { uploadJsonToPinata } from '@/lib/ipfs'; 
import { supabase } from '@/lib/supabaseClient';

// Zod Schema (Keep current)
const projectFormSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  nft_media: z.string().url({ message: "Please upload a valid image." }).min(1, { message: 'Project image is required.' }), 
  fundingGoalUsd: z.coerce
    .number({
      required_error: 'Funding goal is required.',
      invalid_type_error: 'Funding goal must be a number',
    })
    .positive({ message: 'Funding goal must be positive.' }),
  mintPrice: z.coerce.number().nonnegative({ message: "Mint price cannot be negative." }),
  mintLimitPerWallet: z.coerce.number().int().positive({ message: "Mint limit must be a positive whole number." }),
  mintDurationDays: z.coerce.number().int().positive({ message: "Mint duration must be a positive whole number of days." }),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

// Default Values (Keep current, ensure nft_media is initialized)
const defaultValues: Partial<ProjectFormValues> = {
  title: "",
  description: "",
  fundingGoalUsd: 50000,
  mintPrice: 0.001,
  mintLimitPerWallet: 10,
  mintDurationDays: 7,
  nft_media: undefined, 
};

export default function CreateProjectPage() {
  const [step, setStep] = useState(1);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { address } = useAccount();
  // const publicClient = usePublicClient({ chainId: base.id }); // Commented out as it's unused now
  const { data: walletClient } = useWalletClient();

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

  // --- Upload Handlers --- START
  type UploadCompleteData = {
    url: string;
    name: string;
    size: number;
    // serverData might be null if the server onUploadComplete returns void
    serverData: { uploadedBy: string; fileUrl: string } | null;
  };
  const handleUploadComplete = useCallback((res: UploadCompleteData[]) => { 
    if (res && res.length > 0) {
      const url = res[0].url;
      console.log("Image URL: ", url);
      setUploadedImageUrl(url);
      form.setValue("nft_media", url, { shouldValidate: true });
      toast({
        title: "Upload Complete",
        description: "Project image uploaded.",
      });
    }
  }, [form]);

  const handleUploadError = useCallback((error: Error) => {
    console.error(`Upload Error! ${error.message}`, error);
    toast({
      title: "Upload Failed",
      description: `Error: ${error.message}`,
      variant: "destructive",
    });
  }, []);
  // --- Upload Handlers --- END

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
    if (!address || !walletClient || walletClient.chain.id !== base.id) {
      toast({ 
        title: 'Wallet Error', 
        description: 'Please connect your wallet and switch to Base Mainnet to submit.', 
        variant: 'destructive' 
      });
      return;
    }
    if (!uploadedImageUrl) { 
      toast({ title: 'Missing Image', description: 'Upload cover image.', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    toast({ title: 'Submitting Project...', description: 'Please wait.' });

    try {
      const metadata = {
        name: data.title,
        description: data.description,
        image: uploadedImageUrl, 
        fundingGoalUsd: data.fundingGoalUsd,
        mintPriceEth: data.mintPrice,
        mintLimitPerWallet: data.mintLimitPerWallet,
        mintDurationDays: data.mintDurationDays,
      };
      const metadataUri = await uploadJsonToPinata(metadata);
      toast({ title: 'Metadata Uploaded', description: `IPFS URI: ${metadataUri}` });

      // TODO: Call the (currently non-existent) Zora function
      // const contractAddress = await deployZoraNftCollection(
      //   publicClient,
      //   walletClient,
      //   address,
      //   data.title,
      //   "FILM", 
      //   parseEther(data.mintPrice.toString()),
      //   data.mintLimitPerWallet,
      //   data.mintDurationDays,
      //   metadataUri
      // );
      const contractAddress = "0xZORA_CONTRACT_PLACEHOLDER"; // Placeholder
      toast({ title: 'NFT Collection Created', description: `Address: ${contractAddress}` });

      const projectData = {
        // Spread validated data first
        title: data.title,
        description: data.description,
        funding_goal: data.fundingGoalUsd, // Map fundingGoalUsd to funding_goal
        // Add other fields derived from 'data' needed for metadata/contract if they aren't implicitly covered
        // mintPrice: data.mintPrice, // Example if needed directly, though it's in metadata

        // Add generated/obtained values
        creator_wallet_address: address, // Renamed field
        collection_address: contractAddress,
        ipfs_metadata_url: metadataUri,
        image_url: uploadedImageUrl,
      };

      // Log the data being sent to Supabase for debugging
      console.log("Inserting into Supabase: ", projectData);

      const { error: dbError } = await supabase
          .from('projects')
          .insert([projectData]); // insert expects an array
      if (dbError) throw new Error(`Supabase error: ${dbError.message}`);

      toast({ title: 'Project Submitted Successfully!', variant: 'default' });
      // TODO: Redirect
    } catch (error: unknown) { // Use unknown type for error
      console.error("Submission failed:", error);
      let errorMessage = "Unknown error.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast({ title: "Submission Failed", description: errorMessage, variant: "destructive" });
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
                          <Input placeholder="My Awesome Film" {...field} />
                        </FormControl>
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
                  <FormField
                    control={form.control}
                    name="nft_media"
                    render={({ field }) => ( // field is included but value is managed by UploadButton's onClientUploadComplete
                      <FormItem>
                        <FormLabel>Project Cover Image</FormLabel>
                        <FormControl>
                          <div>
                            <UploadButton<OurFileRouter, 'imageUploader'> 
                              endpoint="imageUploader" // Matches endpoint in core.ts
                              onClientUploadComplete={handleUploadComplete}
                              onUploadError={handleUploadError}
                            />
                            {uploadedImageUrl && (
                              <div className="mt-4">
                                <p className="text-sm font-medium">Uploaded Image:</p>
                                <Image
                                  src={uploadedImageUrl}
                                  alt="Uploaded project cover"
                                  width={200} // Example width
                                  height={112} // Example height based on 16:9 aspect ratio
                                  className="rounded-md object-cover"
                                />
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                    <p><strong>Description:</strong> {form.getValues("description")}</p>
                    <p><strong>Funding Goal:</strong> ${form.getValues("fundingGoalUsd").toLocaleString()}</p>
                    <p><strong>Mint Price:</strong> {form.getValues("mintPrice")} ETH</p>
                    <p><strong>Mint Limit:</strong> {form.getValues("mintLimitPerWallet")} per wallet</p>
                    <p><strong>Mint Duration:</strong> {form.getValues("mintDurationDays")} days</p>
                    {uploadedImageUrl && (
                      <div>
                        <p><strong>Cover Image:</strong></p>
                        <Image
                          src={uploadedImageUrl}
                          alt="Project cover summary"
                          width={160} 
                          height={90} 
                          className="rounded-md object-cover"
                        />
                      </div>
                    )}
                  </div>
                  {/* Add wallet connection status/warning if needed */}
                  {!address && (
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
                      disabled={isSubmitting || !address || (walletClient && walletClient.chain.id !== base.id)}
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
