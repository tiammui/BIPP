var observerSupport = "IntersectionObserver" in window;

var bipp = {
	var:{
		module:document.getElementById('bipp-module'),
		classDecodes:[],
		IDdecodes:[],
		classPorts:[],
		currentPort:"",
		sessionFileID:"",
		sessionStyleID:"",
		sessionOptions:{},
		bippFile:{},
		style:{},
		styleList:["bipp-equal","bipp-width-1","bipp-width-2","bipp-height-1","bipp-height-2"],
		styleListValue:["center","left","right","top","bottom"],
		heightList:["bipp-equal","bipp-height-1","bipp-height-2"],
		heightListValue:["center","top","bottom"],
		widthList:["bipp-equal","bipp-width-1","bipp-width-2"],
		widthListValue:["center","left","right"]
	},
	utility:{
		frameProcessor:function(width,height,transferredUrl,low,high){
			bipp.var.imgRatio = width/height;
			if(bipp.var.imgRatio<low&&!bipp.autoSelect){
				bipp.var.framesCon.innerHTML = "";
				for(var i=0;i<bipp.var.heightList.length;i++){
					bipp.var.framesCon.innerHTML += '<div class="bipp-frame-house"><div class="bipp-label-con"><label><div class="bipp-frame bipp '+bipp.var.heightList[i]+'" style="width:'+bipp.width+bipp.measureUnit+';height:'+bipp.height+bipp.measureUnit+';" onmouseover="bipp.utility.hover(event,\'frame\')"><div class="bipp-curtain"><img class="bipp-feedback-image" src="'+bipp.feedbackImg+'" style="width:'+bipp.var.feedbackImgWidth+'%;" ></div><input type="radio" onchange="bipp.utility.checkStyle('+i+')" name="bipp-style" value="'+bipp.var.heightListValue[i]+'-'+bipp.aspectRatio+'"></div></label></div></div>';
				}
			} else if(bipp.var.imgRatio >high&&!bipp.autoSelect){
				bipp.var.framesCon.innerHTML = "";
				for(var i=0;i<bipp.var.widthList.length;i++){
					bipp.var.framesCon.innerHTML += '<div class="bipp-frame-house"><div class="bipp-label-con"><label><div class="bipp-frame bipp '+bipp.var.widthList[i]+'" style="width:'+bipp.width+bipp.measureUnit+';height:'+bipp.height+bipp.measureUnit+';" onmouseover="bipp.utility.hover(event,\'frame\')"><div class="bipp-curtain"><img class="bipp-feedback-image" src="'+bipp.feedbackImg+'" style="width:'+bipp.var.feedbackImgWidth+'%" ></div><input type="radio" onchange="bipp.utility.checkStyle('+i+')" name="bipp-style" value="'+bipp.var.widthListValue[i]+'-'+bipp.aspectRatio+'"></div></label></div></div>';
				}
			} else {
				bipp.var.framesCon.innerHTML = '<div class="bipp-frame-house"><div class="bipp-label-con"><label><div class="bipp-frame bipp bipp-equal" style="width: '+bipp.width+bipp.measureUnit+';height:'+bipp.height+bipp.measureUnit+';" onmouseover="bipp.utility.hover(event,\'frame\')"><div class="bipp-curtain" style="display: block;"><img class="bipp-feedback-image" src="'+bipp.feedbackImg+'" style="width:'+bipp.var.feedbackImgWidth+'%" ></div><input type="radio" name="bipp-style" value="center'+'-'+bipp.aspectRatio+'" checked></div></label></div></div>';
				bipp.var.style[bipp.var.sessionStyleID] = bipp.var.styleRadio[0].value;
				// frameSelect EVENT TRIGGER - before image compression
				bipp.utility.eventEmit("frameSelect")

				this.compressImage();
			}
			for(var i=0;i<bipp.var.frame.length;i++){
				bipp.var.frame[i].style.backgroundImage = "url("+transferredUrl+")";
			}
		},
		inputChange:function(e){
			if(!bipp.var.sessionFileID){
				bipp.var.sessionFileID="default";
				bipp.var.sessionStyleID="default";
			}
			//Get file
			var bippFile=bipp.var.bippFile[bipp.var.sessionFileID] = e.target.files[0];
			bipp.var.uploadStatus.style.display = bipp.uploadStatus;
			var messageResult = ["No Picture Selected","Selected file is not a picture","Picture Selected"]

			if (bippFile&&(bippFile.type.indexOf("image")!=-1)) {
				// file type checking should be done to know if the uploaded file was an image or other file type
				bipp.var.framesCon.style.display = "block";
				bipp.var.image.style.display = "inline";
				bipp.var.image.src = URL.createObjectURL(bippFile);
				bipp.var.changeFile.style.display = "block";
				bipp.var.uploadStatus.innerHTML = '<b style="color:#484">'+messageResult[2]+'</b>';
				bipp.var.fileSelectMessage = messageResult[2];
				bipp.var.uploadPrompt.style.display = "block";
				bipp.var.uploaderCon.style.display = "none";
			} else{
				bipp.var.framesCon.style.display = "none";
				bipp.var.changeFile.style.display = "none";
				bipp.var.uploadPrompt.style.display = "none";
				bipp.var.uploaderCon.style.display = "block";

				// To prevent throwing of Uncaught error if bippFile == undefined
				try {
					if(bippFile.type.indexOf("image")==-1){
						bipp.var.uploadStatus.innerHTML = '<b style="color:#f77">'+messageResult[1]+'</b><br><br>';
						bipp.var.fileSelectMessage = messageResult[1];
						bipp.var.bippFile[bipp.var.sessionFileID] = undefined;
						bipp.var.style[bipp.var.sessionStyleID]=undefined
					}
				} catch (err) {
					bipp.var.uploadStatus.innerHTML = '<b style="color:#f77">'+messageResult[0]+'</b><br><br>';
					bipp.var.fileSelectMessage = messageResult[0];
				}
			}

			// afterSelect EVENT TRIGGER
			bipp.utility.eventEmit("afterSelect")
		},
		imageLoad:function(e) {
			// To get the #bipp-image width and height when image is uploaded		
		
			// the #bipp-image is hidden after the width and height has been gotten, bipp.var.Canvas also use it to draw it image
			bipp.var.image.style.display = "none";
		
			//Aspect ratio ranges
			var ratio = bipp.aspectRatio;
			var AB = 1.17,BC = 1.42,CD=1.64,DE=2.06,FG=0.5,GH=0.62,HI=0.71,AI=0.88;
			var Arange = ratio >= AI && ratio < AB,Brange = ratio >= AB && ratio < BC,Crange = ratio >= BC && ratio < CD,Drange = ratio >= CD && ratio < DE,Erange = ratio >= DE,Frange = ratio < FG,Grange = ratio >= FG && ratio < GH,Hrange = ratio >= GH && ratio < HI,Irange = ratio >= HI && ratio < AI;
		
			if (Arange) {
			bipp.var.low = AI;
			bipp.var.high=AB;
			} else if (Brange) {
			bipp.var.low = AB;
			bipp.var.high=BC;
			} else if (Crange) {
			bipp.var.low = BC;
			bipp.var.high=CD;
			} else if (Drange) {
			bipp.var.low = CD;
			bipp.var.high=DE;
			} else if (Erange) {
			bipp.var.low = DE;
			bipp.var.high=Infinity;
			} else if (Frange) {
			bipp.var.low = 0;
			bipp.var.high=FG;
			} else if (Grange) {
			bipp.var.low = FG;
			bipp.var.high=GH;
			} else if (Hrange) {
			bipp.var.low = GH;
			bipp.var.high=HI;
			} else {
			bipp.var.low = HI;
			bipp.var.high=AI;
			}
			if (ratio <= 1) {
				bipp.var.feedbackImgWidth = 100;
			} else {
				bipp.var.feedbackImgWidth = 100*(1/ratio);
			}
			bipp.utility.frameProcessor(bipp.var.image.width,bipp.var.image.height,bipp.var.image.src,bipp.var.low,bipp.var.high);

		},
		checkStyle:function(position){
			for(var i=0;i<bipp.var.curtain.length;i++){
				bipp.var.curtain[i].style.display = "none";
			}
			bipp.var.style[bipp.var.sessionStyleID] = bipp.var.styleRadio[position].value;
			bipp.var.curtain[position].style.display = "block";
			// frameSelect EVENT TRIGGER - before image compression
			bipp.utility.eventEmit("frameSelect")

			this.compressImage();
		},
		compressImage:function(){
			// To draw image on this.var.Canvas and get a blob from the canvas, the blob file is then passed to bipp.var.bippFile, but if user-agent/browser does not support HTMLCanvasElement or CanvasRenderingContext2D or HTMLElement.toBlob() method bipp.var.bippFile will contain the user original inputed image -which can be significantly heavy-
	
			var isCanvasSupported = !!window.CanvasRenderingContext2D && !!window.HTMLCanvasElement && !!bipp.var.canvas.getContext && !!bipp.var.canvasContext;
			var isToBlobSupported = !!bipp.var.canvas.toBlob;
			var blobCanBeCreated = bipp.compression && isToBlobSupported && isCanvasSupported;
			if(bipp.var.sessionOptions.compression){
				blobCanBeCreated = bipp.var.sessionOptions.compression && isToBlobSupported && isCanvasSupported;
			}
		
			if(blobCanBeCreated){
				// beforeCompress EVENT TRIGGER
				bipp.utility.eventEmit("beforeCompress")

				var BIPP_CANVAS_WIDTH = bipp.var.sessionOptions.width || bipp.width;
				var BIPP_CANVAS_RATIO = bipp.var.sessionOptions.aspectRatio || bipp.aspectRatio;
				bipp.var.canvas.width = BIPP_CANVAS_WIDTH;
				var BIPP_CANVAS_HEIGHT = bipp.var.canvas.height = BIPP_CANVAS_WIDTH/BIPP_CANVAS_RATIO;
				var bippStyleStyle = bipp.getStyle(bipp.var.sessionStyleID).split("-")[0];
				var imgRatio = bipp.var.imgRatio;
		
				// use the bippstyle to draw image on this.var.Canvas
				switch(bippStyleStyle){
					case "left":
						bipp.var.canvasContext.drawImage(bipp.var.image, 0, 0,BIPP_CANVAS_HEIGHT*imgRatio,BIPP_CANVAS_HEIGHT);
						break;
					case "right":
						bipp.var.canvasContext.drawImage(bipp.var.image,-((BIPP_CANVAS_HEIGHT*imgRatio)-BIPP_CANVAS_WIDTH), 0,BIPP_CANVAS_HEIGHT*imgRatio,BIPP_CANVAS_HEIGHT);
						break;
					case "top":
						bipp.var.canvasContext.drawImage(bipp.var.image, 0, 0,BIPP_CANVAS_WIDTH,BIPP_CANVAS_WIDTH/imgRatio);
						break;
					case "bottom":
						bipp.var.canvasContext.drawImage(bipp.var.image, 0, -((BIPP_CANVAS_WIDTH/imgRatio)-BIPP_CANVAS_HEIGHT),BIPP_CANVAS_WIDTH,BIPP_CANVAS_WIDTH/imgRatio);
						break;
					case "center":
						if(imgRatio < BIPP_CANVAS_RATIO){
							bipp.var.canvasContext.drawImage(bipp.var.image, 0, -((BIPP_CANVAS_WIDTH/imgRatio)-BIPP_CANVAS_HEIGHT)/2,BIPP_CANVAS_WIDTH,BIPP_CANVAS_WIDTH/imgRatio);
						} else if(imgRatio > BIPP_CANVAS_RATIO){
							bipp.var.canvasContext.drawImage(bipp.var.image, -((BIPP_CANVAS_HEIGHT*imgRatio)-BIPP_CANVAS_WIDTH)/2,0,BIPP_CANVAS_HEIGHT*imgRatio,BIPP_CANVAS_HEIGHT);
						} else {
							bipp.var.canvasContext.drawImage(bipp.var.image,0,0,BIPP_CANVAS_WIDTH,BIPP_CANVAS_HEIGHT);
						}
						break;
					default:console.error("bippstyle is empty, BIPP compression can't be done");
						break;
				}
				if(!bipp.var.sessionFileID){
					bipp.var.sessionFileID="default";
					bipp.var.sessionStyleID="default"
				}
				bipp.var.canvas.toBlob(function(blob){
					// Gave the blob a "name" and "lastModifiedDate" to make it a file
					blob.name = bipp.var.bippFile[bipp.var.sessionFileID].name.split(".")[0]+".jpg";
					blob.lastModifiedDate = new Date();
					bipp.var.bippFile[bipp.var.sessionFileID] = blob;
					// afterCompress EVENT TRIGGER
					bipp.utility.eventEmit("afterCompress","success")
					resetSession()
				},"image/jpeg");
				
			} else{
				if(!bipp.compression || (bipp.var.sessionOptions.compression!==undefined&&!bipp.var.sessionOptions.compression)){
					console.log("%c Compression is set to false in BIPP config or session Options, provided image won't be compressed.\n 'beforeCompress' and 'afterCompress' events won't trigger","color:blue");
					// afterCompress EVENT TRIGGER
					bipp.utility.eventEmit("afterCompress","compression is false")
					resetSession()
				} else{
					console.error("Browser doesn't support canvas rendering or HTMLElement.toBlob() method, compressed version of inputed image can't be created. \n The uncompressed original image inputed by the user is passed to 'bipp.getFile()' instead.");
					// afterCompress EVENT TRIGGER
					bipp.utility.eventEmit("afterCompress","browser error")
					resetSession()
				}
			}
			function resetSession() {
				bipp.var.sessionFileID="";
				bipp.var.sessionStyleID="";
				bipp.var.sessionOptions={};
			}
		},
		changeImage:function(){
			// changeButtonClick EVENT TRIGGER
			bipp.utility.eventEmit("changeButtonClick")

			bipp.var.style.default = "";
			bipp.var.input.click();
		},
		eventEmit:function(eventName,eventLoad){
			var events = bipp.events[eventName];

			switch(eventName){
				case "start":
					if(events[0]){
						for(var i=0;i<events.length;i++){
							events[i]()
						}
					}
					break;
				case "beforeSelect":
					var returns = [];
					if(events[0]){
						for(var i=0;i<events.length;i++){
							returns.push(events[i](bipp.var.sessionFileID))
						}
						return returns;
					}
					break;
				case "afterSelect":
					var bippFile = bipp.getFile();
					var bippMessage = bipp.var.fileSelectMessage;

					if(events[0]){
						for(var i=0;i<events.length;i++){
							events[i](bippFile,bipp.var.sessionFileID,bippMessage)
						}
					}
					break;
				case "beforeCompress":
					var bippFile = bipp.getFile();
					if(events[0]){
						for(var i=0;i<events.length;i++){
							events[i](bippFile,bipp.var.sessionFileID)
						}
					}
					break;
				case "afterCompress":
					var bippFile = bipp.getFile();

					if(events[0]){
						for(var i=0;i<events.length;i++){
							events[i](bippFile,bipp.var.sessionFileID,eventLoad)
						}
					}
					break;
				case "frameSelect":
					var bippFile = bipp.getFile();
					var bippStyle = bipp.getStyle()
					if(events[0]){
						for(var i=0;i<events.length;i++){
							events[i](bippFile,bippStyle)
						}
					}
					break;
				case "frameHover":
					if(events[0]){
						for(var i=0;i<events.length;i++){
							events[i](eventLoad)
						}
					}
					break;
				case "uploaderHover":
					if(events[0]){
						for(var i=0;i<events.length;i++){
							events[i](eventLoad)
						}
					}
					break;
				case "changeButtonClick":
					var bippFile = bipp.getFile();
					var bippStyle = bipp.getStyle()

					if(events[0]){
						for(var i=0;i<events.length;i++){
							events[i](bippFile,bippStyle)
						}
					}
					break;
				default:console.error("no such eventName ---->"+eventName);
			}
	
		},
		hover:function(e,eventType){
			switch (eventType) {
				case "frame":
					// frameHover EVENT TRIGGER
					bipp.utility.eventEmit("frameHover",e)
					break;
				case "uploader":
					// uploaderHover EVENT TRIGGER
					bipp.utility.eventEmit("uploaderHover",e)
					break;
				default:
					break;
			}
		}
	},
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
	startBipp:function(config){
		if(config.frameWidth)this.width = config.frameWidth;
		if(config.measurementUnit)this.measureUnit = config.measurementUnit;
		if(config.aspectRatio)this.aspectRatio = config.aspectRatio;
		if(config.uploaderHtml)this.uploaderHtml = config.uploaderHtml;
		if(config.uploadPrompt)this.uploadPrompt = config.uploadPrompt;
		if(config.changeFilePrompt)this.changeFilePrompt = config.changeFilePrompt;
		if(config.changeButton)this.changeButton = config.changeButton;
		if(config.uploadStatus!=undefined&&!config.uploadStatus)this.uploadStatus = "none";
		if(config.feedbackImgUrl)this.feedbackImg = config.feedbackImgUrl;
		if(config.compression!=undefined)this.compression=config.compression;
		this.height=this.width/this.aspectRatio;
		if(config.autoSelect)this.autoSelect = config.autoSelect;

		this.var.module.innerHTML = '<div id="bipp-uploader-con"><label><div id="bipp-uploader" onmouseover="bipp.utility.hover(event,\'uploader\')">'+this.uploaderHtml+'</div><input id="bipp-input" type="file" accept="image/*" tabindex="0"></label></div><!-- A mock tag that is used to get the width and height of uploaded image --><img id="bipp-image"><div id="bipp-upload-status"></div><div id="bipp-upload-prompt">'+this.uploadPrompt+'</div><div id="bipp-frames-container"><input type="radio" name="bipp-style" value="" style="width:20px;height:20px" checked></div><div id="bipp-change-file"><div id="bipp-change-file-prompt">'+this.changeFilePrompt+'</div><canvas id="bipp-canvas" width="'+this.width+'" height="'+this.height+'" style="display:none"></canvas><button id="bipp-change-button" onclick="bipp.utility.changeImage()">'+this.changeButton+'</button></div>';

		this.var.styleRadio = document.getElementsByName("bipp-style"),this.var.curtain = document.getElementsByClassName("bipp-curtain"),this.var.frame = document.getElementsByClassName("bipp-frame"),this.var.framesCon = document.getElementById("bipp-frames-container"),this.var.changeFile =document.getElementById("bipp-change-file"),this.var.uploadStatus = document.getElementById("bipp-upload-status"),this.var.uploadPrompt = document.getElementById("bipp-upload-prompt"),this.var.uploaderCon = document.getElementById("bipp-uploader-con"),this.var.uploader = document.getElementById("bipp-uploader"),this.var.canvas = document.getElementById("bipp-canvas"),this.var.input = document.getElementById("bipp-input"),this.var.image = document.getElementById("bipp-image");
		// Listen for when keyboard focus on bipp-input, for User Accessibility
		this.var.input.addEventListener('focusin', function(){
			bipp.var.uploader.style.outline = "solid";
		});
		this.var.input.addEventListener('focusout', function(){
			bipp.var.uploader.style.outline = "none";
		});
		this.var.input.addEventListener('change', this.utility.inputChange);
		this.var.image.addEventListener('load', this.utility.imageLoad);
		this.var.canvasContext = this.var.canvas.getContext("2d");

		// START EVENT TRIGGERS
		bipp.utility.eventEmit("start")
	},
	decodeClass:function(pictureUrl,bippStyle,classPort){
	
		if(!pictureUrl){
			return console.error("An argument in bipp.decodeClass() is either null or missing\nno picture to render");
		}
		if(!bippStyle){
			return console.error("An argument in bipp.decodeClass() is either null or missing\nno bippStyle to render");
		}
		if(!classPort){
			return console.error("An argument in bipp.decodeClass() is either null or missing\nno classport to render");
		}

		this.var.classDecodes.push(new this.bippElement(pictureUrl,bippStyle,classPort));

		if(classPort==this.var.currentPort){
		} else{
			// to get the index number of the last element in the array
			var h = this.var.classPorts.length-1;
	
			if (this.var.classPorts.length == 0){
				this.var.classPorts.push(classPort);
				this.var.currentPort = classPort;
			} else {
				for(var i=0;i<this.var.classPorts.length;i++){
					if(classPort == this.var.classPorts[i]){
						break;
					} else if(classPort !== this.var.classPorts[i] && i == h){
						this.var.classPorts.push(classPort);
						this.var.currentPort = classPort;
						break;
					} else{
					}
				}
			}
		}

	},
	decodeID:function(pictureUrl,bippStyle,IDPort){
		var IDdecodes = this.var.IDdecodes;
		var decodesPlaceholder = [];
		for(var i=0;i<IDdecodes.length;i++){
			if(IDdecodes[i].port!=IDPort){
				decodesPlaceholder.push(IDdecodes[i]);
				continue;
			}
		}
		decodesPlaceholder.push(new this.bippElement(pictureUrl,bippStyle,IDPort));
		this.var.IDdecodes = decodesPlaceholder;
		
		var port = document.getElementById(IDPort);
		var currentBippStyle = bippStyle.split("-");
		var styleValue = currentBippStyle[0];
		var styleRatio = currentBippStyle[1];
	
		port.style.backgroundImage = "url("+pictureUrl+")";
		port.style.height = port.scrollWidth/styleRatio+bipp.measureUnit;
		var styleListValue = this.var.styleListValue;
		if(port.className.indexOf("bipp")==-1){
			for(var i=0;i<styleListValue.length;i++){
				if(styleValue == styleListValue[i]){
					port.className += " "+this.var.styleList[i]+" bipp";
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
			else console.error("Invalid BIPPStyle cannot be passed to "+port+"(ID of an HTMLElement)");
		}
	},
	bippElement:function(pic,style,port){
		this.pictureUrl = pic;
		this.bippStyle = style;
		this.port = port;
	},
	refreshAllClass:function(){
		var ports = this.var.classPorts;
		for(var x=0;x<ports.length;x++){
			var currentPort = document.getElementsByClassName(ports[x]);
			var queryResult = [];
			for(var i=0;i<this.var.classDecodes.length;i++){
				if(this.var.classDecodes[i].port==ports[x]){
					queryResult.push(this.var.classDecodes[i]);
				}
			}
			for(var i=0;i<queryResult.length;i++){
				var currentBippStyle = queryResult[i].bippStyle.split("-");
				var styleValue = currentBippStyle[0];
				var styleRatio = currentBippStyle[1];

				currentPort[i].style.backgroundImage = "url("+queryResult[i].pictureUrl+")";
				currentPort[i].style.height = currentPort[i].scrollWidth/styleRatio+bipp.measureUnit;
				var styleListValue = this.var.styleListValue;
				
				if(currentPort[i].className.indexOf("bipp")==-1){
					for(var ii=0;ii<styleListValue.length;ii++){
						if(styleValue == styleListValue[ii]){
							currentPort[i].className += " "+this.var.styleList[ii]+" bipp";
							break;
						}
					}
				}
			}
		}
	},
	refreshAllID:function(){
		var ports = this.var.IDdecodes;
		for(var i=0;i<ports.length;i++){
			var port = document.getElementById(ports[i].port);
			if(port){
				var style = ports[i].bippStyle.split("-");
				port.style.height = port.scrollWidth/style[1]+bipp.measureUnit;
			}
		}
	},
	refreshClass:function(classPort){
		var ports = this.var.classPorts;
		var index = ports.indexOf(classPort);
		if(index!==-1){
			var currentPort = document.getElementsByClassName(classPort);
			var decodeArray = this.var.classDecodes;
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
				currentPort[i].style.height = currentPort[i].scrollWidth/styleRatio+bipp.measureUnit;
				var styleListValue = this.var.styleListValue;
				
				if(currentPort[i].className.indexOf("bipp")==-1){
					for(var ii=0;ii<styleListValue.length;ii++){
						if(styleValue == styleListValue[ii]){
							currentPort[i].className += " "+this.var.styleList[ii]+" bipp";
							break;
						}
					}
				}
			}
		} else{
			console.error("The classPort \""+classPort+"\" to be refreshed have not been decoded");
		}
	},
	refreshID:function(IDport){
		var ports = this.var.IDdecodes;
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
				port.style.height = port.scrollWidth/style[1]+bipp.measureUnit;
			}
		} else{
			console.error(new Error("The IDport to be refreshed have not been decoded"));
		}
	},
	refreshAll:function(){
		// To Re-render classPorts
		this.refreshAllClass();
	
		// To Re-render IDPorts
		this.refreshAllID()
	},
	getFile:function(bippFileID){
		if(bippFileID&& typeof bippFileID=="string")return this.var.bippFile[bippFileID];
		return this.var.bippFile;
	},
	getStyle:function(bippStyleID){
		if(bippStyleID&& typeof bippStyleID=="string")return this.var.style[bippStyleID];
		return this.var.style;
	},
	selectImage:function(bippFileID,options){
		if(!bippFileID || typeof bippFileID!="string"){
			return
			// emit an error event that let user know the error type
		}
		// beforeSelect EVENT TRIGGER
		var eventReturns = bipp.utility.eventEmit("beforeSelect") || [];
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
		bipp.var.sessionFileID=bippFileID;
		bipp.var.sessionStyleID=bippFileID;
		if(options && typeof options == 'object'){
			this.var.sessionOptions = options;
		}

		// Clearing previously selected file
		bipp.var.input.value="";

		// if value is still `true` after above clearing, fallback for older browser is attempted
		if(bipp.var.input.value){
			bipp.var.input.value.type='text';
			bipp.var.input.value.type=='file';
		}

		bipp.var.input.click();
	},
	resetFile:function(bippFileID){
		this.var.bippFile[bippFileID] = undefined;
		this.var.style[bippFileID] = undefined;
	},
	//return(boolean,message)
	canCompress:function(){
		var isCanvasSupported = !!window.CanvasRenderingContext2D && !!window.HTMLCanvasElement && !!bipp.var.canvas.getContext && !!bipp.var.canvasContext;
		var isToBlobSupported = !!bipp.var.canvas.toBlob;
		var blobCanBeCreated = bipp.compression && isToBlobSupported && isCanvasSupported;
	
		return blobCanBeCreated;
	},
	on:function(eventName,callback){
		switch(eventName){
			case "start":
				this.events.start.push(callback)
				break;
			case "beforeSelect":
				this.events.beforeSelect.push(callback)
				break;
			case "afterSelect":
				this.events.afterSelect.push(callback)
				break;
			case "beforeCompress":
				this.events.beforeCompress.push(callback)
				break;
			case "afterCompress":
				this.events.afterCompress.push(callback)
				break;
			case "frameSelect":
				this.events.frameSelect.push(callback)
				break;
			case "frameHover":
				this.events.frameHover.push(callback)
				break;
			case "uploaderHover":
				this.events.uploaderHover.push(callback)
				break;
			case "changeButtonClick":
				this.events.changeButtonClick.push(callback)
				break;
			default: console.trace(eventName+" is not an eventName");
				console.error(eventName+" is not an eventName")
		}
	},
	events:{
		start:[],//

		/* PRIMARY EVENTS */
		beforeSelect:[],//if any callback return boolean false, image selection won't be possible
		afterSelect:[],//(original image-if present,selection status)
		beforeCompress:[],//(original image)
		afterCompress:[],//(compressed image,compression status) similar to 'frameSelect' event

		frameSelect:[],//(original/compressed image,BIPPstyle) depending on compression state
		frameHover:[],// (hover event)
		uploaderHover:[],// (hover event)
		changeButtonClick:[]//(old original/compressed image,old BIPPstyle-if a frame have been previously selected) depending on compression state
	}
};

/* 
use bipp.refreshClass() instead of bippDecoder()-
use bipp.decodeID() instead of bippDecodeID()
change bipp.decode() name to bipp.decodeClass()/bipp.decodeList()
change bippDecode constructor name to bippObject/bippElement
*/

window.addEventListener('resize',function(){
	bipp.refreshAll();
});

/*
if you pass option to selectImage() it is assumed that you want to compress the image
*/
