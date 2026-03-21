ALTER TABLE expert_city_assignments ADD COLUMN display_order integer DEFAULT 0;
ALTER TABLE industry_experts ADD COLUMN saved_for_later boolean DEFAULT false;