"use client";

import { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form"; // Re-add SubmitHandler for cast
import { z } from "zod";
import { Button } from "@/app/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/app/components/ui/form";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { useToast } from "@/app/components/ui/use-toast";
import { ArrowLeft, ArrowRight } from 'lucide-react'; 
import { Label } from "@/app/components/ui/label";
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import { createCoin } from '@zoralabs/coins-sdk';
import { baseSepolia } from 'viem/chains';
import { Address, parseEther } from 'viem'; 
import { Checkbox } from "@/app/components/ui/checkbox";

// Define the form schema using Zod
const projectFormSchema = z.object({
  title: z.string().min(3, {
    message: 'Title must be at least 3 characters.',
  }),
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters.',
  }),
  imageUrl: z.string().url({ message: 'Please enter a valid URL.' }).optional().or(z.literal('')), 
  fundingGoalUsd: z.coerce 
    .number({
      required_error: 'Funding goal is required',
      invalid_type_error: 'Funding goal must be a number',
    })
    .positive({ message: 'Funding goal must be positive.' }),
  mintPrice: z.coerce.number().nonnegative({ message: "Mint price cannot be negative." }).default(0.001), // Price in ETH
  mintLimitPerWallet: z.coerce.number().int().positive({ message: "Mint limit must be a positive whole number." }).default(10),
  mintDurationDays: z.coerce.number().int().positive({ message: "Mint duration must be a positive whole number of days." }).default(7),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

// Default values for the form
const defaultValues: Partial<ProjectFormValues> = {
  title: '',
  description: '',
  imageUrl: '',
  fundingGoalUsd: 0, 
  mintPrice: 0.001,
  mintLimitPerWallet: 10,
  mintDurationDays: 7,
};

export default function CreateProjectPage() {
  const { address } = useAccount();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1)
  const { toast } = useToast();
  const publicClient = usePublicClient({ chainId: baseSepolia.id });
  const { data: walletClient } = useWalletClient();

  const nextStep = async () => {
    const isValid = await form.trigger(); 
    if (isValid) {
       setStep(step + 1)
    }
  }

  const prevStep = () => {
    setStep(step - 1)
  }

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues,
    mode: 'onChange', 
  });

  // Removed unused event parameter
  function onStepSubmit(data: ProjectFormValues) {
    console.log(`Data validated for Step ${step}:`, data);
    if (step < 4) { 
        nextStep();
    }
  }

  async function handleFinalSubmit() {
    if (!address) {
      console.error('No connected wallet address found.');
      toast({
        title: 'Error: Wallet Not Connected',
        description: 'Please connect your wallet (and ensure it matches the logged-in account) before submitting.',
        variant: 'destructive',
      });
      return;
    }

    if (!walletClient) {
      toast({
        title: 'Error: Wallet Not Ready',
        description: 'Wallet client is not available. Ensure your wallet is connected and ready.',
        variant: 'destructive',
      });
      return;
    }

    if (walletClient.chain.id !== baseSepolia.id) {
      toast({
        title: 'Error: Wrong Network',
        description: `Please switch your connected wallet to Base Sepolia (ID: ${baseSepolia.id}).`,
        variant: 'destructive',
      });
      return; 
    }

    const isValid = await form.trigger();
    if (!isValid) {
      toast({
        title: 'Error: Validation Failed',
        description: 'Please check the form for errors.',
        variant: 'destructive',
      });
      return;
    }

    const formData = form.getValues();
    setIsSubmitting(true);
    const toastRef = toast({ 
        title: 'Processing Project Submission...', 
        description: 'Saving details and deploying your Zora coin. Please wait.',
        duration: null, 
    });
    const updateToast = toastRef.update; 

    try {
      const saveResponse = await fetch('/api/save-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          image_url: formData.imageUrl,
          funding_goal: formData.fundingGoalUsd, 
          creator_wallet_address: address,
        }),
      });
      const saveData = await saveResponse.json();
      if (!saveResponse.ok) {
          throw new Error(`Failed to save project details: ${saveData.error || saveResponse.statusText}`);
      }
      const { projectId, metadataUri } = saveData; 
      if (!projectId || !metadataUri) {
          throw new Error('Missing projectId or metadataUri from save-project response.');
      }
      console.log('Project saved:', projectId, 'Metadata URI:', metadataUri);

      if (!publicClient) {
        toast({
            title: 'Error: Network Client Error',
            description: 'Could not get a client for the required network. Please check your connection.',
            variant: 'destructive',
          });
        setIsSubmitting(false);
        return;
      }

      const coinName = `${formData.title} Film Coin`;
      const safeProjectId = String(projectId);
      const coinSymbol = `P${safeProjectId.substring(0, 4).toUpperCase()}FC`;

      const mintDurationSeconds = BigInt(formData.mintDurationDays * 86400); // Convert days to seconds
      const maxSupply = BigInt("18446744073709551615"); // Max uint64 for unbounded supply
      const mintLimitPerWalletBigInt = BigInt(formData.mintLimitPerWallet);
      const mintPriceWei = parseEther(String(formData.mintPrice)); // Convert ETH string/number to wei BigInt

      const coinParams = {
        name: coinName,
        symbol: coinSymbol,
        uri: metadataUri, 
        payoutRecipient: address as Address, 
        initialPurchaseWei: 0n, 
        mintPrice: mintPriceWei,
        mintLimitPerWallet: mintLimitPerWalletBigInt,
        mintDurationSeconds: mintDurationSeconds,
        maxSupply: maxSupply,
      };

      console.log('Calling createCoin SDK with params:', coinParams);
      const result = await createCoin(coinParams, walletClient, publicClient); 
      console.log('Zora Coin creation successful:', result);
      const newCoinAddress = result.address;
      if (!newCoinAddress) {
          throw new Error('Coin creation transaction succeeded, but no contract address was returned.');
      }

      const updateResponse = await fetch('/api/create-zora-coin', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: projectId, 
          zoraContractAddress: newCoinAddress, 
        }),
      });
      const updateData = await updateResponse.json();
      if (!updateResponse.ok) {
          console.error(`Failed to update project ${projectId} with coin address ${newCoinAddress}: ${updateData.error || updateResponse.statusText}`);
          updateToast({ 
              title: ' Project Created, Update Failed',
              description: `Coin ${newCoinAddress} created, but failed to link it in DB. Please contact support.`,
              variant: 'destructive', 
              duration: 10000 
          });
          throw new Error(`Failed to update project with coin address: ${updateData.error || updateResponse.statusText}`);
      }
       console.log(`Successfully updated project ${projectId} with Zora address ${newCoinAddress}`);


      updateToast({ 
        title: ' Project Created Successfully!',
        description: `Your Zora coin is deployed at ${newCoinAddress}.`,
        variant: 'success', 
        duration: 9000, 
      });
    } catch (error: unknown) { 
      console.error('Final Submission Error:', error);
      let errorMessage = 'An unexpected error occurred.';
      if (error instanceof Error) {
          if (error.message.includes('User rejected the request')) {
              errorMessage = 'Transaction rejected in wallet.';
          } else if (error.message.includes('insufficient funds')) {
              errorMessage = 'Insufficient funds for transaction.';
          } else {
              errorMessage = error.message;
          }
      } else if (typeof error === 'string') {
         errorMessage = error;
      }

      updateToast({ 
        title: ' Error During Project Creation',
        description: errorMessage,
        variant: 'destructive',
        duration: 9000,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto max-w-4xl py-12 px-4 md:px-6">
      {/* Basic Step Indicator (can be enhanced) */}
      <div className="mb-8 flex justify-center space-x-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex flex-col items-center">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${step === i ? "border-red-600 text-red-600" : step > i ? "border-green-500 bg-green-500 text-white" : "border-gray-300 text-gray-400"}`}
            >
              {step > i ? '✓' : i}
            </div>
            <span className={`mt-1 text-xs ${step === i ? "text-red-600" : "text-muted-foreground"}`}>
              {i === 1 ? "Details" : i === 2 ? "Tokens" : i === 3 ? "Media" : "Review"}
            </span>
          </div>
        ))}
      </div>

      {/* Step 1: Project Details */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Project Details</CardTitle>
            <CardDescription>Tell us about your film project.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onStepSubmit as SubmitHandler<ProjectFormValues>)} className="space-y-6">
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
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description / Logline</FormLabel>
                      <FormControl>
                        <Textarea placeholder="A brief summary..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fundingGoalUsd"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Funding Goal (USD)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="50000" {...field} onChange={event => field.onChange(+event.target.value)} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end">
                  <Button type="submit" className="bg-red-600 hover:bg-red-700">
                    Next Step <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Token Economics */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 2: Token Economics</CardTitle>
            <CardDescription>What&apos;s the mint price, limit per wallet, and duration?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="mintPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mint Price (ETH)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.0001" placeholder="e.g., 0.001" {...field} />
                  </FormControl>
                  <FormDescription>
                    The price to mint one token. Set to 0 for a free mint.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mintLimitPerWallet"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mint Limit Per Wallet</FormLabel>
                  <FormControl>
                    <Input type="number" step="1" placeholder="e.g., 10" {...field} />
                  </FormControl>
                  <FormDescription>
                    Maximum number of tokens one wallet address can mint.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mintDurationDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mint Duration (Days)</FormLabel>
                  <FormControl>
                    <Input type="number" step="1" placeholder="e.g., 7" {...field} />
                  </FormControl>
                  <FormDescription>
                    How long the public minting phase will last.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-between">
              <Button onClick={prevStep} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" /> Previous Step
              </Button>
              <Button onClick={nextStep} className="bg-red-600 hover:bg-red-700">
                Next Step <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Media & Team (Placeholder) */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 3: Media Upload</CardTitle>
            <CardDescription>Upload your project&apos;s poster image (Placeholder).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <p className="text-muted-foreground">[Media uploaders and team member fields would go here]</p>
             {/* Add relevant components here */}
            <div className="flex justify-between">
              <Button onClick={prevStep} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" /> Previous Step
              </Button>
              <Button onClick={nextStep} className="bg-red-600 hover:bg-red-700">
                Next Step <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Review & Submit */}
      {step === 4 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 4: Review & Submit</CardTitle>
            <CardDescription>Review your project details before creating it onchain.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
             {/* Display summary of data - using form.getValues() */}
             <div className="space-y-2 rounded-lg border p-4">
                <h3 className="font-semibold">Project Summary</h3>
                <p><strong>Title:</strong> {form.getValues('title')}</p>
                <p><strong>Description:</strong> {form.getValues('description')}</p>
                <p><strong>Funding Goal:</strong> ${form.getValues('fundingGoalUsd')}</p>
                <p><strong>Image URL:</strong> {form.getValues('imageUrl') || 'N/A'}</p>
                <p><strong>Creator Wallet:</strong> {address}</p>
                <p className="text-muted-foreground text-sm">(Add summaries for Steps 2 & 3 data here)</p>
             </div>

            {/* Agreement Checkbox */}
             <div className="flex items-start space-x-2 rounded-lg border p-4 bg-muted/50">
                <Checkbox id="terms" required />
                <div className="grid gap-1.5 leading-none">
                    <Label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Accept terms and conditions
                    </Label>
                    <p className="text-sm text-muted-foreground">
                        You agree to our Terms of Service and confirm all details are accurate.
                    </p>
                </div>
             </div>

            <div className="flex justify-between">
              <Button onClick={prevStep} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" /> Previous Step
              </Button>
              <Button type="button" onClick={handleFinalSubmit} disabled={isSubmitting} className="bg-red-600 hover:bg-red-700">
                {isSubmitting ? 'Submitting...' : 'Confirm & Submit Project'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
