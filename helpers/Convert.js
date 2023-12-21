class Convert{
    index(key){
        let str='';
        switch (key) {
            case 'dashboard': str='Bảng Điều Khiển'; break;
            case 'fullname': str='Họ & Tên'; break;
            case 'command': str='Lệnh'; break;
            case 'entry': str='Entry'; break;
            case 'sl': str='SL'; break;
            case 'tp': str='TP'; break;
            case 'mail': str='Cấu Hình Mail'; break;
            case 'library': str='Thư Viện Ảnh'; break;
            case 'home': str='Giao Diện Home'; break;
            case 'site': str='Cấu Hình Site'; break;
            case 'contact': str='Liên Hệ'; break;
            case 'location': str='Vị Trí'; break;
            case 'svg': str='Svg'; break;
            case 'network': str='Mạng Xã Hội'; break;
            case 'schedule': str='Lịch Học'; break;
            case 'course': str='Khóa Học'; break;
            case 'share': str='Chia Sẻ Kèo'; break;
            case 'menu': str='Menu'; break;
            case 'user': str='Thành Viên'; break;
            case 'title': str='Tên'; break;
            case 'slug': str='Slug'; break;
            case 'post': str='Bài Viết'; break;
            case 'product': str='Sản Phẩm'; break;
            case 'color': str='Màu Sắc'; break;
            case 'pin': str='Pin'; break;
            case 'category': str='Danh Mục'; break;
            case 'email': str='Email'; break;
            case 'phone': str='Điện Thoại'; break;
            case 'password': str='Mật Khẩu'; break;
            case 're_password': str='Xác Nhận Mật Khẩu'; break;
            default: str='No Name'; break;
        }
        return str;
    }
}
module.exports = new Convert()