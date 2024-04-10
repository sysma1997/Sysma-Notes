# SYSMA NOTES

This simple example is a Web API with login token oaut, sending mail for validate user, recover password, change email.

## Requirements

* NodeJs install in your computer or [install NodeJs](https://learn.microsoft.com/en-us/visualstudio/javascript/tutorial-nodejs?view=vs-2022#prerequisites) in visual studio

## Features:

* Web Api: .Net core 7
* Frontend: [Template](https://github.com/sysma1997/template-webpack-react-multiple-page/tree/master)(optional)

## Compile packages Frontend:

* With NodeJs installed in your computer:
	* Open "Developer PowerSheel" in Visual studio or open terminal in root project
	* Go to "Frontend" folder `cd .\Frontend\`
	* Install dependencies `npm install`
* With Visual studio:
	* Deploy Dependencies:
	* select npm and click right -> Install new npm packages [more info](https://learn.microsoft.com/en-us/visualstudio/javascript/npm-package-management?view=vs-2022#cli-based-project-esproj)

## Compile Frontend:

* With NodeJs installed in your computer:
	* Go to "Frontend" folder `cs .\Frontend\`
	* Build project frontend `npm run build`
		* If build dev `npm run build-dev`
		* If edite project frontend `npm run watch`