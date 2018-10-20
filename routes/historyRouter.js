

const {fetchurl,saveHtml,browseGroupHistory,browseUrlHistory} = require('../controllers/BasicLogic/UsersHistory.js')

const configureHistoryRouter = (router) =>{
    //Saving fetched url in mongodb
router.post('/fetchurl',fetchurl);
//Saving html in mongodb
router.post('/savehtml',saveHtml);
//fetching history
router.get('/browseGroupHistory',browseGroupHistory);

router.get('/browseUrlHistory',browseUrlHistory);
// //getting saved html
// router.post('/getSavedHtml',mongod.getSavedHtml);
console.log('history route configired');
}

module.exports = configureHistoryRouter;



