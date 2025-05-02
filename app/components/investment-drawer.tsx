"use client";

import React from "react";
import {
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/app/components/ui/drawer";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Coins } from "lucide-react";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { useAccount, useBalance, useWriteContract } from 'wagmi';
import { formatUnits, parseUnits, erc20Abi } from "viem";
import { toast } from "sonner";

// Define Base USDC address (replace if using a different token)
const USDC_ADDRESS_BASE = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
const PROJECT_TREASURY_ADDRESS = "0xd09e70C83185E9b5A2Abd365146b58Ef0ebb8B7B"; // <<< --- IMPORTANT: Replace this placeholder
const USDC_DECIMALS = 6;

interface InvestmentDrawerProps {
  tokenSymbol: string;
  onOpenChange: (open: boolean) => void; // Add prop for controlling open state
  // TODO: Potentially pass the actual investment token address as a prop
}

export function InvestmentDrawer({ tokenSymbol, onOpenChange }: InvestmentDrawerProps) {
  const [amount, setAmount] = React.useState("");
  const { context } = useMiniKit(); // Get MiniKit context
  const { address } = useAccount(); // Get address via wagmi (should be synced by MiniKitProvider)

  // Log context for debugging (can be removed later)
  React.useEffect(() => {
    console.log("MiniKit Context:", context);
    console.log("Wagmi Address:", address);
  }, [context, address]);

  // Fetch USDC balance using wagmi
  const { data: balanceData, isLoading: isBalanceLoading } = useBalance({
    address: address, // Use the address obtained from wagmi/MiniKit
    token: USDC_ADDRESS_BASE, // Specify the token address
    // chainId: base.id // Optional: Ensure it's checking on Base (usually inferred)
  });

  // Wagmi hook for writing to the contract
  const { data: hash, error, isPending, writeContract } = useWriteContract();

  // Handle successful transaction
  React.useEffect(() => {
    if (hash) {
      toast.success(`Investment successful!`, {
        description: `Transaction Hash: ${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`,
        action: {
          label: "View Tx",
          onClick: () => window.open(`https://basescan.org/tx/${hash}`, '_blank'), // Open Basescan in new tab
        },
      });
      setAmount(""); // Clear input
      onOpenChange(false); // Call the setter passed from parent
    }
  }, [hash, onOpenChange]);

  // Handle transaction error
  React.useEffect(() => {
    if (error) {
      // Attempt to parse a more user-friendly error message
      let errorMessage = "Transaction failed. Please try again.";
      if (error.message) {
        if (error.message.includes('User rejected the request')) {
          errorMessage = 'Transaction rejected in wallet.';
        } else if (error.message.includes('insufficient funds')) {
          errorMessage = 'Insufficient funds for transaction.';
        }
        // Add more specific error checks if needed
      }
      toast.error(errorMessage, {
        description: error.message ? error.message.substring(0, 100) : 'An unknown error occurred.', // Show truncated message
      });
    }
  }, [error]);

  const formattedBalance = balanceData
    ? parseFloat(formatUnits(balanceData.value, balanceData.decimals)).toFixed(2)
    : "0.00";

  const handleInvest = () => {
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0 || !address) {
      let validationError = "Invalid input.";
      if (!amount || parseFloat(amount) <= 0) {
        validationError = "Please enter a valid investment amount.";
      } else if (!address) {
        validationError = "Wallet not connected.";
      }
      toast.error(validationError);
      return;
    }

    try {
      const amountBigInt = parseUnits(amount, USDC_DECIMALS);
      console.log(`Attempting to invest ${amount} USDC (${amountBigInt}) to ${PROJECT_TREASURY_ADDRESS}`);

      writeContract({
        address: USDC_ADDRESS_BASE,
        abi: erc20Abi, // Use standard ERC20 ABI from viem
        functionName: 'transfer',
        args: [PROJECT_TREASURY_ADDRESS, amountBigInt],
      });
    } catch (e) { // eslint-disable-line @typescript-eslint/no-unused-vars
      console.error("Error preparing transaction:", e);
      toast.error("Error preparing transaction. Please check console.");
    }
  };

  return (
    // Note: The DrawerTrigger is typically placed outside this component,
    // where the button to open the drawer resides (e.g., in project details page).
    // This component mainly defines the DrawerContent.
    // We might refactor this later if needed.
    <DrawerContent>
      <div className="mx-auto w-full max-w-sm">
        <DrawerHeader>
          <DrawerTitle>Invest in Project</DrawerTitle>
          <DrawerDescription>
            Enter the amount you wish to invest in {tokenSymbol} tokens.
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-4 pb-0">
          <div className="flex items-center justify-center space-x-2">
            {/* TODO: Add user balance display (Task 6.4) */}
            <Input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-lg"
            />
          </div>
          {/* Display Balance Info */}
          <div className="mt-3 h-[20px]">
            <p className="text-xs text-muted-foreground">
              {isBalanceLoading
                ? "Loading balance..."
                : `Your Balance: ${formattedBalance} ${balanceData?.symbol || 'USDC'}`}
            </p>
          </div>
        </div>
        <DrawerFooter>
          <Button 
            onClick={handleInvest} 
            disabled={isPending || !amount || parseFloat(amount) <= 0 || !address} // Also disable if no address
            className="bg-green-600 hover:bg-green-700"
          >
            <Coins className="w-4 h-4 mr-2" /> {isPending ? 'Investing...' : 'Invest'}
          </Button>
          <DrawerClose asChild> 
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </div>
    </DrawerContent>
  );
}
