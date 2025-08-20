# Database Setup Guide

## Free Database Options

### 1. Supabase (Recommended)
- **URL**: [supabase.com](https://supabase.com)
- **Free Tier**: 500MB database, 2GB bandwidth
- **Setup**:
  1. Create account and new project
  2. Go to Settings > Database
  3. Copy connection string
  4. Update DATABASE_URL in .env

### 2. Neon
- **URL**: [neon.tech](https://neon.tech)
- **Free Tier**: 3GB storage, unlimited compute
- **Setup**:
  1. Create account and new project
  2. Copy connection string
  3. Update DATABASE_URL in .env

### 3. Railway
- **URL**: [railway.app](https://railway.app)
- **Free Tier**: $5 credit monthly
- **Setup**:
  1. Create account and new project
  2. Add PostgreSQL service
  3. Copy connection string
  4. Update DATABASE_URL in .env

## Local Development

### Using Docker (Recommended)
```bash
# Start PostgreSQL container
docker run --name bypass-tool-pro-db \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=bypass_tool_pro \
  -p 5432:5432 \
  -d postgres:15

# Stop container
docker stop bypass-tool-pro-db

# Remove container
docker rm bypass-tool-pro-db
```

### Connection String Format
```
postgresql://username:password@host:port/database?schema=public
```

## Database Migration

After setting up the database:

1. **Install Prisma CLI** (if not already installed):
   ```bash
   cd packages/backend
   pnpm prisma generate
   ```

2. **Run Migration**:
   ```bash
   pnpm prisma migrate dev --name init
   ```

3. **Seed Database** (optional):
   ```bash
   pnpm prisma db seed
   ```

## Environment Variables

Update your `.env` file with the correct DATABASE_URL:

```env
# For local Docker
DATABASE_URL="postgresql://postgres:password@localhost:5432/bypass_tool_pro?schema=public"

# For Supabase
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# For Neon
DATABASE_URL="postgresql://[USER]:[PASSWORD]@[HOST]/[DBNAME]?sslmode=require"
```

## Troubleshooting

1. **Connection Refused**: Check if database is running and port is correct
2. **Authentication Failed**: Verify username/password in connection string
3. **SSL Required**: Add `?sslmode=require` for cloud databases
4. **Migration Errors**: Ensure database user has CREATE privileges
