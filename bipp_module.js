var bipp = (function (){
  /**
   * House the configurations use to run the module
   */
  var configuration={
    width:150,
    measureUnit:"px",
    //height ratio in reference to the width
    aspectRatio:1,
    uploaderHtml:'<div style="border:gray dashed 5px;width:250px; height:150px; color:grey; padding-top:10px;cursor: pointer;"><span style="font-size:60px;font-weight: 1000;" >&plus;</span><br><span>Upload a picture to test <b>BIPP</b></span></div>',
    uploadPrompt:"Choose A Frame That suit you",
    changeFilePrompt:"if you don't find a frame that suit you, it advisable to change the picture you want to upload",
    changeButton:"Change Picture",
    uploadStatus:"block",
    feedbackImg:"../pics/check.png",
    compression:true,
    autoSelect:false,
  }
  /**
   * Contain all the event callbacks registered by an app
   */
  var events={
		start:[],
		beforeSelect:[],//if any callback return boolean false, image selection won't be possible
		afterSelect:[],//(original image-if present,selection status)
		beforeCompress:[],//(original image)
		afterCompress:[],//(compressed image,compression status) similar to 'frameSelect' event

		frameSelect:[],//(original/compressed image,BIPPstyle) depending on compression state
		frameHover:[],// (hover event)
		uploaderHover:[],// (hover event)
		changeButtonClick:[]//(old original/compressed image,old BIPPstyle-if a frame have been previously selected) depending on compression state
	}


  // BIPP global private variable
  var module=document.getElementById('bipp-module'),
  classDecodes=[],
  IDdecodes=[],
  classPorts=[],
  currentPort="",
  sessionFileID="",
  sessionStyleID="",
  sessionOptions={},
  bippFile={},
  style={},
  styleList=["bipp-equal","bipp-width-1","bipp-width-2","bipp-height-1","bipp-height-2"],
  styleListValue=["center","left","right","top","bottom"],
  heightList=["bipp-equal","bipp-height-1","bipp-height-2"],
  heightListValue=["center","top","bottom"],
  widthList=["bipp-equal","bipp-width-1","bipp-width-2"],
  widthListValue=["center","left","right"],
  imgRatio,
  feedbackImgWidth,
  fileSelectMessage,
  low,
  high;

  // BIPP UI private variable
  var styleRadio,
  curtain,
  frame,
  framesCon,
  changeFile,
  uploadStatus,
  uploadPrompt,
  uploaderCon,
  uploader,
  canvas,
  input,
  image;

  // BIPP private functions
  /**
   * 
   * @param {string} pic image url
   * @param {string} style BIPPStyle in the format of '`bippStyle|bippCords`-`aspect ratio`'
   * @param {string} port the `ID`|`classname`|`listID` the element is attach to
   * @returns {{pictureUrl,bippStyle,port}}
   */
  function bippElement(pic,style,port){
		this.pictureUrl = pic;
		this.bippStyle = style;
		this.port = port;
	}
  function frameProcessor(width,height,transferredUrl,low,high){
    imgRatio = width/height;
    if(imgRatio<low&&!configuration.autoSelect){
      framesCon.innerHTML = "";
      for(var i=0;i<heightList.length;i++){
        framesCon.innerHTML += '<div class="bipp-frame-house"><div class="bipp-label-con"><label><div class="bipp-frame bipp '+heightList[i]+'" style="width:'+configuration.width+configuration.measureUnit+';height:'+configuration.height+configuration.measureUnit+';" onmouseover="bipp.hover(event,\'frame\')"><div class="bipp-curtain"><img class="bipp-feedback-image" src="'+configuration.feedbackImg+'" style="width:'+feedbackImgWidth+'%;" ></div><input type="radio" onchange="bipp.checkStyle('+i+')" name="bipp-style" value="'+heightListValue[i]+'-'+configuration.aspectRatio+'"></div></label></div></div>';
      }
    } else if(imgRatio >high&&!configuration.autoSelect){
      framesCon.innerHTML = "";
      for(var i=0;i<widthList.length;i++){
        framesCon.innerHTML += '<div class="bipp-frame-house"><div class="bipp-label-con"><label><div class="bipp-frame bipp '+widthList[i]+'" style="width:'+configuration.width+configuration.measureUnit+';height:'+configuration.height+configuration.measureUnit+';" onmouseover="bipp.hover(event,\'frame\')"><div class="bipp-curtain"><img class="bipp-feedback-image" src="'+configuration.feedbackImg+'" style="width:'+feedbackImgWidth+'%" ></div><input type="radio" onchange="bipp.checkStyle('+i+')" name="bipp-style" value="'+widthListValue[i]+'-'+configuration.aspectRatio+'"></div></label></div></div>';
      }
    } else {
      framesCon.innerHTML = '<div class="bipp-frame-house"><div class="bipp-label-con"><label><div class="bipp-frame bipp bipp-equal" style="width: '+configuration.width+configuration.measureUnit+';height:'+configuration.height+configuration.measureUnit+';" onmouseover="bipp.hover(event,\'frame\')"><div class="bipp-curtain" style="display: block;"><img class="bipp-feedback-image" src="'+configuration.feedbackImg+'" style="width:'+feedbackImgWidth+'%" ></div><input type="radio" name="bipp-style" value="center'+'-'+configuration.aspectRatio+'" checked></div></label></div></div>';
      style[sessionStyleID] = styleRadio[0].value;
      // frameSelect EVENT TRIGGER - before image compression
      eventEmit("frameSelect")

      compressImage();
    }
    for(var i=0;i<frame.length;i++){
      frame[i].style.backgroundImage = "url("+transferredUrl+")";
    }
  }
  function inputChange(e){
    if(!sessionFileID){
      sessionFileID="default";
      sessionStyleID="default";
    }
    //Get file
    var file=bippFile[sessionFileID] = e.target.files[0];
    uploadStatus.style.display = configuration.uploadStatus;
    var messageResult = ["No Picture Selected","Selected file is not a picture","Picture Selected"]

    if (file&&(file.type.indexOf("image")!=-1)) {
      // file type checking should be done to know if the uploaded file was an image or other file type
      framesCon.style.display = "block";
      image.style.display = "inline";
      image.src = URL.createObjectURL(file);
      changeFile.style.display = "block";
      uploadStatus.innerHTML = '<b style="color:#484">'+messageResult[2]+'</b>';
      fileSelectMessage = messageResult[2];
      uploadPrompt.style.display = "block";
      uploaderCon.style.display = "none";
    } else{
      framesCon.style.display = "none";
      changeFile.style.display = "none";
      uploadPrompt.style.display = "none";
      uploaderCon.style.display = "block";

      // To prevent throwing of Uncaught error if file == undefined
      try {
        if(file.type.indexOf("image")==-1){
          uploadStatus.innerHTML = '<b style="color:#f77">'+messageResult[1]+'</b><br><br>';
          fileSelectMessage = messageResult[1];
          bippFile[sessionFileID] = undefined;
          style[sessionStyleID]=undefined
        }
      } catch (err) {
        uploadStatus.innerHTML = '<b style="color:#f77">'+messageResult[0]+'</b><br><br>';
        fileSelectMessage = messageResult[0];
      }
    }

    // afterSelect EVENT TRIGGER
    eventEmit("afterSelect")
  }
  function imageLoad(e) {
    // To get the #bipp-image width and height when image is uploaded		
  
    // the #bipp-image is hidden after the width and height has been gotten, bipp Canvas also use it to draw it image
    image.style.display = "none";
  
    //Aspect ratio ranges
    var ratio = configuration.aspectRatio;
    var AB = 1.17,BC = 1.42,CD=1.64,DE=2.06,FG=0.5,GH=0.62,HI=0.71,AI=0.88;
    var Arange = ratio >= AI && ratio < AB,Brange = ratio >= AB && ratio < BC,Crange = ratio >= BC && ratio < CD,Drange = ratio >= CD && ratio < DE,Erange = ratio >= DE,Frange = ratio < FG,Grange = ratio >= FG && ratio < GH,Hrange = ratio >= GH && ratio < HI,Irange = ratio >= HI && ratio < AI;
  
    if (Arange) {
    low = AI;
    high=AB;
    } else if (Brange) {
    low = AB;
    high=BC;
    } else if (Crange) {
    low = BC;
    high=CD;
    } else if (Drange) {
    low = CD;
    high=DE;
    } else if (Erange) {
    low = DE;
    high=Infinity;
    } else if (Frange) {
    low = 0;
    high=FG;
    } else if (Grange) {
    low = FG;
    high=GH;
    } else if (Hrange) {
    low = GH;
    high=HI;
    } else {
    low = HI;
    high=AI;
    }
    if (ratio <= 1) {
      feedbackImgWidth = 100;
    } else {
      feedbackImgWidth = 100*(1/ratio);
    }
    frameProcessor(image.width,image.height,image.src,low,high);

  }
  function compressImage(){
    // To draw image on Canvas and get a blob from the canvas, the blob file is then passed to bippFile, but if user-agent/browser does not support HTMLCanvasElement or CanvasRenderingContext2D or HTMLElement.toBlob() method bippFile will contain the user original inputed image -which can be significantly heavy-

    var isCanvasSupported = !!window.CanvasRenderingContext2D && !!window.HTMLCanvasElement && !!canvas.getContext && !!canvasContext;
    var isToBlobSupported = !!canvas.toBlob;
    var blobCanBeCreated = configuration.compression && isToBlobSupported && isCanvasSupported;
    if(sessionOptions.compression){
      blobCanBeCreated = sessionOptions.compression && isToBlobSupported && isCanvasSupported;
    }
  
    if(blobCanBeCreated){
      // beforeCompress EVENT TRIGGER
      eventEmit("beforeCompress")

      var BIPP_CANVAS_WIDTH = sessionOptions.width || configuration.width;
      var BIPP_CANVAS_RATIO = sessionOptions.aspectRatio || configuration.aspectRatio;
      canvas.width = BIPP_CANVAS_WIDTH;
      var BIPP_CANVAS_HEIGHT = canvas.height = BIPP_CANVAS_WIDTH/BIPP_CANVAS_RATIO;
      var bippStyleStyle = getStyle(sessionStyleID).split("-")[0];
  
      // use the bippstyle to draw image on Canvas
      switch(bippStyleStyle){
        case "left":
          canvasContext.drawImage(image, 0, 0,BIPP_CANVAS_HEIGHT*imgRatio,BIPP_CANVAS_HEIGHT);
          break;
        case "right":
          canvasContext.drawImage(image,-((BIPP_CANVAS_HEIGHT*imgRatio)-BIPP_CANVAS_WIDTH), 0,BIPP_CANVAS_HEIGHT*imgRatio,BIPP_CANVAS_HEIGHT);
          break;
        case "top":
          canvasContext.drawImage(image, 0, 0,BIPP_CANVAS_WIDTH,BIPP_CANVAS_WIDTH/imgRatio);
          break;
        case "bottom":
          canvasContext.drawImage(image, 0, -((BIPP_CANVAS_WIDTH/imgRatio)-BIPP_CANVAS_HEIGHT),BIPP_CANVAS_WIDTH,BIPP_CANVAS_WIDTH/imgRatio);
          break;
        case "center":
          if(imgRatio < BIPP_CANVAS_RATIO){
            canvasContext.drawImage(image, 0, -((BIPP_CANVAS_WIDTH/imgRatio)-BIPP_CANVAS_HEIGHT)/2,BIPP_CANVAS_WIDTH,BIPP_CANVAS_WIDTH/imgRatio);
          } else if(imgRatio > BIPP_CANVAS_RATIO){
            canvasContext.drawImage(image, -((BIPP_CANVAS_HEIGHT*imgRatio)-BIPP_CANVAS_WIDTH)/2,0,BIPP_CANVAS_HEIGHT*imgRatio,BIPP_CANVAS_HEIGHT);
          } else {
            canvasContext.drawImage(image,0,0,BIPP_CANVAS_WIDTH,BIPP_CANVAS_HEIGHT);
          }
          break;
        default:console.error("bippstyle is empty, BIPP compression can't be done");
          break;
      }
      if(!sessionFileID){
        sessionFileID="default";
        sessionStyleID="default"
      }
      canvas.toBlob(function(blob){
        // Gave the blob a "name" and "lastModifiedDate" to make it a file
        blob.name = bippFile[sessionFileID].name.split(".")[0]+".jpg";
        blob.lastModifiedDate = new Date();
        bippFile[sessionFileID] = blob;
        // afterCompress EVENT TRIGGER
        eventEmit("afterCompress","success")
        resetSession()
      },"image/jpeg");
      
    } else{
      if(!configuration.compression || (sessionOptions.compression!==undefined&&!sessionOptions.compression)){
        console.log("%c Compression is set to false in BIPP config or session Options, provided image won't be compressed.\n 'beforeCompress' and 'afterCompress' events won't trigger","color:blue");
        // afterCompress EVENT TRIGGER
        eventEmit("afterCompress","compression is false")
        resetSession()
      } else{
        console.error("Browser doesn't support canvas rendering or HTMLElement.toBlob() method, compressed version of inputed image can't be created. \n The uncompressed original image inputed by the user is passed to 'bipp.getFile()' instead.");
        // afterCompress EVENT TRIGGER
        eventEmit("afterCompress","browser error")
        resetSession()
      }
    }
    function resetSession() {
      sessionFileID="";
      sessionStyleID="";
      sessionOptions={};
    }
  }
  function eventEmit(eventName,eventLoad){
    var eventsCall = events[eventName];

    switch(eventName){
      case "start":
        if(eventsCall[0]){
          for(var i=0;i<eventsCall.length;i++){
            eventsCall[i]()
          }
        }
        break;
      case "beforeSelect":
        var returns = [];
        if(eventsCall[0]){
          for(var i=0;i<eventsCall.length;i++){
            returns.push(eventsCall[i](sessionFileID))
          }
          return returns;
        }
        break;
      case "afterSelect":
        var bippFile = getFile();
        var bippMessage = fileSelectMessage;

        if(eventsCall[0]){
          for(var i=0;i<eventsCall.length;i++){
            eventsCall[i](bippFile,sessionFileID,bippMessage)
          }
        }
        break;
      case "beforeCompress":
        var bippFile = getFile();
        if(eventsCall[0]){
          for(var i=0;i<eventsCall.length;i++){
            eventsCall[i](bippFile,sessionFileID)
          }
        }
        break;
      case "afterCompress":
        var bippFile = getFile();

        if(eventsCall[0]){
          for(var i=0;i<eventsCall.length;i++){
            eventsCall[i](bippFile,sessionFileID,eventLoad)
          }
        }
        break;
      case "frameSelect":
        var bippFile = getFile();
        var bippStyle = getStyle()
        if(eventsCall[0]){
          for(var i=0;i<eventsCall.length;i++){
            eventsCall[i](bippFile,bippStyle)
          }
        }
        break;
      case "frameHover":
        if(eventsCall[0]){
          for(var i=0;i<eventsCall.length;i++){
            eventsCall[i](eventLoad)
          }
        }
        break;
      case "uploaderHover":
        if(eventsCall[0]){
          for(var i=0;i<eventsCall.length;i++){
            eventsCall[i](eventLoad)
          }
        }
        break;
      case "changeButtonClick":
        var bippFile = getFile();
        var bippStyle = getStyle()

        if(eventsCall[0]){
          for(var i=0;i<eventsCall.length;i++){
            eventsCall[i](bippFile,bippStyle)
          }
        }
        break;
      default:console.error("no such eventName ---->"+eventName);
    }

  }



  // BIPP UI public function
  function changeImage(){
    // changeButtonClick EVENT TRIGGER
    eventEmit("changeButtonClick")

    style.default = "";
    input.click();
  }
  function hover(e,eventType){
    switch (eventType) {
      case "frame":
        // frameHover EVENT TRIGGER
        eventEmit("frameHover",e)
        break;
      case "uploader":
        // uploaderHover EVENT TRIGGER
        eventEmit("uploaderHover",e)
        break;
      default:
        break;
    }
  }
  function checkStyle(position){
    for(var i=0;i<curtain.length;i++){
      curtain[i].style.display = "none";
    }
    style[sessionStyleID] = styleRadio[position].value;
    curtain[position].style.display = "block";
    // frameSelect EVENT TRIGGER - before image compression
    eventEmit("frameSelect")

    compressImage();
  }




  // BIPP public functions
  function startBipp(config){
		if(config.frameWidth)configuration.width = config.frameWidth;
		if(config.measurementUnit)configuration.measureUnit = config.measurementUnit;
		if(config.aspectRatio)configuration.aspectRatio = config.aspectRatio;
		if(config.uploaderHtml)configuration.uploaderHtml = config.uploaderHtml;
		if(config.uploadPrompt)configuration.uploadPrompt = config.uploadPrompt;
		if(config.changeFilePrompt)configuration.changeFilePrompt = config.changeFilePrompt;
		if(config.changeButton)configuration.changeButton = config.changeButton;
		if(config.uploadStatus!=undefined&&!config.uploadStatus)configuration.uploadStatus = "none";
		if(config.feedbackImgUrl)configuration.feedbackImg = config.feedbackImgUrl;
		if(config.compression!=undefined)configuration.compression=config.compression;
		configuration.height=configuration.width/configuration.aspectRatio;
		if(config.autoSelect)configuration.autoSelect = config.autoSelect;

		module.innerHTML = '<div id="bipp-uploader-con"><label><div id="bipp-uploader" onmouseover="bipp.hover(event,\'uploader\')">'+configuration.uploaderHtml+'</div><input id="bipp-input" type="file" accept="image/*" tabindex="0"></label></div><!-- A mock tag that is used to get the width and height of uploaded image --><img id="bipp-image"><div id="bipp-upload-status"></div><div id="bipp-upload-prompt">'+configuration.uploadPrompt+'</div><div id="bipp-frames-container"><input type="radio" name="bipp-style" value="" style="width:20px;height:20px" checked></div><div id="bipp-change-file"><div id="bipp-change-file-prompt">'+configuration.changeFilePrompt+'</div><canvas id="bipp-canvas" width="'+configuration.width+'" height="'+configuration.height+'" style="display:none"></canvas><button id="bipp-change-button" onclick="bipp.changeImage()">'+configuration.changeButton+'</button></div>';

		styleRadio = document.getElementsByName("bipp-style"),
    curtain = document.getElementsByClassName("bipp-curtain"),
    frame = document.getElementsByClassName("bipp-frame"),
    framesCon = document.getElementById("bipp-frames-container"),
    changeFile =document.getElementById("bipp-change-file"),
    uploadStatus = document.getElementById("bipp-upload-status"),
    uploadPrompt = document.getElementById("bipp-upload-prompt"),
    uploaderCon = document.getElementById("bipp-uploader-con"),
    uploader = document.getElementById("bipp-uploader"),
    canvas = document.getElementById("bipp-canvas"),
    input = document.getElementById("bipp-input"),
    image = document.getElementById("bipp-image");

		// Listen for when keyboard focus on bipp-input, for User Accessibility
		input.addEventListener('focusin', function(){
			uploader.style.outline = "solid";
		});
		input.addEventListener('focusout', function(){
			uploader.style.outline = "none";
		});
		input.addEventListener('change', inputChange);
		image.addEventListener('load', imageLoad);
		canvasContext = canvas.getContext("2d");

		// START EVENT TRIGGERS
		eventEmit("start")
	}
	function decodeClass(pictureUrl,bippStyle,classPort){
	
		if(!pictureUrl){
			return console.error("An argument in bipp.decodeClass() is either null or missing\nno picture to render");
		}
		if(!bippStyle){
			return console.error("An argument in bipp.decodeClass() is either null or missing\nno bippStyle to render");
		}
		if(!classPort){
			return console.error("An argument in bipp.decodeClass() is either null or missing\nno classport to render");
		}

		classDecodes.push(new bippElement(pictureUrl,bippStyle,classPort));

		if(classPort==currentPort){
		} else{
			// to get the index number of the last element in the array
			var h = classPorts.length-1;
	
			if (classPorts.length == 0){
				classPorts.push(classPort);
				currentPort = classPort;
			} else {
				for(var i=0;i<classPorts.length;i++){
					if(classPort == classPorts[i]){
						break;
					} else if(classPort !== classPorts[i] && i == h){
						classPorts.push(classPort);
						currentPort = classPort;
						break;
					} else{
					}
				}
			}
		}

	}
	function decodeID(pictureUrl,bippStyle,IDPort){
		var decodesPlaceholder = [];
		for(var i=0;i<IDdecodes.length;i++){
			if(IDdecodes[i].port!=IDPort){
				decodesPlaceholder.push(IDdecodes[i]);
				continue;
			}
		}
		decodesPlaceholder.push(new bippElement(pictureUrl,bippStyle,IDPort));
		IDdecodes = decodesPlaceholder;
		
		var port = document.getElementById(IDPort);
		var currentBippStyle = bippStyle.split("-");
		var styleValue = currentBippStyle[0];
		var styleRatio = currentBippStyle[1];
	
		port.style.backgroundImage = "url("+pictureUrl+")";
		port.style.height = port.scrollWidth/styleRatio+configuration.measureUnit;
		if(port.className.indexOf("bipp")==-1){
			for(var i=0;i<styleListValue.length;i++){
				if(styleValue == styleListValue[i]){
					port.className += " "+styleList[i]+" bipp";
					break;
				}
			}
		}else{
			// Below code enable the replacement of BIPPstyle of a BIPP element that previously have a BIPPstyle
			var bippCorrect=false;
			for(var i=0,len=styleListValue;i<len;i++){
				if(styleListValue[i]==styleValue){
					bippCorrect=true;break;
				}
			}
			if(bippCorrect)port.className = port.className.replace(styleListValue[0],styleValue).replace(styleListValue[1],styleValue).replace(styleListValue[2],styleValue).replace(styleListValue[3],styleValue).replace(styleListValue[4],styleValue);
			else console.error("Invalid BIPPStyle cannot be passed to "+IDPort+"(ID of an HTMLElement)");
		}
	}
	function refreshAllClass(){
		var ports = classPorts;
		for(var x=0;x<ports.length;x++){
			var currentPort = document.getElementsByClassName(ports[x]);
			var queryResult = [];
			for(var i=0;i<classDecodes.length;i++){
				if(classDecodes[i].port==ports[x]){
					queryResult.push(classDecodes[i]);
				}
			}
			for(var i=0;i<queryResult.length;i++){
				var currentBippStyle = queryResult[i].bippStyle.split("-");
				var styleValue = currentBippStyle[0];
				var styleRatio = currentBippStyle[1];

				currentPort[i].style.backgroundImage = "url("+queryResult[i].pictureUrl+")";
				currentPort[i].style.height = currentPort[i].scrollWidth/styleRatio+configuration.measureUnit;
				
				if(currentPort[i].className.indexOf("bipp")==-1){
					for(var ii=0;ii<styleListValue.length;ii++){
						if(styleValue == styleListValue[ii]){
							currentPort[i].className += " "+styleList[ii]+" bipp";
							break;
						}
					}
				}
			}
		}
	}
	function refreshAllID(){
		var ports = IDdecodes;
		for(var i=0;i<ports.length;i++){
			var port = document.getElementById(ports[i].port);
			if(port){
				var style = ports[i].bippStyle.split("-");
				port.style.height = port.scrollWidth/style[1]+configuration.measureUnit;
			}
		}
	}
	function refreshClass(classPort){
		var ports = classPorts;
		var index = ports.indexOf(classPort);
		if(index!==-1){
			var currentPort = document.getElementsByClassName(classPort);
			var decodeArray = classDecodes;
			var queryResult = [];
			for(var i=0;i<decodeArray.length;i++){
				if(decodeArray[i].port==classPort){
					queryResult.push(decodeArray[i]);
				}
			}
			for(var i=0;i<queryResult.length;i++){
				var currentBippStyle = queryResult[i].bippStyle.split("-");
				var styleValue = currentBippStyle[0];
				var styleRatio = currentBippStyle[1];
	
				currentPort[i].style.backgroundImage = "url("+queryResult[i].pictureUrl+")";
				currentPort[i].style.height = currentPort[i].scrollWidth/styleRatio+configuration.measureUnit;
				
				if(currentPort[i].className.indexOf("bipp")==-1){
					for(var ii=0;ii<styleListValue.length;ii++){
						if(styleValue == styleListValue[ii]){
							currentPort[i].className += " "+styleList[ii]+" bipp";
							break;
						}
					}
				}
			}
		} else{
			console.error("The classPort \""+classPort+"\" to be refreshed have not been decoded");
		}
	}
	function refreshID(IDport){
		var ports = IDdecodes;
		var index = -1;
		for(var i=0;i<ports.length;i++){
			if(ports[i].port==IDport){
				index = i;
				break;
			}
		}

		if(index!==-1){
			var port = document.getElementById(IDport);
			if(port){
				var style = ports[index].bippStyle.split("-");
				port.style.height = port.scrollWidth/style[1]+configuration.measureUnit;
			}
		} else{
			console.error(new Error("The IDport to be refreshed have not been decoded"));
		}
	}
	function refreshAll(){
		// To Re-render classPorts
		refreshAllClass();
	
		// To Re-render IDPorts
		refreshAllID()
	}
	function getFile(bippFileID){
		if(bippFileID&& typeof bippFileID=="string")return bippFile[bippFileID];
		return bippFile;
	}
	function getStyle(bippStyleID){
		if(bippStyleID&& typeof bippStyleID=="string")return style[bippStyleID];
		return style;
	}
	function selectImage(bippFileID,options){
		if(!bippFileID || typeof bippFileID!="string"){
			return
			// emit an error event that let user know the error type
		}
		// beforeSelect EVENT TRIGGER
		var eventReturns = eventEmit("beforeSelect") || [];
		for(var i=0;i<eventReturns.length;i++){
			if(eventReturns[i]==false){
				// if any item in eventReturns is equal to boolean false
				// 	stop the loop and exit the function before clicking bipp-input
				return
				// emit an error event that let user know the error type
			}
		}
		// if all items in eventReturns is equal to boolean true or undefined
		// 	bipp-input should be clicked for image selection
		sessionFileID=bippFileID;
		sessionStyleID=bippFileID;
		if(options && typeof options == 'object'){
			sessionOptions = options;
		}

		// Clearing previously selected file
		input.value="";

		// if value is still `true` after above clearing, fallback for older browser is attempted
		if(input.value){
			input.value.type='text';
			input.value.type=='file';
		}

		input.click();
	}
	function resetFile(bippFileID){
		bippFile[bippFileID] = undefined;
		style[bippFileID] = undefined;
	}
	//return(boolean,message)
	function canCompress(){
		var isCanvasSupported = !!window.CanvasRenderingContext2D && !!window.HTMLCanvasElement && !!canvas.getContext && !!canvasContext;
		var isToBlobSupported = !!canvas.toBlob;
		var blobCanBeCreated = configuration.compression && isToBlobSupported && isCanvasSupported;
	
		return blobCanBeCreated;
	}
	function on(eventName,callback){
		switch(eventName){
			case "start":
				events.start.push(callback)
				break;
			case "beforeSelect":
				events.beforeSelect.push(callback)
				break;
			case "afterSelect":
				events.afterSelect.push(callback)
				break;
			case "beforeCompress":
				events.beforeCompress.push(callback)
				break;
			case "afterCompress":
				events.afterCompress.push(callback)
				break;
			case "frameSelect":
				events.frameSelect.push(callback)
				break;
			case "frameHover":
				events.frameHover.push(callback)
				break;
			case "uploaderHover":
				events.uploaderHover.push(callback)
				break;
			case "changeButtonClick":
				events.changeButtonClick.push(callback)
				break;
			default: console.trace(eventName+" is not an eventName");
				console.error(eventName+" is not an eventName")
		}
	}


  window.addEventListener('resize',function(){
    refreshAll();
  });

  return {
    start:startBipp,
    decodeClass:decodeClass,
    decodeID:decodeID,
    refreshAllClass:refreshAllClass,
    refreshAllID:refreshAllID,
    refreshClass:refreshClass,
    refreshID:refreshID,
    refreshAll:refreshAll,
    getFile:getFile,
    getStyle:getStyle,
    selectImage:selectImage,
    resetFile:resetFile,
    canCompress:canCompress,
    on:on,
    changeImage:changeImage,
    hover:hover,
    checkStyle:checkStyle
  }
})();
window.bipp=bipp;