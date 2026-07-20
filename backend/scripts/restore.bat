@echo off
REM ============================================================
REM SmartQuiz Platform - Database Restore Script
REM Usage: scripts\restore.bat path_to_backup_file.sql
REM ============================================================

SET DB_NAME=smartquiz_platform_db
SET DB_USER=root
SET DB_PASS=010507heng
SET DB_HOST=localhost
SET DB_PORT=3307

if "%~1"=="" (
    echo ERROR: Please provide the path to the backup SQL file.
    echo Usage: scripts\restore.bat path_to_backup_file.sql
    exit /b 1
)

if not exist "%~1" (
    echo ERROR: File not found: %~1
    exit /b 1
)

echo Restoring database %DB_NAME% from: %~1
echo WARNING: This will overwrite the existing database!
pause

mysql -u %DB_USER% -p%DB_PASS% -h %DB_HOST% -P %DB_PORT% %DB_NAME% < "%~1"

if %errorlevel% equ 0 (
    echo Restore completed successfully!
) else (
    echo ERROR: Restore failed!
    exit /b 1
)
