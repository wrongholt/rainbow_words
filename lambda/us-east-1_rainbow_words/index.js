/* eslint-disable  func-names */
/* eslint-disable  no-console */
const main = require('./main.json');
const wordsJson = require('./words.json');
const modesJson = require('./modes.json');
const optionsJson = require('./options.json');
const Alexa = require('ask-sdk');
var generateWord;
var databaseWord;
var databaseMode;
const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === `LaunchRequest`;
  },
  async handle(handlerInput) {
    const attributesManager = handlerInput.attributesManager;
    const attributes = await attributesManager.getPersistentAttributes() || {};
    if (attributes.databaseMode == null) {
      databaseMode = "Color Section Mode";
      attributes.databaseMode = databaseMode;
    } else {
      databaseMode = attributes.databaseMode;
    }
    if (i != null) {
      var i = attributes.i;
    } else {
      if (attributes.i == null) {
        var i = 0;
      }
      var i = attributes.i;

    }
    if (i == 9) {
      i = 0;
    }
    attributes.i = i;
    attributesManager.setPersistentAttributes(attributes);
    const welcomeMessage = `Welcome, to Rainbow Words. You are in ${databaseMode}. Pick your mode setting by saying, Change Mode. To learn about modes say, Modes.`;
    await attributesManager.savePersistentAttributes();
    const title = "Welcome to Rainbow Words.";
    const subtitle = "Where kids learn words."
    if (supportsAPL(handlerInput)) {
      return handlerInput.responseBuilder
        .speak(welcomeMessage)
        .reprompt(helpMessage)
        .addDirective({
          type: 'Alexa.Presentation.APL.RenderDocument',
          version: '1.0',
          document: main,
          datasources: {
            "mainData": {
              "type": "object",
              "properties": {
                "title": title,
                "subtitle": subtitle,
                "bgImage": urls[attributes.i]
              }
            }
          }
        })
        .getResponse();
    } else {
      return handlerInput.responseBuilder
        .speak(welcomeMessage)
        .reprompt(welcomeMessage)
        .withSimpleCard(title, "Where kids learn words.")
        .getResponse();
    }
  },
};

const GetWordsIntentHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest' &&
      request.intent.name === 'GetWordsIntentHandler';
  },
  async handle(handlerInput) {
    const attributesManager = handlerInput.attributesManager;
    const attributes = await attributesManager.getPersistentAttributes() || {};

    if (i != null) {
      var i = attributes.i;
    } else {
      var i = attributes.i;
      if (attributes.i == null) {
        var i = 0;
      }
    }
    if (i == 9) {
      i = 0;
    }
    attributes.i = i;
    const request = handlerInput.requestEnvelope.request;
    attributesManager.setPersistentAttributes(attributes);
    await attributesManager.savePersistentAttributes();
    if (request.intent.slots &&
      request.intent.slots.theWord &&
      request.intent.slots.theWord.value &&
      request.intent.slots.theWord.resolutions &&
      request.intent.slots.theWord.resolutions.resolutionsPerAuthority &&
      request.intent.slots.theWord.resolutions.resolutionsPerAuthority[0] &&
      request.intent.slots.theWord.resolutions.resolutionsPerAuthority[0].values &&
      request.intent.slots.theWord.resolutions.resolutionsPerAuthority[0].values[0] &&
      request.intent.slots.theWord.resolutions.resolutionsPerAuthority[0].values[0].value &&
      request.intent.slots.theWord.resolutions.resolutionsPerAuthority[0].values[0].value.name) {
      if (request.intent.slots.theWord.value == databaseWord) {
        var title = 'That is correct! ' + `${databaseWord}`;
        var speechText = `That is correct! ${databaseWord}`;

      } else {
        var title = 'That is not correct! The word is: ' + `${databaseWord}`;
        var speechText = `That is not correct! The word is: ${databaseWord}`;
      }
    }
    if (supportsAPL(handlerInput)) {
      return handlerInput.responseBuilder
        .withShouldEndSession(false)
        .speak(speechText)
        .addDirective({
          type: 'Alexa.Presentation.APL.RenderDocument',
          version: '1.0',
          document: optionsJson,
          datasources: {
            "mainData": {
              "type": "object",
              "properties": {
                "title": title,
                "bgImage": urls[attributes.i]
              }
            }
          }
        })
        .getResponse();
    } else {
      return handlerInput.responseBuilder
        .withShouldEndSession(false)
        .speak(speechText)
        .withSimpleCard(title)
        .getResponse();
    }
  },
};
const AnotherWordHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;

    return request.type === 'IntentRequest' &&
      request.intent.name === 'AnotherWordHandler';
  },
  async handle(handlerInput) {
    const attributesManager = handlerInput.attributesManager;
    const attributes = await attributesManager.getPersistentAttributes() || {};
    if (i != null) {
      var i = attributes.i;
    } else {
      if (attributes.i == null) {
        var i = 0;
      }
      var i = attributes.i;
    }
    if (wordCounter != null) {
      var wordCounter = attributes.wordCounter;
    } else {
      var wordCounter = attributes.wordCounter;
      if (attributes.wordCounter == null) {
        var wordCounter = 0;
      }
    }
    if (wordCounter == 30) {
      i += 1;
      wordCounter = 0;
    }
    if (i == 9) {
      i = 0;
    }

    if (databaseMode === "Color Section Mode") {
      generateWord = randomNoRepeats(words[i]);
      attributes.generateWord = generateWord();
      databaseWord = attributes.generateWord;
      var speechText = `Here is your word, please tell me the word that is displayed. For your next word say next.`;
      var title = `${databaseWord}`;
      wordCounter += 1;
      attributes.i = i;
      attributes.wordCounter = wordCounter;
      var bgImage = urls[attributes.i];
      var fontSize = "15vw"
    } else if (databaseMode === "All Words Mode") {
      var it;
      var j;
      if (it == null) {
        var it = attributes.it;
      } else{
        var it = attributes.it;
      }
      if (j == null) {
        var j = attributes.j;
      } else{
        var j = attributes.j;
      }
      if (words.length == it) {
        var speechText = "You have gone through all the words, Good Job!"
        var title = "You have gone through all the words, Good Job!"
        var bgImage = urls[5];
        var fontSize = "7vw"
      } else {
        generateWord = words[it][j];
        var j = j + 1;
        var bgImage = urls[it]; 
        attributes.generateWord = generateWord;
        databaseWord = attributes.generateWord;
        var speechText = `Here is your word, please tell me the word that is displayed. For your next word say next.`;
        var title = `${databaseWord}`;
        var fontSize = "15vw"
        if (j === words[it].length) {
        var bgImage = urls[it];  
        var it = it + 1;
        var j = 0;
          attributes.it = it;
        }
        attributes.j = j
        
      }
     
    }

    
    attributesManager.setPersistentAttributes(attributes);
    await attributesManager.savePersistentAttributes();
    if (supportsAPL(handlerInput)) {
      return handlerInput.responseBuilder
        .withShouldEndSession(false)
        .speak(speechText)
        .addDirective({
          type: 'Alexa.Presentation.APL.RenderDocument',
          version: '1.0',
          document: wordsJson,
          datasources: {
            "mainData": {
              "type": "object",
              "properties": {
                "title": title,
                "bgImage": bgImage,
                "fontSize": fontSize
              }
            }
          }
        })
        .getResponse();
    } else {
      return handlerInput.responseBuilder
        .withShouldEndSession(false)
        .speak(speechText)
        .withSimpleCard(title)
        .getResponse();
    }
  },
};

const modesIntentHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;

    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      request.intent.name === 'modesIntentHandler';
  },
  async handle(handlerInput) {
    const attributesManager = handlerInput.attributesManager;
    const attributes = await attributesManager.getPersistentAttributes() || {};
if(databaseMode=="Color Section Mode"){
  databaseMode="All Words Mode";
}else{
  databaseMode="Color Section Mode"
}

    if(databaseMode=="Color Section Mode"){
    databaseMode = "Color Section Mode";
    var speechText = 'You are now in Color Section Mode, to start say: word me.';
    attributes.databaseMode = databaseMode;
  }else if(databaseMode=="All Words Mode"){
    databaseMode = "All Words Mode";
    var speechText = 'You are now in All Words Mode, to start say: word me.';
    var it = 0;
    var j = 0;
    attributes.it = it;
    attributes.j = j;
    attributes.databaseMode = databaseMode;
  }

    attributesManager.setPersistentAttributes(attributes);
    await attributesManager.savePersistentAttributes();
    if (supportsAPL(handlerInput)) {
    return handlerInput.responseBuilder
        .withShouldEndSession(false)
        .speak(speechText)
        .withSimpleCard(speechText)
        .addDirective({
          type: 'Alexa.Presentation.APL.RenderDocument',
          version: '1.0',
          document: modesJson,
          datasources: {
            "mainData": {
              "type": "object",
              "properties": {
                "title": speechText
              }
            }
          }
        })
        .getResponse();
    } else {
    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard(speechText)
      .getResponse();
    }
  },
};

const modeHelpIntentHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;

    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      request.intent.name === 'modeHelpIntentHandler';
  },
  handle(handlerInput) {
    const speechText = 'There are two modes: Color Section Mode, where the child learns through repetition or All Words Mode, in which the child will start at the beginning and work through all the words we have available.';
    if (supportsAPL(handlerInput)) {
      return handlerInput.responseBuilder
          .withShouldEndSession(false)
          .speak(speechText)
          .withSimpleCard(speechText)
          .addDirective({
            type: 'Alexa.Presentation.APL.RenderDocument',
            version: '1.0',
            document: modesJson,
            datasources: {
              "mainData": {
                "type": "object",
                "properties": {
                  "title": speechText
                }
              }
            }
          })
          .getResponse();
      } else {
    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard(speechText)
      .getResponse();
      }
  },
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = 'You start by saying next or word me. If I ever stop listening just say Alexa and the word.';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent' ||
        handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speechText = 'Goodbye!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, I can\'t understand the command. Please say again.')
      .reprompt('Sorry, I can\'t understand the command. Please say again.')
      .getResponse();
  },
};

const skillBuilder = Alexa.SkillBuilders.standard();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    GetWordsIntentHandler,
    AnotherWordHandler,
    modesIntentHandler,
    modeHelpIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .withTableName('rainbow-words')
  .withAutoCreateTable(true)
  .lambda();
var urls = ["https://s3.amazonaws.com/alexa.skill.rainbowwords/background-board-carpentry-960137.jpg",
  "https://s3.amazonaws.com/alexa.skill.rainbowwords/abstract-background-carpentry-268976.jpg",
  "https://s3.amazonaws.com/alexa.skill.rainbowwords/abstract-art-background-1020317.jpg",
  "https://s3.amazonaws.com/alexa.skill.rainbowwords/artificial-background-close-up-958168.jpg",
  "https://s3.amazonaws.com/alexa.skill.rainbowwords/abstract-art-artificial-131634.jpg",
  "https://s3.amazonaws.com/alexa.skill.rainbowwords/backgrounds-blank-blue-953214.jpg",
  "https://s3.amazonaws.com/alexa.skill.rainbowwords/pexels-photo-355762.jpeg",
  "https://s3.amazonaws.com/alexa.skill.rainbowwords/abstract-attractive-backdrop-838423.jpg",
  "https://s3.amazonaws.com/alexa.skill.rainbowwords/cement-color-concrete-1260727.jpg"
];
var words = [
  ["I", "a", "the", "can", "see", "like", "to", "and", "you", "big"],
  ["in", "it", "is", "we", "me", "my", "run", "play", "say", "look"],
  ["for", "at", "am", "did", "little", "get", "will", "jump", "up", "on"],
  ["make", "ride", "down", "yes", "no", "so", "go", "he", "she", "be"],
  ["have", "our", "out", "saw", "all", "do", "come", "out", "eat", "they"],
  ["with", "here", "find", "blue", "two", "away", "are", "but", "ate", "good"],
  ["into", "this", "that", "there", "came", "red", "three", "too", "ran", "must"],
  ["went", "black", "who", "what", "where", "white", "not", "said", "want", "brown"],
  ["soon", "new", "now", "well", "funny", "yellow", "under", "pretty", "four", "was"]
];


function supportsAPL(handlerInput) {
  const supportedInterfaces = handlerInput.requestEnvelope.context.System.device.supportedInterfaces;
  const aplInterface = supportedInterfaces['Alexa.Presentation.APL'];
  return aplInterface != null && aplInterface != undefined;
}

function randomNoRepeats(array) {
  var copy = array.slice(0);
  return function () {
    if (copy.length < 1) {
      copy = array.slice(0);
    }
    var index = Math.floor(Math.random() * copy.length);
    var item = copy[index];
    copy.splice(index, 1);
    return item;
  };
}

//Constents

const helpMessage = "Would you like to play Rainbow Words still? If so say word me.";