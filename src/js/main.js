var SCO = (function(data){
  /**
   * @namespace SCO
   * @desc The main SCO object
   */
  var SCO = {
    data: {
      content: {},
      startTime: new Date(),
      currQuestionStart: null,
      currQuestionEnd: null
    },
    /**
     * @namespace SCO.nav
     * @desc The SCO's navigation data and methods
     * @prop {number} activePageNumber - The sequential number of the active page
     * @prop {object} activePage - The active page object
     * @prop {object} pageData - Holds the generated HTML for special pages like test questions
     * @prop {boolean} onFirstPage - If SCO is on the first page
     * @prop {boolean} onLastPage - If SCO is on the last page
     */
    nav: {
      activePageNumber: 0,
      activePage: {},
      pageData: null,
      onFirstPage: true,
      onLastPage: false,

      /**
       * @desc Loads and processes the SCO data via {@link SCO.nav.processContentData}.
       * @memberof SCO.nav
       */
      init: function(){
        SCO.data.content = SCO.nav.processContentData(data);
      },

      /**
       * @desc Processes SCO data for use within the app by adding run-time-specific properties to pages.
       * @param {object} data - The SCO data object containing all pages
       * @memberof SCO.nav
       */
      processContentData: function(data){
        var processedData = data;
        var pages = processedData.pages;
        var questionNums = [], randomizedQuestions = [];

        for (var i = 0, j = pages.length; i < j; i++){
          if(pages[i].type == 'question') {
            pages[i].answered = false;

            if(data.config.randomizeQuestions) {
              questionNums.push(i);
            }

            if(data.config.randomizeLures) {
              if(pages[i].qtype == 'choice') {
                pages[i].lures = SCO.utils.shuffleArray(pages[i].lures);
              }
            }
          }
        }

        if(data.config.randomizeQuestions){
          randomizedQuestions = SCO.utils.shuffleArray(questionNums.slice(0));

          console.log(questionNums + " -> " + randomizedQuestions);
          var targetPages = [];

          for(i = 0, j = randomizedQuestions.length; i < j; i++){
            targetPages.push(pages[randomizedQuestions[i]]);
            console.log(targetPages[i].title);
            console.log("going to page " + questionNums[i]);
          }

          for(var k = 0, l = targetPages.length; k < l; k++){
            pages[questionNums[k]] = targetPages[k];
          }
        }

        return processedData;
      },

      /**
       * @desc Loads a specific page from the SCO content.
       * @param {number} pageNum - The sequential page number
       * @memberof SCO.nav
       */
      loadPageData: function(pageNum){
        SCO.nav.activePage = SCO.data.content.pages[pageNum];
        SCO.nav.activePageNumber = pageNum;
        SCO.nav.pageData = null;
        if(SCO.nav.activePage.type == 'question') {
          SCO.nav.pageData = SCO.nav.loadQuestionData(SCO.nav.activePage);
          SCO.data.currQuestionStart = new Date().getTime();
        }

        SCO.UI.update(SCO.nav.activePage.behavior);
      },

      /**
       * @desc Loads the data for a specified 'question' page.
       * @param {object} page - The specific 'question' page
       * @memberof SCO.nav
       */
      loadQuestionData: function(page){
        this.clickHandler = function(el){
          el.addEventListener('click', function(){
            SCO.interactions.addInteractionData(el.id);
            document.getElementById('next').removeAttribute('disabled');
            page.answered = true;
          });
        };

        var luresContainer = document.createElement('form');

        if(page.qtype == 'choice'){
          for(i = 0, j = page.lures.length; i < j; i++) {
            var luresFrag = document.createElement('p');
            var lureRadio = document.createElement('input');
            lureRadio.id = page.lures[i].id;
            lureRadio.name = 'question';
            lureRadio.setAttribute('type', 'radio');
            this.clickHandler(lureRadio);
            var lureText = document.createElement('label');
            lureText.setAttribute('for', lureRadio.id);
            lureText.innerHTML = page.lures[i].text;
            luresFrag.appendChild(lureRadio);
            luresFrag.appendChild(lureText);
            luresContainer.appendChild(luresFrag);
          }
        }

        return luresContainer;
      }
    },

    /**
     * @namespace SCO.UI
     * @desc The SCO's UI-related methods
     */
    UI: {
      /**
       * @desc Adds event listners to UI eleements
       * @memberof SCO.UI
       */
      init: function(){
        document.getElementById('next').addEventListener('click', function(){
          if(SCO.nav.activePageNumber >= (SCO.data.content.pages.length-1)) {
            return false;
          } else {
            SCO.nav.activePageNumber++;
            SCO.nav.loadPageData(SCO.nav.activePageNumber);
          }
        });

        document.getElementById('prev').addEventListener('click', function(){
          if(SCO.nav.activePageNumber === 0) {
            return false;
          } else {
            SCO.nav.activePageNumber--;
            SCO.nav.loadPageData(SCO.nav.activePageNumber);
          }
        });

        document.getElementById('exit').addEventListener('click', function(){
          SCO.SCORM.exit();
        });
      },

      /**
       * @param {object} options - Page-specific behavior options
       * @desc Updates UI elements based on the loaded pageNum
       * @memberof SCO.UI
       */
      update: function(options){
        document.getElementById('pageNum').innerHTML = (SCO.nav.activePageNumber+1).toString() + " of " + SCO.data.content.pages.length.toString();
        document.getElementById('prev').style.visibility = (SCO.nav.activePageNumber === 0) ? 'hidden' : 'visible';
        document.getElementById('next').style.visibility = (SCO.nav.activePageNumber >= (SCO.data.content.pages.length-1)) ? 'hidden' : 'visible';

        if(document.getElementById('next').disabled) {
          document.getElementById('next').disabled = false;
        }

        document.getElementById('title').innerHTML = SCO.nav.activePage.title;
        document.getElementById('text').innerHTML = SCO.nav.activePage.text;
        document.getElementById('data').innerHTML = '';

        if(SCO.nav.pageData){
          document.getElementById('data').appendChild(SCO.nav.pageData);
        } else {
          document.getElementById('data').innerHTML = '';
        }

        if(options.lockNext) {
          if(SCO.nav.activePage.type == 'question'){
            if(!SCO.nav.activePage.answered) {
              document.getElementById('next').setAttribute('disabled', 'true');
            }

            if(SCO.nav.activePage.answered){
              for(i = 0; i < j; i++) {
                if(SCO.nav.activePage.lures[i].id == SCO.interactions.data[SCO.nav.activePage.qid].response) {
                  document.getElementById(SCO.nav.activePage.lures[i].id).setAttribute('checked', '');
                }
              }
            }
          }
        }
      }
    },

    /**
     * @namespace SCO.utils
     * @desc The SCO's utility methods, such as array sorters.
     */
    utils: {
      /**
       * @desc Shuffles the order of elements in a given array.
       * @param {array} array - The array to shuffle
       * @return {array} The shuffled array
       * @memberof SCO.utils
       */
      shuffleArray: function(array){
        for (var i = array.length - 1; i > 0; i--) {
          var j = Math.floor(Math.random() * (i + 1));
          var temp = array[i];
          array[i] = array[j];
          array[j] = temp;
        }
        return array;
      },

      /**
       * @desc Formats time (in milliseconds) to a SCORM-friendly format
       * @param {number} n - A Date object's time in milliseconds
       * @return {string} The SCORM-formatted result
       * @memberof SCO.utils
       */
      formatLatency: function(millisecs) {
        var secs = Math.ceil(millisecs/1000);
      	var mins = Math.floor(secs/60);
      	secs -= mins*60;
      	var hours = Math.floor(mins/60);
      	mins -= hours*60;
      	var results = 'PT';
      	if ( hours > 0 ) {
      		results += hours + 'H';
        }
      	if (mins > 0 ) {
      		results += mins + 'M';
        }
      	if (secs >= 0 ) {
      		results += secs + 'S';
        }
      	return results;
      },

      /**
       * @desc Pads a number with a preceding 0
       * @param {number} num - The number to pad
       * @return {string} The number with a preceding 0 if applicable
       * @memberof SCO.utils
       */
      pad: function(num){
        return ((num > 9 ) ? num: '0'+num);
      },

      /**
       * @desc Formats a date to a SCORM 2004-friendly timestamp
       * @param {object} date - A date object to format
       * @return {string} The formatted timestamp
       * @memberof SCO.utils
       */
      formatTimestamp: function(date){
        return date.getFullYear()+'-'+SCO.utils.pad(date.getMonth()+1)+'-'+SCO.utils.pad(date.getDate())+'T'+SCO.utils.pad(date.getHours())+':'+SCO.utils.pad(date.getMinutes())+':'+SCO.utils.pad(date.getSeconds());
      }
    },

    /**
     * @namespace SCO.SCORM
     * @desc Contains methods for handling SCORM 2004 interactions.
     */
    SCORM: {
      /**
       * @desc Initializes the SCORM API connection
       * @memberof SCO.SCORM
       */
      init: function(){
        doInitialize();
        doSetValue('cmi.location', '');
        doSetValue('cmi.success_status', 'unknown');
        doSetValue('cmi.completion_status', 'incomplete');
        doCommit();
      },

      /**
       * @desc Sets all interaction data using the gathered interactions in SCO.interactions.data
       * @memberof SCO.SCORM
       */
      setInteractions: function(){
        var i = 0;
        var interactionStr = "";
        for(var interaction in SCO.interactions.data){
          interactionStr = "cmi.interactions." + i.toString();
          doSetValue(interactionStr + ".id", SCO.interactions.data[interaction].id);
          doSetValue(interactionStr + ".description", SCO.interactions.data[interaction].desc);
          doSetValue(interactionStr + ".type", SCO.interactions.data[interaction].type);
          doSetValue(interactionStr + ".learner_response", SCO.interactions.data[interaction].response);
          doSetValue(interactionStr + ".correct_responses.0.pattern", SCO.interactions.data[interaction].response);
          doSetValue(interactionStr + ".result", SCO.interactions.data[interaction].result);
          doSetValue(interactionStr + ".latency", SCO.interactions.data[interaction].latency);
          doSetValue(interactionStr + ".timestamp", SCO.interactions.data[interaction].time);
          i++;
        }
      },

      /**
       * @desc Grades the interactions and sets a scaled scaledScore
       * @memberof SCO.SCORM
       */
      grade: function(){
        var numCorrect = 0;
        var numInteractions = 0;

        for(var i in SCO.interactions.data){
          numInteractions++;
          if(SCO.interactions.data[i].result == 'correct'){
            numCorrect++;
          }
        }

        var scaledScore = Math.round((numCorrect / numInteractions)*100)/100;
        doSetValue('cmi.score.scaled', scaledScore);
      },

      /**
       * @desc Sets exit statuses and terminates the SCORM API connection
       * @memberof SCO.SCORM
       */
      exit: function(){
        SCO.SCORM.setInteractions();
        SCO.SCORM.grade();
        doSetValue('cmi.completion_status', 'completed');
        doSetValue("adl.nav.request", "exitAll");
        doSetValue("cmi.exit", "normal");
        doSetValue("cmi.session_time", SCO.utils.formatLatency(new Date().getTime() - SCO.data.startTime));
        doCommit();
        doTerminate();
      },
    },

    /**
     * @namespace SCO.interactions
     * @desc The SCO's interaction data and methods.
     * @prop {object} data - Object to hold all interaction data for later submission to LMS.
     */
    interactions: {
      data: {},

      /**
       * @desc Adds interaction data for a question to the interaction data object.
       * @param {string} id - The ID of a question
       * @memberof SCO.interactions
       */
      addInteractionData: function(id){
        var qData = {
          id: "",
          desc: "",
          type: "",
          response: "",
          correct_response: "",
          result: "",
          latency: "",
          time: ""
        };

        for(var i = 0, j = SCO.nav.activePage.lures.length; i < j; i++){
          if(id == SCO.nav.activePage.lures[i].id){
            qData.id = SCO.nav.activePage.qid;
            qData.desc = "QID: " + SCO.nav.activePage.qid;
            if(SCO.nav.activePage.qtype == 'choice') {
              qData.type = "choice";
            }
            qData.response = id;
            for(var lure in SCO.nav.activePage.lures){
              if(SCO.nav.activePage.lures[lure].correct) {
                qData.correct_response = SCO.nav.activePage.lures[lure].id;
              }
            }
            qData.result = SCO.nav.activePage.lures[i].correct ? 'correct' : 'incorrect';
            SCO.data.currQuestionEnd = new Date().getTime();
            qData.latency = SCO.utils.formatLatency(SCO.data.currQuestionEnd - SCO.data.currQuestionStart);
            qData.time = SCO.utils.formatTimestamp(new Date());

            SCO.interactions.data[SCO.nav.activePage.qid] = qData;
          }
        }
      }
    }
  };

  SCO.SCORM.init();
  SCO.nav.init();
  SCO.UI.init();
  SCO.nav.loadPageData(SCO.nav.activePageNumber);

  return {
    showInteractions: function(){
      console.dir(SCO.interactions.data);
    }
  };

})(SCO_data);
