# SYSMA NOTES

This simple example is a Web API with login token oaut, sending mail for validate user, recover password, change email.

## Requirements

* NodeJs install in your computer
* Add secrets.json in gmail configuration project to send emails:
	* Click right in Solution in solution explorer -> Manage user secrets:
	```json
	{
		"Gmail:User": "<email>",
		"Gmail:Password": "<password>"
	}
	```
	[More information on how create app password in google](https://support.google.com/mail/answer/185833?hl=en#)

## Features:

* Web Api: .Net core 7
* Frontend: [Template](https://github.com/sysma1997/template-webpack-react-multiple-page/tree/master)(optional)

## Compile packages Frontend:

* With NodeJs installed in your computer:
	* Open "Developer PowerSheel" in Visual studio or open terminal in root project
	* Go to "Frontend" folder `cd .\Frontend\`
	* Install dependencies `npm install`

## Compile Frontend:

* With NodeJs installed in your computer:
	* Go to "Frontend" folder `cs .\Frontend\`
	* Build project frontend `npm run build`
		* If build dev `npm run build-dev`
		* If you want to edit project frontend `npm run watch`