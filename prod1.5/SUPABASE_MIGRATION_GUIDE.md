# Supabase Database Migration Guide

## Overview
This guide will help you migrate your Django application from MySQL to Supabase (PostgreSQL). Your application has 21 models including User, Exercise, Workout, Meal, and Gamification features.

---

## Prerequisites
- [ ] Supabase account (free tier available at [supabase.com](https://supabase.com))
- [ ] Backup of your current MySQL database
- [ ] Python environment with required packages
- [ ] Access to your Django application

---

## Step 1: Create Supabase Project

### 1.1 Sign Up and Create Project
1. Go to [supabase.com](https://supabase.com) and sign up/log in
2. Click "New Project"
3. Fill in project details:
   - **Name**: `synchron-db` (or your preferred name)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier is fine to start
4. Wait for project to initialize (2-3 minutes)

### 1.2 Get Connection Details
1. Go to **Project Settings** → **Database**
2. Copy these values (you'll need them later):
   - **Host**: `db.xxxxxxxxxxxxxxxx.supabase.co`
   - **Database name**: `postgres`
   - **Port**: `5432`
   - **User**: `postgres`
   - **Password**: (the one you created)
   - **Connection String**: Also available for reference

---

## Step 2: Update Django Dependencies

### 2.1 Install PostgreSQL Adapter
Add to your `requirements.txt`:
```txt
psycopg2-binary==2.9.9
```

### 2.2 Install the package
```bash
source venv/bin/activate
pip install psycopg2-binary
```

---

## Step 3: Configure Django for Supabase

### 3.1 Update Environment Variables
Add these to your `.env` file:
```ini
# Supabase Database Configuration
SUPABASE_DB_NAME=postgres
SUPABASE_DB_USER=postgres
SUPABASE_DB_PASSWORD=your_supabase_password_here
SUPABASE_DB_HOST=db.xxxxxxxxxxxxxxxx.supabase.co
SUPABASE_DB_PORT=5432

# Set to use Supabase
USE_SUPABASE=TRUE
```

### 3.2 Update Django Settings
Update your `synchron/synchron/settings.py` database configuration:

```python
# Add this near the top with other imports
USE_SUPABASE = os.getenv('USE_SUPABASE') == 'TRUE'

# Update DATABASES configuration
if USE_SUPABASE:
    # Supabase (PostgreSQL) Database
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': os.getenv('SUPABASE_DB_NAME', 'postgres'),
            'USER': os.getenv('SUPABASE_DB_USER', 'postgres'),
            'PASSWORD': os.getenv('SUPABASE_DB_PASSWORD'),
            'HOST': os.getenv('SUPABASE_DB_HOST'),
            'PORT': os.getenv('SUPABASE_DB_PORT', '5432'),
            'OPTIONS': {
                'sslmode': 'require',  # Supabase requires SSL
            }
        }
    }
elif 'DB_NAME' in os.environ:
    # Production MySQL Database
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.mysql',
            'NAME': config['MySQL_PROD']['MYSQL_DATABASE_PROD'],
            'USER': config['MySQL_PROD']['MYSQL_USER_PROD'],
            'PASSWORD': config['MySQL_PROD']['MYSQL_PASSWORD_PROD'],
            'HOST': config['MySQL_PROD']['MYSQL_HOST_PROD'],
            'PORT': config['MySQL_PROD']['MYSQL_PORT_PROD']
        }
    }
else:
    # Local MySQL Database
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.mysql',
            'NAME': config['MySQL']['MYSQL_DATABASE'],
            'USER': config['MySQL']['MYSQL_USER'],
            'PASSWORD': config['MySQL']['MYSQL_PASSWORD'],
            'HOST': config['MySQL']['MYSQL_HOST'],
            'PORT': config['MySQL']['MYSQL_PORT']
        }
    }
```

---

## Step 4: Handle MySQL to PostgreSQL Differences

### 4.1 Known Incompatibilities to Fix

#### Issue 1: AutoField vs BigAutoField
PostgreSQL recommends BigAutoField. Django 3.2+ uses this by default.
- ✅ Already configured in your `settings.py`:
  ```python
  DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
  ```

#### Issue 2: JSONField
- Django's `models.JSONField` works differently in PostgreSQL vs MySQL
- ✅ Your models use it correctly (Exercise, Achievement, Badge, etc.)

#### Issue 3: CharField max_length
- PostgreSQL is more strict about field types
- ✅ Your models look good

#### Issue 4: DecimalField precision
- Review all DecimalField declarations
- Your current ones: `max_digits=5, decimal_places=2` should work fine

---

## Step 5: Export Current MySQL Data

### 5.1 Backup Current Database
```bash
# Create a backup directory
mkdir -p database_backups

# Export MySQL database
mysqldump -u your_mysql_user -p your_database_name > database_backups/mysql_export_$(date +%Y%m%d_%H%M%S).sql
```

### 5.2 Export Data as JSON (Django way - RECOMMENDED)
This is the best method for cross-database migration:

```bash
# Activate your virtual environment
source venv/bin/activate
cd synchron

# Export all data to JSON
python manage.py dumpdata --natural-foreign --natural-primary \
  --exclude auth.permission \
  --exclude contenttypes \
  --indent 2 > ../database_backups/django_data_$(date +%Y%m%d_%H%M%S).json
```

---

## Step 6: Create Schema in Supabase

### 6.1 Create Fresh Migrations (Optional but Recommended)
If you want a clean migration setup:

```bash
cd synchron

# Remove old migration files (BACKUP FIRST!)
# Keep __init__.py files
rm -rf core/migrations/0*.py

# Create initial migration
python manage.py makemigrations

# Review the migration file created
```

### 6.2 Run Migrations on Supabase

```bash
# Make sure USE_SUPABASE=TRUE in your .env file
export USE_SUPABASE=TRUE

# Run migrations
python manage.py migrate

# This will create all tables in your Supabase database
```

### 6.3 Verify Tables in Supabase Dashboard

1. Go to Supabase Dashboard → **Table Editor**
2. You should see all your tables:
   - auth_user (Django's base user table)
   - core_user (your custom user fields)
   - core_exercise
   - core_workout
   - core_workoutplan
   - core_meal
   - core_bodymeasurementlog
   - core_nutritionmacro
   - And all other models...

---

## Step 7: Import Data to Supabase

### 7.1 Load Django JSON Data
This is the safest method:

```bash
cd synchron

# Load the data
python manage.py loaddata ../database_backups/django_data_YYYYMMDD_HHMMSS.json
```

### 7.2 Handle Potential Issues

#### Issue: Content Types
If you get content type errors:
```bash
# Load in specific order
python manage.py loaddata --exclude auth.permission --exclude contenttypes \
  ../database_backups/django_data_YYYYMMDD_HHMMSS.json
```

#### Issue: Foreign Key Constraints
If foreign key errors occur:
```bash
# Disable constraints temporarily (PostgreSQL)
python manage.py shell

from django.db import connection
cursor = connection.cursor()
cursor.execute('SET CONSTRAINTS ALL DEFERRED;')

# Then load data
exit()
python manage.py loaddata your_data.json
```

---

## Step 8: Create Supabase Users (Optional)

### 8.1 Supabase Auth Integration
If you want to use Supabase Auth instead of Django's auth:

1. Go to **Authentication** → **Providers** in Supabase Dashboard
2. Enable Email, Google, Apple providers
3. Install Supabase Python client:
   ```bash
   pip install supabase
   ```

### 8.2 Keep Django Auth (Recommended for now)
Your current JWT authentication will work fine. You can migrate to Supabase Auth later.

---

## Step 9: Update Application Configuration

### 9.1 Update Docker Configuration (if using Docker)

Update `docker-compose-prod.yaml`:
```yaml
services:
  web:
    environment:
      - USE_SUPABASE=TRUE
      - SUPABASE_DB_NAME=postgres
      - SUPABASE_DB_USER=postgres
      - SUPABASE_DB_PASSWORD=${SUPABASE_DB_PASSWORD}
      - SUPABASE_DB_HOST=${SUPABASE_DB_HOST}
      - SUPABASE_DB_PORT=5432
```

### 9.2 Update Cloud Run / GCP Configuration
If deploying to GCP, add Supabase credentials to Secret Manager.

---

## Step 10: Testing the Migration

### 10.1 Run Django Tests
```bash
python manage.py test core
```

### 10.2 Test Critical Endpoints

#### Test User Creation
```bash
# Create a superuser
python manage.py createsuperuser
```

#### Test API Endpoints
```bash
# Test authentication
curl -X POST http://localhost:8000/api/token/ \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass"}'

# Test workout retrieval
curl -X GET http://localhost:8000/api/workouts/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 10.3 Verify Data Integrity

```python
# Run in Django shell
python manage.py shell

from core.models import User, Exercise, Workout, Meal

# Check counts
print(f"Users: {User.objects.count()}")
print(f"Exercises: {Exercise.objects.count()}")
print(f"Workouts: {Workout.objects.count()}")
print(f"Meals: {Meal.objects.count()}")

# Test relationships
user = User.objects.first()
print(f"User workouts: {user.workout_set.count()}")
print(f"User BMI: {user.calculate_bmi()}")
```

---

## Step 11: Enable Supabase Features

### 11.1 Enable Row Level Security (RLS)
Supabase's killer feature - database-level security:

```sql
-- Run in Supabase SQL Editor

-- Enable RLS on core_exercise table
ALTER TABLE core_exercise ENABLE ROW LEVEL SECURITY;

-- Create policy: anyone can read exercises
CREATE POLICY "Anyone can view exercises"
  ON core_exercise FOR SELECT
  TO authenticated, anon
  USING (true);

-- Enable RLS on user workouts
ALTER TABLE core_workout ENABLE ROW LEVEL SECURITY;

-- Users can only see their own workouts
CREATE POLICY "Users can view own workouts"
  ON core_workout FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id::text);
```

### 11.2 Enable Realtime (Optional)
For live updates:

1. Go to **Database** → **Replication**
2. Enable replication for tables you want real-time updates on:
   - `core_workout`
   - `core_exerciselog`
   - `core_bodymeasurementlog`

### 11.3 Setup Storage (Optional)
For exercise GIFs and videos:

1. Go to **Storage** → **New Bucket**
2. Create buckets:
   - `exercise-gifs`
   - `exercise-videos`
3. Update Django to use Supabase Storage instead of S3 (optional)

---

## Step 12: Performance Optimization

### 12.1 Create Indexes
```sql
-- Run in Supabase SQL Editor

-- Index for user lookups
CREATE INDEX idx_core_user_email ON core_user(email);
CREATE INDEX idx_core_user_username ON core_user(username);

-- Index for workout queries
CREATE INDEX idx_core_workout_user ON core_workout(user_id);
CREATE INDEX idx_core_workout_date ON core_workout(day);

-- Index for exercise logs
CREATE INDEX idx_core_exerciselog_user ON core_exerciselog(user_id);
CREATE INDEX idx_core_exerciselog_date ON core_exerciselog(date);

-- Index for body measurements
CREATE INDEX idx_core_bodymeasurementlog_user_date 
  ON core_bodymeasurementlog(user_id, date DESC);

-- Index for meals
CREATE INDEX idx_core_meal_name ON core_meal(name);
CREATE INDEX idx_core_meal_calories ON core_meal(calories);
```

### 12.2 Enable Connection Pooling
Update your settings.py:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('SUPABASE_DB_NAME'),
        'USER': os.getenv('SUPABASE_DB_USER'),
        'PASSWORD': os.getenv('SUPABASE_DB_PASSWORD'),
        'HOST': os.getenv('SUPABASE_DB_HOST'),
        'PORT': os.getenv('SUPABASE_DB_PORT', '5432'),
        'OPTIONS': {
            'sslmode': 'require',
        },
        'CONN_MAX_AGE': 600,  # Connection pooling
    }
}
```

---

## Step 13: Monitoring and Maintenance

### 13.1 Monitor Database Performance
- Go to **Reports** in Supabase Dashboard
- Check:
  - Database size
  - Active connections
  - Query performance
  - API requests

### 13.2 Setup Backups
Supabase handles backups automatically, but for extra safety:

```bash
# Create a backup script
cat > backup_supabase.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="database_backups"
mkdir -p $BACKUP_DIR

# Export Django data
cd synchron
python manage.py dumpdata --natural-foreign --natural-primary \
  --exclude auth.permission \
  --exclude contenttypes \
  --indent 2 > ../$BACKUP_DIR/supabase_backup_$(date +%Y%m%d_%H%M%S).json

echo "Backup completed successfully!"
EOF

chmod +x backup_supabase.sh
```

---

## Step 14: Rollback Plan (Just in Case)

### 14.1 Keep MySQL Running
Don't delete your MySQL database immediately. Run both in parallel for a week.

### 14.2 Quick Rollback
If issues arise:

```bash
# In your .env file
USE_SUPABASE=FALSE

# Restart your application
# It will reconnect to MySQL
```

---

## Common Issues and Solutions

### Issue 1: SSL Connection Error
**Error**: `SSL connection has been closed unexpectedly`

**Solution**: Add SSL options to database config:
```python
'OPTIONS': {
    'sslmode': 'require',
    'connect_timeout': 10,
}
```

### Issue 2: Connection Timeout
**Error**: `Connection timeout`

**Solution**: 
- Check Supabase dashboard for database status
- Verify your IP isn't blocked
- Check firewall settings

### Issue 3: Permission Denied on Tables
**Error**: `permission denied for table`

**Solution**: Ensure migrations ran completely:
```bash
python manage.py migrate --run-syncdb
```

### Issue 4: Field Type Mismatch
**Error**: `column "x" is of type integer but expression is of type varchar`

**Solution**: This happens with MySQL→PostgreSQL migration. You may need to:
1. Reset migrations
2. Or manually fix field types in migration files

---

## Checklist: Pre-Launch

Before going live with Supabase:

- [ ] All migrations run successfully
- [ ] Data imported and verified
- [ ] Tests passing
- [ ] Authentication working
- [ ] API endpoints responding correctly
- [ ] File uploads working (if applicable)
- [ ] Performance acceptable
- [ ] Backups configured
- [ ] Monitoring setup
- [ ] Rollback plan documented
- [ ] Team trained on new system

---

## Benefits of Supabase

After migration, you'll have access to:

✅ **Free PostgreSQL database** (500MB free tier)  
✅ **Automatic backups** (daily, point-in-time recovery on paid plans)  
✅ **Built-in authentication** (if you want to migrate from JWT)  
✅ **Real-time subscriptions** (WebSocket support)  
✅ **Storage buckets** (for files)  
✅ **Auto-generated REST API** (direct database access)  
✅ **Row Level Security** (database-level auth)  
✅ **Better PostgreSQL features** (JSON operations, full-text search, etc.)  
✅ **Managed infrastructure** (no server management)

---

## Next Steps After Migration

1. **Optimize Queries**: Use Django Debug Toolbar to find slow queries
2. **Add Realtime Features**: Implement live workout updates
3. **Migrate to Supabase Auth**: Consider using Supabase's auth system
4. **Add File Storage**: Move from S3 to Supabase Storage
5. **Implement RLS**: Add row-level security policies
6. **Add Full-Text Search**: PostgreSQL has excellent search capabilities

---

## Support and Resources

- **Supabase Docs**: https://supabase.com/docs
- **Django PostgreSQL**: https://docs.djangoproject.com/en/stable/ref/databases/#postgresql-notes
- **Community**: https://supabase.com/discord
- **Django Discord**: https://discord.gg/django

---

## Conclusion

This migration will give you:
- A more modern database setup
- Better scalability
- Advanced PostgreSQL features
- Managed infrastructure
- Lower costs (free tier is generous)

Take your time with each step, test thoroughly, and keep your MySQL database running until you're confident everything works perfectly.

Good luck! 🚀

