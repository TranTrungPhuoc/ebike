const express = require('express')
const router = express.Router()
const schema = require('../schemas/TradingView_Schema')

// const Binance = require('node-binance-api');

// const binance = new Binance().options({
//     APIKEY: 'Lzyz55a20UA92EQYUFu1ShbPsKCTJ4VcJNGC2EXeWSvbbmbgVXEHRQ1l3iVXsiO9',
//     APISECRET: '3sGP7JNSdaHP1hQqAK1lMpv2341qKHLeBDgbweUluVGbGuARobYgECefAHdUU4is',
//     useServerTime: true,
// });

router.post('/webhook', async (req, res) => {
    // await schema.deleteMany();
    // return
    const countDocuments = await schema.countDocuments({ interval: req.body.interval }).exec();
    if(countDocuments > 499){
        const lastData = await schema.find({ interval: req.body.interval }).sort({time: 1}).limit(1).exec();
        await schema.deleteOne({ interval: req.body.interval, _id: lastData[0]._id }).exec();
    }
    await schema.create(req.body);
    res.status(200).send('Successfully!');

    // const symbol = 'LPTUSDT';
    // const orderId = 'YOUR_ORDER_ID'; // Thay thế bằng ID của lệnh bạn muốn cập nhật
    // const newTakeProfit = 52000; // Giá mới cho Take Profit
    // const newStopLoss = 48000; // Giá mới cho Stop Loss

    // binance.futuresOrder({
    //     symbol: symbol,
    //     orderId: orderId,
    //     stopPrice: newTakeProfit, // Giá mới cho Take Profit
    //     closePosition: false, // true nếu bạn muốn đóng lệnh khi đặt TP/SL
    // }, (error, response) => {
    // if (error) {
    //     console.error('Lỗi khi cập nhật TP/SL:', error.body);
    // } else {
    //     console.log('TP/SL đã được cập nhật thành công:', response);
    // }
    // });

    // return false;

    // await schema.create(req.body);

    // const array = await schema.find({ interval: req.body.interval }).limit(5).sort({ time: -1 }).exec();

    // const newArray = [];

    // for (let index = 0; index < array.length; index++) {
    //     const element = array[index];
    //     newArray.push((element['close'] >= element['open']) ? true : false)
    // }

    // let enterCommand = false;

    // if (
    //     newArray[0]
    //     &&
    //     newArray[1]
    // ) {
    //     enterCommand = true;
    // }

    // const symbol = 'LPTUSDT';
    // const quantity = 1;
    // const stopPrice = 4;

    // const _futuresAccount = await binance.futuresAccount();

    // const percent = 10;

    // if(_futuresAccount.totalWalletBalance / percent < 5){
    //     console.log('Bạn không đủ số dư');
    //     return false;
    // }

    // const price = _futuresAccount.totalWalletBalance / percent;

    // const entry = await binance.futuresBuy({
    //     symbol: 'LPTUSDT', 
    //     quantity: 1, 
    //     price: 5
    // });
    // console.log(...{
    //     symbol: 'LPTUSDT', 
    //     quantity: 1, 
    //     price: 5
    // });

    // return

    // let result = '';

    // const orderLists = await binance.futuresOpenOrders(symbol)

    // if (
    //     newArray[0]
    //     &&
    //     newArray[1]
    //     &&
    //     newArray[2]
    // ) {
    //     if (orderLists.length == 0) enterCommand = true;
    // }

    // if (enterCommand && orderLists.length == 0) {
    //     const orderParams =
    //     {
    //         symbol,
    //         // side,
    //         type,
    //         quantity,
    //         price,
    //         // takeProfitPrice,
    //         // stopPrice,
    //         // timeInForce: 'GTC',
    //         // newOrderRespType: 'FULL',
    //         // workingType: 'MARK_PRICE', // Sử dụng giá thị trường để xác định SL/TP
    //         // newClientOrderId: 'myOrder', // ID của lệnh (tuỳ chọn)
    //     }
    //     console.log(orderParams);
    //     console.log(await binance.futuresBuy(orderParams));
    //     result = 'Lệnh mở';
    // }

    // if (!enterCommand) {
    //     await binance.futuresCancelAll(symbol)
    //     result = 'Lệnh đóng';
    // }

    // console.log(newArray);
    // console.log(result);

    // res.status(200).send('Webhook data received');
});

module.exports = router