-- Migration 007: Error Logs Table for CodeLift Platform
CREATE TABLE IF NOT EXISTS public.error_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    level VARCHAR(20) NOT NULL DEFAULT 'error', -- 'error', 'warn', 'fatal'
    message TEXT NOT NULL,
    stack TEXT,
    context JSONB DEFAULT '{}'::jsonb,
    source VARCHAR(100) DEFAULT 'client',
    url TEXT,
    user_id TEXT,
    user_role VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_error_logs_created_at ON public.error_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_error_logs_level ON public.error_logs (level);

-- Row Level Security
ALTER TABLE public.error_logs ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'error_logs' AND policyname = 'Allow public access on error_logs'
    ) THEN
        CREATE POLICY "Allow public access on error_logs" 
        ON public.error_logs 
        FOR ALL 
        USING (true) 
        WITH CHECK (true);
    END IF;
END $$;
