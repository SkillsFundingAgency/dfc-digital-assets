# GdsSfa package #

This package is based on the [GDS resources](https://github.com/alphagov/) . In order to use it you need to add the package to the ResourcePackages folder of your project. If the ResourcePackages folder doesn't contain any packages, widget templates will be loaded from Feather or from the MVC folder of SitefinityWebApp (if this folder contains files with names, matching the naming convention). Templates from the source of Feather have lowest loading priority. Templates in the MVC folder of SitefinityWebApp are with higher priority, and templates from a package have highest loading priority.

## Package structure ##

The GdsSfa package contains 3 folders and several files. 
 - assets folder - this contains CSS, JS, images and fonts.
 - MVC folder - contains all widget templates categorized by widget
 - GridSystem - contains all layout/grid templates
 - gruntfile.js and other files in the root - these are files we use in our GruntJS set up.


## Editing and creating a widget
By default this does not include all widget templates. Please add templates as needed. 

Creating a new template is just as easy. 
Duplicate an existing template, gve a name to the new file, keeping in mind the following structure - [ControllerNameWithoutControllerInName]View.XXXXXX.cshtml. Then the new template will appear in the list of templates for this widget.

For widgets that have list and details views, the structure should be List.XXXXXX.cshtml or Detail.XXXXXX.cshtml, respectively.

## Responsive design ##

The responsiveness of our widgets and layout controls rely solely on the front end frameworks GDs is supporting. Sfa goal is to integrate the frameworks in  the best possible way so that everyone can take advantage of the responsive features of the frameworks. 

Sfa tried to write as less custom CSS as possible and rely mainly on what the frameworks already provide. This way a person who is familiar with Gds styling shouldn't learn new classes and conventions.