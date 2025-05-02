import { NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '@/lib/supabaseClient'; // Import your Supabase client

// Define the expected shape of the request body
// Matches the form structure + the metadata URI
const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  imageUrl: z.string().url('Image URL must be a valid URL').optional().or(z.literal('')), // Optional but must be URL if provided
  fundingGoalUsd: z.coerce.number().positive('Funding goal must be positive'), // Coerce string input to number
  metadataUri: z.string().url('Metadata URI must be a valid URL'), // Assuming IPFS URI format like ipfs://...
  creatorWalletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid wallet address'), // Basic check for ETH address format
  // Note: Zora contract address will be added later in a separate step/update
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate request body
    const validation = projectSchema.safeParse(body);
    if (!validation.success) {
      console.error('Save Project Validation Error:', validation.error.flatten());
      return NextResponse.json({ error: 'Invalid input', details: validation.error.flatten() }, { status: 400 });
    }

    const { 
      title,
      description,
      imageUrl,
      fundingGoalUsd,
      metadataUri,
      creatorWalletAddress 
    } = validation.data;

    // --- TODO: Security Enhancement ---
    // 1. Authentication: Ensure this route is protected and only authenticated users can call it.
    // 2. Wallet Address Verification: Instead of trusting the client-sent `creatorWalletAddress`,
    //    get the authenticated user's address from the server-side session/context.
    // 3. Service Role Key: For operations bypassing RLS or administrative tasks, 
    //    consider creating a separate Supabase client using the Service Role Key.
    //    See Supabase docs for creating admin clients in Next.js Route Handlers.
    // --- End of TODO ---

    // Insert data into Supabase
    // Assumes your 'projects' table has columns matching these names
    // and RLS is configured to allow authenticated users to insert.
    const { data, error } = await supabase
      .from('projects')
      .insert([
        {
          title,
          description,
          image_url: imageUrl,
          funding_goal: fundingGoalUsd, // Match schema column name 'funding_goal'
          metadata_uri: metadataUri,
          creator_wallet_address: creatorWalletAddress,
          // zora_contract_address: null // Will be updated later
        },
      ])
      .select('id') // Return the ID of the newly created project
      .single(); // Expecting a single row back

    if (error) {
      console.error('Supabase Insert Error:', error);
      // Provide more specific feedback based on error code if possible
      return NextResponse.json({ error: 'Failed to save project to database.', details: error.message }, { status: 500 });
    }

    if (!data) {
        console.error('Supabase Insert Error: No data returned after insert.');
        return NextResponse.json({ error: 'Failed to save project: No confirmation ID received.' }, { status: 500 });
    }

    console.log('Project saved successfully. ID:', data.id);
    return NextResponse.json({ projectId: data.id }, { status: 201 }); // 201 Created status

  } catch (error) {
    console.error('Save Project Error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input format.', details: error.flatten() }, { status: 400 });
    }
    if (error instanceof SyntaxError && error.message.includes('JSON')) {
       return NextResponse.json({ error: 'Invalid JSON format in request body.' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
