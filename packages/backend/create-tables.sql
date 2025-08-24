-- Create Tables for Bypass Tool Pro
-- Run this in Supabase SQL Editor

-- ===== CORE TABLES =====

-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT UNIQUE NOT NULL,
    permissions JSONB NOT NULL DEFAULT '[]',
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role_id TEXT NOT NULL REFERENCES roles(id),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    domain TEXT UNIQUE NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
    created_by TEXT NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== TOOL TABLES =====

-- Create keywords table
CREATE TABLE IF NOT EXISTS keywords (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    text TEXT NOT NULL,
    project_id TEXT NOT NULL REFERENCES projects(id),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'checked', 'failed')),
    position INTEGER,
    result_link TEXT,
    last_checked TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(text, project_id)
);

-- Create keyword_ranks table
CREATE TABLE IF NOT EXISTS keyword_ranks (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    position INTEGER NOT NULL,
    url TEXT NOT NULL,
    title TEXT,
    snippet TEXT,
    checked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    keyword_id TEXT NOT NULL REFERENCES keywords(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create link_positions table
CREATE TABLE IF NOT EXISTS link_positions (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    project_id TEXT NOT NULL REFERENCES projects(id),
    keyword TEXT NOT NULL,
    domain TEXT NOT NULL,
    position INTEGER,
    result_link TEXT,
    content_area TEXT,
    is_hidden BOOLEAN DEFAULT FALSE,
    hidden_method TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'checked', 'failed')),
    checked_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create xml_imports table
CREATE TABLE IF NOT EXISTS xml_imports (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    url TEXT NOT NULL,
    xpath TEXT NOT NULL,
    result TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'success', 'failed')),
    error_message TEXT,
    metadata JSONB,
    created_by TEXT NOT NULL REFERENCES users(id),
    project_id TEXT REFERENCES projects(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create keyword_analysis table
CREATE TABLE IF NOT EXISTS keyword_analysis (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    project_id TEXT NOT NULL REFERENCES projects(id),
    keyword1 TEXT NOT NULL,
    keyword2 TEXT NOT NULL,
    similarity_score DOUBLE PRECISION NOT NULL CHECK (similarity_score >= 0 AND similarity_score <= 1),
    common_results JSONB,
    is_duplicate BOOLEAN DEFAULT FALSE,
    analyzed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create schemas table
CREATE TABLE IF NOT EXISTS schemas (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    description TEXT,
    form_fields JSONB NOT NULL,
    is_public BOOLEAN DEFAULT FALSE,
    is_template BOOLEAN DEFAULT FALSE,
    version TEXT DEFAULT '1.0.0',
    created_by TEXT NOT NULL REFERENCES users(id),
    project_id TEXT REFERENCES projects(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create schema_access_controls table
CREATE TABLE IF NOT EXISTS schema_access_controls (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    schema_id TEXT NOT NULL REFERENCES schemas(id),
    role_id TEXT NOT NULL REFERENCES roles(id),
    can_read BOOLEAN DEFAULT FALSE,
    can_write BOOLEAN DEFAULT FALSE,
    can_delete BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(schema_id, role_id)
);

-- Create tags table
CREATE TABLE IF NOT EXISTS tags (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    domain TEXT NOT NULL,
    description TEXT,
    code TEXT NOT NULL,
    placement TEXT DEFAULT 'head' CHECK (placement IN ('head', 'body', 'footer')),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_by TEXT NOT NULL REFERENCES users(id),
    project_id TEXT REFERENCES projects(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== SYSTEM TABLES =====

-- Create system_configs table
CREATE TABLE IF NOT EXISTS system_configs (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL,
    type TEXT DEFAULT 'string' CHECK (type IN ('string', 'number', 'boolean', 'json')),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id TEXT REFERENCES users(id),
    action TEXT NOT NULL,
    resource TEXT NOT NULL,
    resource_id TEXT,
    details JSONB,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== INDEXES =====

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_keywords_project_id ON keywords(project_id);
CREATE INDEX IF NOT EXISTS idx_keyword_ranks_keyword_id ON keyword_ranks(keyword_id);
CREATE INDEX IF NOT EXISTS idx_link_positions_project_id ON link_positions(project_id);
CREATE INDEX IF NOT EXISTS idx_xml_imports_project_id ON xml_imports(project_id);
CREATE INDEX IF NOT EXISTS idx_keyword_analysis_project_id ON keyword_analysis(project_id);
CREATE INDEX IF NOT EXISTS idx_schemas_project_id ON schemas(project_id);
CREATE INDEX IF NOT EXISTS idx_tags_project_id ON tags(project_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- ===== SAMPLE DATA =====

-- Insert default roles
INSERT INTO roles (name, description, permissions) VALUES
('admin', 'Administrator with full access', '["*"]'),
('user', 'Regular user with limited access', '["read:own", "write:own", "delete:own"]'),
('moderator', 'Moderator with review access', '["read:all", "write:review", "delete:review"]')
ON CONFLICT (name) DO NOTHING;

-- Insert default users
INSERT INTO users (email, name, role_id) VALUES
('admin@bypass-tool.com', 'System Administrator', (SELECT id FROM roles WHERE name = 'admin')),
('demo@bypass-tool.com', 'Demo User', (SELECT id FROM roles WHERE name = 'user'))
ON CONFLICT (email) DO NOTHING;

-- Insert system configs
INSERT INTO system_configs (key, value, type, description) VALUES
('app_name', 'Bypass Tool Pro', 'string', 'Application name'),
('max_keywords_per_project', '1000', 'number', 'Maximum keywords per project'),
('enable_audit_logging', 'true', 'boolean', 'Enable audit logging')
ON CONFLICT (key) DO NOTHING;

-- ===== ROW LEVEL SECURITY (RLS) =====

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE keyword_ranks ENABLE ROW LEVEL SECURITY;
ALTER TABLE link_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE xml_imports ENABLE ROW LEVEL SECURITY;
ALTER TABLE keyword_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE schemas ENABLE ROW LEVEL SECURITY;
ALTER TABLE schema_access_controls ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (basic policies - can be customized later)
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid()::text = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid()::text = id);

CREATE POLICY "Users can view own projects" ON projects FOR SELECT USING (created_by = auth.uid()::text);
CREATE POLICY "Users can create projects" ON projects FOR INSERT WITH CHECK (created_by = auth.uid()::text);
CREATE POLICY "Users can update own projects" ON projects FOR UPDATE USING (created_by = auth.uid()::text);

-- ===== FUNCTIONS =====

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_keywords_updated_at BEFORE UPDATE ON keywords FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_keyword_ranks_updated_at BEFORE UPDATE ON keyword_ranks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_link_positions_updated_at BEFORE UPDATE ON link_positions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_xml_imports_updated_at BEFORE UPDATE ON xml_imports FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_keyword_analysis_updated_at BEFORE UPDATE ON keyword_analysis FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_schemas_updated_at BEFORE UPDATE ON schemas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_schema_access_controls_updated_at BEFORE UPDATE ON schema_access_controls FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tags_updated_at BEFORE UPDATE ON tags FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_system_configs_updated_at BEFORE UPDATE ON system_configs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===== COMPLETION =====

-- Grant permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Grant permissions to anon users (for public data)
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON system_configs TO anon;

COMMENT ON TABLE roles IS 'User roles and permissions';
COMMENT ON TABLE users IS 'System users';
COMMENT ON TABLE projects IS 'SEO projects';
COMMENT ON TABLE keywords IS 'Keywords to track';
COMMENT ON TABLE keyword_ranks IS 'Keyword ranking history';
COMMENT ON TABLE link_positions IS 'Link position checking results';
COMMENT ON TABLE xml_imports IS 'XML import results';
COMMENT ON TABLE keyword_analysis IS 'Keyword similarity analysis';
COMMENT ON TABLE schemas IS 'Schema markup templates';
COMMENT ON TABLE schema_access_controls IS 'Schema access permissions';
COMMENT ON TABLE tags IS 'Tracking tags and scripts';
COMMENT ON TABLE system_configs IS 'System configuration';
COMMENT ON TABLE audit_logs IS 'Audit trail';

SELECT 'Database schema created successfully!' as status;
