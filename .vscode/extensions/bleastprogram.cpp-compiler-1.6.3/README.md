Welcome to my [CPP and C extension](https://marketplace.visualstudio.com/items?itemName=bleastProgram.CPP-Compiler) ! 🚀🚀🚀<br>
<br>

# INFO <br>

<br>
This extension allows you to build your cpp or c projects. Your project can contain an infinite amount of files and my extension will automatically find them all.<br>
You can add include paths, librarys paths, librarys names, preprocessors, and ignore paths which will be ignored in the build.<br>
You can specify an application type. It can either be an executable, a dynamic library or a static library (exe, dll, slib). Dll only works with g++!<br>

You can build in both debug mode and releade mode.<br>
You can simply switch between debug and release in the settings file. It will use the -O3 optimisation level by default. if you want to specify a custom level, <br>
You can simply specify it like this ->  build: Release-LEVEL -> The LEVEL is where you put the flag. <br>
Do not add "-O" before, simply specify the name like 1, 2, 3, fast,g. <br>
List of all the available flags : https://gcc.gnu.org/onlinedocs/gcc/Optimize-Options.html

<br>
<br>

> ## This extension also support Debug and Release mode
>
> > - Debug exposes the code to the gdb debugger and enables debugging features such as breakpoint and others.
> >
> > - Release mode optimizes and reduces your application size when possible. This mode should only be used when the project is ready to be published

<br>
One of the best features is the compilation history. It's a file that allows this extension to decide wich file to compile and which file not to compile making the build time faster.<br>
And Finally, this extension compiles your files in parallel (asynchronously), which makes the build time even faster.<br>
<br>

# REQUIREMENTS <br>

    You need a compiler added to the path in terminal. Can either be g++ or clang++. If you decide to use clang++, you need to have msvc installed on windows.

    if you want to add colors to the output, download Output Colorizer.

<br>

    name: "app"                                 #Do not put any space in the name
    application_type: "exe"                     # exe, dll, or slib
    cpp_version: "auto"
    build: "Debug"                              #Debug or Release
    showSteps: true
    include:
        - exemple
    library_directory:
        - exemple
    library:
        - exemple
    preprocessor:                              # You can add preprocessors -> NAME and preprocessors with values -> NAME,VALUE
        - exemple
    ressources:                                # The ressources are folders or files that will be copied into the out folder
        - exemple
    ignore:
        - exemple

<br>

# SYNTAX <br>

1: When including header files in your cpp files, please take note that the files that you expect to change in the future (your custom header files for example ) need to be surrounded
by ' " " ', while third party header files or just files that are complete need to be surrounded by ' < > '. This is very important since this extension uses the included files
surrounded by ' " " ' as well to determine if a cpp file should be compiled or not.

<br>

2: Your app name in the settings and your folder name needs to be attached, no space

<br>

3: The paths in the settings file needs to start from the root of your project.

<br>

# COMMANDS <br>

<br>

> ## Four commands are availabe:
>
> > -'CPP\_ : Compile project' -> This builds the executable for your project
> >
> > -'CPP\_ : Recompile project' -> this deletes the compilation history and rebuilds your project from scratch
> >
> > -'CPP\_ : Run project' -> Automatically finds the executable file and runs it
> >
> > -'CPP\_ : Configure project' -> This creates the folders and the files necessary for the extension to work.

<br>
You can also use the quick access buttons availabe in the status bar:<br><br>

<img src="https://user-images.githubusercontent.com/64434215/224561838-49c0f5ef-0582-4630-8536-fc0130539325.png"></img>

<br>

# DEMO <br>

<br>

### Creating a new Project <br><br>

<video src="https://user-images.githubusercontent.com/64434215/224561703-5c948678-56d2-4ef8-b6b0-09f4633e6282.mp4"></video>

<br><br>

### Compiling a Project <br><br>

<video src="https://user-images.githubusercontent.com/64434215/224561749-ab002d64-2ee8-40ee-bd18-2025da37341f.mp4"></video>

<br><br>

### You can also check out this youtube video for more information <br><br>

https://www.youtube.com/watch?v=UFmJ48t1QHM&t=245s"
