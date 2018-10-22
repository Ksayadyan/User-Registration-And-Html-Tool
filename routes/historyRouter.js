

const {fetchurl,saveHtml,browseGroupHistory,browseUrlHistory,browseGroupedUrlHistory} = require('../controllers/BasicLogic/UsersHistory.js');
const {getSavedHtml, getImages, editProfilePic} = require('../models/MongoDb/mongo.js');

const configureHistoryRouter = (router) =>{
    //Saving fetched url in mongodb
router.post('/fetchurl',fetchurl);
//Saving html in mongodb
router.post('/savehtml',saveHtml);
//fetching history
router.get('/browseGroupHistory',browseGroupHistory);

router.get('/browseUrlHistory',browseUrlHistory);

router.get('/browseGroupedUrlHistory', browseGroupedUrlHistory);
// //getting saved html
router.post('/getSavedHtml',getSavedHtml);

router.get('/getImages', getImages);

router.post('/editProfilePic',editProfilePic);

console.log('history route configired');
}

module.exports = configureHistoryRouter;



