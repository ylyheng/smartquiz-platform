@echo off
REM ============================================================
REM SmartQuiz Platform - Database Backup Script
REM Usage: scripts\backup.bat [backup_name]
REM ============================================================

SET DB_NAME=smartquiz_platform_db
SET DB_USER=root
SET DB_PASS=010507heng
SET DB_HOST=localhost
SET DB_PORT=3307
SET BACKUP_DIR=%~dp0backups

REM Create backups directory if it doesn't exist
if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"

REM Generate timestamp for filename
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value 2^>nul') do set datetime=%%I
set TIMESTAMP=%datetime:~0,4%%datetime:~4,2%%datetime:~6,2%_%datetime:~8,2%%datetime:~10,2%%datetime:~12,2%

REM Set backup filename
if "%~1"=="" (
    set BACKUP_FILE=%BACKUP_DIR%\%DB_NAME%_%TIMESTAMP%.sql
) else (
    set BACKUP_FILE=%BACKUP_DIR%\%~1_%TIMESTAMP%.sql
)

REM Run mysqldump
echo Backing up database %DB_NAME%...
mysqldump -u %DB_USER% -p%DB_PASS% -h %DB_HOST% -P %DB_PORT% --single-transaction --routines --triggers %DB_NAME% > "%BACKUP_FILE%"

if %errorlevel% equ 0 (
    echo Backup completed successfully: %BACKUP_FILE%
    echo File size:
    dir "%BACKUP_FILE%"
) else (
    echo ERROR: Backup failed!
    exit /b 1
)
