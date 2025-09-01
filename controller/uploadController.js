const express = require('express');
const { BadRequestError } = require('../error');
const { StatusCodes } = require('http-status-codes');

const uploadPicture = (req, res) => {
    if (!req.file) {
        throw new BadRequestError('No file to Upload')
    }
    const filename = req.file.filename;

    const url = `uploads/img/${filename}`;

    res.status(StatusCodes.OK).json({'Url': url});
}

module.exports = {uploadPicture};
