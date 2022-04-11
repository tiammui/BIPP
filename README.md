# BIPP DOCUMENTATION

BIPP is a lightweight module that leverage CSS 'background-image', 'background-size' and 'background-position' properties to simplify image processing and collection from users.

BIPP is a simple module that can be integrated with any website/web app.
BIPP is an abbreviatiion for "Background-Image Picture Processing".
BIPP main aim is to simplify image processing leveraging on CSS 'background-image', 'background-size' and 'background-position' properties.
BIPP is designed to work on old and new browsers by ensuring pure Javascript and cross-platform CSS properties.
BIPP can be customized to suit developers needs.
BIPP is a module that help developers collect pictures from users.
BIPP enable developers choose the aspect ratio of image they want to collect.

## INTEGRATION OF BIPP MODULE

---

1. To integrate BIPP to your website or web app the below codes should be copied into the `<body>` tag (preferably the bottom of the \<body>` tag).

```html
<link rel="stylesheet" type="text/css" href="url/to/file/bipp.css" />
<script type="text/javascript" src="url/to/file/bipp_module.js" async></script>
```

2. to initialise the module 'bipp.start()' function should be called with bipp configuration object as it first argument (see example below)

```js
// BIPP configuration object
var bippConfig = {
	frameWidth:200,
	measurementUnit:"px",
	aspectRatio:0.5,
	uploaderHtml:"",
	uploadPrompt:"",
	changeFilePrompt:"",
	changeButton:"",
	uploadStatus:true,
	feedbackImgUrl:"",
	compression:true,
	autoSelect:false
};

// call to initialise module with configuration object above
bipp.start(bippConfig);
```

_read more about BIPP configuration in next section_

## BIPP CONFIGURATION
This section would explain how you can use create and use a BIPP config object to customize the module

```js
// BIPP configuration object with complete properties
var bippConfig = {
		frameWidth: 150,
		measurementUnit: "px",
		aspectRatio: 1,
		uploaderHtml: 
				`<div style="border:gray dashed 5px;width:250px; height:150px; color:grey; padding-top:10px;cursor: pointer;">
						<span style="font-size:60px;font-weight: 1000;" >
								&plus;
						</span><br>
						<span>
								Upload a picture to test <b>BIPP</b>
						</span>
				</div>`,
		uploadPrompt: "Choose A Frame That suit you",
		changeFilePrompt:"",
		changeButton: "Change Picture",
		uploadStatus:true,
		feedbackImgUrl:"http://mvp.ng/cummins/pics/check.png",
		compression:true,
		autoSelect:false
};
```


NOTE;- BIPP have fallback value for property, meaning when any value of the configuration object's property is not specified/given the module use the in-built value of the properties

> __frameWidth__ _[Data-type: Number][Default/In-built Value: 150]_- this property is used to define the width of each frame.

> __measurementUnit__ _[Data-type: String][Default/In-built Value: "px"]_- this property determine the CSS measurement unit of the frameWidth property value explained above. any absolute or relative unit can be used.

> __aspectRatio__ _[Data-type: Number][Default/In-built Value: 1]_- it used to specify the aspect ratio of each frame, with the frameWidth property as reference it the ratio of frame width to it height, see example below

if the `frameWidth` property has the value of 150 with `measurementUnit` property having "px" as it value and `aspectRatio` property has the value of 1.5 then each frame will have the width of 150px and height of 100px(the module internally divide the frameWidth value by the `aspectRatio` value to get the frame height)

> __uploaderHtml__ _[Data-type: String][Default/In-built Value: 
```html
<div style="border:gray dashed 5px;width:250px; height:150px; color:grey; padding-top:10px;cursor: pointer;text-align:center">
	<span style="font-size:60px;font-weight: 1000;" >
	&plus;
	</span><br>
	<span>
			Upload a picture to test <b>BIPP</b>
	</span>
</div>
```
]_- this property is used to customize how you want the picture uploader UI to look like, it works exactly like assigning innerHTML to any HTML tag, caution must be taken when assigning value to this property, especially the usage of double-quotes, single-quote, backticks and some other symbols, it adviseable the developer have a working knowledge of how to assign value to innerHTML of element before editing this property

> __uploadPrompt__ _[Data-type: String][Default/In-built Value: "Choose A Frame That suit you"]_- use to customize what prompt the user to choose a frame after a picture has been uploaded into the module. work like assigning innerHTML value to an element.
NOTE;- it totally different from uploadStatus property because it only appear when a picture is selected.

> __uploadStatus__ _[Data-type: Boolean][Default/In-built Value: true]_- this property is used to choose if you want the user to know when a picture is selected or not, assigning true to this property means you want users to know when a picture is selected and vice-versa.
NOTE;- it totally different from uploadPrompt property because it appears everytime.

> __changeFilePrompt__ _[Data-type: String][Default/In-built Value: "if you don't find a frame that suit you, it advisable to change the picture you want to upload"]_- use to customize what prompt the user to select another picture if user doesn't like how the presently uploaded picture in the module is displayed in frames, work like assigning innerHTML value to an element.

> __changeButton__ _[Data-type: String][Default/In-built Value: "Change Picture"]_- use to customize the content of the button that change picture when user doesn't like how the presently uploaded picture in the module is displayed in frames, works like assigning innerHTML value to an element.

> __feedbackImgUrl__ _[Data-type: String/Reference][Default/In-built Value: "http://mvp.ng/cummins/pics/check.png"]_- this property specify the link/directory reference to the picture that shows as feedback to let user know when a frame is selected, it adviseable to use a picture with transparent background with an aspect ratio of 1 to 1.

> __compression__ _[Data-type: Boolean][Default/In-built Value: true]_- this property is used to choose if you want the picture user selected to be compressed and cropped before been passed to bippFile or not, assigning true to this property means you want users picture to compressed and vice-versa.

> __lazyLoad__ _[Data-type: Boolean][Default/In-built Value: true]_- this property is used to choose if you want decoded pictures to lazy-load or not, assigning true to this property means you want decoded pictures lazy-loaded and vice-versa.


## INTERACTING WITH THE MODULE

### decode types (element, ID, Group and list)
### BIPP UI

## BIPP EVENTS

## DECODING

## STYLING

## GENERAL NOTE

### Dealing with display:none and refreshes

## GLOSSARY
