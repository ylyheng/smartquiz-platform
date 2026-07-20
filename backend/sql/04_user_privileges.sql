-- ============================================================
-- SmartQuiz Platform - User Privileges and Access Control
-- Database: MySQL
-- ============================================================

USE smartquiz_platform_db;

-- ============================================================
-- 1. Create Application User (for production use)
-- ============================================================
-- This user is used by the application to connect to the database.
-- It has limited privileges compared to the root user.

CREATE USER IF NOT EXISTS 'smartquiz_app'@'localhost'
  IDENTIFIED BY 'change_this_password_in_production';

-- ============================================================
-- 2. Grant Privileges to Application User
-- ============================================================
-- Only necessary permissions: SELECT, INSERT, UPDATE, DELETE on the app database.
-- No DROP, ALTER, GRANT, or other admin privileges.

GRANT SELECT, INSERT, UPDATE, DELETE
  ON smartquiz_platform_db.*
  TO 'smartquiz_app'@'localhost';

-- ============================================================
-- 3. Create Read-Only User (for analytics/reporting)
-- ============================================================
-- This user can only read data, useful for reporting tools or dashboards.

CREATE USER IF NOT EXISTS 'smartquiz_readonly'@'localhost'
  IDENTIFIED BY 'change_this_password_in_production';

GRANT SELECT
  ON smartquiz_platform_db.*
  TO 'smartquiz_readonly'@'localhost';

-- ============================================================
-- 4. Create Admin User (for database administration)
-- ============================================================
-- Full privileges on the application database only.

CREATE USER IF NOT EXISTS 'smartquiz_admin'@'localhost'
  IDENTIFIED BY 'change_this_password_in_production';

GRANT ALL PRIVILEGES
  ON smartquiz_platform_db.*
  TO 'smartquiz_admin'@'localhost';

-- ============================================================
-- 5. Apply Privilege Changes
-- ============================================================
FLUSH PRIVILEGES;

-- ============================================================
-- 6. Verify Grants
-- ============================================================
-- Run these to verify what each user can do:
-- SHOW GRANTS FOR 'smartquiz_app'@'localhost';
-- SHOW GRANTS FOR 'smartquiz_readonly'@'localhost';
-- SHOW GRANTS FOR 'smartquiz_admin'@'localhost';

-- ============================================================
-- ROLE SUMMARY
-- ============================================================
--
-- | User              | Role          | Permissions                     |
-- |-------------------|---------------|---------------------------------|
-- | root              | DB Admin      | ALL PRIVILEGES (use for setup)  |
-- | smartquiz_app     | Application   | SELECT, INSERT, UPDATE, DELETE  |
-- | smartquiz_readonly| Read-Only     | SELECT only                     |
-- | smartquiz_admin   | DB Manager    | ALL on smartquiz_platform_db    |
