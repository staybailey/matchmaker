<<<<<<< HEAD
import { getRandomUsers, addMatch, getMatchSet } from '../db/dbHelpers';
import { getConnectedPairsAndMessagesForUser, addMessage } from '../db/chatHelpers'
=======
import { getRandomUsers, addMatch, getMatchSet, getUser, postUser } from '../db/dbHelpers';
>>>>>>> Lots of changes to have button to login in and add and get user data from the database
import path from 'path';
import bodyParser from 'body-parser';
import store from './scoreboard';
import request from 'request';

var genderPreference = function(input) {
  if (Math.floor(Math.random() * 10) === 0) {
	return input;
  }
  if (input === 'male') {
  	return 'female';
  }
  return 'male';
}

export default function (app, express) {
	// test route, use this to get data for redux
	app.get('/api/candidates', function(req, res) {
		getMatchSet().then(function(rows) {
			res.json([rows.prospects[0], rows.prospects[1], rows.target])
		})
	})

	app.post('/api/pairs', (req, res) => {
		store.dispatch({type: 'UPDATE_LATEST', latestMatch: req.body})
		addMatch(req.body).then(() => {
			getMatchSet().then((rows) => {
				res.json([rows.prospects[0], rows.prospects[1], rows.target])
			})
		})	
	})


	app.get('/api/chats/:user_id', (req, res) => {
		getConnectedPairsAndMessagesForUser(req.params.user_id).then((rows) => {
			res.json(rows)
		})
	});

	app.post('/api/chats', (req, res) => {
		addMessage(req.body).then(() => {
			res.end();
		});
	});

	app.put('/api/users', (req, res) => {
		console.log(typeof req.body.facebook_id);
		getUser(req.body.facebook_id).then((rows) => {
			console.log(rows);
			if (rows.length === 0) {
			  res.json(null);
			} else {
			  res.json(rows[0]);
			}
		})
	})

	app.post('/api/users', (req, res) => {
		console.log(req.body.access_token);
		request.get('https://graph.facebook.com/v2.5/me?fields=id,first_name,last_name,gender,birthday,picture.width(200).height(200).type(square)&access_token=' + req.body.access_token, function(err, getResponse, fbResult) {
            if (err) {
                console.log("FB err: ", err);
                return res.send(500);
            }
            try {
                fbResult = JSON.parse(fbResult);
                var userData = {
                    facebook_id: fbResult.id, 
                    first_name: fbResult.first_name,
                    last_name: fbResult.last_name,
                    gender: fbResult.gender,
                    birthday: null, // NEEDS CLEANING FOR BAD DATA
                    zipcode: 99999, // DUMMY VALUE
                    status: 'true',
                    age_min: 0,
                    age_max: 100,
                    gender_preference: gp,
                    description: '',
                    location_preference: 99999,
                    image_url: fbResult.picture.data.url
                }
                postUser(userData).then((rows) => {
                  return res.json(rows[0]);
                });           
            } catch (e) {
                console.log("generic error");
                return res.send(500);
            }
		})
	})


	// app.get('/api/matchSet', (req, res) => {
	// 	getMatchSet().then((matchSet) => {
	// 		console.log(matchSet)
	// 		res.json(matchSet)
	// 	})
	// })



}