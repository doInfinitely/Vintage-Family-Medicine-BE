-- Enable pgcrypto for gen_random_uuid() (already available in Supabase by default)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─────────────────────────────────────────────
-- 1. site_settings
-- ─────────────────────────────────────────────
CREATE TABLE site_settings (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name               TEXT NOT NULL,
  tagline                 TEXT,
  logo_url                TEXT,
  favicon_url             TEXT,
  primary_phone           TEXT,
  primary_email           TEXT,
  default_meta_title      TEXT,
  default_meta_description TEXT,
  emergency_notice        TEXT,
  footer_disclaimer       TEXT,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- 2. pages
-- ─────────────────────────────────────────────
CREATE TABLE pages (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug             TEXT UNIQUE NOT NULL,
  title            TEXT NOT NULL,
  meta_title       TEXT,
  meta_description TEXT,
  is_published     BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order       INTEGER NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- 3. page_sections
-- ─────────────────────────────────────────────
CREATE TABLE page_sections (
  id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id                     UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  section_key                 TEXT NOT NULL,
  section_type                TEXT NOT NULL,
  eyebrow                     TEXT,
  title                       TEXT,
  subtitle                    TEXT,
  body                        TEXT,
  image_url                   TEXT,
  image_alt                   TEXT,
  primary_button_label        TEXT,
  primary_button_action_key   TEXT,
  secondary_button_label      TEXT,
  secondary_button_action_key TEXT,
  config_json                 JSONB,
  is_visible                  BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order                  INTEGER NOT NULL DEFAULT 0,
  created_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- 4. navigation_items
-- ─────────────────────────────────────────────
CREATE TABLE navigation_items (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label        TEXT NOT NULL,
  href         TEXT NOT NULL,
  placement    TEXT NOT NULL,
  parent_id    UUID REFERENCES navigation_items(id) ON DELETE SET NULL,
  is_external  BOOLEAN NOT NULL DEFAULT FALSE,
  opens_new_tab BOOLEAN NOT NULL DEFAULT FALSE,
  is_visible   BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order   INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- 5. call_to_actions
-- ─────────────────────────────────────────────
CREATE TABLE call_to_actions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action_key    TEXT UNIQUE NOT NULL,
  label         TEXT NOT NULL,
  description   TEXT,
  provider      TEXT NOT NULL,
  action_type   TEXT NOT NULL,
  href          TEXT,
  phone_number  TEXT,
  icon          TEXT,
  opens_new_tab BOOLEAN NOT NULL DEFAULT TRUE,
  is_primary    BOOLEAN NOT NULL DEFAULT FALSE,
  is_enabled    BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order    INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- 6. integrations
-- ─────────────────────────────────────────────
CREATE TABLE integrations (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider           TEXT UNIQUE NOT NULL,
  display_name       TEXT NOT NULL,
  base_url           TEXT,
  widget_script_url  TEXT,
  widget_id          TEXT,
  public_config_json JSONB,
  is_enabled         BOOLEAN NOT NULL DEFAULT TRUE,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- 7. services
-- ─────────────────────────────────────────────
CREATE TABLE services (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug              TEXT UNIQUE NOT NULL,
  name              TEXT NOT NULL,
  category          TEXT NOT NULL,
  short_description TEXT,
  full_description  TEXT,
  icon              TEXT,
  image_url         TEXT,
  image_alt         TEXT,
  is_featured       BOOLEAN NOT NULL DEFAULT FALSE,
  is_visible        BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order        INTEGER NOT NULL DEFAULT 0,
  meta_title        TEXT,
  meta_description  TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- 8. service_conditions
-- ─────────────────────────────────────────────
CREATE TABLE service_conditions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id  UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  description TEXT,
  is_visible  BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- 9. providers
-- ─────────────────────────────────────────────
CREATE TABLE providers (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  title      TEXT,
  credentials TEXT,
  bio        TEXT,
  photo_url  TEXT,
  photo_alt  TEXT,
  specialties TEXT[],
  is_visible BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- 10. locations
-- ─────────────────────────────────────────────
CREATE TABLE locations (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name           TEXT NOT NULL,
  address_line_1 TEXT NOT NULL,
  address_line_2 TEXT,
  city           TEXT NOT NULL,
  state          TEXT NOT NULL,
  postal_code    TEXT NOT NULL,
  country        TEXT NOT NULL DEFAULT 'US',
  phone          TEXT,
  text_number    TEXT,
  fax            TEXT,
  email          TEXT,
  map_url        TEXT,
  map_embed_url  TEXT,
  latitude       NUMERIC(10, 7),
  longitude      NUMERIC(10, 7),
  timezone       TEXT NOT NULL DEFAULT 'America/Chicago',
  is_primary     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- 11. office_hours
-- ─────────────────────────────────────────────
CREATE TABLE office_hours (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  open_time   TIME,
  close_time  TIME,
  lunch_start TIME,
  lunch_end   TIME,
  is_closed   BOOLEAN NOT NULL DEFAULT FALSE,
  note        TEXT,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- 12. holiday_closures
-- ─────────────────────────────────────────────
CREATE TABLE holiday_closures (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  closure_type    TEXT NOT NULL,
  fixed_month     INTEGER CHECK (fixed_month BETWEEN 1 AND 12),
  fixed_day       INTEGER CHECK (fixed_day BETWEEN 1 AND 31),
  recurrence_rule TEXT,
  specific_date   DATE,
  note            TEXT,
  is_visible      BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order      INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- 13. faqs
-- ─────────────────────────────────────────────
CREATE TABLE faqs (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question   TEXT NOT NULL,
  answer     TEXT NOT NULL,
  category   TEXT,
  is_visible BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- 14. announcements
-- ─────────────────────────────────────────────
CREATE TABLE announcements (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title      TEXT NOT NULL,
  message    TEXT NOT NULL,
  type       TEXT NOT NULL DEFAULT 'general',
  start_date DATE,
  end_date   DATE,
  is_visible BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- 15. legal_pages
-- ─────────────────────────────────────────────
CREATE TABLE legal_pages (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug           TEXT UNIQUE NOT NULL,
  title          TEXT NOT NULL,
  body           TEXT NOT NULL,
  version        TEXT,
  effective_date DATE,
  is_published   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- 16. media_assets
-- ─────────────────────────────────────────────
CREATE TABLE media_assets (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_type TEXT NOT NULL,
  title      TEXT,
  file_url   TEXT NOT NULL,
  alt_text   TEXT,
  width      INTEGER,
  height     INTEGER,
  mime_type  TEXT,
  is_visible BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- 17. content_revisions
-- ─────────────────────────────────────────────
CREATE TABLE content_revisions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type   TEXT NOT NULL,
  entity_id     UUID NOT NULL,
  revision_data JSONB NOT NULL,
  revision_note TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
