class Api{
    constructor(req, res){
        this.req=req
        this.res=res
    }
    recursive(array = [], initial = '') {
        let newArray = [];
        for (let index = 0; index < array.length; index++) {
            const element = array[index];
            const valueParentID = (element['parentID']) ?? '';
            if (valueParentID.toString() == initial.toString()) {
                newArray.push({
                    title: element['title'],
                    slug: (element['type']=='sanpham'?element['slug']: (element['type']+'/'+element['slug'])),
                    childs: this.recursive(array, element['_id'])
                })
            }
        }
        return newArray;
    }
}
module.exports = Api