-- Insert common exercises
INSERT INTO public.exercises (name, category, muscle_groups, instructions) VALUES
-- Strength exercises
('Push-ups', 'strength', ARRAY['chest', 'shoulders', 'triceps'], 'Start in plank position, lower body to ground, push back up'),
('Pull-ups', 'strength', ARRAY['back', 'biceps'], 'Hang from bar, pull body up until chin over bar'),
('Squats', 'strength', ARRAY['quadriceps', 'glutes', 'hamstrings'], 'Stand with feet shoulder-width apart, lower hips back and down'),
('Deadlifts', 'strength', ARRAY['hamstrings', 'glutes', 'back'], 'Lift barbell from ground to hip level with straight back'),
('Bench Press', 'strength', ARRAY['chest', 'shoulders', 'triceps'], 'Lie on bench, press barbell from chest to full arm extension'),
('Shoulder Press', 'strength', ARRAY['shoulders', 'triceps'], 'Press weights overhead from shoulder level'),
('Bicep Curls', 'strength', ARRAY['biceps'], 'Curl weights from extended arms to shoulders'),
('Tricep Dips', 'strength', ARRAY['triceps'], 'Lower body using arms, push back up'),

-- Cardio exercises
('Running', 'cardio', ARRAY['legs', 'cardiovascular'], 'Maintain steady pace for specified duration'),
('Cycling', 'cardio', ARRAY['legs', 'cardiovascular'], 'Pedal at consistent intensity'),
('Jump Rope', 'cardio', ARRAY['legs', 'cardiovascular'], 'Jump over rope with both feet'),
('Burpees', 'cardio', ARRAY['full body', 'cardiovascular'], 'Squat, jump back to plank, jump forward, jump up'),

-- Flexibility exercises
('Stretching', 'flexibility', ARRAY['full body'], 'Hold stretches for 15-30 seconds'),
('Yoga Flow', 'flexibility', ARRAY['full body'], 'Flow through yoga poses with controlled breathing')

ON CONFLICT (name) DO NOTHING;
