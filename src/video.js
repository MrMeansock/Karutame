            var ready = false;
            
            // 2. This code loads the IFrame Player API code asynchronously.
            var tag = document.createElement('script');
      
            tag.src = "https://www.youtube.com/iframe_api";
            var firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      
            // 3. This function creates an <iframe> (and YouTube player)
            //    after the API code downloads.
            var player;
            function onYouTubeIframeAPIReady() {
              player = new YT.Player('player', {
                height: '390',
                width: '640',
                videoId: '',
                events: {
                  'onReady': onPlayerReady,
                  'onError': onError
                }
              });
            }
      
            // 4. The API will call this function when the video player is ready.
            function onPlayerReady(event) {
                console.log("hello");
              //event.target.playVideo();
              ready = true;
            }

            function onError(event) {
                console.log("error");
            }
      
            // 5. The API calls this function when the player's state changes.
            //    The function indicates that when playing a video (state=1),
            //    the player should play for six seconds and then stop.
            function stopVideo() {
              player.stopVideo();
            }