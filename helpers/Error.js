class Error{
    index(key, field, so=0){
        let str=''
        switch (key) {
            case 401: str=field + ' không được rỗng !!!'; break;
            case 402: str=field + ' không đúng định dạng !!!'; break;
            case 403: str=field + ' đã tồn tại !!!'; break;
            case 405: str='Xác nhận Mật Khẩu không đúng !!!'; break;
            case 406: str=field + ' chứa ít nhất '+so+' kí tự !!!'; break;
            default: str='No Response'; break;
        }
        return str;
    }
}
module.exports = new Error