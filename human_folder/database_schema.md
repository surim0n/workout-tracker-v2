# Workout Tracker Database Schema

## Overview
This document describes the database schema for the Workout Tracker application built with Next.js and Supabase.

## Tables

### 1. `profiles` Table
Extends Supabase's `auth.users` table with additional user profile information.

```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Fields:**
- `id` - UUID, Primary Key, references auth.users(id)
- `display_name` - TEXT, User's display name
- `created_at` - TIMESTAMP, Record creation time
- `updated_at` - TIMESTAMP, Record last update time

**Row Level Security:**
- Users can only access their own profile data
- Automatic profile creation on user signup via trigger

---

### 2. `exercises` Table
Stores predefined exercise definitions that can be added to workouts.

```sql
CREATE TABLE public.exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  muscle_groups TEXT[],
  instructions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Fields:**
- `id` - UUID, Primary Key
- `name` - TEXT, Exercise name (unique)
- `category` - TEXT, Exercise category ('strength', 'cardio', 'flexibility', etc.)
- `muscle_groups` - TEXT[], Array of target muscle groups
- `instructions` - TEXT, Exercise instructions/description
- `created_at` - TIMESTAMP, Record creation time

**Row Level Security:**
- All authenticated users can read exercises
- Only admins can modify exercises (insert/update/delete)

**Sample Categories:**
- `strength` - Weight lifting, bodyweight exercises
- `cardio` - Running, cycling, HIIT
- `flexibility` - Stretching, yoga

---

### 3. `workouts` Table
Stores user workout sessions.

```sql
CREATE TABLE public.workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  notes TEXT,
  duration_minutes INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Fields:**
- `id` - UUID, Primary Key
- `user_id` - UUID, Foreign Key to auth.users(id)
- `name` - TEXT, Workout session name
- `notes` - TEXT, Optional workout notes
- `duration_minutes` - INTEGER, Total workout duration
- `created_at` - TIMESTAMP, Record creation time
- `updated_at` - TIMESTAMP, Record last update time

**Row Level Security:**
- Users can only access their own workouts
- Full CRUD permissions for own workouts

---

### 4. `workout_exercises` Table
Junction table linking workouts to exercises with performance data.

```sql
CREATE TABLE public.workout_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id UUID NOT NULL REFERENCES public.workouts(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES public.exercises(id) ON DELETE CASCADE,
  sets INTEGER,
  reps INTEGER[],
  weight DECIMAL[],
  distance DECIMAL,
  duration_seconds INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Fields:**
- `id` - UUID, Primary Key
- `workout_id` - UUID, Foreign Key to workouts(id)
- `exercise_id` - UUID, Foreign Key to exercises(id)
- `sets` - INTEGER, Number of sets performed
- `reps` - INTEGER[], Array of reps per set
- `weight` - DECIMAL[], Array of weights used per set
- `distance` - DECIMAL, Distance covered (for cardio)
- `duration_seconds` - INTEGER, Duration in seconds (for cardio/timed exercises)
- `notes` - TEXT, Optional exercise-specific notes
- `created_at` - TIMESTAMP, Record creation time

**Row Level Security:**
- Users can only access workout_exercises for their own workouts
- Enforced through workout ownership checks

## Relationships

```
auth.users (1) ──→ (many) profiles
auth.users (1) ──→ (many) workouts
exercises (1) ──→ (many) workout_exercises
workouts (1) ──→ (many) workout_exercises
```

## Indexes

### Recommended Indexes for Performance:

```sql
-- User workouts lookup
CREATE INDEX idx_workouts_user_id_created_at ON workouts(user_id, created_at DESC);

-- Exercise lookups
CREATE INDEX idx_exercises_category ON exercises(category);
CREATE INDEX idx_exercises_name ON exercises(name);

-- Workout exercises lookups
CREATE INDEX idx_workout_exercises_workout_id ON workout_exercises(workout_id);
CREATE INDEX idx_workout_exercises_exercise_id ON workout_exercises(exercise_id);
```

## Row Level Security Policies

### Profiles
```sql
-- Users can only see/modify their own profile
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON profiles FOR DELETE USING (auth.uid() = id);
```

### Exercises
```sql
-- All authenticated users can read exercises
CREATE POLICY "exercises_select_all" ON exercises FOR SELECT TO authenticated USING (true);
```

### Workouts
```sql
-- Users can only access their own workouts
CREATE POLICY "workouts_select_own" ON workouts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "workouts_insert_own" ON workouts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "workouts_update_own" ON workouts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "workouts_delete_own" ON workouts FOR DELETE USING (auth.uid() = user_id);
```

### Workout Exercises
```sql
-- Users can only access workout_exercises for their own workouts
CREATE POLICY "workout_exercises_select_own" ON workout_exercises 
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM workouts 
    WHERE workouts.id = workout_exercises.workout_id 
    AND workouts.user_id = auth.uid()
  ));
-- Similar policies for INSERT, UPDATE, DELETE
```

## Triggers

### Auto-create Profile on User Signup
```sql
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'display_name', NEW.email))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
```

## Sample Data Structure

### Exercise Example:
```json
{
  "id": "uuid-here",
  "name": "Bench Press",
  "category": "strength",
  "muscle_groups": ["chest", "shoulders", "triceps"],
  "instructions": "Lie on bench, lower bar to chest, press up",
  "created_at": "2024-01-01T00:00:00Z"
}
```

### Workout Example:
```json
{
  "id": "uuid-here",
  "user_id": "user-uuid",
  "name": "Upper Body Strength",
  "notes": "Felt strong today",
  "duration_minutes": 45,
  "created_at": "2024-01-01T10:00:00Z"
}
```

### Workout Exercise Example:
```json
{
  "id": "uuid-here",
  "workout_id": "workout-uuid",
  "exercise_id": "exercise-uuid",
  "sets": 3,
  "reps": [10, 8, 6],
  "weight": [135, 155, 175],
  "distance": null,
  "duration_seconds": null,
  "notes": "Increased weight from last session"
}
```

## Environment Variables Required

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Migration Files

1. `001_create_tables.sql` - Creates all tables and RLS policies
2. `002_seed_exercises.sql` - Seeds the exercises table with common exercises
3. `003_create_profile_trigger.sql` - Sets up auto-profile creation trigger

## Notes

- All tables use UUID primary keys for better scalability
- Row Level Security (RLS) is enabled on all tables
- Timestamps are stored with timezone information
- Arrays are used for sets/reps/weights to support variable set counts
- Foreign key constraints ensure data integrity
- ON DELETE CASCADE ensures cleanup when parent records are deleted