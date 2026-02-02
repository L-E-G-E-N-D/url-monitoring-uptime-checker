CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS monitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  check_interval_minutes INT NOT NULL CHECK (check_interval_minutes > 0),
  is_active BOOLEAN DEFAULT true,
  status TEXT DEFAULT 'PENDING',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS monitor_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  monitor_id UUID NOT NULL REFERENCES monitors(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('UP', 'DOWN')),
  response_time_ms INT,
  http_status_code INT,
  checked_at TIMESTAMPTZ DEFAULT now()
);


CREATE INDEX IF NOT EXISTS idx_monitor_checks_monitor_id
ON monitor_checks (monitor_id);

CREATE INDEX IF NOT EXISTS idx_monitor_checks_checked_at
ON monitor_checks (checked_at DESC);

CREATE INDEX IF NOT EXISTS idx_monitors_is_active
ON monitors (is_active);
