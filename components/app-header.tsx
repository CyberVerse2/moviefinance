"use client"; // Mark as Client Component

import React from "react"; 
import { Wallet, ConnectWallet, WalletDropdown, WalletDropdownDisconnect } from "@coinbase/onchainkit/wallet";
import {
  Avatar,
  Name,
  Address,
  Identity,
  EthBalance,
} from "@coinbase/onchainkit/identity";

export function AppHeader() {

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4">
      {/* Use justify-between for main container */}
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">

        {/* Left Group: Title and Subtitle */}
        <div>
          <h1 className="text-lg font-semibold">MovieFinance</h1>
          <p className="text-sm text-muted-foreground">
            Funding the Future of Film
          </p>
        </div>

        {/* Right Group: Buttons */}
        <div className="flex items-center space-x-4">

          {/* Wallet Connect Button - Restored full structure */}
          <Wallet className="z-10">
            <ConnectWallet>
              {/* Using Name like reference, can add Avatar back if preferred */}
              <Name className="text-inherit" />
            </ConnectWallet>
            <WalletDropdown>
              <Identity className="p-4" hasCopyAddressOnClick>
                <Avatar />
                <Name />
                <Address />
                <EthBalance />
              </Identity>
              <WalletDropdownDisconnect />
            </WalletDropdown>
          </Wallet>
        </div>

      </div>
    </header>
  );
}
