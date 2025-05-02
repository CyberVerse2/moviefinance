import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '@/lib/supabaseClient';

// Environment Variables Validation - Keep Supabase, remove others if unused elsewhere
const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
});

const env = envSchema.safeParse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
});

if (!env.success) {
  console.error('Invalid environment variables for /api/create-zora-coin:', env.error.flatten().fieldErrors);
  // Throw an error or handle appropriately; server cannot start reliably.
  // For now, we'll log and potentially allow it to fail later, but this should be stricter.
}

// Define the expected shape of the request body for updating Supabase
const updateCoinSchema = z.object({
  projectId: z.string().uuid('Invalid Project ID'),
  zoraContractAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Zora contract address'),
});

export async function POST(req: NextRequest) {
  // Environment variable check (optional here if checked globally)
  if (!env.success) {
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  let requestBody;
  try {
    requestBody = await req.json();
  } catch /* (error) */ {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const validation = updateCoinSchema.safeParse(requestBody);

  if (!validation.success) {
    console.error('Update Zora Address Validation Error:', validation.error.flatten());
    return NextResponse.json({ error: 'Validation failed', details: validation.error.flatten().fieldErrors }, { status: 400 });
  }

  const { projectId, zoraContractAddress } = validation.data;

  try {
    // Update the project record in Supabase with the Zora contract address
    const { error: updateError } = await supabase
      .from('projects')
      .update({ zora_contract_address: zoraContractAddress })
      .eq('id', projectId);

    if (updateError) {
      console.error('Supabase Update Error:', updateError);
      return NextResponse.json({ error: 'Failed to update project with Zora address.', details: updateError.message }, { status: 500 });
    }

    console.log(`Successfully updated project ${projectId} with Zora address ${zoraContractAddress}`);
    return NextResponse.json({ message: 'Project updated successfully' }, { status: 200 });

  } catch (error: unknown) {
    console.error('Error updating Zora address:', error);
    const statusCode = 500;
    let errorMessage = 'Internal Server Error';

    // Type checks for specific errors
    if (error instanceof z.ZodError) { // Should be caught by initial validation, but good practice
        errorMessage = 'Invalid input format during processing.';
        return NextResponse.json({ error: errorMessage, details: error.flatten() }, { status: 400 });
    }
    // Check if it's a standard Error object to safely access message
    if (error instanceof Error) {
        errorMessage = error.message;
    }

    // Return generic 500 error with potentially more specific message
    return NextResponse.json({ error: 'Failed to update project Zora address', details: errorMessage }, { status: statusCode });
  }
}
