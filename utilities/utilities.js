const sendGenericError = (res, message, error) => {
    const packet = {
        message: message,
        payload: error,
    };

    console.log(packet);
    res.status(500).json(packet);
}

module.exports = {
    sendGenericError
};