-- Create the projects table
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    title TEXT NOT NULL,
    logline TEXT,
    description TEXT,
    funding_goal NUMERIC DEFAULT 0,
    creator_wallet_address TEXT NOT NULL, -- Consider adding constraint check for 0x prefix and length 42
    metadata_uri TEXT, -- e.g., ipfs://<CID>
    zora_contract_address TEXT, -- e.g., 0x... address on Base Sepolia
    image_url TEXT -- URL to the project image (e.g., from Supabase Storage or IPFS)
);

-- Create the investments table
CREATE TABLE IF NOT EXISTS investments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE, -- Link to the project
    investor_wallet_address TEXT NOT NULL, -- Wallet address of the investor
    amount_wei NUMERIC NOT NULL, -- Investment amount stored in Wei (as numeric for precision)
    tx_hash TEXT -- Optional: Store the blockchain transaction hash
);

-- Optional: Add indexes for frequently queried columns
CREATE INDEX IF NOT EXISTS idx_projects_creator_wallet ON projects(creator_wallet_address);
CREATE INDEX IF NOT EXISTS idx_investments_project_id ON investments(project_id);
CREATE INDEX IF NOT EXISTS idx_investments_investor_wallet ON investments(investor_wallet_address);

-- Optional: Row Level Security (RLS) - Recommended for production
-- Enable RLS for both tables
-- ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE investments ENABLE ROW LEVEL SECURITY;

-- Example RLS Policies (adjust based on your auth rules):
-- Allow public read access for projects
-- CREATE POLICY "Allow public read access" ON projects FOR SELECT USING (true);

-- Allow authenticated users to insert their own investments
-- CREATE POLICY "Allow insert for authenticated users" ON investments FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow users to read their own investments
-- CREATE POLICY "Allow individual read access" ON investments FOR SELECT USING (auth.uid() = (SELECT user_id FROM profiles WHERE wallet_address = investor_wallet_address)); -- Assuming a profiles table linking auth.uid() to wallet_address
