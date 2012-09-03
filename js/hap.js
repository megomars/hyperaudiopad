$(document).ready(function(){   
		
	var theScript = [];  
	var mediaDir = "http://happyworm.com/video";
	var transcriptDir = "transcripts";  
	var exposedTranscripts = [{'id':'internetindians','title':'Internet Amazonians'},{'id':'raidsinrainforest','title':'Rainforest Raids'}];

	var latency = 1000;
        //console.log('start');                    
		// Grab the script from the URL
	var theScriptState = [];
	//var theScriptState = $.bbq.getState();  
		//console.dir(theScript);  
	var theScriptLength = theScript.length; 
		
		//console.log(theScript[0].m);         
	    //console.log(theScriptLength); 
		//console.log(theScript.length);   
		
		/*if (theScriptLength > 0) {   
			
			for (var i=0; i < theScriptLength; i++) {
				loadFile(theScript[i].m);
			}
			
		} else {
		  theScript = [];   
		} */
		
		
	var currentlyLoaded = 0;
	var hints = true;
	var playSource = true;
		
	// we need two instances so that we can do transitions
		
	var myPlayer1 = $("#jquery_jplayer_1");
	var myPlayer2 = $("#jquery_jplayer_2");

	var player1MediaId = "";
	var player2MediaId = "";
	
	
	myPlayer1.jPlayer({
 		ready: function (event) {
  
			if(event.jPlayer.html.used && event.jPlayer.html.video.available) {
					//initPopcorn('#' + $(this).data("jPlayer").internal.audio.id);
			}
    }, 
  			
		solution: "html, flash",
    swfPath: "js",
    supplied: "m4v,webmv",
		preload: "auto"
  });  

  myPlayer2.jPlayer({
 		ready: function (event) {
  
			if(event.jPlayer.html.used && event.jPlayer.html.video.available) {
					//initPopcorn('#' + $(this).data("jPlayer").internal.audio.id);
			}
    }, 
  			
		solution: "html, flash",
    swfPath: "js",
    supplied: "m4v,webmv",
		preload: "auto"
  }); 


	$('#transcript-files').empty();
	for (var j = 0; j < exposedTranscripts.length; j++) {
	    $('#transcript-files').append('<li><a class="transcript-file" href="'+exposedTranscripts[j].id+'" >'+exposedTranscripts[j].title+'</a></li>');
	}


	var i = 0;


	// The below block of code is used to load saved scripts. Previously state was stored RESTfully in the URL, but due to size limits in some browsers and generally unweildlyness of long URLS it is *maybe* better to read and write stat from a db. I have taken this out for now.

	if (theScriptState[i] != false) { 
		 	while (theScriptState[i] != undefined) {

				//loadFile(theScriptState[i].m); 
                
				// repeated code use loadFile with a callback 
				
				//console.log('snippet --------------- > '+i);

				var timespan = {};
				timespan.s = parseInt(theScriptState[i].s);
				timespan.e = parseInt(theScriptState[i].e);  
				timespan.m = theScriptState[i].m; 
				
				//var id = theScriptState[i].m;
        var file = transcriptDir+'/'+timespan.m+'.htm'; 
				var mediaMp4 = mediaDir+'/'+timespan.m+'.mp4';
				var mediaWebM = mediaDir+'/'+timespan.m+'.webm';
				
				//console.log('file = '+audioogg);       
				//console.log(myPlayer1.data('jPlayer').status.src);
				//timespan.src = myPlayer1.data('jPlayer').status.src; 
				 
				
				theScript.push(timespan);  
				
				//console.log(theScriptState[i].s);   


				
				$.ajax({
				  url: file,
				  async: false,
				  success: function(data) {  

						//load success!!!     
						initPopcorn('#' + myPlayer1.data("jPlayer").internal.video.id);      

						// load in the audio      

				  	myPlayer1.jPlayer("setMedia", {
		        	m4v: mediaMp4,
		        	webmv: mediaWebM
		      	});

						$.data(myPlayer1,'mediaId',timespan.m);

				  	$('#transcript-content').html(data); 

						//$('.scroll-panel').jScrollPane(); 
					
						// We need to paste the appropriate parts in the target pane here     
 
						var thisSpan = $('#transcript-content span[m="'+timespan.s+'"]');     
					      
						var endFound = false;
 
					
						var selectedStuff = $('<p i="'+i+'" s="'+timespan.s+'" e="'+timespan.e+'"  f="'+myPlayer1.data('jPlayer').status.src+'">');
					 
						$('#target-content').append( selectedStuff ); 

						while (endFound == false) {

							$(thisSpan).clone().appendTo(selectedStuff);   
							thisSpan = thisSpan.next();    
							selectedStuff.append(' ');
							if (thisSpan.attr('m') == timespan.e) endFound = true; 
						} 

						$('#target-content').append('</p>');       

				  }
				});




				//while (theScript

				//$('#target-content').append();

				i++;
				//console.log('New snippet');      
			 } 
		   
		}  
		
		//console.log('EXITED');
   

		// These events are fired as play time increments  

		var playingWord = 1;    
		
		
		// transcript links to audio

		$('#transcript').delegate('span','click',function(e){ 
			playSource = true; 
			var jumpTo = $(this).attr('m')/1000; 
            //console.log('playing from '+jumpTo);

      if (currentlyLoaded == 1) {
      	myPlayer1.jPlayer("play",jumpTo);
      } else {
      	myPlayer2.jPlayer("play",jumpTo);
      }     
			
			$('#play-btn-source').hide();
			$('#pause-btn-source').show();  

			/*e.stopPropagation();
			e.preventDefault(); 
    	e.stopImmediatePropagation();*/
			console.log('click');
		   
			return false;
		});     
		
		var index = "";
		var filename = "";
		var end = "";
		var start = ""; 
		var mediaId = "";
		
		
		$('#target-content').delegate('span','click',function(){ 		

			log3 = true;

			playSource = false;	
 
			var jumpTo = $(this).attr('m')/1000;   
			
			index = $(this).parent().attr('i'); 
		
			mediaId = theScript[index].m; 

				
			var mediaMp4 = mediaDir+"/"+mediaId+".mp4";
			var mediaWebM = mediaDir+'/'+mediaId+'.webm';


			//console.log(mediaId);
			//console.log(player1MediaId);
			//console.log("index="+index);
			//console.log("jumpTo="+jumpTo);

			if (player1MediaId == mediaId) {
				$('#jquery_jplayer_2').hide();
				$('#jquery_jplayer_1').show();
				myPlayer1.jPlayer("play",jumpTo);    
			} else {
				$('#jquery_jplayer_1').hide();
				$('#jquery_jplayer_2').show();
				myPlayer2.jPlayer("play",jumpTo);
			}
       
			
		  filename = $(this).parent().attr('f');  
			end = $(this).parent().attr('e');  
			start = $(this).parent().attr('s'); 
			index = $(this).parent().attr('i'); 

			return false;
		});


 

		
		myPlayer1.bind($.jPlayer.event.ended, function() {  
			// 
		}); 
		     
		
		/* hyperaudiopad stuff */

		/* load in the file */  



		function initPopcorn(id) {   
			var p = Popcorn(id)
			.code({
			   start: 0,
		       end: 2000,
		       onStart: function (options) {
		         //console.log('start')
		       },
		       onFrame: (function () {
		        var count = 0;
		        return function (options) {
					
            //var now = this.Popcorn.instances[0].media.currentTime*1000;   

            var now;

            //console.log(mediaId);

            if (player1MediaId == mediaId) {
            	now = myPlayer1.data('jPlayer').status.currentTime * 1000;
						} else {
							now = myPlayer2.data('jPlayer').status.currentTime * 1000;
						}

						//console.log(now);
					
						var src = "";

						//console.log("now="+now+" end="+end+"theScript.length="+theScript.length+" index="+index);

						//console.log('end = '+end);
						//console.log('now = '+now);

						//console.log(playSource);
					
						if (now > end && playSource == false) {  



							//console.log('tick');

          		//myPlayer1.jPlayer("pause");
          		//myPlayer2.jPlayer("pause");
							index = parseInt(index);

							// check for the end



							if (theScript.length <= (index+1) && now > end) {
								//console.log(end);
								//console.log(now);
								if (log2) console.log('end reached '+end+" now "+now);
								log2 = false;
								myPlayer1.jPlayer("pause");
								myPlayer2.jPlayer("pause");
							}


							
							if (theScript.length > (index+1)) {  


								// moving to the next block in the target

								index = index + 1;       
								if (log) console.log('index incremented now ='+index);
								if (log) console.dir(theScript);
								start = theScript[index].s;   
								end = theScript[index].e;
						    mediaId = theScript[index].m;


						    if (player1MediaId == mediaId) {
									$('#jquery_jplayer_2').hide();
									$('#jquery_jplayer_1').show();
									myPlayer2.jPlayer("pause");
									myPlayer1.jPlayer("play",start/1000); 
									//console.log('playing 1');
								} else {
									$('#jquery_jplayer_1').hide();
									$('#jquery_jplayer_2').show();
									myPlayer1.jPlayer("pause");
									myPlayer2.jPlayer("play",start/1000); 
									//console.log('playing 2');
								}

							
								/*myPlayer1.bind($.jPlayer.event.progress + ".fixStart", function(event) {
									// Warning: The variable 'start' must not be changed before this handler is called.
							    $(this).unbind(".fixStart"); 
									$(this).jPlayer("play",start/1000);
								});     
				
								myPlayer1.jPlayer("pause",start);   */
							}    
						}
		      }
		    })(),
		    onEnd: function (options) {
		         //console.log('end');
		    }
			});  

			$("#transcript-content span").each(function(i) {  
				p.transcript({
					time: $(this).attr("m") / 1000, // seconds
					futureClass: "transcript-grey",
					target: this
				});  
			});
		};


		$('.transcript-file').live('click',function(){ 
			var id = $(this).attr('href');  
			
			$('#script-title').text($(this).text());  
			
			loadFile(id); 

			return false;
		}); 


		
		function loadFile(id) { 
			var file = transcriptDir+'/'+id+'.htm'; 
			var mediaMp4 = mediaDir+'/'+id+'.mp4';
			var mediaWebM = mediaDir+'/'+id+'.webm';
			

			//$('.direct').html('loading ...');
			   
      $('#load-status').html('loading ...');
			$('#transcript-content').load(file, function() {
			  	//load success!!!     
				

				// load in the audio

				// check which player to load media into

				if (myPlayer1.data('jPlayer').status.src && currentlyLoaded < 2) {
					initPopcorn('#' + myPlayer2.data("jPlayer").internal.video.id);   
					myPlayer2.jPlayer("setMedia", {
	        	m4v: mediaMp4,
	        	webmv: mediaWebM
	      	});
	      	$.data(myPlayer2,'mediaId',id);
	      	currentlyLoaded = 2;
	      	player2MediaId = id;
	      	$('#jquery_jplayer_1').hide();
	      	$('#jquery_jplayer_2').show();
				} else {
					initPopcorn('#' + myPlayer1.data("jPlayer").internal.video.id);   
					myPlayer1.jPlayer("setMedia", {
	        	m4v: mediaMp4,
	        	webmv: mediaWebM
	      	});
	      	$.data(myPlayer1,'mediaId',id);
	      	currentlyLoaded = 1;
	      	player1MediaId = id;
	      	$('#jquery_jplayer_2').hide();
	      	$('#jquery_jplayer_1').show();
				}
   
	
				
				$('#load-status').html('');

				if (hints == true) {
					$('#transcript-content-hint').fadeIn('slow');
					$('#transcript-file-hint').fadeOut('slow');
				}
				
				$('#source-header-ctrl').fadeIn();
				
			});		
		} 
		
		

		// select text function

		function getSelText()
		{
			var txt = '';
			if (window.getSelection){
				txt = window.getSelection();
			}
			else if (document.getSelection){
				txt = document.getSelection();
			}
			else if (document.selection){
				txt = document.selection.createRange().text;
			}          

			return txt;
		}

		// Causes issues when content is scrolled

		/*$('#transcript-content').mousedown(function(){ 
			$(this).focus();
		});*/

		// Sets the excerpt  
		


		$('#transcript-content').mouseup(function(e){ 
		
			//console.log('mouseup');

	 		var select = getSelText(); 
	  		var tweetable = select+"";  

			var startSpan = select.anchorNode.nextSibling; 
			if (startSpan == null) {
				startSpan = select.anchorNode.parentNode;
			}


			//var endSpan = select.focusNode.nextSibling;

			//console.log('select.focusnode');
			//console.dir(select.focusNode);

			var endSpan;

			// Check node sibling is a span (otherwise must be a para)
			// NB: Node is always text which is why we need to grab the sibling

			var endNode = select.focusNode.nextSibling;

			if (endNode instanceof HTMLSpanElement) {
				endSpan = endNode; 
			} else {
				//console.log('endNode not span');
				//console.dir(endNode);

				if (endNode instanceof HTMLParagraphElement) {
					endSpan = select.focusNode.previousSibling.lastElementChild;
				} else {
					endSpan = select.focusNode.previousSibling;
				}
			}

			if (endSpan == null) {  
				//console.log('END SPAN IS NULL');
				endSpan = select.focusNode.parentNode; 
				/*if (endSpan == null) {
					endSpan = select.focusNode.parentNode;
				}*/
			}

			/*if (endSpan == null) {  
				console.log('END SPAN IS NULL');
				endSpan = select.focusNode.parentNode.nextElementSibling; 
				if (endSpan == null) {
					endSpan = select.focusNode.parentNode;
				}
			} */    
			

			/*console.log('start span ..... ');
			console.dir(startSpan);
			console.log('start span');    
			console.log(startSpan); 
			console.log('--------');  
			console.log('end span ..... ');     
			console.dir(endSpan);
			console.log('end span');  
			console.log(endSpan); 
			console.log('--------');*/


			//console.log(endSpan instanceof);

			   
			// if either are null we have a problem basically, a problem that should be solved
			if (startSpan != null && endSpan != null) {
			
				// Flip if end time is less than start time (ie the text was selected backwards)
		
				var startTime = parseInt(startSpan.getAttribute('m'));
				var endTime = parseInt(endSpan.getAttribute('m'));   



				
				/*console.log('startTime'); 
				console.log(startTime); 
				console.log('--------');
				console.log('endTime');    
				console.log(endTime); 
				console.log('--------');*/
		        
				var tempSpan = endSpan;
				var tempTime = endTime;
				
				if (endTime < startTime) {    
					endSpan = startSpan; 
					endTime = startTime;  
					startSpan = tempSpan;
					startTime = tempTime;
				}   
				
        // check for single word click
				//if (getNextNode(startSpan,true,endSpan) != endSpan) {
				// we should allows for single word selection though
				if (startSpan != endSpan) {
			        /*console.log('startspan'); 
					console.log(startSpan); 
					console.log('--------');
					console.log('endspan');    
					console.log(endSpan); 
					console.log('--------'); */ 



					var nextSpan = startSpan; 
					// $('#target-content').append('<p s="'+startTime+'" e="'+endTime+'" f="'+myPlayer1.data('jPlayer').status.src+'">');
					var selectedStuff = $('<p i="'+theScript.length+'" s="'+startTime+'" e="'+endTime+'"  f="'+myPlayer1.data('jPlayer').status.src+'">'); 
					$('#target-content').append( selectedStuff ); 
					
					//console.log('selected....');
					
					
					while(nextSpan != endSpan) { 
						//console.log('nextspan');   
						//console.log(nextSpan);         
						// $(nextSpan).clone().appendTo('#target-content');
						if (nextSpan instanceof HTMLSpanElement) {
							$(nextSpan).clone().appendTo(selectedStuff); 
							selectedStuff.append(' ');
						}

						// as nextNode of a paragraph is a parapgraph we want to drop down here
						if (nextSpan instanceof HTMLParagraphElement) {
							selectedStuff.append('<p>');
							nextSpan = nextSpan.firstChild;
						} else {
							nextSpan = getNextNode(nextSpan,true,endSpan);	
						}
					}

					$(endSpan).clone().appendTo(selectedStuff); 

					// grab the span after the endSpan to get proper end time

					var nextSpanStart = getNextNode(nextSpan,true,endSpan);

					if (nextSpanStart instanceof HTMLParagraphElement) {
						nextSpanStart = nextSpanStart.firstChild;
					}

					var nextSpanStartTime = parseInt(nextSpanStart.getAttribute('m'));

					if (isNaN(nextSpanStartTime)) { // checking for end of text select
						nextSpanStartTime = Math.floor(myPlayer1.data('jPlayer').status.duration * 1000);
					}
					//console.log(selectedStuff);


					$('#target-content').append('</p>');   

					
					var timespan = {};
					timespan.s = startTime;
					timespan.e = nextSpanStartTime;  
					if (currentlyLoaded == 1) {
						timespan.m = $.data(myPlayer1,'mediaId'); 
					} else {
						timespan.m = $.data(myPlayer2,'mediaId'); 						
					}
					

					//console.log("s="+startTime);
					//console.log("e="+endTime);
					//console.log("n="+nextSpanStartTime);

					//console.log(myPlayer1.data('jPlayer').status.src);
					//timespan.src = myPlayer1.data('jPlayer').status.src;
					theScript.push(timespan);     
					
          //$.bbq.pushState(theScript);
					//console.dir(theScript);

					//alert('here');

					//$('#target-content span').addClass('transcript-grey');

					//e.preventDefault(); 
    			//e.stopImmediatePropagation();
    			return false; 
				}
			}

			$('#transcript-content-hint').fadeOut();
			hints = false;
			
		});

		$('#transcript-content-hint').click(function() {
			$(this).fadeOut('slow');
			hints = false;
		});



		var getNextNode = function(node, skipChildren, endNode){

			//console.dir(node);
		  //if there are child nodes and we didn't come from a child node
		  /*if (endNode == node) {
		    return null;
		  }*/
		  if (node.firstChild && !skipChildren) {
		    return node.firstChild;
		  }
		  if (!node.parentNode){
		    return null;
		  }
		  return node.nextElementSibling 
		         || getNextNode(node.parentNode, true, endNode); 
		
		  //return node.nextSibling 
				         //|| getNextNode(node.parentNode, true, endNode);
		
		};  

		$('#play-btn-source').click(function(){
			if (currentlyLoaded == 1) {
				myPlayer1.jPlayer("play");
			}

			if (currentlyLoaded == 2) {
				myPlayer2.jPlayer("play");
			}
			
			if (currentlyLoaded > 0) {
				$(this).hide();
				$('#pause-btn-source').show();
			}

			return false;
		});

		$('#pause-btn-source').click(function(){

			if (currentlyLoaded == 1) {
				myPlayer1.jPlayer("pause");
			}

			if (currentlyLoaded == 2) {
				myPlayer2.jPlayer("pause");
			}
			
			if (currentlyLoaded > 0) {
				$(this).hide();
				$('#play-btn-source').show();
			}

			return false;
		});

		$('#clear-btn').click(function(){   
			
			//$.bbq.removeState();
			theScript = [];
			$('#transcript-content').html('');
			$('#target-content').html('');

			Popcorn.destroy(p);

			return false;
		});

		
		$('#instructions-btn').click(function(){   
			
			if($('#instructions').is(':visible')){
				$('#instructions').fadeOut();
			} else {
				$('#instructions').fadeIn();
			}
			 
			return false;
		});

		/* test stuff */

		$('#show-video').click(function(){   

			$('#transcript-content').css('top','350px');

			return false;
		});
		
});    