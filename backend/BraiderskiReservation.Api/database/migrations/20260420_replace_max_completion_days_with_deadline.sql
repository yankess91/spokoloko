ALTER TABLE services
    ADD COLUMN IF NOT EXISTS completion_deadline_date date;

UPDATE services
SET completion_deadline_date = (CURRENT_DATE + (max_completion_time_days || ' days')::interval)::date
WHERE type = 1
  AND max_completion_time_days IS NOT NULL
  AND max_completion_time_days > 0;

ALTER TABLE services
    DROP COLUMN IF EXISTS max_completion_time_days;
