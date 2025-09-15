-- Insert comprehensive exercise list
INSERT INTO public.exercises (name, category, muscle_groups, instructions) VALUES
-- Chest Exercises
('Bench Press', 'strength', ARRAY['chest', 'shoulders', 'triceps'], 'Lie on bench, lower bar to chest, press up'),
('Push-ups', 'strength', ARRAY['chest', 'shoulders', 'triceps'], 'Start in plank position, lower chest to floor, push up'),
('Incline Bench Press', 'strength', ARRAY['chest', 'shoulders'], 'Similar to bench press but on inclined bench'),
('Dumbbell Flyes', 'strength', ARRAY['chest'], 'Lie on bench, arc dumbbells from sides to center'),

-- Back Exercises
('Pull-ups', 'strength', ARRAY['back', 'biceps'], 'Hang from bar, pull body up until chin clears bar'),
('Deadlift', 'strength', ARRAY['back', 'legs', 'glutes'], 'Lift barbell from floor to hip level'),
('Bent-over Row', 'strength', ARRAY['back', 'biceps'], 'Bend over, pull barbell to lower chest'),
('Lat Pulldown', 'strength', ARRAY['back', 'biceps'], 'Pull bar down to chest while seated'),

-- Leg Exercises
('Squats', 'strength', ARRAY['legs', 'glutes'], 'Lower body as if sitting in chair, return to standing'),
('Lunges', 'strength', ARRAY['legs', 'glutes'], 'Step forward, lower back knee toward ground'),
('Leg Press', 'strength', ARRAY['legs', 'glutes'], 'Push weight away using leg press machine'),
('Calf Raises', 'strength', ARRAY['calves'], 'Rise up on toes, lower slowly'),

-- Shoulder Exercises
('Overhead Press', 'strength', ARRAY['shoulders', 'triceps'], 'Press weight from shoulders to overhead'),
('Lateral Raises', 'strength', ARRAY['shoulders'], 'Raise dumbbells to sides until parallel with floor'),
('Front Raises', 'strength', ARRAY['shoulders'], 'Raise dumbbells in front to shoulder height'),

-- Arm Exercises
('Bicep Curls', 'strength', ARRAY['biceps'], 'Curl dumbbells toward shoulders'),
('Tricep Dips', 'strength', ARRAY['triceps'], 'Lower and raise body using triceps on parallel bars'),
('Hammer Curls', 'strength', ARRAY['biceps', 'forearms'], 'Curl dumbbells with neutral grip'),

-- Core Exercises
('Plank', 'strength', ARRAY['core'], 'Hold body straight in plank position'),
('Crunches', 'strength', ARRAY['core'], 'Contract abs to lift shoulders off ground'),
('Russian Twists', 'strength', ARRAY['core'], 'Rotate torso side to side while seated'),

-- Cardio Exercises
('Running', 'cardio', ARRAY['legs', 'cardiovascular'], 'Maintain steady running pace'),
('Cycling', 'cardio', ARRAY['legs', 'cardiovascular'], 'Pedal at consistent pace'),
('Rowing', 'cardio', ARRAY['back', 'arms', 'legs', 'cardiovascular'], 'Pull rowing handle to chest, extend legs'),
('Elliptical', 'cardio', ARRAY['legs', 'arms', 'cardiovascular'], 'Move arms and legs in elliptical motion'),
('Jump Rope', 'cardio', ARRAY['legs', 'cardiovascular'], 'Jump over rope as it passes under feet'),

-- Functional/Olympic Exercises
('Burpees', 'strength', ARRAY['full body'], 'Drop to pushup, jump feet to hands, jump up'),
('Mountain Climbers', 'cardio', ARRAY['core', 'legs'], 'Alternate bringing knees to chest in plank position'),
('Clean and Press', 'strength', ARRAY['full body'], 'Clean barbell to shoulders, press overhead'),
('Turkish Get-ups', 'strength', ARRAY['full body', 'core'], 'Stand up and lie down while holding weight overhead'),

-- Additional Strength Exercises
('Incline Dumbbell Press', 'strength', ARRAY['chest', 'shoulders'], 'Press dumbbells on incline bench'),
('Decline Bench Press', 'strength', ARRAY['chest', 'triceps'], 'Press barbell on decline bench'),
('Cable Crossover', 'strength', ARRAY['chest'], 'Pull cables across body from high position'),
('T-Bar Row', 'strength', ARRAY['back', 'biceps'], 'Row with T-bar attachment'),
('Seated Cable Row', 'strength', ARRAY['back', 'biceps'], 'Pull cable to torso while seated'),
('Romanian Deadlift', 'strength', ARRAY['hamstrings', 'glutes'], 'Deadlift with focus on hamstrings'),
('Bulgarian Split Squat', 'strength', ARRAY['legs', 'glutes'], 'Lunge with rear foot elevated'),
('Hip Thrusts', 'strength', ARRAY['glutes', 'hamstrings'], 'Thrust hips up from bridge position'),
('Face Pulls', 'strength', ARRAY['shoulders', 'back'], 'Pull cable to face level'),
('Arnold Press', 'strength', ARRAY['shoulders'], 'Shoulder press with rotation'),
('Close-Grip Bench Press', 'strength', ARRAY['triceps', 'chest'], 'Bench press with narrow grip'),
('Preacher Curls', 'strength', ARRAY['biceps'], 'Bicep curls on preacher bench'),
('Hanging Leg Raises', 'strength', ARRAY['core'], 'Raise legs while hanging from bar'),
('Dead Bug', 'strength', ARRAY['core'], 'Extend opposite arm and leg while on back'),

-- Additional Cardio Options
('Stair Climbing', 'cardio', ARRAY['legs', 'cardiovascular'], 'Climb stairs at steady pace'),
('Swimming', 'cardio', ARRAY['full body', 'cardiovascular'], 'Swim laps using various strokes'),
('Battle Ropes', 'cardio', ARRAY['arms', 'core', 'cardiovascular'], 'Wave heavy ropes in various patterns'),
('Box Jumps', 'cardio', ARRAY['legs', 'cardiovascular'], 'Jump onto box, step down'),
('High Knees', 'cardio', ARRAY['legs', 'cardiovascular'], 'Run in place bringing knees to chest'),

-- Flexibility & Mobility
('Static Stretching', 'flexibility', ARRAY['full body'], 'Hold stretches for 15-30 seconds'),
('Dynamic Warm-up', 'flexibility', ARRAY['full body'], 'Movement-based stretches before workout'),
('Yoga Flow', 'flexibility', ARRAY['full body'], 'Flow through yoga poses with controlled breathing'),
('Foam Rolling', 'flexibility', ARRAY['full body'], 'Roll muscles over foam roller for release')

ON CONFLICT (name) DO NOTHING;
