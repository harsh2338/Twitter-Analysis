// const express = require("express");
// const User = require("../models/userSchema");
// const bcrypt = require("bcrypt");
// const check_auth = require("../middlewares/check_auth");
// const jwt = require("jsonwebtoken");
// const jwt_key = require("../config/jwt_key")

// const router = express.Router();

// router.post("/signup", (req, res) => {
//     bcrypt.hash(req.body.password, 10, (err, hash) => {
//         if (err)
//             return res.status(500).json({ error: err });

//         user_data = {
//             name: req.body.name,
//             email: req.body.email,
//             password: hash
//         };
//         user = new User(user_data)
//         user.save()
//             .then((user) => {
//                 res.status(201).json({
//                     message: "User created",
//                     user
//                 });
//             })
//             .catch(err => res.status(409).json({ error: err }));
//     });
// });

// router.post("/login", (req, res, next) => {
//     User.findOne({ email: req.body.email })
//         .then(user => {
//             if (!user)
//                 return res.status(401).json({
//                     message: "Auth failed"
//                 });

//             bcrypt.compare(req.body.password, user.password, (err, result) => {
//                 if (err)
//                     return res.status(401).json({
//                         message: "Auth failed"
//                     });
//                 if (!result)
//                     return res.status(403).json({
//                         message: "Auth failed"
//                     });
//                 const token = jwt.sign({ id: user._id, email: user.email, name: user.name }, jwt_key, { expiresIn: "3h" });
//                 const username = user.name
//                 return res.status(200).json({
//                     message: "Auth successful",
//                     token,
//                     username
//                 });
//             });
//         })
//         .catch(err => res.status(401).json({ message: err }));
// });

// module.exports = router;

// const express = require("express");
// const Tweet = require("../models/tweetSchema");
// const User = require("../models/userSchema");
// const twit_api = require('../services/twit_api');
// const sent_api = require('../services/sent_api');
// const check_auth = require('../middlewares/check_auth')
// const router = express.Router();

// router.get("/",check_auth, async(req,res)=>{
//     let tweets = [];
//     if(req.query.tag.startsWith('@')){
//         tweets = await twit_api.get_user_tweets(req.query.tag, req.query.maxTweets);
//     }
//     else{
//         tweets = await twit_api.get_tweets(req.query.tag, req.query.maxTweets);
//     }
//     await sent_api.tweets_analyzer(tweets);
//     User.updateOne({_id : req.user.id}, {$push : {recent : req.query.tag}}).then(user=>{});
//     return res.json(tweets);
// });

// module.exports = router;

// const T = require('../config/twit_config').Twit;

// const tweet_metadata = ['created_at','id','full_text','geo','coordinates','place','retweet_count','favorite_count']
// const user_metadata = ['id','name','screen_name','location','profile_background_color','profile_background_image_url','profile_image_url']

// const process_tweets = (tweets)=>{
//     let processed_tweets = [];
//     for(let tweet of tweets){
//         let twt = {}
//         for(let tm of tweet_metadata)
//             twt[tm] = tweet[tm];
//         if('retweeted_status' in tweet)
//             twt['full_text'] = tweet.retweeted_status.full_text;
//         if('extended_tweet' in tweet)
//             twt['full_text'] = tweet.extended_tweet.full_text;
//         if(!twt['full_text']) twt['full_text'] = tweet.text;
//         twt['user'] = {};
//         for(let um of user_metadata)
//             twt['user'][um] = tweet['user'][um];
//         processed_tweets.push(twt);
//     }
//     return processed_tweets;
// }

// const get_tweets_helper = (hashtag,id,count,since_id = -1)=>{
//     return new Promise((resolve,reject)=>{ 
//         let params = {q: `${hashtag}`, count:count, lang:'en',tweet_mode : 'extended'};
//         if(id != -1)
//             params['max_id'] = `${id}`;
//         if(since_id != -1)params['since_id'] = `${since_id}`;
//         T.get("search/tweets",params,(err, data)=>{
//             if(err)return reject(err);
//             resolve(process_tweets(data.statuses));
//         });
//     });
// }

// const get_tweets = async (hashtag,max_tweets = 100,since_id = -1)=>{
//     let max_id = -1
//     let tweets = []
//     let total = 0
    
//     while(total < max_tweets){ 
//         var curr_tweets = []
//         curr_tweets = await get_tweets_helper(hashtag,max_id,max_tweets-total,since_id);
//         if(curr_tweets.length == 0) break;
//         total += curr_tweets.length;
//         tweets = tweets.concat(curr_tweets)
//         max_id = curr_tweets[curr_tweets.length-1].id
//     }
//     return tweets;
// }

// const get_user_tweets_helper = (user,count=200,max_id = -1,since_id = -1)=>{
//     return new Promise((resolve,reject)=>{
//         let params = {screen_name : user,count : count,tweet_mode : 'extended'};
//         if(since_id != -1)params['since_id'] = `${since_id}`;
//         if(max_id != -1)params['max_id'] = `${max_id}`;
//         T.get('statuses/user_timeline',params,(err,data)=>{
//             if(err)return reject(err);
//             resolve(process_tweets(data));
//         });
//     });
    
// }

// const get_user_tweets = async (user,max_tweets = 100,since_id=-1)=>{
//     let tweets = []
//     let total = 0
//     let max_id = -1
    
//     while(total < max_tweets){ 
//         var curr_tweets = []
//         curr_tweets = await get_user_tweets_helper(user,count = max_tweets-total,max_id = max_id,since_id);
//         if(curr_tweets.length == 0) break;
//         total += curr_tweets.length;
//         tweets = tweets.concat(curr_tweets)
//         max_id = curr_tweets[curr_tweets.length-1].id
//     }
//     return tweets;
// }

// module.exports = {
//     process_tweets,
//     get_tweets,
//     get_user_tweets,
// };
