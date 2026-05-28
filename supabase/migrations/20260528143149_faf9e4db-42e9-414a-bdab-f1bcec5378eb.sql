DELETE FROM connections WHERE candidate_id = '8505a9c7-3754-4a2a-879c-05e8a98e08df';
DELETE FROM connect_notes WHERE candidate_id = '8505a9c7-3754-4a2a-879c-05e8a98e08df';
DELETE FROM brand_lead_responses WHERE candidate_id = '8505a9c7-3754-4a2a-879c-05e8a98e08df';
DELETE FROM brand_starred_attendee WHERE candidate_id = '8505a9c7-3754-4a2a-879c-05e8a98e08df';
DELETE FROM candidate_starred_brands WHERE candidate_id = '8505a9c7-3754-4a2a-879c-05e8a98e08df';
DELETE FROM user_sessions WHERE subject_type = 'candidate' AND subject_id = '8505a9c7-3754-4a2a-879c-05e8a98e08df';
DELETE FROM candidates WHERE id = '8505a9c7-3754-4a2a-879c-05e8a98e08df';