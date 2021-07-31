const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const getNLUInstance = () => {
    const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
    const { IamAuthenticator } = require('ibm-watson/auth');

    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
        version: '2021-03-25',
        authenticator: new IamAuthenticator({
            apikey: process.env.API_KEY,
        }),
        serviceUrl: process.env.API_URL,
    });

    return naturalLanguageUnderstanding;
}

const app = new express();
app.use(express.static('client'))

const cors_app = require('cors');
app.use(cors_app());

app.get("/",(req,res)=>{
    res.render('index.html');
  });

app.get("/url/emotion", (req,res) => {
    const analyzeParams = {
        'url': 'http://www.ibm.com/us-en/',
        'features': {
            'emotion': {
                'targets': [
                    'ibm',
                    'us'
                ]
            }
        }
    };

    const nlu = getNLUInstance();
    nlu.analyze(analyzeParams)
    .then(analysisResults => {
        return res.send(analysisResults.result.emotion.document.emotion);
    })
    .catch(err => {
        console.log('error:', err);
    });
});

app.get("/url/sentiment", (req,res) => {
    const analyzeParams = {
        'url': 'http://www.ibm.com/us-en/',
        'features': {
            'sentiment': {
                'targets': [
                    'ibm',
                    'us'
                ]
            }
        }
    };

    const nlu = getNLUInstance();
    nlu.analyze(analyzeParams)
    .then(analysisResults => {
        return res.send(analysisResults.result.sentiment.document.label);
    })
    .catch(err => {
        console.log('error:', err);
    });
});

app.get("/text/emotion", (req,res) => {
    const analyzeParams = {
        'text': 'I love apples! I do not like oranges.',
        'features': {
            'emotion': {
                'targets': [
                    'apples',
                    'oranges'
                ]
            }
        }
    };

    const nlu = getNLUInstance();
    nlu.analyze(analyzeParams)
    .then(analysisResults => {
        return res.send(analysisResults.result.emotion.document.emotion);
    })
    .catch(err => {
        console.log('error:', err);
    });
});

app.get("/text/sentiment", (req,res) => {
    const analyzeParams = {
        'text': 'I love apples! I do not like oranges.',
        'features': {
            'sentiment': {
                'targets': [
                    'apples',
                    'oranges'
                ]
            }
        }
    };

    const nlu = getNLUInstance();
    nlu.analyze(analyzeParams)
    .then(analysisResults => {
        return res.send(analysisResults.result.sentiment.document.label);
    })
    .catch(err => {
        console.log('error:', err);
    });
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})

