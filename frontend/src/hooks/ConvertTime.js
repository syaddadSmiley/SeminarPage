
const ConvertTime = (time) => {
    const date = new Date(time);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    return day + '-' + month + '-' + year + ' ' + hour + ':' + minute + ':' + second;   
};

export default ConvertTime;
// var dateFns = require("date-fns")

// const dateString = '2019-09-18T19:00:52Z';

// const parsed = dateFns.parse(dateString, "yyyy-MM-dd'T'HH:mm:ssXXX", new Date());
// const result = dateFns.format(parsed, 'dd/MM/YYY HH:mm');