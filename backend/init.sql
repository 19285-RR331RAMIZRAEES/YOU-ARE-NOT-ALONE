-- Initialize PostgreSQL database for Hope Stories Platform

-- Create stories table
CREATE TABLE IF NOT EXISTS stories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content TEXT NOT NULL CHECK (char_length(content) >= 10 AND char_length(content) <= 10000),
    is_anonymous BOOLEAN NOT NULL DEFAULT TRUE,
    author_name VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    is_approved BOOLEAN DEFAULT TRUE,
    is_flagged BOOLEAN DEFAULT FALSE,
    view_count INTEGER DEFAULT 0,
    helpful_count INTEGER DEFAULT 0
);

-- Create indexes for better query performance
CREATE INDEX idx_stories_created_at ON stories(created_at DESC);
CREATE INDEX idx_stories_approved ON stories(is_approved) WHERE is_approved = TRUE;

-- Create function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to call the function before any UPDATE
CREATE TRIGGER trigger_update_stories_updated_at
    BEFORE UPDATE ON stories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample stories
INSERT INTO stories (content, is_anonymous, author_name, created_at) VALUES
(
    'After years of struggling with anxiety and depression, I finally found the courage to seek help. It wasn''t easy—there were days I wanted to give up. But slowly, with therapy and support from loved ones, I started to see glimpses of light. Today, I can honestly say I''m in a better place. If you''re reading this and struggling, please know: it gets better. You deserve help, and you deserve to heal.',
    TRUE,
    NULL,
    NOW() - INTERVAL '5 days'
),
(
    'I never thought I''d be able to share my story, but here I am. Every day gets a little easier. The journey has taught me that healing isn''t linear—some days are harder than others, but that''s okay. I''ve learned to be gentle with myself and celebrate small victories.',
    TRUE,
    NULL,
    NOW() - INTERVAL '8 days'
),
(
    'Reading others'' stories gave me the strength to write my own. We''re all in this together, and knowing I''m not alone has made all the difference. Thank you to this community for being a safe space where I can be vulnerable and honest. Your stories have been my light in the darkness.',
    TRUE,
    NULL,
    NOW() - INTERVAL '10 days'
);

-- Grant permissions (if needed for specific user)
GRANT ALL PRIVILEGES ON TABLE stories TO storyshare;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO storyshare;
