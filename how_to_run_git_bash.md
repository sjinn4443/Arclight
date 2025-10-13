# How to Open Git Bash and Make Hooks Executable

To make your Git pre-push hook executable, you need to use the `chmod` command. This command is available in Git Bash, which is a terminal emulator that provides a Bash emulation environment on Windows.

## Steps:

1.  **Find Git Bash:**
    - On Windows, search for "Git Bash" in your Start menu. It's usually installed with Git for Windows.
    - Click on the "Git Bash" application to open it.

2.  **Navigate to your project directory:**
    - Once Git Bash is open, you'll be in a terminal. You need to navigate to your project's root directory, which is `d:\Arclight\Arclight_App_NewApp_ChatRefact\Arclight_App`.
    - You can use the `cd` command. For example, if your project is on the D: drive, you might type:
      ```bash
      cd /d/Arclight/Arclight_App_NewApp_ChatRefact/Arclight_App
      ```
      (Note: In Git Bash, Windows paths are often represented with forward slashes and the drive letter prefixed with `/d/` or similar).

3.  **Make the hook executable:**
    - Once you are in the correct directory, run the following command:
      ```bash
      chmod +x .git/hooks/pre-push
      ```

After running this command, your pre-push hook will be executable, and you can proceed to test your pipeline by committing and pushing.
