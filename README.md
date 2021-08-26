# BIPP DOCUMENTATION

BIPP is a simple module that can be integrated with any website/web app.
BIPP is an abbreviatiion for "Background-Image Picture Processing".
BIPP main aim is to simplify image processing leveraging on CSS 'background-image', 'background-size' and 'background-position' properties.
BIPP is designed to work on old and new browsers by ensuring pure Javascript and cross-platform CSS properties.
BIPP can be customized to suit developers needs.
BIPP is a module that help developers collect pictures from users and give users calculated limited option to choose a frame that is best for them(it eliminate users need to edit picture them self, making the picture collection process simple for users and the developer) based on the developers specification.
BIPP enable developers choose the aspect ratio of image they want to collect.
BIPP's bipp-style the user chose can be assessed from 'document.bippForm.bippStyle.value' which can be stored by developers alongside other metadata of the picture

## INTEGRATION OF BIPP MODULE

---

1. To integrate BIPP to your website or web app the below codes should be copied into the \<body> tag (preferably the bottom of the \<body> tag).

```html
<link rel="stylesheet" type="text/css" href="bipp.css" />
<script type="text/javascript" src="bipp.js" async></script>
```

> NOTE;- the 2nd `<script>` tag has an attribute of `'async'` it to prevent Event Listeners used in the module from loading before the module configuration pass some element into the DOM.

2.  below code should be copied to where you want the module UI(User Interface) to be located in your mark-up

        <div id="bipp-module"></div>

> NOTE;- Only one bipp module can be integrated in a web document

3. to initialise the module 'bipp.startBipp()' function should be called with bipp configuration object as it only argument (see example below)

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
		compression:true
		autoSelect:false
};

// call to initialise module with configuration object above
bipp.startBipp(bippConfig);
```

_read more about BIPP configuration in next section_

## BIPP CONFIGURATION

## INTERACTING WITH THE MODULE

## BIPP EVENTS

## DECODING

## STYLING

## GENERAL NOTE

### Dealing with display:none and refreshes

## GLOSSARY
