const express = require('express');
const router = express.Router();
const {verify} = require('../middleware/tokenVerify');

const {createSliderState, updateSliderState, getSliderState} = require('../controller/SliderState');


router.post('/', verify, createSliderState);
router.get('/', getSliderState);
router.patch('/:sliderStateId', verify, updateSliderState);






module.exports = router;

