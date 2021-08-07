const express = require('express');
const Url = require('../model/scraped-url');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const request = require('request');
const cherio = require('cherio');

const router = express.Router();

const sendCookie = (name, req, res) => {
  const cookieOption = {
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'development') cookieOption.secure = false;

  res.cookie('test', name, cookieOption);

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

const loginController = (req, res, next) => {
  const { name } = req.body;

  // No checking or anything. Just sending the cookie
  sendCookie(name, req, res);
};

// Not so secured auth
checkAuth = (req, res, next) => {
  if (req.cookies.test) {
    next();
  } else {
    return new AppError('Not authorized', 401);
  }
};

const saveToDataBase = async (req, urls) => {
  try {
    const name = req.cookies.test;
    const data = await Url.create({ name, urls });
  } catch (err) {
    return new AppError('Error saving data', 404);
  }
};

const scrapImage = catchAsync(async (req, res, next) => {
  const { link } = req.body;

  const urls = [];

  request(link, async (err, response, html) => {
    if (!err && response.statusCode === 200) {
      console.log('Success!');
      const $ = await cherio.load(html);

      await $('img').each((i, img) => {
        const image = $(img).attr('src');
        urls.push(image);
      });

      await saveToDataBase(req, urls);

      res.send(urls);
    } else {
      return new AppError('Invalid URL', 400);
    }
  });
});

router.post('/login', loginController);

// Auth middleware
router.use(checkAuth);

router.post('/scrap', scrapImage);

module.exports = router;
